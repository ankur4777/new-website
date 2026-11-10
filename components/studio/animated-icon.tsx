import type { CSSProperties } from "react";

export type IconName = "home" | "growth" | "web" | "layers" | "code" | "mobile" | "work" | "studio" | "process" | "contact" | "arrow" | "down" | "palette" | "magnet" | "scatter" | "swirl" | "burst" | "reset" | "download" | "check" | "menu" | "close";

/** Original motion-ready line icons. Decorative: the surrounding control supplies its label. */
export function AnimatedIcon({ name, size = 22, className = "", delay = 0 }: { name: IconName; size?: number; className?: string; delay?: number }) {
  let content;
  switch (name) {
    case "home": content = <><path className="icon-lift" d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-7h6v7"/></>; break;
    case "growth": content = <><path d="M3 20h18"/><path className="icon-bar bar-one" d="M6 16v-4"/><path className="icon-bar bar-two" d="M12 16V9"/><path className="icon-bar bar-three" d="M18 16V5"/><path className="icon-signal" d="m4 8 6-4 4 1 5-3"/></>; break;
    case "web": content = <><circle cx="12" cy="12" r="9"/><ellipse className="icon-globe" cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/></>; break;
    case "layers": content = <><path className="icon-layer layer-one" d="m3 7 9-4 9 4-9 4Z"/><path className="icon-layer layer-two" d="m3 12 9 4 9-4"/><path className="icon-layer layer-three" d="m3 17 9 4 9-4"/></>; break;
    case "code": content = <><path className="icon-code-left" d="m8 6-6 6 6 6"/><path className="icon-code-right" d="m16 6 6 6-6 6"/><path className="icon-trace" d="m14 3-4 18"/></>; break;
    case "mobile": content = <><rect className="icon-phone" x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4M11 18h2"/><path className="icon-signal" d="m9 12 2 2 4-5"/></>; break;
    case "work": content = <><rect className="icon-tile tile-one" x="3" y="3" width="7" height="7" rx="1.5"/><rect className="icon-tile tile-two" x="14" y="3" width="7" height="7" rx="1.5"/><rect className="icon-tile tile-three" x="3" y="14" width="7" height="7" rx="1.5"/><rect className="icon-tile tile-four" x="14" y="14" width="7" height="7" rx="1.5"/></>; break;
    case "studio": content = <><path className="icon-star" d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/><path className="icon-signal" d="M20 2v4m-2-2h4"/></>; break;
    case "process": content = <><path className="icon-trace" d="M5 5h10a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h10"/><circle cx="5" cy="5" r="2"/><path className="icon-arrow" d="m17 16 3 3-3 3"/></>; break;
    case "contact": content = <><path className="icon-bubble" d="M21 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 19 0Z"/><path className="icon-dot dot-one" d="M7 11h.01"/><path className="icon-dot dot-two" d="M12 11h.01"/><path className="icon-dot dot-three" d="M17 11h.01"/></>; break;
    case "arrow": content = <g className="icon-arrow"><path d="M5 19 19 5M5 5h14v14"/></g>; break;
    case "down": content = <g className="icon-down"><path d="M12 3v18m-6-6 6 6 6-6"/></g>; break;
    case "palette": content = <><path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-3.7 1.5 1.5 0 0 1 .7-2.8H17A4 4 0 0 0 21 10c-.7-4-4.2-7-9-7Z"/><circle className="icon-dot dot-one" cx="7" cy="10" r=".8"/><circle className="icon-dot dot-two" cx="11" cy="7" r=".8"/><circle className="icon-dot dot-three" cx="16" cy="9" r=".8"/></>; break;
    case "magnet": content = <><path className="icon-lift" d="M5 10V5h5v9a2 2 0 0 0 4 0V5h5v9a7 7 0 0 1-14 0v-4Zm0 0h5m4 0h5"/><path className="icon-signal" d="M2 2 4 4m16 0 2-2"/></>; break;
    case "scatter": content = <><path className="icon-star" d="M12 3v5m0 8v5M3 12h5m8 0h5M5 5l3 3m8 8 3 3M5 19l3-3m8-8 3-3"/><circle cx="12" cy="12" r="2"/></>; break;
    case "swirl": content = <path className="icon-star" d="M12 12c0-4 6-4 6 0a6 6 0 1 1-6-6c8 0 10 10 4 14M5 3 3 7l5 1"/>; break;
    case "burst": content = <><path className="icon-star" d="m12 2 2 7 7-4-4 7 5 3-8 1-2 6-2-7-8 1 6-5-4-6 6 3Z"/></>; break;
    case "reset": content = <><path className="icon-star" d="M4 9a8 8 0 1 1 0 7M4 3v6h6"/></>; break;
    case "download": content = <><path className="icon-down" d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 15v5h16v-5"/></>; break;
    case "check": content = <path className="icon-trace" d="m5 12 4 4L20 5"/>; break;
    case "menu": content = <><path className="icon-code-left" d="M3 7h18"/><path d="M7 12h14"/><path className="icon-code-right" d="M3 17h18"/></>; break;
    case "close": content = <g className="icon-star"><path d="m6 6 12 12M6 18 18 6"/></g>; break;
  }
  return <svg className={`animated-icon icon-${name} ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={{ "--icon-delay": `${delay}ms` } as CSSProperties}>{content}</svg>;
}
