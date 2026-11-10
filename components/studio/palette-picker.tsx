"use client";
import { useEffect, useRef, useState } from "react";
import { applyPalette, defaultPalette, palettes, type PaletteId } from "@/lib/palettes";
import { AnimatedIcon } from "./animated-icon";

export default function PalettePicker() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PaletteId>(defaultPalette);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const current = palettes.find((p) => p.id === selected)!;

  useEffect(() => {
    let saved: string = defaultPalette;
    try { saved = localStorage.getItem("studio-palette") || saved; } catch {}
    setSelected(applyPalette(saved).id);
  }, []);

  useEffect(() => {
    if (!open || !panel.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current.querySelector<HTMLButtonElement>("button")?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const buttons = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") || []);
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keyboard);
      (previous || trigger.current)?.focus();
    };
  }, [open]);

  function choose(id: PaletteId) {
    setSelected(id);
    applyPalette(id);
    try { localStorage.setItem("studio-palette", id); } catch {}
  }

  return <>
    <button ref={trigger} className="palette-launcher" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="color-studio">
      <span className="palette-launcher-orb"><AnimatedIcon name="palette" size={19}/></span>
      <span>Color studio<small>6 dark directions</small></span>
      <span className="palette-launcher-dot"/>
    </button>
    {open && <div className="palette-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div ref={panel} id="color-studio" className="palette-panel" role="dialog" aria-modal="true" aria-labelledby="palette-title" aria-describedby="palette-description">
        <div className="palette-heading"><span className="eyebrow">YOUR BRAND, YOUR FREQUENCY</span><button onClick={() => setOpen(false)} className="palette-close" aria-label="Close color studio"><AnimatedIcon name="close" size={20}/></button></div>
        <h2 id="palette-title">Find your <span className="serif-word">afterglow.</span></h2>
        <p id="palette-description">Six dark directions. Choose a palette to preview it across the entire website—including the 3D sculptures.</p>
        <div className="palette-options" role="group" aria-label="Website color palettes">
          {palettes.map((p, i) => <button key={p.id} onClick={() => choose(p.id)} className={`palette-card ${selected === p.id ? "selected" : ""}`} aria-pressed={selected === p.id} style={{ "--preview-bg": p.background, "--preview-primary": p.primary, "--preview-secondary": p.secondary } as React.CSSProperties}>
            <span className="palette-card-art" aria-hidden="true"><span className="palette-mini-index">0{i + 1} /</span><span className="palette-mini-shape"/><span className="palette-mini-type">Different.<br/><b>By design.</b></span><span className="palette-mini-cta"/></span>
            <span className="palette-card-label"><b>{p.name}</b><span className="palette-check"><AnimatedIcon name="check" size={12}/></span></span>
            <span className="palette-card-family"><i/><i/>{p.family}</span>
            <span className="palette-card-mood">{p.mood}</span>
          </button>)}
        </div>
        <div className="palette-current" aria-live="polite"><span className="status-dot"/>Previewing {current.name}<span>{current.primary.toUpperCase()}</span></div>
        <button className="button button-primary palette-keep" onClick={() => setOpen(false)}>Keep exploring in {current.name}<AnimatedIcon name="arrow" size={17}/></button>
        <p className="palette-footnote">Your preview is remembered on this browser. You can change it any time.</p>
      </div>
    </div>}
  </>;
}
