"use client";
import { useId } from "react";
import type { ProjectConcept } from "@/lib/project-concept";

/** Original vector scenes, composed from the brief's subject and a stable design seed. */
export default function ConceptIllustration({concept,variant=0,compact=false}:{concept:ProjectConcept;variant?:number;compact?:boolean}) {
  const id=useId().replace(/:/g,"");
  const p=(name:string)=>`url(#${id}-${name})`;
  const seed=(concept.design.seed+variant*971)>>>0;
  const turn=(seed%17)-8;
  const visual=concept.design.visual;
  const product=concept.idea.toLowerCase();
  let scene;
  if(visual==="coffee") scene=<>
    <path d="M0 0h600v640H0z" fill="#b3a88d"/><path d="M0 0h600v640H0z" fill="#fff" filter={p("grain")} opacity=".15"/>
    <path d="m30 0 570 270M0 90l600 270M0 180l600 270M0 270l600 270M0 360l600 270" stroke="#8b846d" strokeWidth="2" opacity=".22"/>
    <g transform={`rotate(${turn},300,320)`} filter={p("shadow")}><ellipse cx="306" cy="360" rx="185" ry="168" fill="#e9e7d9"/><ellipse cx="306" cy="354" rx="160" ry="147" fill="#f6f4e8"/><path d="M428 266c88-29 102 78 16 86" fill="none" stroke="#f5f2df" strokeWidth="35"/><circle cx="305" cy="304" r="133" fill={p("ceramic")}/><circle cx="305" cy="304" r="111" fill="#77503a"/><circle cx="305" cy="304" r="102" fill="#af784a"/><path d="M305 381c-6-60-83-72-51-127 18-28 48-7 51 13 4-20 39-42 57-13 34 58-51 75-57 127Z" fill="#e8d6ae"/><path d="M305 374V262m0 79c-45-17-58-36-42-51m42 35c47-18 59-39 41-54m-41 40c-34-18-35-32-29-38m29 70c30-10 45-22 48-34" fill="none" stroke="#bc8956" strokeWidth="6" strokeLinecap="round"/></g>
    <g transform="rotate(25 486 452)" filter={p("shadow")}><ellipse cx="486" cy="406" rx="21" ry="35" fill={p("metal")}/><rect x="479" y="426" width="13" height="135" rx="6" fill={p("metal")}/></g>
    {[0,1,2,3,4,5].map(i=><g key={i} transform={`translate(${i%2?510+(seed+i*17)%45:40+(seed+i*13)%45},${40+((seed+i*137)%540)}) rotate(${i*36})`}><ellipse rx="10" ry="15" fill="#493729"/><path d="M0-11C-7 0 7 2 0 12" fill="none" stroke="#9a7153" strokeWidth="2"/></g>)}
    <path d="M46 438q82-59 100-9m-82 13q62 49 78 2M53 450l83-22" stroke="#425b3f" fill="#4c6845" strokeWidth="4"/>
  </>;
  else if(visual==="culinary") scene=<>
    <rect width="600" height="640" fill="#bcbca4"/><path d="M0 0h600v640H0z" fill="#fff" filter={p("grain")} opacity=".14"/>
    <path d="M45 0v640M56 0v640M542 0v640M552 0v640" stroke="#e6e0cc" strokeWidth="2"/>
    <g filter={p("shadow")} transform={`rotate(${turn},300,320)`}><circle cx="302" cy="335" r="227" fill="#e8e7dd"/><circle cx="302" cy="335" r="192" fill="#d9ddcf"/><circle cx="302" cy="335" r="182" fill="#eff0de"/>
    {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${215+i*13} 210C440 ${220+i*22} 165 ${290+i*20} ${370-i*8} 445`} stroke={i%2?"#b9ba6c":"#cfcc87"} fill="none" strokeWidth="26" strokeLinecap="round"/>)}
    {[0,1,2,3,4].map(i=><g key={i} transform={`translate(${193+(i*73)%220},${223+(i*89)%220}) rotate(${i*51})`}><ellipse rx="33" ry="23" fill="#ba593c"/><ellipse rx="26" ry="17" fill="#d77745"/><path d="M-19 0h38M0-13v26" stroke="#eab079" strokeWidth="3"/></g>)}
    {[0,1,2,3,4,5].map(i=><path key={i} d="M0 0q-32-48-48-8Q-42 21 0 0q18-47 37-14Q34 10 0 0" fill={i%2?"#496d37":"#668144"} transform={`translate(${189+(i*79)%230},${237+(i*63)%210}) rotate(${i*43})`}/>)}
    </g><path d="M44 112v360m-12-360v81q12 35 24 0v-81M32 150h24" stroke={p("metal")} strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M557 113v359m0-359q-34 73 0 117" fill="none" stroke={p("metal")} strokeWidth="9" strokeLinecap="round"/>
  </>;
  else if(visual==="landscape") scene=<>
    <rect width="600" height="640" fill={p("sky")}/><circle cx={430+(seed%70)} cy="137" r="62" fill="#fff0c9" opacity=".9"/>
    <path d="m0 345 101-171 82 118 122-227 145 240 79-126 71 159v302H0Z" fill="#9daea9"/><path d="m179 294 126-229 67 115-42-11-25-48-31 78-26-5-30 55Z" fill="#f0f1e7"/>
    <path d="M0 376q110-151 210-33t190-18q90-80 200-66v381H0Z" fill="#557d74"/><path d="M0 474q150-176 303-90t297 27v229H0Z" fill="#254e48"/>
    <path d="M164 640q-7-163 118-217t34-112q91 44 11 109T283 640" fill="#9fc2b6"/><path d="M179 640q1-144 109-203t35-102" fill="none" stroke="#d6e0cf" strokeWidth="4" opacity=".6"/>
    {Array.from({length:18},(_,i)=><path key={i} d="m0 0-13 35h8l-12 25h14v15h6V60h14L8 35h8Z" fill={i%2?"#173d36":"#365f4e"} transform={`translate(${(i*79+(seed%100))%620},${416+(i*37)%185}) scale(${.4+(i%4)*.2})`}/>)}
    <path d="M58 152q43-24 84 0m-6 28q38-20 72 0" fill="none" stroke="#edf0e1" strokeWidth="4" opacity=".65"/>
  </>;
  else if(visual==="architecture") scene=<>
    <rect width="600" height="640" fill="#b8c8c7"/><circle cx="480" cy="96" r="67" fill="#eee7d1" opacity=".6"/><path d="M0 368 600 290v350H0Z" fill="#a5a58f"/>
    <g filter={p("shadow")}><path d="m82 230 277-84 162 90-277 90Z" fill="#ded8c6"/><path d="m82 230 162 96v201L82 437Z" fill="#b9b39f"/><path d="m244 326 277-90v202l-277 89Z" fill="#eeeadb"/><path d="m272 351 219-71v135l-219 71Z" fill="#354c48"/><path d="m344 327 1 136m72-160v137" stroke="#c9c4ae" strokeWidth="6"/><path d="m107 266 111 65v134l-111-64Z" fill="#5e6a59"/><path d="m88 229 270-84 164 90v16l-279 91L88 246Z" fill="#f0ece0"/>
    <path d="m261 352 257-85v27l-257 84Z" fill="#e1dbc9"/><path d="m83 438 160 91 278-90v30l-278 90L83 466Z" fill="#c8c5b1"/></g>
    <path d="m273 548 238-78 75 48-239 78Z" fill="#638f87"/><path d="m295 550 214-70 50 32-212 71Z" fill="#8bb5a6"/><path d="m304 552 201-66" stroke="#c6d7c5" strokeWidth="2"/>
    <g transform="translate(61 413)"><path d="M0 0v-143" stroke="#716e4c" strokeWidth="8"/>{[0,1,2,3,4].map(i=><path key={i} d="M0-118q-64-63-81-5Q-38-132 0-118q26-72 76-50Q29-162 0-118" fill="#506e4e" transform={`rotate(${i*35-65} 0 -118)`}/>)}</g>
    <path d="M0 601 158 554m244 86 198-65" stroke="#d3d0b9" strokeWidth="3"/>
  </>;
  else if(visual==="botanical") scene=<>
    <rect width="600" height="640" fill="#c9d0b7"/><path d="M0 495 600 388v252H0Z" fill="#b1bba0"/><ellipse cx="301" cy="531" rx="167" ry="32" fill="#657158" opacity=".19"/>
    <g fill="#536e4a"><path d="M41 590q50-222 94-459M101 308Q-6 229 24 164q72 15 84 120M118 241q86-97 106-45-5 50-106 69M68 435q-91-54-65-109 72 21 65 109M88 365q105-78 110-13-18 45-110 48"/><path d="M534 640q-56-194-69-388m28 179q81-102 107-55-3 67-107 55m-14-70q-99-44-72-95 74 4 72 95" fill="#768967"/></g>
    <g filter={p("shadow")} transform={`rotate(${turn*.5},300,350)`}><rect x="209" y="237" width="183" height="282" rx="23" fill={p("bottle")}/><path d="M228 252q-12 150-7 238" stroke="#f4e5bd" strokeWidth="10" opacity=".42" fill="none"/><rect x="232" y="171" width="139" height="83" rx="10" fill="#b3a184"/><path d="M243 183h116M243 196h116M243 209h116M243 222h116" stroke="#e5d3aa" strokeWidth="2" opacity=".65"/><rect x="222" y="321" width="158" height="121" rx="2" fill="#e9e4d2"/><text x="300" y="362" textAnchor="middle" fill="#3f4e3a" fontFamily="Georgia,serif" fontSize="24">{concept.name.slice(0,14)}</text><path d="M282 384h36m-18-13v27" stroke="#667255"/><text x="300" y="421" textAnchor="middle" fill="#6b6e5e" fontFamily="monospace" fontSize="8" letterSpacing="3">DAILY RITUAL / 01</text></g>
  </>;
  else if(visual==="product"||visual==="music") {
    const jewellery=/jewel|ring|gem|diamond|gold/.test(product);
    const bag=/fashion|bag|clothing|leather/.test(product);
    scene=<><rect width="600" height="640" fill={p("soft")}/><path d="M0 488 600 374v266H0Z" fill="#000" opacity=".06"/><ellipse cx="312" cy="501" rx="172" ry="37" fill="#101420" opacity=".13"/>
      {jewellery?<g filter={p("shadow")} transform={`rotate(${turn-16} 300 320)`}><ellipse cx="301" cy="361" rx="136" ry="151" fill="none" stroke={p("gold")} strokeWidth="40"/><ellipse cx="301" cy="361" rx="111" ry="127" fill="none" stroke="#fff0bc" strokeWidth="3"/><path d="m229 217 28-62h87l31 62-74 75Z" fill="#c3ded5" stroke="#f7eed1" strokeWidth="7"/><path d="m257 155 12 62 32 75 30-75 13-62m-115 62h146m-106 0 32-62 30 62" fill="none" stroke="#f5faf0" strokeWidth="3"/><path d="m249 236-19 13m122-12 20 16" stroke="#c7a869" strokeWidth="12"/></g>:bag?<g filter={p("shadow")} transform={`rotate(${turn} 300 340)`}><path d="M171 254h254l25 250q-145 54-303-1Z" fill={p("leather")}/><path d="M232 281V199q0-88 70-88t70 88v82" stroke="#6e3e2b" strokeWidth="23" fill="none"/><path d="m183 275-17 216q139 43 265-1l-19-215" stroke="#d3a376" strokeWidth="2" fill="none" strokeDasharray="4 4"/><rect x="281" y="320" width="40" height="35" rx="5" fill={p("gold")}/><text x="300" y="433" textAnchor="middle" fill="#f7dfbc" fontFamily="Georgia,serif" fontSize="16" letterSpacing="3">{concept.name.toUpperCase().slice(0,15)}</text></g>:visual==="music"||/audio|headphone|sound|tech/.test(product)?<g filter={p("shadow")} transform={`rotate(${turn-15} 300 320)`}><path d="M164 340V265a140 140 0 0 1 280 0v75" fill="none" stroke="#303b44" strokeWidth="43"/><path d="M166 306v-42a137 137 0 0 1 274 0v42" fill="none" stroke="#aebdb8" strokeWidth="18"/><rect x="135" y="283" width="96" height="188" rx="47" fill={p("device")}/><rect x="373" y="283" width="96" height="188" rx="47" fill={p("device")}/><rect x="159" y="303" width="57" height="151" rx="28" fill="#37414c"/><rect x="387" y="303" width="57" height="151" rx="28" fill="#2d3640"/><path d="M179 319v116m231-116v116" stroke="#74858a" strokeWidth="3"/></g>:<g filter={p("shadow")} transform={`rotate(${turn} 300 340)`}><path d="M244 150h111v76q-2 43 47 92t27 140q-33 81-132 78t-128-78q-28-86 26-142t49-90Z" fill={p("ceramic")}/><ellipse cx="300" cy="151" rx="56" ry="16" fill="#e6d6b3"/><ellipse cx="300" cy="151" rx="45" ry="10" fill="#6f775c"/><path d="M224 279q-52 129-21 184" stroke="#ffffff3b" strokeWidth="12" strokeLinecap="round" fill="none"/><path d="M185 400q111 49 234-2" stroke="#8b957752" fill="none" strokeWidth="3"/></g>}
      <text x="42" y="590" fill={concept.design.ink} opacity=".42" fontFamily="monospace" fontSize="9" letterSpacing="4">OBJECT STUDY / {String(variant+1).padStart(2,"0")}</text></>;
  }
  else if(visual==="learning") scene=<>
    <rect width="600" height="640" fill={p("soft")}/><g transform={`translate(300 330) rotate(${turn-12})`} filter={p("shadow")}><rect x="-175" y="-192" width="304" height="386" rx="15" fill={concept.secondary}/><rect x="-145" y="-211" width="304" height="386" rx="15" fill="#eee9db"/><rect x="-119" y="-161" width="200" height="18" rx="8" fill="#b8b49f"/><text x="-113" y="-42" fontFamily="Georgia,serif" fontSize="102" fill="#3e514b">Aa.</text><path d="M-112-6H120M-112 10H75M-112 26h157" stroke="#b9b8aa" strokeWidth="5"/><rect x="-117" y="62" width="246" height="84" rx="9" fill="#d0d9b7"/><path d="m-96 118 27-25 27 14 32-28 34 39 30-21 54 20" stroke="#6a8a5b" strokeWidth="6" fill="none"/><circle cx="72" cy="-91" r="37" fill={concept.accent}/><path d="m60-110 30 18-30 18Z" fill={p("dark")}/></g><g transform="translate(460 146) rotate(14)" filter={p("shadow")}><rect x="-71" y="-45" width="142" height="91" rx="10" fill="#f9f5e8"/><path d="m-36 2 21 19L26-18" stroke="#728b53" strokeWidth="11" strokeLinecap="round" fill="none"/></g><path d="m84 133 13-27 12 27 30 9-30 9-12 28-13-28-27-9Z" fill={concept.accent}/>
  </>;
  else if(visual==="fitness") scene=<>
    <rect width="600" height="640" fill="#c9dc9f"/><path d="M0 524 600 412v228H0Z" fill="#aec77e"/><g transform={`rotate(${turn} 300 320)`}><circle cx="323" cy="300" r="188" fill="none" stroke="#6f904d" strokeWidth="34" opacity=".2"/><circle cx="323" cy="300" r="188" fill="none" stroke="#eff3d7" strokeWidth="34" strokeDasharray="800 450" transform="rotate(-90 323 300)" strokeLinecap="round"/><path d="m321 251-57 93-86 64 20 24 102-52 53-71 24 89 90 62 20-25-71-72-21-130Z" fill="#263f38"/><path d="m310 205-66 46-42 79 25 15 44-69 51-20 73 47 66-6-2-24-64-6-43-57Z" fill="#375a45"/><circle cx="341" cy="159" r="31" fill="#cb9474"/><path d="M317 138q12-37 48-10l3 19-39-4" fill="#273d32"/><path d="m178 408-22 18 27 16 34-3-18-26m271 43 13 25 37 7-4-19-35-27" fill="#f5efd2"/></g><text x="42" y="589" fontSize="66" fontFamily="sans-serif" fontWeight="800" fill="#35523d" opacity=".45">KEEP MOVING.</text>
  </>;
  else if(visual==="logistics") scene=<>
    <rect width="600" height="640" fill={p("soft")}/><path d="m-30 470 350-199 310 177M-20 302l363 211 290-169" stroke="#ffffff63" strokeWidth="43" fill="none"/><path d="m-30 470 350-199 310 177M-20 302l363 211 290-169" stroke="#8a9d9a" strokeWidth="2" strokeDasharray="9 13" fill="none"/>
    <g transform={`translate(294 330) rotate(${turn*.5})`} filter={p("shadow")}><path d="m-191-60 171-98 152 87L-39 28Z" fill="#ebd0a6"/><path d="m-191-60 152 88v161l-152-89Z" fill="#c4a27c"/><path d="m-39 28 171-99V90L-39 189Z" fill="#e0ba8b"/><path d="m132-71 77 45 55 106-132 76Z" fill={concept.accent}/><path d="m149-36 45 25 32 64-77 45Z" fill="#52787d"/><path d="m132 156 132-76v63l-132 78Z" fill="#60736e"/><ellipse cx="-129" cy="134" rx="22" ry="33" fill="#344b48"/><ellipse cx="57" cy="153" rx="23" ry="34" fill="#344b48"/><ellipse cx="207" cy="163" rx="23" ry="34" fill="#344b48"/><path d="m-144-33 65 38m-65-9 65 38" stroke="#b18f6c" strokeWidth="3"/><path d="m34-83 74 44" stroke="#f8e4c6" strokeWidth="7"/></g><path d="M484 123q0-37 33-37t33 37q0 30-33 63-33-34-33-63" fill={concept.accent}/><circle cx="517" cy="121" r="12" fill="#f5efdd"/>
  </>;
  else if(visual==="care"||visual==="community") scene=<>
    <rect width="600" height="640" fill={p("soft")}/><g filter={p("shadow")} transform={`rotate(${turn-6} 300 320)`}><rect x="111" y="122" width="367" height="390" rx="32" fill="#eaf1e9"/><path d="M112 169q181-83 366 0v80H112Z" fill="#bdd9cc"/><circle cx="295" cy="243" r="69" fill="#d4b195"/><path d="M228 230q-2-103 96-60 59 32 34 75l-27-54-96 46" fill="#38564b"/><path d="M180 432q4-122 115-122t120 122" fill="#688f7d"/><path d="m265 318 31 45 30-45 30 127H236Z" fill="#f1f5e8"/><rect x="143" y="414" width="304" height="71" rx="16" fill="#f7f8ef"/><circle cx="179" cy="449" r="15" fill="#bed5c0"/><path d="m172 449 6 5 9-11" stroke="#4b6d54" strokeWidth="3" fill="none"/><path d="M208 442h128m-128 14h86" stroke="#839d8a" strokeWidth="5"/></g><g transform="translate(464 146)" filter={p("shadow")}><rect x="-51" y="-51" width="102" height="102" rx="25" fill={concept.accent}/>{visual==="care"?<path d="M-25 0h50M0-25v50" stroke="#f6f3e8" strokeWidth="15" strokeLinecap="round"/>:<path d="M0 29q-52-35-28-54Q-5-45 0-17 9-46 32-25 51 1 0 29" fill="#f4eadb"/>}</g>
  </>;
  else if(visual==="finance") scene=<>
    <rect width="600" height="640" fill={p("soft")}/><g transform={`rotate(${turn-16} 300 320)`} filter={p("shadow")}><rect x="151" y="135" width="310" height="213" rx="24" fill={concept.secondary}/><rect x="103" y="243" width="361" height="232" rx="25" fill="#294b49"/><text x="135" y="288" fill="#e9f0dc" fontSize="20" fontFamily="sans-serif">{concept.name.slice(0,17)}</text><rect x="137" y="328" width="43" height="33" rx="7" fill={p("gold")}/><text x="137" y="410" fontFamily="monospace" fontSize="18" fill="#d0dcd0" letterSpacing="4">••••  ••••  2026</text><path d="m341 321 22-29 25 10 36-39" stroke="#c9e6c0" fill="none" strokeWidth="4"/></g><g filter={p("shadow")} transform="translate(425 468)">{[0,1,2,3].map(i=><g key={i} transform={`translate(0 ${-i*17})`}><ellipse rx="69" ry="27" cy="9" fill="#bc9750"/><rect x="-69" y="0" width="138" height="10" fill="#c7a86b"/><ellipse rx="69" ry="27" fill={p("gold")}/></g>)}</g>
  </>;
  else scene=<>
    <rect width="600" height="640" fill={p("soft")}/><path d="m0 555 600-346M0 450 600 104M58 640 600 327M0 100l600 346M0 207l600 346M0 313l564 327" stroke={concept.accent} opacity=".15" strokeWidth="1"/>
    <g transform={`translate(300 315) rotate(${turn})`} filter={p("shadow")}>
      {visual==="creative"?<><path d="m-192-100 225-130 153 88L-39-12Z" fill={concept.accent}/><path d="M-39-12 186-142v140L-39 128Z" fill={concept.secondary}/><path d="m-192-100 153 88v140l-153-88Z" fill="#627c77"/><path d="m-38 40 226-131v140L-38 179Z" fill="#e7e5cd"/><path d="m-192 91 153 88 225-130v70L-39 249-192 161Z" fill={concept.accent}/><text x="-90" y="18" fill="#f7f4e6" fontFamily="Georgia,serif" fontSize="84" transform="skewY(30)">{concept.name.charAt(0)}</text></>:<><path d="m-169-53 167-97 167 97L-2 43Z" fill={concept.secondary}/><path d="M-2 43 165-53v151L-2 195Z" fill={concept.accent}/><path d="m-169-53 167 96v152l-167-97Z" fill="#648b8d"/><path d="m-117-127 115-67 115 67L-2-59Z" fill="#f1f0dc"/><path d="M-2-59 113-127v30L-2-30Z" fill="#c7d4c6"/><path d="m-117-127 115 68v29l-115-67Z" fill="#a6bab5"/><path d="m-114-61 1 94 72 43m72-32 71-40v94l-71 41" stroke="#f2f4dc" strokeWidth="5" fill="none" strokeLinecap="round"/></>}
    </g><circle cx="481" cy="127" r="32" fill={concept.accent}/><path d="m469 127 10 10 17-21" stroke="#f6f6e8" strokeWidth="5" fill="none"/>
  </>;
  return <svg className={`concept-illustration ${compact?"illustration-compact":""}`} viewBox="0 0 600 640" role="img" aria-label={`${visual} illustration for ${concept.name}`} preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${id}-soft`} x2="1" y2="1"><stop stopColor={concept.secondary}/><stop offset="1" stopColor={concept.theme==="light"?"#e4dfd1":"#35484b"}/></linearGradient>
      <linearGradient id={`${id}-sky`} x2=".5" y2="1"><stop stopColor="#92b6c3"/><stop offset="1" stopColor="#e0dbc4"/></linearGradient>
      <radialGradient id={`${id}-ceramic`} cx=".3" cy=".2" r=".9"><stop stopColor="#f6f2da"/><stop offset=".5" stopColor="#b8c5a0"/><stop offset="1" stopColor="#6f8b65"/></radialGradient>
      <linearGradient id={`${id}-metal`}><stop stopColor="#777a6d"/><stop offset=".3" stopColor="#ebe9d1"/><stop offset=".55" stopColor="#959a88"/><stop offset="1" stopColor="#d1d2b8"/></linearGradient>
      <linearGradient id={`${id}-gold`} x2="1" y2="1"><stop stopColor="#a98a46"/><stop offset=".3" stopColor="#f8e6a7"/><stop offset=".5" stopColor="#c3a064"/><stop offset=".8" stopColor="#eee2b2"/><stop offset="1" stopColor="#9f7a3f"/></linearGradient>
      <linearGradient id={`${id}-bottle`}><stop stopColor="#6a6841"/><stop offset=".24" stopColor="#ad9c5c"/><stop offset=".55" stopColor="#877b46"/><stop offset="1" stopColor="#4e5838"/></linearGradient>
      <linearGradient id={`${id}-leather`}><stop stopColor="#6b432f"/><stop offset=".5" stopColor="#a4724c"/><stop offset="1" stopColor="#5c392a"/></linearGradient>
      <linearGradient id={`${id}-device`}><stop stopColor="#34444e"/><stop offset=".35" stopColor="#d1d8ce"/><stop offset=".8" stopColor="#8d9b9c"/><stop offset="1" stopColor="#52636c"/></linearGradient>
      <linearGradient id={`${id}-dark`}><stop stopColor="#172b29"/><stop offset="1" stopColor="#33483b"/></linearGradient>
      <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="8" dy="17" stdDeviation="13" floodColor="#17211b" floodOpacity=".23"/></filter>
      <filter id={`${id}-grain`}><feTurbulence baseFrequency=".7" numOctaves="3" seed={seed%53} type="fractalNoise"/><feColorMatrix type="saturate" values="0"/></filter>
    </defs>
    {scene}
  </svg>;
}
