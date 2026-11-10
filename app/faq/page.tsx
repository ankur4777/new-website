import { Eyebrow, Accordion, Button } from "@/components/studio/ui";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Good questions" };
export default function FAQ() {
  return (
    <>
      <section className="section-wrap page-hero faq-hero">
        <Eyebrow>GOOD QUESTIONS / HONEST ANSWERS</Eyebrow>
        <h1>
          A little clarity.
          <br />
          <span className="gradient-text">A confident next step.</span>
        </h1>
        <p>
          From the first conversation to life after launch, here are a few
          things that are helpful to know.
        </p>
      </section>
      <section className="section-wrap faq-page">
        <div className="faq-aside">
          <span className="faq-question-mark">?</span>
          <h3>
            Something else
            <br />
            on your mind?
          </h3>
          <p>Your project deserves its own conversation.</p>
          <Button href="/contact" secondary>
            Let’s talk about it
          </Button>
        </div>
        <Accordion />
      </section>
    </>
  );
}
