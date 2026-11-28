import sys, json, os
os.makedirs("qa/screenshots", exist_ok=True)
from playwright.sync_api import sync_playwright
BASE="http://127.0.0.1:4321"
pages=sys.argv[1].split(",") if len(sys.argv)>1 else ["/","/services","/services/home-nursing","/about","/why-aayush","/testimonials","/career","/blog","/blog/a-home-away-from-home","/blog/bringing-a-parent-home-after-a-hospital-stay","/faqs","/contact","/privacy-policy","/site-map","/nope"]
vps={"desktop":(1440,900),"laptop":(1024,768),"tablet":(768,1024),"mobile":(390,844),"mobile-360":(360,780),"mobile-320":(320,640)}
only=sys.argv[2].split(",") if len(sys.argv)>2 else list(vps)
report=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    for name in only:
        w,h=vps[name]
        ctx=b.new_context(viewport={"width":w,"height":h},reduced_motion="reduce",device_scale_factor=1)
        for path in pages:
            pg=ctx.new_page(); errs=[]
            pg.on("console",lambda m,errs=errs: errs.append(m.text) if m.type in("error","warning") else None)
            pg.on("pageerror",lambda e,errs=errs: errs.append(str(e)))
            r=pg.goto(BASE+path,wait_until="networkidle")
            ov=pg.evaluate("()=>({sw:document.documentElement.scrollWidth,iw:window.innerWidth})")
            # find offenders
            # Elements inside a horizontal scroll container (e.g. the testimonial slider) are off-screen by design.
            off=pg.evaluate("""()=>{const iw=window.innerWidth;const o=[];const inScroller=e=>{for(let a=e.parentElement;a;a=a.parentElement){const x=getComputedStyle(a).overflowX;if(x==='auto'||x==='scroll')return true}return false};document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>iw+1&&r.width>0&&getComputedStyle(e).position!=='fixed'&&!e.closest('.hp')&&!e.closest('[hidden]')&&!inScroller(e))o.push(e.tagName+'.'+(e.className&&e.className.baseVal===undefined?e.className:'')+' '+Math.round(r.right))});return o.slice(0,5)}""")
            slug=(path.strip("/").replace("/","_") or "home")
            pg.screenshot(path=f"qa/screenshots/{name}_{slug}.png",full_page=True)
            report.append((name,path,r.status,ov["sw"]>ov["iw"],off,errs[:3]))
            pg.close()
        ctx.close()
    b.close()
for r in report:
    flag="" if (r[2] in(200,404) and not r[3] and not r[5]) else "  <<<<"
    if r[1]=="/nope" and r[2]==404 and not r[3]: flag=""
    print(r[0],r[1],r[2],"OVERFLOW" if r[3] else "ok",r[4] or "",r[5] or "",flag)
