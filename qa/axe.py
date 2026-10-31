import json
from playwright.sync_api import sync_playwright
axe=open('node_modules/axe-core/axe.min.js').read()
pages=["/","/services","/services/home-nursing","/about","/why-aayush","/testimonials","/career","/blog","/blog/a-home-away-from-home","/blog/in-home-care-the-best-choice-for-your-beloved","/faqs","/contact","/privacy-policy","/site-map","/nope"]
tot=0
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,vp in (("desktop",(1280,900)),("mobile",(390,844))):
        ctx=b.new_context(viewport={"width":vp[0],"height":vp[1]},reduced_motion="reduce")
        for path in pages:
            pg=ctx.new_page(); pg.goto("http://127.0.0.1:4321"+path,wait_until="networkidle")
            pg.evaluate(axe)
            r=pg.evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}})")
            for v in r["violations"]:
                tot+=1; print(name,path,v["id"],v["impact"],len(v["nodes"]),v["nodes"][0]["html"][:110].replace("\n"," "), "|", v["nodes"][0]["any"][0]["message"][:120] if v["nodes"][0]["any"] else "")
            pg.close()
        ctx.close()
    b.close()
print("violations:",tot)
