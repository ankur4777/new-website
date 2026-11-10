"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  Minus,
  Check,
  Layers,
  BarChart3,
  Globe2,
  Code2,
  Smartphone,
  ArrowRight,
  Activity,
  Command,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { services, projects, processSteps, faqs } from "@/lib/studio-content";
export const Arrow = ({ down = false }: { down?: boolean }) =>
  down ? <ArrowDown size={18} /> : <ArrowUpRight size={19} />;
export function Button({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "button-secondary" : "button-primary"} ${className}`}
    >
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
export function Eyebrow({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <div className="eyebrow">
      <span className="tiny-square" />
      {children}
      {number && <span className="eyebrow-number">{number}</span>}
    </div>
  );
}
export function Icon({ name, size = 25 }: { name: string; size?: number }) {
  const map = {
    growth: BarChart3,
    web: Globe2,
    layers: Layers,
    code: Code2,
    mobile: Smartphone,
  };
  const I = map[name as keyof typeof map] || Command;
  return <I size={size} strokeWidth={1.4} />;
}
export function ServicesList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`services-list ${compact ? "compact" : ""}`}>
      {services.map((s) => (
        <Link
          className="service-row reveal"
          key={s.slug}
          href={`/services/${s.slug}`}
          style={{ "--service-accent": s.accent } as React.CSSProperties}
        >
          <span className="service-number">/{s.number}</span>
          <span className="service-icon">
            <Icon name={s.icon} />
          </span>
          <div className="service-name">
            <h3>{s.name}</h3>
            <span>{s.short}</span>
          </div>
          <div className="service-tags">
            {s.tags.slice(0, 2).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <span className="circle-arrow">
            <Arrow />
          </span>
        </Link>
      ))}
    </div>
  );
}
export function Process({ full = false }: { full?: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <div className={`process-grid ${full ? "full" : ""}`}>
      {processSteps.map((p, i) => (
        <button
          key={p.name}
          onClick={() => setActive(i)}
          className={`process-step reveal ${active === i ? "active" : ""}`}
          aria-pressed={active === i}
        >
          <span className="process-number">
            /{p.number}
            <ArrowRight size={18} />
          </span>
          <h3>
            {p.name}
            <span className="step-dot" />
          </h3>
          <p>{p.description}</p>
          <span className="process-output">
            <Check size={13} />
            {p.output}
          </span>
        </button>
      ))}
    </div>
  );
}
export function Accordion({
  items = faqs,
}: {
  items?: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="accordion">
      {items.map((f, i) => (
        <div className={`faq-item ${open === i ? "open" : ""}`} key={f.q}>
          <h3>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={`answer-${i}`}
            >
              <span>{f.q}</span>
              {open === i ? <Minus size={19} /> : <Plus size={19} />}
            </button>
          </h3>
          <div className="faq-answer" id={`answer-${i}`} hidden={open !== i}>
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export function ProjectVisual({
  theme,
  large = false,
}: {
  theme: string;
  large?: boolean;
}) {
  if (theme === "orbit")
    return (
      <div
        className={`project-art orbit-art ${large ? "large" : ""}`}
        aria-label="Orbit business dashboard design concept"
      >
        <div className="art-orbit orbit-a" />
        <div className="art-orbit orbit-b" />
        <div className="dashboard-window">
          <div className="window-top">
            <div>
              <i />
              <i />
              <i />
            </div>
            <span>orbit.workspace</span>
            <span>↗</span>
          </div>
          <div className="dashboard-body">
            <aside>
              <b>
                o<span>rbit</span>
                <i>✷</i>
              </b>
              {[
                "Overview",
                "Analytics",
                "Projects",
                "Messages",
                "Settings",
              ].map((x, i) => (
                <span key={x} className={i === 0 ? "selected" : ""}>
                  <span>{["◈", "▥", "▧", "◌", "⚙"][i]}</span>
                  {x}
                </span>
              ))}
              <small>
                YOUR WORKSPACE
                <br />A little more connected.
              </small>
            </aside>
            <div className="dash-content">
              <div className="dash-heading">
                <div>
                  <small>YOUR DAILY PERSPECTIVE</small>
                  <h4>Good things ahead.</h4>
                </div>
                <div className="dash-avatar">S</div>
              </div>
              <div className="dash-stats">
                <div>
                  <span>Total revenue</span>
                  <b>₹ 84,250</b>
                  <small>↗ 18.6% this month</small>
                </div>
                <div>
                  <span>Active projects</span>
                  <b>
                    24<span>projects</span>
                  </b>
                  <small>6 ready for review</small>
                </div>
              </div>
              <div className="dash-chart">
                <div>
                  <b>Everything in motion</b>
                  <span>This month⌄</span>
                </div>
                <svg
                  viewBox="0 0 400 120"
                  role="img"
                  aria-label="Illustrative analytics line chart"
                >
                  <defs>
                    <linearGradient id="chartFade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#b5a0fa" stopOpacity=".4" />
                      <stop offset="1" stopColor="#b5a0fa" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 102 C30 105 28 65 61 70 S95 94 120 65 S157 85 178 44 S208 73 240 40 S278 65 300 30 S345 65 370 20 S390 22 400 6 L400 120 L0 120 Z"
                    fill="url(#chartFade)"
                  />
                  <path
                    d="M0 102 C30 105 28 65 61 70 S95 94 120 65 S157 85 178 44 S208 73 240 40 S278 65 300 30 S345 65 370 20 S390 22 400 6"
                    fill="none"
                    stroke="#c5b3ff"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="chart-months">
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="art-badge">
          <span className="status-dot" />A clearer point of view.
        </div>
      </div>
    );
  if (theme === "mono")
    return (
      <div
        className={`project-art mono-art ${large ? "large" : ""}`}
        aria-label="Mono headphone store website design concept"
      >
        <div className="mono-window">
          <div className="mono-nav">
            <b>mono®</b>
            <span>Sound, reimagined.</span>
            <span>Bag (0) ↗</span>
          </div>
          <div className="mono-copy">
            <small>LESS NOISE. MORE FEELING.</small>
            <h4>
              Find your
              <br />
              own frequency.
            </h4>
            <span className="mono-cta">Explore the collection ↗</span>
          </div>
          <div className="headphones">
            <div className="headband" />
            <div className="ear ear-left" />
            <div className="ear ear-right" />
          </div>
          <span className="mono-bottom">
            FORM MEETS FREQUENCY&nbsp; —&nbsp; M01
          </span>
          <div className="mono-price">
            M01 / STUDIO
            <br />
            <b>Made for your world.</b>
          </div>
        </div>
      </div>
    );
  if (theme === "stride")
    return (
      <div
        className={`project-art stride-art ${large ? "large" : ""}`}
        aria-label="Stride mobile fitness app design concept"
      >
        <span className="stride-backdrop">
          a little
          <br />
          further.
        </span>
        <div className="phone phone-back">
          <span className="phone-notch" />
          <div className="phone-header">
            9:41 <span>••• ▰</span>
          </div>
          <small>YOUR WEEK, IN MOTION</small>
          <h4>
            Small steps.
            <br />
            Real progress.
          </h4>
          <div className="mini-bars">
            {[40, 70, 45, 95, 60, 80, 100].map((x, i) => (
              <i key={i} style={{ height: `${x}%` }} />
            ))}
          </div>
          <p>Every move counts.</p>
        </div>
        <div className="phone phone-front">
          <span className="phone-notch" />
          <div className="phone-header">
            9:41 <span>••• ▰</span>
          </div>
          <div className="stride-logo">
            stride<span>↗</span>
          </div>
          <small>LET’S MAKE TODAY A GOOD ONE.</small>
          <h4>
            Your pace.
            <br />
            Your progress.
          </h4>
          <div className="activity-circle">
            <Activity size={23} />
            <b>6,420</b>
            <small>steps & counting</small>
          </div>
          <div className="phone-chips">
            <span>
              4.8 <small>km</small>
            </span>
            <span>
              48 <small>minutes</small>
            </span>
          </div>
          <div className="phone-tab">
            ⌂ <span>◈</span> ◷ <span>☻</span>
          </div>
        </div>
      </div>
    );
  return (
    <div
      className={`project-art onda-art ${large ? "large" : ""}`}
      aria-label="Onda digital campaign design concept"
    >
      <div className="onda-orb" />
      <div className="onda-poster">
        <span>
          onda®<small>A DIFFERENT KIND OF ENERGY.</small>
        </span>
        <h4>
          MAKE
          <br />
          SOME
          <br />
          <em>WAVES.</em>
        </h4>
        <div>
          GOOD THINGS DON’T STAY QUIET. <Zap size={23} />
        </div>
      </div>
      <div className="onda-sticker">
        feel the
        <br />
        <b>difference.</b>
        <ArrowUpRight size={25} />
      </div>
    </div>
  );
}
export function WorkGrid({ home = false }: { home?: boolean }) {
  const [filter, setFilter] = useState("All work");
  const filtered = projects.filter(
    (p) => filter === "All work" || p.category === filter,
  );
  return (
    <>
      <div className="work-filters" role="group" aria-label="Filter projects">
        {["All work", "Websites", "Applications", "Marketing"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={f === filter ? "active" : ""}
          >
            {f}
            {f === filter && <span />}
          </button>
        ))}
        <span className="concept-label">
          A glimpse of what’s possible · Design concepts
        </span>
      </div>
      <div className={`work-grid ${home ? "home-work" : ""}`}>
        {filtered.slice(0, home ? 2 : 4).map((p, i) => (
          <Link
            href={`/work/${p.slug}`}
            className="project-card reveal"
            key={p.slug}
          >
            <div className="project-visual-wrap">
              <ProjectVisual theme={p.theme} />
              <span className="project-open">
                <Arrow />
              </span>
              <span className="project-index">
                0{projects.indexOf(p) + 1} / CONCEPT
              </span>
            </div>
            <div className="project-meta">
              <div>
                <h3>
                  {p.name}
                  <span>®</span>
                </h3>
                <p>{p.summary}</p>
              </div>
              <span>{p.type}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
export function TechnologyRibbon() {
  return (
    <div className="technology-ribbon" aria-label="Our connected services">
      <div>
        {[0, 1].map((k) => (
          <span key={k} aria-hidden={k === 1}>
            {["STRATEGY", "DESIGN", "DEVELOPMENT", "GROWTH"].map((x) => (
              <span key={x}>
                {x}
                <span className="ribbon-star">✷</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
