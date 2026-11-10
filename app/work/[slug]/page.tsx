import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/studio-content";
import { Eyebrow, ProjectVisual, Button, Arrow } from "@/components/studio/ui";
import type { Metadata } from "next";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${projects.find((p) => p.slug === slug)?.name || "Project"} — Design concept`,
  };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <>
      <section className="section-wrap case-hero">
        <Link href="/work" className="back-link">
          ← THE POSSIBILITY COLLECTION
        </Link>
        <Eyebrow>{p.type.toUpperCase()} / DESIGN EXPLORATION</Eyebrow>
        <div className="case-title">
          <h1>
            {p.name}
            <span>®</span>
          </h1>
          <p>{p.headline}</p>
        </div>
        <div className="case-meta">
          <p>{p.summary}</p>
          <div>
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section-wrap case-visual">
        <ProjectVisual theme={p.theme} large />
      </section>
      <section className="section-wrap section-space case-story">
        <div>
          <Eyebrow>THE CHALLENGE</Eyebrow>
          <h2>
            A good question
            <br />
            <span className="muted">changes everything.</span>
          </h2>
        </div>
        <div>
          <p>{p.challenge}</p>
          <Eyebrow>THE DESIGN DIRECTION</Eyebrow>
          <p>{p.approach}</p>
          <div className="concept-notice">
            INDEPENDENT CONCEPT
            <p>
              This is an illustrative design exploration. It is not a client
              project or a live product, and the displayed metrics are sample
              interface content.
            </p>
          </div>
        </div>
      </section>
      <section className="section-wrap next-service">
        <span>NEXT POSSIBILITY</span>
        <Link href={`/work/${next.slug}`}>
          <h2>
            {next.name}
            <span className="muted"> / {next.type}</span>
          </h2>
          <Arrow />
        </Link>
      </section>
    </>
  );
}
