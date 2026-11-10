"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { company } from "@/lib/studio-content";
import { buildConcept, conceptBrief, conceptFeatures, conceptPalettes, CONCEPT_HANDOFF_KEY, createConceptHandoff, defaultConceptDraft, getEnquiryLink, projectKinds, readableInk, type ConceptDraft, type FeatureId, type ProjectConcept } from "@/lib/project-concept";
import { AnimatedIcon } from "./animated-icon";
import ConceptPreview from "./concept-preview";
import ConceptIllustration from "./concept-illustration";

const examples = [
  { label: "A café with bookings", text: "A light, minimal website for a café with online booking, a menu and a photo gallery. Use forest green.", name: "Gather" },
  { label: "A learning app", text: "A dark blue mobile app for online learning with member login, courses, payments and notifications.", name: "Openmind" },
  { label: "A team workspace", text: "A clean web application for our team with a dashboard, analytics, automation and live chat. Dark violet theme.", name: "Flowstate" },
];
const featureName = (id: FeatureId) => conceptFeatures.find((x) => x.id === id)!.label;
type PreviewView = "overview" | "direction" | FeatureId;

function PreviewLayer({expanded,children}:{expanded:boolean;children:React.ReactNode}) {
  return expanded?createPortal(children,document.body):children;
}

function SampleChart() {
  return <div className="pc-chart" aria-label="Sample activity chart"><div className="pc-chart-heading"><span>Activity overview</span><small>DEMO DATA · THIS WEEK</small></div><div className="pc-chart-bars">{[35, 56, 44, 77, 60, 91, 72].map((h, i) => <div key={i}><span style={{height:`${h}%`}}/><small>{["M","T","W","T","F","S","S"][i]}</small></div>)}</div></div>;
}

function FeatureDemo({ view, concept }: { view: PreviewView; concept: ProjectConcept }) {
  const [day, setDay] = useState("Tue");
  const [slot, setSlot] = useState("10:30");
  const [confirmed, setConfirmed] = useState(false);
  const [cart, setCart] = useState(0);
  const [tried, setTried] = useState(false);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  if (view === "booking") return <div className="pc-feature-demo"><span className="pc-kicker">A LITTLE TIME FOR YOU</span><h3>Make room for<br/><em>something good.</em></h3><p>Try a sample booking journey.</p><div className="pc-days">{["Mon","Tue","Wed","Thu","Fri"].map((d,i)=><button key={d} onClick={()=>{setDay(d);setConfirmed(false);}} aria-pressed={day===d}>{d}<b>{12+i}</b></button>)}</div><div className="pc-slots">{["09:00","10:30","14:00"].map((s)=><button key={s} aria-pressed={slot===s} onClick={()=>{setSlot(s);setConfirmed(false);}}>{s}</button>)}</div><button className="pc-primary" onClick={()=>setConfirmed(true)}>{confirmed ? "Demo selection saved ✓" : "Try this time"}</button><p className="pc-demo-feedback" role="status">{confirmed ? `Your demo selection: ${day} at ${slot}.` : "Sample dates and availability"}</p></div>;
  if (view === "shop") return <div className="pc-feature-demo"><div className="pc-module-title"><div><span className="pc-kicker">THE EVERYDAY EDIT</span><h3>A little considered.</h3></div><span className="pc-bag" aria-live="polite">Bag / {cart}</span></div><div className="pc-products">{["The essential","The original","The everyday"].map((name,i)=><article key={name}><div className={`pc-product-art art-${i}`}><ConceptIllustration concept={concept} variant={i+1} compact/></div><h4>{name}</h4><p>Sample product · ₹{[1200,1800,2400][i]}</p><button onClick={()=>setCart(cart+1)}>Add to demo bag <span>+</span></button></article>)}</div><p className="pc-demo-feedback" role="status">{cart ? `${cart} ${cart===1?"item":"items"} in your demo bag. Try a different feature above.` : "Explore a sample collection and try adding an item."}</p></div>;
  if (view === "payments") return <div className="pc-feature-demo pc-payment"><span className="pc-kicker">A SIMPLE WAY TO COMPLETE</span><h3>One last<br/><em>little step.</em></h3><div className="pc-checkout-line"><span>Example order</span><b>₹1,200</b></div><div className="pc-payment-method"><AnimatedIcon name="check" size={16}/><span>Demo payment method</span><b>•••• 4242</b></div><button className="pc-primary" onClick={()=>setTried(true)}>{tried ? "Demo complete ✓" : "Try demo checkout"}</button><p className="pc-demo-feedback" role="status">{tried ? "Demo completed. No payment was processed." : "Interactive sample checkout"}</p></div>;
  if (view === "members") return <div className="pc-feature-demo pc-member"><span className="pc-member-avatar">{concept.name.charAt(0)}</span><span className="pc-kicker">A SPACE OF YOUR OWN</span><h3>{tried?"Good to see you, Alex.":"Your people. Connected."}</h3><p>{tried?"Your projects, saved items and conversations live here.":"Preview a simple member experience for your project."}</p>{tried&&<div className="pc-sample-stats"><span>Saved items<b>06</b></span><span>Messages<b>02</b></span></div>}<button className="pc-primary" onClick={()=>setTried(!tried)}>{tried?"Back to sign-in demo":"Open demo account"}</button><p className="pc-demo-feedback">Sample account · no sign-up required</p></div>;
  if (view === "dashboard" || view === "analytics") return <div className="pc-feature-demo"><span className="pc-kicker">THE BIGGER PICTURE</span><h3>Your day, at a glance.</h3><div className="pc-sample-stats"><span>Active projects<b>08</b></span><span>Tasks complete<b>24</b></span><span>This week<b>06</b></span></div><SampleChart/><p className="pc-demo-feedback">Illustrative figures for your concept</p></div>;
  if (view === "chat") return <div className="pc-feature-demo pc-chat"><span className="pc-kicker">A CONVERSATION STARTER</span><h3>A little help.<br/><em>Right here.</em></h3><div className="pc-chat-bubble">Welcome to {concept.name}. What would you like to explore?</div>{asked&&<><div className="pc-chat-bubble pc-chat-user">{asked}</div><div className="pc-chat-bubble">We can guide visitors through {concept.features.includes("booking")?"booking an appointment":concept.features.includes("shop")?"finding the right product":"your services"} and connect them with your team.</div></>}<form className="pc-chat-input" onSubmit={e=>{e.preventDefault();if(question.trim()){setAsked(question.trim());setQuestion("");}}}><input aria-label="Demo chat question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={140} placeholder="Ask a sample question…"/><button aria-label="Send demo question" type="submit"><AnimatedIcon name="arrow" size={16}/></button></form><p className="pc-demo-feedback">Scripted interaction preview</p></div>;
  if (view === "gallery" || view === "articles") return <div className="pc-feature-demo"><span className="pc-kicker">ROOM FOR DISCOVERY</span><h3>{view==="gallery"?"A fresh perspective.":"A little worth exploring."}</h3><div className={`pc-content-grid ${view==="gallery"?"pc-gallery":""}`}>{concept.cards.map((text,i)=><article key={text}><div className={`pc-product-art art-${i}`}><ConceptIllustration concept={concept} variant={i+1} compact/></div><small>{view==="articles"?"INSIGHTS / 0":"SELECTED / 0"}{i+1}</small><h4>{text}</h4><p>{view==="articles"?"A place for your stories, insights and useful ideas.":"A space for the moments and work you want to share."}</p></article>)}</div></div>;
  if (view === "direction") return <div className="pc-feature-demo"><span className="pc-kicker">YOUR DIRECTION, CONNECTED</span><h3>{concept.name}</h3><p>{concept.idea || "A thoughtful digital experience shaped around your business and your audience."}</p><div className="pc-direction-list"><span>Project<b>{projectKinds.find(x=>x.id===concept.kind)!.label}</b></span><span>Look & feel<b>{concept.theme} / {concept.style}</b></span><span>Color direction<b>{concept.palette}</b></span>{concept.features.map(id=><span key={id}>{featureName(id)}<AnimatedIcon name="check" size={14}/></span>)}</div></div>;
  const detail: Partial<Record<FeatureId,{title:string;lines:string[];action:string}>> = {
    notifications:{title:"The right nudge. At the right time.",lines:["Your project is ready to review","A reminder for your next booking","Your team has a new update"],action:"Try a notification"},
    automation:{title:"A little less busywork.",lines:["A new enquiry arrives","Assign it to the right team","Send a helpful follow-up"],action:"Run sample workflow"},
    team:{title:"Better, together.",lines:["Alex · Design direction","Sam · Project development","You · A fresh perspective"],action:"Preview collaboration"},
    seo:{title:"Be there when they search.",lines:["A clear structure for search","Useful content for your audience","A focused path to an enquiry"],action:"Preview search result"},
    social:{title:"A reason to stop scrolling.",lines:["Your story, told with intention","Creative that feels like your brand","A consistent conversation"],action:"Preview a social post"},
    ads:{title:"Reach the right people.",lines:["A clear campaign objective","A message for your audience","A focused landing experience"],action:"Preview campaign"},
    newsletter:{title:"Stay in the conversation.",lines:["A welcome that feels personal","The ideas worth sharing","A clear next step"],action:"Preview welcome email"},
  };
  const content = detail[view as FeatureId] || detail.automation!;
  return <div className="pc-feature-demo"><span className="pc-kicker">{featureName(view as FeatureId)}</span><h3>{content.title}</h3><div className="pc-workflow">{content.lines.map((line,i)=><div key={line}><span>0{i+1}</span><p>{line}</p><AnimatedIcon name="check" size={14}/></div>)}</div><button className="pc-primary" onClick={()=>setTried(!tried)}>{tried?"Back to feature":content.action}</button>{tried&&<div className="pc-feature-feedback" role="status"><b>{concept.name}</b><p>{view==="seo"?`${concept.name} — ${concept.headline.join(" ")}`:view==="notifications"?"Your next step is ready. Take a look when it suits you.":view==="social"?concept.headline.join(" "):"Your sample journey is connected. The team can tailor every step to your business."}</p></div>}</div>;
}


function codeFor(concept: ProjectConcept) {
  return [
    "// your brief, becoming a visual direction",
    "",
    "const direction = {",
    "  brand: " + JSON.stringify(concept.name) + ",",
    "  composition: " + JSON.stringify(concept.design.layout) + ",",
    "  artwork: " + JSON.stringify(concept.design.visual) + ",",
    "  typography: " + JSON.stringify(concept.design.font) + ",",
    "  theme: " + JSON.stringify(concept.theme) + ",",
    "  accent: " + JSON.stringify(concept.accent) + ",",
    "  signature: " + JSON.stringify(concept.design.id),
    "};",
    "",
    "compose.hero(direction);",
    "compose.story(" + JSON.stringify(concept.design.storyTitle) + ");",
    ...concept.features.map(id => "connect." + id + "();"),
    "",
    "// considered details. a different perspective."
  ].join("\\n");
}

export default function ProjectBuilder() {
  const [hydrated,setHydrated]=useState(false);
  const [draft,setDraft]=useState<ConceptDraft>(defaultConceptDraft);
  const [concept,setConcept]=useState(()=>buildConcept({...defaultConceptDraft,name:"Forma",idea:"A thoughtful online store with payments and a photo gallery. Dark violet."}));
  const [generated,setGenerated]=useState(false);
  const [signature,setSignature]=useState("");
  const [revision,setRevision]=useState(0);
  const [direction,setDirection]=useState(0);
  const [expanded,setExpanded]=useState(false);
  const [device,setDevice]=useState<"desktop"|"mobile">("desktop");
  const [building,setBuilding]=useState(false);
  const [progress,setProgress]=useState(0);
  const [code,setCode]=useState("");
  const [announcement,setAnnouncement]=useState("");
  const [handoffError,setHandoffError]=useState(false);
  const timer=useRef<ReturnType<typeof setInterval>|null>(null);
  const preview=useRef<HTMLDivElement>(null);
  const previewTitle=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{setHydrated(true);return()=>{if(timer.current)clearInterval(timer.current);};},[]);
  useEffect(()=>{
    if(!expanded)return;
    const previousFocus=document.activeElement as HTMLElement|null;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    preview.current?.querySelector<HTMLButtonElement>(".idea-return-choices")?.focus();
    const keys=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){e.preventDefault();setExpanded(false);}
      if(e.key!=="Tab")return;
      const nodes=Array.from(preview.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')||[]).filter(node=>node.offsetParent!==null);
      const first=nodes[0],last=nodes[nodes.length-1];
      if(!first)return;
      if(e.shiftKey&&(document.activeElement===first||!preview.current?.contains(document.activeElement))){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&(document.activeElement===last||!preview.current?.contains(document.activeElement))){e.preventDefault();first.focus();}
    };
    document.addEventListener("keydown",keys);
    return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener("keydown",keys);previousFocus?.focus({preventScroll:true});};
  },[expanded]);
  const proposed=buildConcept(draft);
  const kind=proposed.kind;
  const availableFeatures=conceptFeatures.filter(x=>x.kinds.includes(kind)||proposed.features.includes(x.id));
  const dirty=generated&&signature!==JSON.stringify(draft);
  const contact=getEnquiryLink(conceptBrief(concept),company);

  function update<K extends keyof ConceptDraft>(key:K,value:ConceptDraft[K]) {setDraft(current=>({...current,[key]:value}));setHandoffError(false);}
  function toggleFeature(id:FeatureId) {
    const active=proposed.features.includes(id);
    setDraft(current=>({...current,features:active?current.features.filter(x=>x!==id):[...current.features,id],excludedFeatures:active?[...current.excludedFeatures,id]:current.excludedFeatures.filter(x=>x!==id)}));
  }
  function generate(e?:React.FormEvent) {
    e?.preventDefault(); if(building)return;
    const savedSignature=JSON.stringify(draft);
    const next=buildConcept(draft,signature===savedSignature?direction+1:0), source=codeFor(next);
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches||document.documentElement.dataset.motion==="off";
    setBuilding(true);setProgress(0);setCode("");setHandoffError(false);setAnnouncement("Composing your concept.");
    if(!expanded)preview.current?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
    const start=performance.now(), duration=reduced?180:1900+(next.design.seed%650);
    timer.current=setInterval(()=>{
      const p=Math.min(1,(performance.now()-start)/duration);
      setProgress(p);setCode(source.slice(0,Math.ceil(source.length*p)));
      if(p===1){if(timer.current)clearInterval(timer.current);timer.current=null;setConcept(next);setDirection(next.design.variation);setDevice(next.kind==="mobile"?"mobile":"desktop");setGenerated(true);setSignature(savedSignature);setRevision(x=>x+1);setBuilding(false);setExpanded(true);setAnnouncement(`${projectKinds.find(x=>x.id===next.kind)!.label} concept ready in the ${next.design.label} direction. Explore the full preview, try another direction or return to your choices.`);previewTitle.current?.focus({preventScroll:true});}
    },24);
  }
  function handoff(e:React.MouseEvent<HTMLAnchorElement>) {
    if(contact.direct)return;
    try{sessionStorage.setItem(CONCEPT_HANDOFF_KEY,JSON.stringify(createConceptHandoff(concept)));}catch{e.preventDefault();setHandoffError(true);}
  }
  const phase=progress<.28?0:progress<.6?1:progress<.88?2:3;

  return <section className="idea-section section-wrap" id="idea-studio" aria-labelledby="idea-title">
    <div className="idea-section-heading"><div><span className="eyebrow"><span className="tiny-square"/>YOUR IDEA. A LITTLE MORE TANGIBLE.</span><h2 id="idea-title">What if<br/><span className="serif-word">became this?</span></h2></div><div><p>A few choices. A little imagination. See a direction for your next website, app or digital project take shape.</p><span className="idea-speed"><i/>INSTANT CONCEPT · NO SIGN-UP</span></div></div>
    <div className="idea-studio-layout">
      <form className="idea-controls" onSubmit={generate}>
        <div className="idea-controls-heading"><AnimatedIcon name="studio" size={22}/><b>The possibility starts here.</b><span>01 → 04</span></div>
        <fieldset disabled={!hydrated||building} className="idea-all-controls">
          <fieldset className="idea-field"><legend><span>01</span>What are we making?</legend><div className="idea-kind-options"><button type="button" aria-pressed={draft.kind==="auto"} onClick={()=>update("kind","auto")}><AnimatedIcon name="burst" size={16}/>From my idea</button>{projectKinds.map(x=><button type="button" key={x.id} aria-pressed={draft.kind===x.id} onClick={()=>update("kind",x.id)}><AnimatedIcon name={x.icon} size={16}/>{x.label}</button>)}</div></fieldset>
          <fieldset className="idea-field"><legend><span>02</span>Tell us the what-if.</legend><label className="idea-brand-label" htmlFor="idea-brand">Project / brand name <span>optional</span></label><input id="idea-brand" maxLength={40} value={draft.name} onChange={e=>update("name",e.target.value)} placeholder="Give your idea a name"/><label className="sr-only" htmlFor="idea-description">Describe your project requirements</label><textarea id="idea-description" rows={3} maxLength={600} value={draft.idea} onChange={e=>update("idea",e.target.value)} placeholder="A café website with bookings, a photo gallery and a clean green theme…"/><div className="idea-description-meta"><span>We’ll pick up project, feature and style cues.</span><span>{draft.idea.length}/600</span></div><div className="idea-examples"><span>TRY AN IDEA</span>{examples.map(x=><button key={x.label} type="button" onClick={()=>setDraft({...defaultConceptDraft,idea:x.text,name:x.name})}>{x.label}<span>↗</span></button>)}</div></fieldset>
          <fieldset className="idea-field"><legend><span>03</span>A few things it should do.</legend><div className="idea-feature-options">{availableFeatures.map(x=><button type="button" key={x.id} aria-pressed={proposed.features.includes(x.id)} onClick={()=>toggleFeature(x.id)}><span className="idea-feature-check">{proposed.features.includes(x.id)?"✓":"+"}</span>{x.label}</button>)}</div><p className="idea-hint">Matches from your written idea are selected too. Tap to refine.</p></fieldset>
          <fieldset className="idea-field idea-visual-field"><legend><span>04</span>Make it feel like you.</legend><div className="idea-visual-row"><div><label htmlFor="idea-theme">Theme</label><select id="idea-theme" value={draft.theme} onChange={e=>update("theme",e.target.value as ConceptDraft["theme"])}><option value="auto">From my idea</option><option value="dark">After dark</option><option value="light">Warm & light</option></select></div><div><label htmlFor="idea-style">Design style</label><select id="idea-style" value={draft.style} onChange={e=>update("style",e.target.value as ConceptDraft["style"])}><option value="auto">From my idea</option><option value="expressive">Expressive</option><option value="minimal">Minimal</option><option value="editorial">Editorial</option></select></div></div><span className="idea-color-label">Color direction <b>{draft.palette==="auto"?"From your idea":draft.palette==="custom"?draft.customColor:conceptPalettes.find(x=>x.id===draft.palette)?.name}</b></span><div className="idea-colors"><button type="button" className="idea-auto-color" aria-label="Detect colors from my idea" aria-pressed={draft.palette==="auto"} onClick={()=>update("palette","auto")}><AnimatedIcon name="burst" size={15}/></button>{conceptPalettes.map(x=><button key={x.id} type="button" aria-label={x.name} aria-pressed={draft.palette===x.id} style={{"--swatch":x.color,"--swatch-second":x.secondary} as CSSProperties} onClick={()=>update("palette",x.id)}><span>{draft.palette===x.id?"✓":""}</span></button>)}<label className={`idea-custom-color ${draft.palette==="custom"?"selected":""}`} title="Pick a custom accent"><input type="color" aria-label="Custom accent color" value={draft.customColor} onChange={e=>setDraft(current=>({...current,palette:"custom",customColor:e.target.value}))}/><AnimatedIcon name="palette" size={17}/></label></div></fieldset>
        </fieldset>
        <button type="submit" className="idea-generate" disabled={!hydrated||building}><AnimatedIcon name={building?"code":"burst"} size={19}/><span>{!hydrated?"Opening idea studio…":building?"A little possibility, loading…":generated?"Update my preview":"Make my preview"}</span><AnimatedIcon name="arrow" size={18}/></button><p className="idea-local-note">A visual starting point, composed in your browser.</p>
      </form>
      <PreviewLayer expanded={expanded}>
      {expanded&&<div className="idea-full-preview-scrim" aria-hidden="true" onClick={()=>setExpanded(false)}/>}
      <div ref={preview} className={`idea-preview-panel ${expanded?"is-expanded":""}`} role={expanded?"dialog":undefined} aria-modal={expanded?true:undefined} aria-labelledby={expanded?"idea-preview-title":undefined}>
        <div className="idea-preview-heading"><div><span className={`idea-ready-dot ${building?"is-building":""}`}/><h3 id="idea-preview-title" ref={previewTitle} tabIndex={-1}>{building?"An idea in motion…":generated?"Your idea, considered.":"A little glimpse of what’s possible."}</h3></div>{expanded?<button aria-label="Back to choices" className="idea-return-choices" onClick={()=>setExpanded(false)}><AnimatedIcon name="close" size={14}/><span>Back to choices</span></button>:null}<div className="idea-device-switch" role="group" aria-label="Preview screen size"><button type="button" disabled={building} onClick={()=>setDevice("desktop")} aria-pressed={device==="desktop"} aria-label="Desktop preview"><AnimatedIcon name="web" size={17}/></button><button type="button" disabled={building} onClick={()=>setDevice("mobile")} aria-pressed={device==="mobile"} aria-label="Mobile preview"><AnimatedIcon name="mobile" size={17}/></button>{!expanded&&<button className="idea-expand-button" disabled={building} onClick={()=>setExpanded(true)} aria-label="Open full preview"><AnimatedIcon name="layers" size={15}/><span>Full preview</span></button>}</div></div>
        <div className="idea-direction-bar"><div><span>{generated?`DIRECTION ${String(direction+1).padStart(2,"0")} / ${concept.design.id}`:"AN EXAMPLE DIRECTION"}</span><strong>{concept.design.label}</strong></div><button type="button" onClick={()=>generate()} disabled={!generated||dirty||building}><AnimatedIcon name="reset" size={13}/>Another direction</button></div>
        <div className="idea-browser-bar"><span><i/><i/><i/></span><span><AnimatedIcon name="code" size={12}/>{generated?concept.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"your-project":"your-next-idea"} / concept</span><span>{generated?"YOUR CONCEPT":"EXAMPLE CONCEPT"}</span></div>
        <div className={`idea-preview-stage ${building?"is-building":""}`} aria-busy={building}>
          <ConceptPreview key={revision} concept={concept} device={device} renderFeature={(view)=><FeatureDemo key={`${revision}-${view}`} view={view} concept={concept}/>}/>
          {building&&<div className="idea-building"><div className="idea-build-grid"/><div className="idea-build-top"><AnimatedIcon name="code" size={24}/><span>A LITTLE IDEA, TAKING SHAPE</span><b>{Math.round(progress*100)}%</b></div><div className="idea-code-window" aria-hidden="true"><span>your-possibility.tsx <i>●</i></span><pre><code>{code}<span className="idea-code-cursor">▌</span></code></pre></div><div className="idea-build-steps">{["Reading the direction","Shaping the layout","Connecting the details","Ready for your curiosity"].map((text,i)=><span key={text} className={phase>=i?"active":""}><i>{phase>i?"✓":`0${i+1}`}</i>{text}</span>)}</div><div className="idea-build-progress" role="progressbar" aria-label="Preparing project concept" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)}><span style={{width:`${progress*100}%`}}/></div></div>}
        </div>
        <div className="idea-preview-summary"><span className="idea-summary-kicker">{dirty?"YOUR CHOICES HAVE CHANGED · UPDATE TO SEE THEM":generated?"SHAPED AROUND YOUR IDEA":"CHOOSE A DIRECTION ON THE LEFT TO MAKE IT YOURS"}</span><div className="idea-summary-tags"><span>{projectKinds.find(x=>x.id===concept.kind)!.label}</span><span>{concept.theme} / {concept.style}</span><span><i style={{background:concept.accent}}/>{concept.palette}</span>{concept.features.slice(0,3).map(id=><span key={id}>{featureName(id)}</span>)}{concept.features.length>3&&<span>+{concept.features.length-3} more</span>}</div><p>Explore the feature tabs inside the preview. Every detail is a conversation starter.</p></div>
        <div className="idea-next-step"><div><AnimatedIcon name="contact" size={22}/><div><h4>Like where this is going?</h4><p>{generated?"Let’s turn this direction into your next real thing.":"Make your preview, then take the next step together."}</p></div></div>{generated&&!dirty&&!building?<a className="idea-contact-link" href={contact.href} onClick={handoff}>{contact.label}<AnimatedIcon name="arrow" size={17}/></a>:<button className="idea-contact-link" disabled>{dirty?"Update preview to continue":"Get more. Make it real."}<AnimatedIcon name="arrow" size={17}/></button>}</div>
        {handoffError&&<div className="idea-handoff-error" role="alert"><p>Your browser could not carry the brief to the next page. Copy the details below, then open the enquiry form.</p><textarea readOnly aria-label="Your concept brief to copy" value={conceptBrief(concept)} rows={5}/><a className="text-link" href="/contact">Open enquiry form <AnimatedIcon name="arrow" size={14}/></a></div>}
        <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
      </div>
      </PreviewLayer>
    </div>
  </section>;
}
