import Link from "next/link";
import Scene from "@/components/studio/scene";
import SignalBloom from "@/components/studio/signal-bloom";
import SparkCatch from "@/components/studio/spark-catch";
import { AnimatedIcon } from "@/components/studio/animated-icon";
import {
  Arrow,
  Button,
  Eyebrow,
  ServicesList,
  Process,
  WorkGrid,
  TechnologyRibbon,
  Accordion,
} from "@/components/studio/ui";
export default function Home() {
  return (
    <>
      <section className="home-hero section-wrap">
        <div className="hero-overline">
          <span className="hero-kicker">
            <span className="status-dot" />
            INDEPENDENT MINDS. EXTRAORDINARY POSSIBILITIES.
          </span>
          <span className="hero-edition">STRATEGY / DESIGN / TECHNOLOGY</span>
        </div>
        <div className="hero-layout">
          <div className="hero-copy">
            <h1>
              Good ideas.
              <br />
              Exceptional
              <br />
              <span className="gradient-text">digital.</span>
              <span className="hero-asterisk">✷</span>
            </h1>
            <p>
              We turn your next big idea into something people
              <br className="desktop-break" /> see, use, and remember.
            </p>
            <div className="hero-actions">
              <Button href="/contact">Let’s build something</Button>
              <Link className="text-link" href="/work">
                Explore our work
                <Arrow />
              </Link>
            </div>
            <div className="hero-small">
              <span className="mini-line" />A fresh perspective. From first
              thought to what’s next.
            </div>
          </div>
          <div className="hero-art">
            <span className="scene-eyebrow">IDEAS IN MOTION / 001</span>
            <Scene />
            <span className="floating-note note-strategy">
              <AnimatedIcon name="studio" size={27} />
              <div>
                Different by design.<small>CONNECTED BY TECHNOLOGY</small>
              </div>
            </span>
            <span className="floating-note note-code">
              <AnimatedIcon name="code" size={15} />
              More than the ordinary.
            </span>
            <span className="art-caption">
              <span />
              GO AHEAD. MOVE YOUR CURSOR.
            </span>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#what-we-do" className="scroll-link">
            <span className="scroll-icon">
              <AnimatedIcon name="down" size={17} />
            </span>
            GOOD THINGS BELOW
          </a>
          <p>
            Your vision. Our curiosity. <span>Something extraordinary.</span>
          </p>
          <a className="hero-scroll-index playground-shortcut" href="#spark-catch">PLAY A LITTLE SPARK CATCH <AnimatedIcon name="down" size={13}/></a>
        </div>
      </section>
      <TechnologyRibbon />
      <div className="light-band light-services">
      <section className="section-wrap section-space" id="what-we-do">
        <div className="section-intro reveal">
          <Eyebrow number="01 / 05">A CONNECTED KIND OF EXPERTISE</Eyebrow>
          <div className="intro-split">
            <h2>
              Everything your next
              <br />
              big thing <span className="muted">needs.</span>
            </h2>
            <div>
              <p>
                From the first impression to the everyday interaction, we
                connect the dots between your brand, your business, and your
                audience.
              </p>
              <Link href="/services" className="text-link">
                Meet your possibilities
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
        <ServicesList />
      </section>
      </div>
      <SparkCatch />
      <section className="work-section section-wrap section-space">
        <div className="section-heading reveal">
          <div>
            <Eyebrow number="02 / 05">
              A LITTLE LOOK INSIDE OUR THINKING
            </Eyebrow>
            <h2>
              Ideas, <span className="serif-word">in action.</span>
            </h2>
          </div>
          <Link href="/work" className="text-link">
            Explore the possibilities
            <Arrow />
          </Link>
        </div>
        <WorkGrid home />
      </section>
      <SignalBloom />
      <section className="studio-teaser section-wrap section-space">
        <div className="studio-visual reveal">
          <div className="grid-plane" />
          <div className="abstract-stack">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="studio-visual-label">
            MANY PERSPECTIVES.
            <br />
            <b>ONE SHARED DIRECTION.</b>
          </span>
          <span className="studio-orbit-label">DESIGN × CODE × CURIOSITY</span>
        </div>
        <div className="studio-teaser-copy reveal">
          <Eyebrow number="03 / 05">SMALL DETAILS. BIGGER PICTURE.</Eyebrow>
          <h2>
            Creative minds.
            <br />
            Technical hearts.
            <br />
            <span className="muted">Shared ambition.</span>
          </h2>
          <p>
            We believe the best digital experiences happen where good questions
            meet thoughtful design and careful engineering.
          </p>
          <p>
            That means understanding your business, challenging the obvious, and
            caring about the little things that make a big difference.
          </p>
          <Button href="/about" secondary>
            Get to know the studio
          </Button>
        </div>
      </section>
      <section className="section-wrap section-space">
        <div className="section-heading reveal">
          <div>
            <Eyebrow number="04 / 05">FROM WHAT IF TO WHAT’S NEXT</Eyebrow>
            <h2>
              A clear path.
              <br />
              <span className="muted">An open mind.</span>
            </h2>
          </div>
          <Link href="/process" className="text-link">
            How we make it happen
            <Arrow />
          </Link>
        </div>
        <Process />
      </section>
      <div className="light-band light-faq">
      <section className="faq-home section-wrap section-space">
        <div className="reveal">
          <Eyebrow number="05 / 05">A GOOD PLACE TO START</Eyebrow>
          <h2>
            Good questions.
            <br />
            <span className="serif-word">Honest answers.</span>
          </h2>
          <Link href="/faq" className="text-link">
            A little more clarity
            <Arrow />
          </Link>
        </div>
        <Accordion
          items={[
            {
              q: "Where do we begin?",
              a: "With a conversation about your business, your audience, and what you want to make possible. An early idea is more than enough to start.",
            },
            {
              q: "Can you connect marketing and development?",
              a: "Yes. We can shape a connected experience across your website, product, and digital marketing, or support one specific part of your project.",
            },
            {
              q: "What if my project is still just an idea?",
              a: "That is a useful place to begin. We can explore the problem, outline the key journeys, and help define a practical first release.",
            },
          ]}
        />
      </section>
      </div>
    </>
  );
}
