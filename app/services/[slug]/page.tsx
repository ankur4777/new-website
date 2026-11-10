import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/studio-content";
import {
  Arrow,
  Button,
  Eyebrow,
  Icon,
  Accordion,
} from "@/components/studio/ui";
import ServiceDemo from "@/components/studio/service-demo";
import type { Metadata } from "next";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  return { title: s?.name || "Service", description: s?.description };
}
export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const next = services[(services.indexOf(s) + 1) % services.length];
  return (
    <div style={{ "--page-accent": s.accent } as React.CSSProperties}>
      <section className="section-wrap detail-hero">
        <Link href="/services" className="back-link">
          ← ALL EXPERTISE
        </Link>
        <div className="detail-hero-top">
          <Eyebrow>
            /{s.number} — {s.name.toUpperCase()}
          </Eyebrow>
          <span className="detail-service-icon">
            <Icon name={s.icon} size={34} />
          </span>
        </div>
        <h1>
          {s.headline[0]}
          <br />
          <span className="service-accent">{s.headline[1]}</span>
        </h1>
        <div className="detail-hero-bottom">
          <p>{s.description}</p>
          <Button href={`/contact?service=${s.slug}`}>
            Let’s talk{" "}
            {s.name === "Digital marketing" ? "growth" : "possibilities"}
          </Button>
        </div>
        <div className="detail-tags">
          {s.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>
      <section className="section-wrap">
        <ServiceDemo slug={slug} />
      </section>
      <section className="section-wrap section-space">
        <div className="section-heading reveal">
          <div>
            <Eyebrow>THE DETAILS THAT MAKE THE DIFFERENCE</Eyebrow>
            <h2>
              Thoughtfully made.
              <br />
              <span className="muted">Purposefully connected.</span>
            </h2>
          </div>
          <p className="section-aside">
            A clear purpose behind every choice. An experience shaped around the
            people who use it.
          </p>
        </div>
        <div className="capabilities-grid">
          {s.capabilities.map((c, i) => (
            <article className="capability reveal" key={c.title}>
              <span className="capability-num">0{i + 1} /</span>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-wrap section-space service-journey">
        <div>
          <Eyebrow>HOW WE GET THERE</Eyebrow>
          <h2>
            From your first thought.
            <br />
            <span className="serif-word">To your next chapter.</span>
          </h2>
          <p>
            A collaborative process with clear stages and room for the questions
            that move a project forward.
          </p>
          <Link href="/process" className="text-link">
            Our approach
            <Arrow />
          </Link>
        </div>
        <div className="journey-steps">
          {s.workflow.map((w, i) => (
            <div className="reveal" key={w}>
              <span>0{i + 1}</span>
              <h3>{w}</h3>
              <Arrow />
            </div>
          ))}
        </div>
      </section>
      <section className="section-wrap section-space faq-home">
        <div>
          <Eyebrow>A LITTLE MORE CLARITY</Eyebrow>
          <h2>
            Before we
            <br />
            <span className="muted">get started.</span>
          </h2>
        </div>
        <Accordion items={s.questions} />
      </section>
      <section className="section-wrap next-service">
        <span>KEEP EXPLORING</span>
        <Link href={`/services/${next.slug}`}>
          <span style={{ color: next.accent }}>
            <Icon name={next.icon} size={30} />
          </span>
          <h2>{next.name}</h2>
          <Arrow />
        </Link>
      </section>
    </div>
  );
}
