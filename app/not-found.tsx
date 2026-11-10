import { Button, Eyebrow } from "@/components/studio/ui";
export default function NotFound() {
  return (
    <section className="section-wrap not-found">
      <span className="error-orbit" aria-hidden="true">
        404
      </span>
      <Eyebrow>A LITTLE OFF THE BEATEN PATH</Eyebrow>
      <h1>
        This way?
        <br />
        <span className="gradient-text">A new possibility.</span>
      </h1>
      <p>
        That page seems to have taken a different direction.
        <br />
        Let’s get you back to something good.
      </p>
      <div>
        <Button href="/">Back to the beginning</Button>
        <Button href="/services" secondary>
          Explore our expertise
        </Button>
      </div>
    </section>
  );
}
