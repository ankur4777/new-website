"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Code2,
  GitBranch,
  Layers,
  Zap,
} from "lucide-react";
import { ProjectVisual } from "./ui";
export default function ServiceDemo({ slug }: { slug: string }) {
  const [metric, setMetric] = useState(0);
  if (slug === "digital-marketing")
    return (
      <div className="service-demo marketing-demo">
        <div className="demo-header">
          <span>
            <span className="status-dot" />
            THE GROWTH PERSPECTIVE
          </span>
          <small>ILLUSTRATIVE PREVIEW</small>
        </div>
        <div
          className="metric-tabs"
          role="tablist"
          aria-label="Marketing preview metric"
        >
          {["Visibility", "Engagement", "Conversions"].map((s, i) => (
            <button
              role="tab"
              tabIndex={metric === i ? 0 : -1}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const next =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : (metric + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                  setMetric(next);
                  (
                    e.currentTarget.parentElement?.children[
                      next
                    ] as HTMLButtonElement
                  )?.focus();
                }
              }}
              aria-selected={metric === i}
              aria-controls="marketing-preview"
              id={`metric-${i}`}
              className={metric === i ? "active" : ""}
              onClick={() => setMetric(i)}
              key={s}
            >
              {s}
            </button>
          ))}
        </div>
        <div
          id="marketing-preview"
          role="tabpanel"
          aria-labelledby={`metric-${metric}`}
        >
          <div className="marketing-title">
            <span>
              THE RIGHT PEOPLE.
              <br />
              <b>
                {
                  [
                    "A stronger presence.",
                    "A real connection.",
                    "A clearer next step.",
                  ][metric]
                }
              </b>
            </span>
            <ArrowUpRight size={46} />
          </div>
          <div className="marketing-chart">
            {[35, 48, 42, 57, 48, 70, 60, 78, 70, 85, 90, 100].map((v, i) => (
              <div
                key={i}
                style={{
                  height: `${Math.max(15, v - (metric === 1 ? (i % 3) * 12 : metric === 2 ? (i % 4) * 9 : 0))}%`,
                }}
              >
                <span />
              </div>
            ))}
          </div>
          <div className="marketing-chart-labels">
            <span>DISCOVER</span>
            <span>CONNECT</span>
            <span>TAKE ACTION ↗</span>
          </div>
          <p className="demo-disclaimer">
            A visual concept, not campaign results.
          </p>
        </div>
      </div>
    );
  if (slug === "software-development")
    return (
      <div className="service-demo software-demo">
        <div className="demo-header">
          <span>
            <Code2 size={14} />
            BUILT AROUND YOUR WORLD
          </span>
          <small>CONCEPT PREVIEW</small>
        </div>
        <div className="code-window">
          <div className="code-title">
            <span />
            <span />
            <span />
            <b>your-next-advantage.ts</b>
          </div>
          <pre>
            <code>
              <span className="code-purple">const</span> betterWorkflow = {"{"}
              <br /> <span className="code-mint">understand</span>:{" "}
              <span className="code-orange">"your business"</span>,<br />{" "}
              <span className="code-mint">connect</span>: [
              <span className="code-orange">"people"</span>,{" "}
              <span className="code-orange">"processes"</span>],
              <br /> <span className="code-mint">automate</span>:{" "}
              <span className="code-orange">"the repetitive"</span>,<br />{" "}
              <span className="code-mint">makeRoomFor</span>:{" "}
              <span className="code-orange">"what matters"</span>
              <br />
              {"}"};<br />
              <br />
              <span className="code-comment">
                // A better way to work, by design.
              </span>
              <br />
              <span className="code-purple">await</span> build(betterWorkflow);
              <span className="code-caret">▌</span>
            </code>
          </pre>
        </div>
        <div className="pipeline">
          <span>
            <Layers size={18} />
            YOUR SYSTEMS
          </span>
          <i />
          <span className="pipeline-core">
            <Zap size={21} />
          </span>
          <i />
          <span>
            <Check size={17} />
            CONNECTED
          </span>
        </div>
        <p className="demo-disclaimer">
          Thoughtful systems. Smoother workflows.
        </p>
      </div>
    );
  return (
    <div className="service-project-demo">
      <ProjectVisual
        theme={
          slug === "web-development"
            ? "mono"
            : slug === "app-development"
              ? "stride"
              : "orbit"
        }
        large
      />
      <span className="demo-caption">
        EXPERIENCE DESIGN / ILLUSTRATIVE CONCEPT
      </span>
    </div>
  );
}
