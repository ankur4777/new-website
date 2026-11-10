import { Eyebrow, WorkGrid } from "@/components/studio/ui";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Our work — Design concepts" };
export default function Work() {
  return (
    <>
      <section className="section-wrap page-hero work-hero">
        <Eyebrow>THE POSSIBILITY COLLECTION</Eyebrow>
        <h1>
          Not just seen.
          <br />
          <span className="gradient-text">Felt. Used. Remembered.</span>
        </h1>
        <div className="work-hero-footer">
          <p>
            Explore a few ways strategy, design, and technology
            <br className="desktop-break" /> can come together. A little glimpse
            of what’s possible.
          </p>
          <span className="project-note">
            <span />
            INDEPENDENT DESIGN CONCEPTS
            <br />
            CREATED TO SHOW OUR DIRECTION
          </span>
        </div>
      </section>
      <section className="section-wrap work-page-grid">
        <WorkGrid />
      </section>
      <section className="section-wrap section-space work-note">
        <span>GOOD WORK BEGINS WITH YOUR WORLD.</span>
        <h2>
          Different businesses.
          <br />
          Different challenges.
          <br />
          <span className="muted">Always a fresh perspective.</span>
        </h2>
        <p>
          These are illustrative concepts, not completed client engagements.
          Your project starts with your own audience, ambitions, and story.
        </p>
      </section>
    </>
  );
}
