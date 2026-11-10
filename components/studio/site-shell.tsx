"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  MoveUpRight,
  AudioLines,
  Pause,
  Play,
} from "lucide-react";
import { company, services } from "@/lib/studio-content";
import { Icon } from "./ui";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [expertise, setExpertise] = useState(false);
  const [motion, setMotion] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const saved = localStorage.getItem("studio-motion");
    const on = saved
      ? saved === "on"
      : !matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotion(on);
    document.documentElement.dataset.motion = on ? "on" : "off";
    const scroll = () => {
      setScrolled(scrollY > 25);
      const h = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${h > 0 ? (scrollY / h) * 100 : 0}%`,
      );
    };
    scroll();
    addEventListener("scroll", scroll, { passive: true });
    return () => removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    setMenu(false);
    setExpertise(false);
    document.documentElement.dataset.pageReady = "true";
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setExpertise(false);
      }
    };
    const outside = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setExpertise(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  const toggleMotion = () => {
    const next = !motion;
    setMotion(next);
    localStorage.setItem("studio-motion", next ? "on" : "off");
    document.documentElement.dataset.motion = next ? "on" : "off";
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="scroll-progress" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <nav ref={navRef} className="nav-inner" aria-label="Main navigation">
          <Link
            href="/"
            className="wordmark"
            aria-label={`${company.name} home`}
          >
            <span className="brand-symbol">
              <i />
              <i />
              <i />
            </span>
            {company.name}
            <span className="brand-period">.</span>
          </Link>
          <div className="desktop-nav">
            <Link className={pathname === "/" ? "active" : ""} href="/">
              Home
            </Link>
            <div className="nav-dropdown">
              <button
                className={pathname.startsWith("/services") ? "active" : ""}
                onClick={() => setExpertise(!expertise)}
                aria-expanded={expertise}
                aria-controls="expertise-menu"
              >
                Expertise
                <ChevronDown size={13} className={expertise ? "rotate" : ""} />
              </button>
              {expertise && (
                <div className="expertise-menu" id="expertise-menu">
                  <div className="dropdown-top">
                    <span>WHAT WE DO</span>
                    <Link href="/services">
                      Explore all <ArrowUpRight size={14} />
                    </Link>
                  </div>
                  {services.map((s) => (
                    <Link href={`/services/${s.slug}`} key={s.slug}>
                      <span style={{ color: s.accent }}>
                        <Icon name={s.icon} size={21} />
                      </span>
                      <div>
                        <b>{s.name}</b>
                        <small>{s.short}</small>
                      </div>
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              className={pathname.startsWith("/work") ? "active" : ""}
              href="/work"
            >
              Our work
            </Link>
            <Link
              className={pathname === "/about" ? "active" : ""}
              href="/about"
            >
              The studio
            </Link>
            <Link
              className={pathname === "/process" ? "active" : ""}
              href="/process"
            >
              Our approach
            </Link>
          </div>
          <div className="nav-right">
            <Link href="/contact" className="nav-contact">
              Let’s talk <ArrowUpRight size={16} />
            </Link>
            <button
              className="menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
            >
              {menu ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </nav>
      </header>
      {menu && (
        <div className="mobile-menu">
          <span className="eyebrow">FIND YOUR NEXT CHAPTER</span>
          {[
            ["Home", "/"],
            ["Expertise", "/services"],
            ["Our work", "/work"],
            ["The studio", "/about"],
            ["Our approach", "/process"],
            ["Let’s talk", "/contact"],
          ].map(([l, h], i) => (
            <Link key={h} href={h}>
              <span>0{i + 1}</span>
              {l}
              <ArrowUpRight />
            </Link>
          ))}
          <div className="mobile-service-links">
            {services.map((s) => (
              <Link href={`/services/${s.slug}`} key={s.slug}>
                {s.name}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      )}
      <main id="main" className="main-content" key={pathname}>
        {children}
      </main>
      {pathname !== "/contact" && (
        <section className="footer-cta section-wrap">
          <div className="cta-top">
            <span className="eyebrow">
              <span className="status-dot" />
              EVERY GREAT THING STARTS WITH A CONVERSATION
            </span>
            <span className="tiny-caption">YOUR NEXT CHAPTER /</span>
          </div>
          <Link href="/contact" className="cta-link">
            <h2>
              Have a good idea?
              <br />
              <span>Let’s make it happen.</span>
            </h2>
            <span className="cta-circle">
              <MoveUpRight />
            </span>
          </Link>
        </section>
      )}
      <footer className="site-footer">
        <div className="section-wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="wordmark">
                <span className="brand-symbol">
                  <i />
                  <i />
                  <i />
                </span>
                {company.name}
                <span className="brand-period">.</span>
              </Link>
              <p>
                Strategy. Design. Technology.
                <br />A little different. A lot of possibility.
              </p>
              <span className="placeholder-label">
                A new company. A name in the making.
              </span>
            </div>
            <div>
              <span className="footer-heading">EXPLORE</span>
              <Link href="/about">The studio</Link>
              <Link href="/work">Our work</Link>
              <Link href="/process">Our approach</Link>
              <Link href="/faq">Good questions</Link>
            </div>
            <div>
              <span className="footer-heading">OUR EXPERTISE</span>
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`}>
                  {s.name}
                </Link>
              ))}
            </div>
            <div>
              <span className="footer-heading">LET’S CONNECT</span>
              <Link className="footer-contact" href="/contact">
                Start something good
                <ArrowUpRight size={16} />
              </Link>
              <p>
                Bring your idea.
                <br />
                We’ll bring the possibilities.
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 {company.name}. Made with intention.</span>
            <span className="footer-tagline">
              INDEPENDENT THINKING. CONNECTED EXPERIENCES.
            </span>
            <button
              className="motion-toggle"
              aria-pressed={motion}
              onClick={toggleMotion}
            >
              {motion ? <AudioLines size={15} /> : <Pause size={14} />}Motion{" "}
              {motion ? "on" : "off"}
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
