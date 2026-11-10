import Scene from "@/components/studio/scene";
import { Eyebrow, Button, Arrow, Process } from "@/components/studio/ui";
import Link from "next/link";
import { ArrowUpRight, Combine, Eye, HeartHandshake, Scan } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "The studio" };
export default function About() {
  return (
    <>
      <section className="section-wrap page-hero about-hero">
        <Eyebrow>THE STUDIO / A DIFFERENT PERSPECTIVE</Eyebrow>
        <h1>
          Curious by nature.
          <br />
          <span className="gradient-text">Creative by choice.</span>
        </h1>
        <div className="about-hero-bottom">
          <p>
            A digital company at the intersection of strategy, design, and
            technology. Here to turn meaningful ideas into experiences that
            matter.
          </p>
          <span className="about-star">✷</span>
          <span className="tiny-caption">
            THINK DIFFERENTLY.
            <br />
            MAKE THOUGHTFULLY.
          </span>
        </div>
      </section>
      <section className="studio-manifesto section-wrap">
        <div className="manifesto-art">
          <Scene variant="studio" />
          <span>DIFFERENT PERSPECTIVES / ONE VISION</span>
        </div>
        <div className="manifesto-copy">
          <Eyebrow>WHAT BRINGS IT ALL TOGETHER</Eyebrow>
          <h2>
            The details matter.
            <br />
            The people <span className="serif-word">more.</span>
          </h2>
          <p>
            Behind every interface is someone trying to get something done.
            Behind every business is a team with a vision of what could be
            better.
          </p>
          <p>
            We build with both in mind. Asking useful questions. Making
            considered choices. Connecting creative thinking with practical
            engineering.
          </p>
          <p className="manifesto-statement">
            Good work starts with understanding.
            <br />
            Extraordinary work keeps asking why.
          </p>
        </div>
      </section>
      <section className="section-wrap section-space">
        <div className="section-heading">
          <div>
            <Eyebrow>THE THINGS WE COME BACK TO</Eyebrow>
            <h2>
              A point of view.
              <br />
              <span className="muted">A better way forward.</span>
            </h2>
          </div>
        </div>
        <div className="values-grid">
          {[
            {
              icon: Eye,
              title: "Stay curious.",
              body: "Look beyond the brief. Understand the people, the problem, and the opportunity before choosing a solution.",
            },
            {
              icon: Scan,
              title: "Care for the details.",
              body: "The spacing, the loading state, the last interaction. Small things shape how an entire experience feels.",
            },
            {
              icon: HeartHandshake,
              title: "Make it together.",
              body: "Clear conversations, shared decisions, and honest feedback keep a project connected to the people it serves.",
            },
            {
              icon: Combine,
              title: "Think in connections.",
              body: "A website, an app, and a campaign should tell one story. We keep the bigger picture in view.",
            },
          ].map((v, i) => (
            <article className="value reveal" key={v.title}>
              <v.icon size={30} strokeWidth={1.2} />
              <span>0{i + 1}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-statement">
        <div className="section-wrap">
          <Eyebrow>OUR KIND OF DIGITAL</Eyebrow>
          <h2>
            Not made to blend in.
            <br />
            <span className="gradient-text">Made to mean something.</span>
          </h2>
          <p>Distinctive on the surface. Thoughtful all the way through.</p>
          <Button href="/services" secondary>
            Explore our expertise
          </Button>
        </div>
      </section>
      <section className="section-wrap section-space">
        <div className="section-heading">
          <div>
            <Eyebrow>AN OPEN, CONNECTED PROCESS</Eyebrow>
            <h2>
              Good things
              <br />
              <span className="serif-word">take shape.</span>
            </h2>
          </div>
          <Link href="/process" className="text-link">
            See our approach
            <Arrow />
          </Link>
        </div>
        <Process />
      </section>
    </>
  );
}
