import Link from "next/link";
import type { Metadata } from "next";
import Scene from "@/components/studio/scene";
import { services } from "@/lib/studio-content";
import {
  Arrow,
  Button,
  Eyebrow,
  Icon,
  ServicesList,
  Accordion,
} from "@/components/studio/ui";
export const metadata: Metadata = { title: "Our expertise" };
export default function Services() {
  return (
    <>
      <section className="page-hero services-hero section-wrap">
        <div className="page-hero-copy">
          <Eyebrow>OUR EXPERTISE / FIVE WAYS FORWARD</Eyebrow>
          <h1>
            Connected thinking.
            <br />
            <span className="gradient-text">Endless possibility.</span>
          </h1>
          <p>
            Your business is more than a website, a campaign, or an app. We
            bring the right pieces together to build something that works as
            one.
          </p>
          <Button href="/contact">Find your next move</Button>
        </div>
        <div className="services-hero-art">
          <Scene variant="small" />
        </div>
        <div className="page-hero-bottom">
          <span>FIVE DISCIPLINES. ONE SHARED DIRECTION.</span>
          <span>EXPLORE BELOW ↓</span>
        </div>
      </section>
      <section className="section-wrap service-hub section-space">
        <div className="section-intro">
          <Eyebrow>THOUGHTFULLY CONNECTED</Eyebrow>
          <h2>
            A bigger picture.
            <br />
            <span className="muted">Every detail considered.</span>
          </h2>
        </div>
        <ServicesList />
      </section>
      <section className="section-wrap section-space">
        <div className="why-grid">
          <div className="reveal">
            <Eyebrow>A LITTLE MORE THAN A SERVICE</Eyebrow>
            <h2>
              One conversation.
              <br />
              <span className="serif-word">More possibilities.</span>
            </h2>
            <p>
              Start with what your business needs. We’ll help connect the right
              disciplines around it.
            </p>
            <Button href="/contact" secondary>
              Let’s explore your idea
            </Button>
          </div>
          <div className="connection-map reveal">
            <div className="connection-core">
              your
              <br />
              <b>next big thing.</b>
            </div>
            {services.map((s, i) => (
              <Link
                href={`/services/${s.slug}`}
                key={s.slug}
                className={`connection-node connection-${i}`}
                style={{ "--node-color": s.accent } as React.CSSProperties}
              >
                <Icon name={s.icon} size={21} />
                <span>{s.name}</span>
              </Link>
            ))}
            <span className="connection-ring" />
            <span className="connection-ring ring-2" />
          </div>
        </div>
      </section>
      <section className="section-wrap section-space faq-home">
        <div>
          <Eyebrow>LET’S MAKE IT CLEAR</Eyebrow>
          <h2>
            The right service.
            <br />
            <span className="muted">The right starting point.</span>
          </h2>
        </div>
        <Accordion
          items={[
            {
              q: "Can I start with just one service?",
              a: "Absolutely. A focused website, an individual campaign, or a product prototype can all be useful starting points. We shape the scope around what you need now.",
            },
            {
              q: "How do you choose the right technology?",
              a: "We consider your users, functionality, budget, existing systems, and the team that will maintain the product. The technology follows the requirements.",
            },
            {
              q: "Can you collaborate with our existing team?",
              a: "Yes. We can work alongside your marketing, design, or development team with clear responsibilities and an agreed way to share progress.",
            },
          ]}
        />
      </section>
    </>
  );
}
