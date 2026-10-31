import json, datetime
from playwright.sync_api import sync_playwright
DEMO="http://127.0.0.1:4321"; EP="http://127.0.0.1:4322"
results=[]
def check(name, cond, extra=""):
    results.append((name, bool(cond), extra)); print(("PASS " if cond else "FAIL ")+name, extra if not cond else "")
today=datetime.date.today().isoformat()
past=(datetime.date.today()-datetime.timedelta(days=3)).isoformat()
future=(datetime.date.today()+datetime.timedelta(days=10)).isoformat()

with sync_playwright() as p:
    b=p.chromium.launch()
    # ---------- DEMO MODE ----------
    ctx=b.new_context(viewport={"width":1280,"height":900}); pg=ctx.new_page()
    posts=[]; pg.on("request",lambda r: posts.append(r.url) if r.method=="POST" else None)
    errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
    pg.goto(DEMO+"/contact",wait_until="networkidle")
    panel=pg.locator("#panel-enquiry")
    # empty submit
    panel.get_by_role("button",name="Send enquiry").click()
    n_inv=panel.locator('[aria-invalid="true"]').count()
    check("single service is pre-selected; empty submit flags the 4 other required fields", n_inv==4 and panel.locator("#enquiry-service").input_value()=="Home Nursing", f"got {n_inv}")
    check("first invalid field receives focus", pg.evaluate("document.activeElement.id")=="enquiry-name")
    check("error text is visible & linked", panel.locator("#enquiry-email-error").inner_text().strip()!="" and "enquiry-email-error" in (panel.locator("#enquiry-email").get_attribute("aria-describedby") or ""))
    check("status summary announced (role=status)", "correct" in panel.locator("[data-status]").inner_text().lower())
    # invalid formats
    panel.locator("#enquiry-name").fill("Asha Rao"); panel.locator("#enquiry-email").fill("bad@"); panel.locator("#enquiry-phone").fill("123"); panel.locator("#enquiry-city").fill("Bangalore"); panel.locator("#enquiry-service").select_option("Home Nursing")
    panel.locator("#enquiry-date").fill(past)
    panel.get_by_role("button",name="Send enquiry").click()
    check("bad email rejected", "valid email" in panel.locator("#enquiry-email-error").inner_text())
    check("short phone rejected", "valid phone" in panel.locator("#enquiry-phone-error").inner_text())
    check("past date rejected", "future" in panel.locator("#enquiry-date-error").inner_text())
    # errors clear when fixed
    panel.locator("#enquiry-email").fill("asha@example.com")
    check("error clears on fix", panel.locator("#enquiry-email-error").inner_text()=="" and panel.locator("#enquiry-email").get_attribute("aria-invalid") is None)
    panel.locator("#enquiry-phone").fill("+91 98765 43210"); panel.locator("#enquiry-date").fill(future)
    panel.get_by_role("button",name="Send enquiry").click(); pg.wait_for_timeout(300)
    st=panel.locator("[data-status]")
    check("demo mode says NOTHING WAS SENT", "nothing was sent" in st.inner_text().lower() and st.get_attribute("data-state")=="demo", st.inner_text())
    check("demo mode makes no network POST", len(posts)==0, str(posts))
    check("demo mode keeps the typed values", panel.locator("#enquiry-name").input_value()=="Asha Rao")
    check("date min attr = today", panel.locator("#enquiry-date").get_attribute("min")==today)
    # honeypot
    pg.evaluate("document.querySelector('#enquiry-website').value='http://spam.test'")
    panel.get_by_role("button",name="Send enquiry").click(); pg.wait_for_timeout(200)
    check("honeypot path sends nothing", len(posts)==0)
    # tabs
    pg.reload(wait_until="networkidle")
    tab_b=pg.locator("#tab-booking"); tab_e=pg.locator("#tab-enquiry")
    tab_e.focus(); pg.keyboard.press("ArrowRight")
    check("arrow key moves to Book a Service tab", tab_b.get_attribute("aria-selected")=="true" and pg.locator("#panel-booking").is_visible() and not pg.locator("#panel-enquiry").is_visible())
    pg.keyboard.press("Home")
    check("Home key returns to first tab", tab_e.get_attribute("aria-selected")=="true")
    tab_b.click()
    pg.locator("#booking-name").fill("A B"); pg.locator("#booking-email").fill("a@b.co"); pg.locator("#booking-phone").fill("9876543210"); pg.locator("#booking-city").fill("Pune"); pg.locator("#booking-service").select_option("Home Nursing")
    pg.locator("#panel-booking").get_by_role("button",name="Request booking").click()
    check("booking requires start date", "start date" in pg.locator("#booking-date-error").inner_text().lower())
    # deep links
    pg.goto(DEMO+"/contact#book-a-service",wait_until="networkidle")
    check("#book-a-service opens booking tab", pg.locator("#panel-booking").is_visible())
    pg.goto(DEMO+"/contact?service=home-nursing",wait_until="networkidle")
    check("?service= selects Home Nursing (the only service)", pg.locator("#enquiry-service").input_value()=="Home Nursing" and pg.locator("#enquiry-service option[value]:not([value=''])").count()==1)
    # service page CTA
    pg.goto(DEMO+"/services/home-nursing",wait_until="networkidle")
    pg.locator('.enq').get_by_role('link',name='Make an Enquiry').click(); pg.wait_for_load_state("networkidle")
    check("service CTA lands on contact with service preselected", pg.url.endswith("/contact?service=home-nursing") and pg.locator("#enquiry-service").input_value()=="Home Nursing", pg.url)
    check("no JS errors in demo flows", not errs, str(errs))
    ctx.close()

    # ---------- ENDPOINT CONFIGURED ----------
    ctx=b.new_context(viewport={"width":1280,"height":900}); pg=ctx.new_page()
    captured={}
    def ok(route):
        captured['body']=json.loads(route.request.post_data); captured['hdr']=route.request.headers
        route.fulfill(status=200,content_type="application/json",headers={"access-control-allow-origin":"*"},body='{"ok":true}')
    pg.route("https://forms.test/**", lambda r: r.fulfill(status=204,headers={"access-control-allow-origin":"*","access-control-allow-headers":"*","access-control-allow-methods":"*"}) if r.request.method=="OPTIONS" else ok(r))
    pg.goto(EP+"/contact",wait_until="networkidle")
    e=pg.locator("#panel-enquiry")
    e.locator("#enquiry-name").fill("Asha Rao"); e.locator("#enquiry-email").fill("asha@example.com"); e.locator("#enquiry-phone").fill("9876543210"); e.locator("#enquiry-city").fill("Bangalore"); e.locator("#enquiry-service").select_option("Home Nursing"); e.locator("#enquiry-message").fill("Need care for my father")
    e.get_by_role("button",name="Send enquiry").click(); pg.wait_for_timeout(500)
    st=e.locator("[data-status]")
    check("configured endpoint: success message", st.get_attribute("data-state")=="success" and "has been sent" in st.inner_text(), st.inner_text())
    b_=captured.get('body',{})
    check("payload has fields, formType, access_key, no honeypot", b_.get("fullName")=="Asha Rao" and b_.get("formType")=="Make an Enquiry" and b_.get("access_key")=="pubkey123" and "website" not in b_, str(b_))
    check("form reset after success", e.locator("#enquiry-name").input_value()=="")
    # failure
    pg.unroute("https://forms.test/**")
    pg.route("https://forms.test/**", lambda r: r.fulfill(status=204,headers={"access-control-allow-origin":"*","access-control-allow-headers":"*","access-control-allow-methods":"*"}) if r.request.method=="OPTIONS" else r.fulfill(status=500,headers={"access-control-allow-origin":"*"},body="no"))
    e.locator("#enquiry-name").fill("Asha Rao"); e.locator("#enquiry-email").fill("asha@example.com"); e.locator("#enquiry-phone").fill("9876543210"); e.locator("#enquiry-city").fill("Bangalore"); e.locator("#enquiry-service").select_option("Home Nursing")
    e.get_by_role("button",name="Send enquiry").click(); pg.wait_for_timeout(500)
    check("server 500 shows error, keeps values", st.get_attribute("data-state")=="error" and e.locator("#enquiry-name").input_value()=="Asha Rao", st.inner_text())
    # network failure
    pg.unroute("https://forms.test/**"); pg.route("https://forms.test/**", lambda r: r.abort())
    e.get_by_role("button",name="Send enquiry").click(); pg.wait_for_timeout(500)
    check("network failure shows error with phone fallback", st.get_attribute("data-state")=="error" and "+91 70130 50751" in st.inner_text(), st.inner_text())
    ctx.close()

    # ---------- NAVIGATION ----------
    ctx=b.new_context(viewport={"width":1280,"height":900}); pg=ctx.new_page()
    pg.goto(DEMO+"/",wait_until="networkidle")
    check("no pointless dropdown with a single service", pg.locator("li[data-has-sub]").count()==0 and pg.locator(".nav__sub-toggle").count()==0)
    pg.locator("a.nav__link", has_text="Services").click(); pg.wait_for_load_state("networkidle")
    check("Services link navigates", pg.url.endswith("/services"))
    check("current page marked aria-current", pg.locator('.nav__link[aria-current="page"]').inner_text()=="Services")
    ctx.close()
    # mobile menu
    ctx=b.new_context(viewport={"width":390,"height":844},has_touch=True); pg=ctx.new_page()
    pg.goto(DEMO+"/",wait_until="networkidle")
    mm=pg.locator("#mobile-menu"); tg=pg.locator("[data-menu-toggle]")
    check("mobile menu closed initially", not mm.is_visible() and tg.get_attribute("aria-expanded")=="false")
    tg.click()
    check("mobile menu opens", mm.is_visible() and tg.get_attribute("aria-expanded")=="true")
    bb=mm.bounding_box(); check("mobile menu fills the viewport below the header", bb["height"]>500 and bb["y"]<200 and abs(bb["y"]+bb["height"]-844)<2, str(bb))
    last=pg.locator("#mobile-menu .mobile-menu__foot .btn").last.bounding_box(); check("menu CTA buttons are reachable", last is not None and last["y"]<844+400)
    check("scroll locked while open", pg.evaluate("document.documentElement.style.overflow")=="hidden")
    pg.keyboard.press("Escape")
    check("Escape closes mobile menu & restores scroll", not mm.is_visible() and pg.evaluate("document.documentElement.style.overflow")=="")
    tg.click(); pg.locator("#mobile-menu").get_by_role("link",name="Services",exact=True).click(); pg.wait_for_load_state("networkidle")
    check("mobile menu link navigates", pg.url.endswith("/services"))
    check("menu closed after navigation", not pg.locator("#mobile-menu").is_visible())
    ctx.close()
    # ---------- SCOPE CHECKS: single service, single office ----------
    ctx=b.new_context(); pg=ctx.new_page()
    import re as _re
    for path in ["/","/services","/services/home-nursing","/about","/why-aayush","/testimonials","/career","/blog","/faqs","/contact","/privacy-policy","/site-map","/nope"]:
        pg.goto(DEMO+path,wait_until="networkidle"); txt=pg.inner_text("html")+pg.content()
        check(f"no Old Age Home / Mumbai / Chandigarh on {path}", not _re.search(r"old[ -]?age[ -]?home|mumbai|chandigarh|belapur|ashok pal|sanjay", txt, _re.I))
    r=pg.goto(DEMO+"/services/old-age-home"); check("old Old Age Home URL is gone (404)", r.status==404)
    pg.goto(DEMO+"/services",wait_until="networkidle")
    check("services page lists exactly one service: Home Nursing", pg.locator("a.svc__link").count()==1 and pg.locator("a.svc__link").inner_text()=="Home Nursing")
    pg.goto(DEMO+"/contact",wait_until="networkidle")
    check("contact page shows exactly one office (Bangalore)", pg.locator("main address.office").count()==1 and "Bangalore" in pg.locator("main address.office").inner_text())
    check("footer shows exactly one office", pg.locator("footer address.office").count()==1)
    ctx.close()
    # 404 + FAQ accordion + sitemap/robots
    ctx=b.new_context(); pg=ctx.new_page()
    r=pg.goto(DEMO+"/does-not-exist"); check("unknown URL -> custom 404", r.status==404 and "couldn't find that page" in pg.content())
    pg.goto(DEMO+"/faqs",wait_until="networkidle")
    d=pg.locator("details").first; d.locator("summary").click()
    check("FAQ accordion opens", d.get_attribute("open") is not None)
    d.locator("summary").press("Enter")
    check("FAQ accordion closes via keyboard", d.get_attribute("open") is None)
    r=pg.goto(DEMO+"/robots.txt"); check("robots.txt references sitemap", "sitemap-index.xml" in pg.inner_text("body"))
    r=pg.goto(DEMO+"/sitemap-index.xml"); check("sitemap-index.xml served", r.status==200)
    ctx.close(); b.close()
bad=[r for r in results if not r[1]]
print(f"\n{len(results)-len(bad)}/{len(results)} passed")
