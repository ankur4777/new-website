import { Eyebrow } from "@/components/studio/ui";
import ContactForm from "@/components/studio/contact-form";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Let’s talk" };
export default function Contact() {
  return (
    <section className="section-wrap contact-page">
      <div className="contact-copy">
        <Eyebrow>GOOD THINGS START HERE</Eyebrow>
        <h1>
          An idea.
          <br />A conversation.
          <br />
          <span className="gradient-text">A possibility.</span>
        </h1>
        <p>
          A new business. A better experience.
          <br />
          Something that doesn’t exist yet.
          <br />
          <b>We’d love to hear what you’re thinking.</b>
        </p>
        <div className="contact-graphic" aria-hidden="true">
          <span className="contact-ring" />
          <span className="contact-ring ring-two" />
          <span className="contact-ring ring-three" />
          <ArrowUpRight />
        </div>
        <div className="contact-steps">
          <span>WHAT HAPPENS NEXT</span>
          <p>
            <span>01</span> Share your idea and priorities.
          </p>
          <p>
            <span>02</span> Explore the right approach together.
          </p>
          <p>
            <span>03</span> Shape the scope and the next step.
          </p>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
