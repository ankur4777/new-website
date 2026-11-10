import Link from "next/link";
import { Eyebrow, Button, Arrow } from "@/components/studio/ui";
import { processSteps } from "@/lib/studio-content";
import { Check, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Our approach" };
const deliverables = [
  [
    "Business and audience understanding",
    "Shared goals and priorities",
    "A considered project scope",
  ],
  [
    "Content and user journeys",
    "Visual direction and key screens",
    "Interactive prototypes",
  ],
  [
    "Iterative implementation",
    "Regular project reviews",
    "Testing the important journeys",
  ],
  [
    "Launch and handover planning",
    "Documentation and training",
    "Next steps and support options",
  ],
];
export default function ProcessPage() {
  return (
    <>
      <section className="section-wrap page-hero process-hero">
        <Eyebrow>OUR APPROACH / A CLEAR WAY FORWARD</Eyebrow>
        <h1>
          Great things don’t
          <br />
          <span className="gradient-text">happen by accident.</span>
        </h1>
        <p>
          A little structure creates a lot of possibility. Our approach keeps
          the important questions, people, and decisions connected from
          beginning to beyond.
        </p>
        <div className="process-track" aria-label="Four project stages">
          {processSteps.map((s, i) => (
            <Link href={`#stage-${i}`} key={s.name}>
              <span>{s.number}</span>
              {s.name}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section-wrap process-timeline">
        {processSteps.map((s, i) => (
          <article
            className="timeline-stage reveal"
            key={s.name}
            id={`stage-${i}`}
          >
            <span className="timeline-number">{s.number}</span>
            <div className="timeline-main">
              <Eyebrow>{s.name.toUpperCase()}</Eyebrow>
              <h2>{s.line}</h2>
              <p>{s.description}</p>
              <span className="timeline-output">
                <Check size={15} />
                {s.output}
              </span>
            </div>
            <div className="timeline-deliverables">
              <span>WHAT THIS LOOKS LIKE</span>
              {deliverables[i].map((d) => (
                <p key={d}>
                  <span>↗</span>
                  {d}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>
      <section className="section-wrap section-space process-promise">
        <Eyebrow>THROUGH EVERY STAGE</Eyebrow>
        <h2>
          Clarity in the process.
          <br />
          <span className="serif-word">Creativity in the possibilities.</span>
        </h2>
        <div>
          <p>
            You know what’s happening, why it matters, and what comes next. A
            shared direction gives the work room to become something special.
          </p>
          <Button href="/contact">Start the conversation</Button>
        </div>
      </section>
    </>
  );
}
