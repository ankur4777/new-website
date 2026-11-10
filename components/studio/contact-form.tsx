"use client";
import { useEffect, useState } from "react";
import { company, services } from "@/lib/studio-content";
import { CONCEPT_HANDOFF_KEY, getEnquiryLink, parseConceptHandoff } from "@/lib/project-concept";
import { ArrowLeft } from "lucide-react";
import { AnimatedIcon } from "./animated-icon";
import { Icon } from "./ui";
type Brief = {
  name: string;
  email: string;
  company: string;
  description: string;
  timeline: string;
  budget: string;
  services: string[];
};
export default function ContactForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [budget, setBudget] = useState("Let’s discuss");
  const [error, setError] = useState("");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [description, setDescription] = useState("");
  const [attachedConcept, setAttachedConcept] = useState<{ name: string; palette: string } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("service");
    if (s && services.some((x) => x.slug === s)) setSelected([s]);
    if (params.get("from") === "idea-studio") {
      try {
        const concept = parseConceptHandoff(sessionStorage.getItem(CONCEPT_HANDOFF_KEY));
        if (concept) {
          setSelected([concept.service]);
          setDescription(concept.description);
          setAttachedConcept({ name: concept.name, palette: concept.palette });
        }
      } catch {}
    }
  }, []);
  function clearConcept() {
    setAttachedConcept(null);
    setDescription("");
    setSelected([]);
    try { sessionStorage.removeItem(CONCEPT_HANDOFF_KEY); } catch {}
  }
  const directContact = brief ? getEnquiryLink(`PROJECT ENQUIRY\nName: ${brief.name}\nEmail: ${brief.email}\nCompany: ${brief.company || "Not specified"}\nServices: ${brief.services.join(", ")}\nBudget: ${brief.budget}\nTimeline: ${brief.timeline}\n\n${brief.description}`, company) : null;
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected.length) {
      setError("Please choose at least one service.");
      return;
    }
    setError("");
    const data = new FormData(e.currentTarget);
    setBrief({
      name: String(data.get("name")),
      email: String(data.get("email")),
      company: String(data.get("company")),
      description: String(data.get("description")),
      timeline: String(data.get("timeline")),
      budget,
      services: selected.map((s) => services.find((x) => x.slug === s)!.name),
    });
  }
  function download() {
    if (!brief) return;
    const text = `YOUR NEXT BIG THING\nProject brief\n\nName: ${brief.name}\nEmail: ${brief.email}\nCompany: ${brief.company || "Not specified"}\n\nServices: ${brief.services.join(", ")}\nBudget: ${brief.budget}\nTimeline: ${brief.timeline}\n\nTHE IDEA\n${brief.description}\n\nPrepared in website preview. This brief has not been sent.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "your-project-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="contact-form-wrap">
      <form onSubmit={submit} className={brief ? "form-hidden" : ""}>
        {attachedConcept && <div className="concept-attached"><AnimatedIcon name="check" size={22}/><div><b>Your concept came along.</b><p>{attachedConcept.name} · {attachedConcept.palette}<br/>Your requirements are filled in below. Edit anything you like.</p></div><button type="button" onClick={clearConcept}>Clear</button></div>}
        <fieldset>
          <legend>
            <span>01 /</span> What do you have in mind?
          </legend>
          <p className="field-hint">Choose one, or connect a few.</p>
          <div className="service-choices">
            {services.map((s) => (
              <button
                type="button"
                key={s.slug}
                className={selected.includes(s.slug) ? "selected" : ""}
                aria-pressed={selected.includes(s.slug)}
                onClick={() => {
                  setSelected(
                    selected.includes(s.slug)
                      ? selected.filter((x) => x !== s.slug)
                      : [...selected, s.slug],
                  );
                  setError("");
                }}
              >
                <Icon name={s.icon} size={17} />
                {s.name}
                {selected.includes(s.slug) ? (
                  <AnimatedIcon name="check" size={14} />
                ) : (
                  <span>+</span>
                )}
              </button>
            ))}
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </fieldset>
        <fieldset>
          <legend>
            <span>02 /</span> Tell us a little about yourself.
          </legend>
          <div className="field-grid">
            <label>
              Your name <span>*</span>
              <input
                name="name"
                placeholder="A name to the idea"
                required
                maxLength={100}
                autoComplete="name"
              />
            </label>
            <label>
              Your email <span>*</span>
              <input
                name="email"
                type="email"
                placeholder="Where we can find you"
                required
                maxLength={200}
                autoComplete="email"
              />
            </label>
          </div>
          <label>
            Company / brand <span className="optional">(optional)</span>
            <input
              name="company"
              placeholder="What’s the name?"
              maxLength={200}
              autoComplete="organization"
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>
            <span>03 /</span> A few details make a difference.
          </legend>
          <label>
            Your idea <span>*</span>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The idea, the challenge, the what-if. We’re listening."
              required
              minLength={15}
              maxLength={5000}
              rows={4}
            />
          </label>
          <div className="field-grid">
            <label>
              Estimated budget
              <select
                name="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option>Let’s discuss</option>
                <option>Under ₹50,000</option>
                <option>₹50,000 – ₹2 lakh</option>
                <option>₹2 lakh – ₹5 lakh</option>
                <option>₹5 lakh+</option>
              </select>
            </label>
            <label>
              Your timeline
              <select name="timeline" defaultValue="Let’s figure it out">
                <option>Let’s figure it out</option>
                <option>As soon as practical</option>
                <option>Within 1–3 months</option>
                <option>Within 3–6 months</option>
                <option>Just exploring</option>
              </select>
            </label>
          </div>
        </fieldset>
        <div className="contact-submit">
          <button className="button button-primary" type="submit">
            <span>Prepare my project brief</span>
            <AnimatedIcon name="arrow" size={18} />
          </button>
          <p>
            {company.email || company.whatsapp ? "Review your brief, then choose the contact link to share it with us." : <>Your details stay in this page.<br/>Direct enquiry delivery is waiting for the company contact details.</>}
          </p>
        </div>
      </form>
      {brief && (
        <div className="brief-success" role="status">
          <span className="success-icon">
            <AnimatedIcon name="check" size={32} />
          </span>
          <span className="eyebrow">A GOOD IDEA HAS A STARTING POINT.</span>
          <h2>
            Your brief
            <br />
            is <span className="gradient-text">ready.</span>
          </h2>
          <p>
            Thanks, {brief.name.split(" ")[0]}. Your idea is taking shape.
            Download your project brief to keep everything in one place.
          </p>
          <div className="brief-summary">
            <span>YOUR DIRECTION</span>
            <p>{brief.services.join(" + ")}</p>
            <span>YOUR NEXT STEP</span>
            <p>{brief.description}</p>
          </div>
          <div className="brief-actions">
            {directContact?.direct && <a className="button button-primary" href={directContact.href}>{directContact.label}<AnimatedIcon name="arrow" size={17}/></a>}
            <button className="button button-primary" onClick={download}>
              Download your brief
              <AnimatedIcon name="download" size={17} />
            </button>
            <button className="text-link" onClick={() => setBrief(null)}>
              <ArrowLeft size={16} />
              Edit my brief
            </button>
          </div>
          <p className="brief-notice">
            {directContact?.direct ? "Your brief is ready to share. The contact link opens a message for you to review and send." : "Your brief has been prepared locally. Direct enquiry delivery will be connected when the company contact details are ready."}
          </p>
        </div>
      )}
    </div>
  );
}
