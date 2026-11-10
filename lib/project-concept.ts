export type ProjectKind = "website" | "webapp" | "software" | "mobile" | "marketing";
export type ConceptTheme = "dark" | "light";
export type ConceptStyle = "expressive" | "minimal" | "editorial";
export type FeatureId = "booking" | "shop" | "payments" | "members" | "dashboard" | "chat" | "articles" | "gallery" | "analytics" | "notifications" | "automation" | "team" | "seo" | "social" | "ads" | "newsletter";

export const projectKinds: { id: ProjectKind; label: string; icon: "web" | "layers" | "code" | "mobile" | "growth" }[] = [
  { id: "website", label: "Website", icon: "web" },
  { id: "webapp", label: "Web application", icon: "layers" },
  { id: "software", label: "Software", icon: "code" },
  { id: "mobile", label: "Mobile app", icon: "mobile" },
  { id: "marketing", label: "Digital marketing", icon: "growth" },
];
export const conceptPalettes = [
  { id: "violet", name: "Violet / mint", color: "#bba2fa", dark: "#9b70e4", secondary: "#9ae4d5" },
  { id: "ocean", name: "Ocean / ice", color: "#82b9ff", dark: "#2666c5", secondary: "#8ee4e8" },
  { id: "forest", name: "Forest / lime", color: "#96d5ad", dark: "#29774b", secondary: "#d4e891" },
  { id: "coral", name: "Coral / peach", color: "#ffad99", dark: "#b34e3e", secondary: "#ffd39d" },
  { id: "gold", name: "Gold / cream", color: "#e9cc8b", dark: "#856019", secondary: "#ebe2c9" },
] as const;

export const conceptFeatures: { id: FeatureId; label: string; match: RegExp; kinds: ProjectKind[] }[] = [
  { id: "booking", label: "Online booking", match: /\b(book(?:ing|ings)?|reservations?|appointments?|schedule)\b/i, kinds: ["website", "webapp", "mobile"] },
  { id: "shop", label: "Online store", match: /\b(shop|store|e-?commerce|cart|products?)\b/i, kinds: ["website", "webapp", "mobile"] },
  { id: "payments", label: "Payments", match: /\b(payments?|checkout|stripe|upi|billing|subscription)\b/i, kinds: ["website", "webapp", "software", "mobile"] },
  { id: "members", label: "Member login", match: /\b(login|log in|sign[ -]?in|accounts?|members?|authentication|student portal)\b/i, kinds: ["website", "webapp", "software", "mobile"] },
  { id: "dashboard", label: "Dashboard", match: /\b(dashboard|admin|crm|management|lms)\b/i, kinds: ["webapp", "software", "mobile"] },
  { id: "chat", label: "AI / live chat", match: /\b(chat(?:bot)?|assistant|live support|ai)\b/i, kinds: ["website", "webapp", "software", "mobile"] },
  { id: "articles", label: "Blog / content", match: /\b(blog|articles?|lessons?|courses?|content)\b/i, kinds: ["website", "webapp", "marketing"] },
  { id: "gallery", label: "Portfolio / gallery", match: /\b(gallery|portfolio|photograph\w*|showcase)\b/i, kinds: ["website", "mobile"] },
  { id: "analytics", label: "Analytics", match: /\b(analytics|reports?|reporting|metrics|tracking)\b/i, kinds: ["webapp", "software", "mobile", "marketing"] },
  { id: "notifications", label: "Notifications", match: /\b(notifications?|alerts?|reminders?)\b/i, kinds: ["webapp", "software", "mobile"] },
  { id: "automation", label: "Automation", match: /\b(automat\w*|workflow\w*|integrations?|api)\b/i, kinds: ["webapp", "software"] },
  { id: "team", label: "Team workspace", match: /\b(team|collaborat\w*|employees?|staff)\b/i, kinds: ["webapp", "software"] },
  { id: "seo", label: "Search / SEO", match: /\b(seo|search engine|organic search)\b/i, kinds: ["website", "marketing"] },
  { id: "social", label: "Social media", match: /\b(social|instagram|facebook|linkedin)\b/i, kinds: ["marketing"] },
  { id: "ads", label: "Paid campaigns", match: /\b(ads?|advertis\w*|campaigns?|ppc|leads?)\b/i, kinds: ["marketing"] },
  { id: "newsletter", label: "Email / newsletter", match: /\b(newsletters?|email marketing|mailing list)\b/i, kinds: ["website", "marketing"] },
];

export type ConceptDraft = {
  kind: ProjectKind | "auto";
  name: string;
  idea: string;
  features: FeatureId[];
  excludedFeatures: FeatureId[];
  palette: string;
  customColor: string;
  theme: ConceptTheme | "auto";
  style: ConceptStyle | "auto";
};
export const defaultConceptDraft: ConceptDraft = { kind: "auto", name: "", idea: "", features: [], excludedFeatures: [], palette: "auto", customColor: "#bba2fa", theme: "auto", style: "auto" };

const industries = [
  { id: "care", match: /\b(dent\w*|clinic|health\w*|hospital|doctor|wellness|medical)\b/i, brand: "Carewell", title: ["Good care.", "A little closer."], action: "Find your care", cards: ["Care that fits your life", "A team you can trust", "Your wellbeing, connected"] },
  { id: "learning", match: /\b(learn\w*|courses?|school|education|tutor\w*|student|college|lms)\b/i, brand: "Openmind", title: ["A curious mind.", "An open future."], action: "Explore learning", cards: ["Learn at your pace", "Meet your next mentor", "Build a new skill"] },
  { id: "food", match: /\b(restaurant|cafe|café|coffee|food|bakery|dining|menu)\b/i, brand: "Gather", title: ["Good food.", "Great company."], action: "Explore the menu", cards: ["Something seasonal", "Made with care", "A table for your people"] },
  { id: "fitness", match: /\b(fitness|gym|workout|trainer|yoga|sport\w*)\b/i, brand: "Momentum", title: ["Your next move", "starts here."], action: "Find your rhythm", cards: ["A plan that fits", "Make progress together", "Show up for yourself"] },
  { id: "property", match: /\b(real estate|properties|property|housing|homes?|apartments?)\b/i, brand: "Haven", title: ["A place to live.", "A place to belong."], action: "Explore spaces", cards: ["Thoughtful spaces", "A neighbourhood for you", "Every detail considered"] },
  { id: "travel", match: /\b(travel|tours?|flights?|trips?|hotel|holiday|vacation)\b/i, brand: "Elsewhere", title: ["Somewhere new.", "Something unforgettable."], action: "Find your next escape", cards: ["Go a little further", "Stay somewhere special", "Your journey, your way"] },
  { id: "shop", match: /\b(shop|store|e-?commerce|fashion|products?|jewel\w*|gem\w*|clothing)\b/i, brand: "Forma", title: ["Considered things.", "Everyday possibility."], action: "Explore the collection", cards: ["The everyday edit", "Made to stay with you", "A thoughtful collection"] },
  { id: "creative", match: /\b(portfolio|photograph\w*|design|creative|agency|artist)\b/i, brand: "Outline", title: ["A different", "point of view."], action: "Explore the work", cards: ["Ideas with intention", "Details worth noticing", "A fresh perspective"] },
  { id: "community", match: /\b(charity|nonprofit|non-profit|community|donat\w*|foundation)\b/i, brand: "Together", title: ["Small acts.", "Lasting change."], action: "Make a difference", cards: ["People at the centre", "A shared purpose", "Build a better tomorrow"] },
];

export function detectProjectKind(idea: string): ProjectKind {
  if (/\b(mobile app\w*|android app\w*|ios app\w*|iphone app\w*|app store|phone app)\b/i.test(idea)) return "mobile";
  if (/\b(desktop|software|automation tool|inventory system)\b/i.test(idea)) return "software";
  if (/\b(web app\w*|dashboard|portal|saas|crm|lms|management system)\b/i.test(idea)) return "webapp";
  if (/\b(website|web site|landing page|online store|e-?commerce)\b/i.test(idea)) return "website";
  if (/\b(mobile|android|ios|iphone)\b/i.test(idea)) return "mobile";
  if (/\b(marketing|seo|social media|advertis\w*|campaign|lead generation)\b/i.test(idea)) return "marketing";
  return "website";
}

export type ProjectConcept = {
  kind: ProjectKind;
  name: string;
  idea: string;
  industry: string;
  headline: string[];
  action: string;
  cards: string[];
  features: FeatureId[];
  detected: FeatureId[];
  palette: string;
  accent: string;
  secondary: string;
  theme: ConceptTheme;
  style: ConceptStyle;
};

/** Local, deterministic concept composition. Visitor text is rendered as text, never HTML or code. */
export function buildConcept(input: ConceptDraft): ProjectConcept {
  const idea = input.idea.trim().slice(0, 600);
  const cues = idea.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const kind = input.kind === "auto" ? detectProjectKind(cues) : input.kind;
  const industry = industries.find((x) => x.match.test(cues));
  const detected = conceptFeatures.filter((x) => {
    const match = x.match.exec(cues);
    return match && !/(?:no|not|without|exclude|avoid|don’t need|don't need)\s+(?:\w+\s+){0,2}$/i.test(cues.slice(Math.max(0, match.index - 24), match.index));
  }).map((x) => x.id);
  const features = [...new Set([...input.features.filter((id) => conceptFeatures.some((x) => x.id === id)), ...detected])].filter((id) => !input.excludedFeatures.includes(id));
  const theme = input.theme === "auto" ? /\b(white|light|bright|airy)\b/i.test(cues) ? "light" : "dark" : input.theme;
  const style = input.style === "auto" ? /\b(editorial|serif|luxury|elegant)\b/i.test(cues) ? "editorial" : /\b(minimal|simple|clean)\b/i.test(cues) ? "minimal" : "expressive" : input.style;
  let palette = conceptPalettes.find((x) => x.id === input.palette);
  if (input.palette === "auto") {
    if (/\b(blue|ocean|cyan|teal)\b/i.test(cues)) palette = conceptPalettes[1];
    else if (/\b(green|forest|lime|emerald)\b/i.test(cues)) palette = conceptPalettes[2];
    else if (/\b(coral|orange|red|peach)\b/i.test(cues)) palette = conceptPalettes[3];
    else if (/\b(gold|yellow|amber|cream)\b/i.test(cues)) palette = conceptPalettes[4];
  }
  palette ??= conceptPalettes[0];
  const custom = input.palette === "custom" && /^#[a-f\d]{6}$/i.test(input.customColor);
  const accent = custom ? input.customColor : theme === "light" ? palette.dark : palette.color;
  return {
    kind, name: input.name.trim().slice(0, 40) || industry?.brand || (kind === "marketing" ? "Brightside" : kind === "software" || kind === "webapp" ? "Flowstate" : "Your next idea"),
    idea, industry: industry?.id || "business", headline: industry?.title || ["A good idea.", "A new possibility."],
    action: industry?.action || "Explore the possibilities", cards: industry?.cards || ["A thoughtful beginning", "A better everyday", "Room for what’s next"],
    features, detected, palette: custom ? `Custom ${input.customColor.toUpperCase()}` : palette.name,
    accent, secondary: custom ? input.customColor : palette.secondary, theme, style,
  };
}

export function readableInk(hex: string): "#000000" | "#ffffff" {
  const channels = [1, 3, 5].map((i) => { const c = parseInt(hex.slice(i, i + 2), 16) / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2] > .179 ? "#000000" : "#ffffff";
}

const serviceForKind: Record<ProjectKind, string> = { website: "web-development", webapp: "web-applications", software: "software-development", mobile: "app-development", marketing: "digital-marketing" };
export const CONCEPT_HANDOFF_KEY = "studio-project-concept-v1";
export function conceptBrief(concept: ProjectConcept): string {
  return `PROJECT CONCEPT: ${concept.name}\nProject: ${projectKinds.find((x) => x.id === concept.kind)!.label}\nIdea: ${concept.idea || "I would like to discuss this visual direction."}\nFeatures: ${concept.features.map((id) => conceptFeatures.find((x) => x.id === id)!.label).join(", ") || "Let’s explore together"}\nTheme: ${concept.theme}\nDesign: ${concept.style}\nPalette: ${concept.palette}\nAccent: ${concept.accent.toUpperCase()}\n\nI would like to discuss developing this concept further.`;
}
export function createConceptHandoff(concept: ProjectConcept) {
  return { version: 1, createdAt: Date.now(), service: serviceForKind[concept.kind], name: concept.name, palette: concept.palette, description: conceptBrief(concept) };
}
export function parseConceptHandoff(raw: string | null) {
  try {
    const item: unknown = JSON.parse(raw || "null");
    if (!item || typeof item !== "object") return null;
    const value = item as ReturnType<typeof createConceptHandoff>;
    if (value.version !== 1 || typeof value.createdAt !== "number" || Date.now() - value.createdAt > 24 * 60 * 60 * 1000 || value.createdAt > Date.now() + 60_000) return null;
    if (!Object.values(serviceForKind).includes(value.service) || typeof value.description !== "string" || value.description.length > 3000 || typeof value.name !== "string" || value.name.length > 40 || typeof value.palette !== "string" || value.palette.length > 60) return null;
    return value;
  } catch { return null; }
}
export function getEnquiryLink(brief: string, details: { email?: string; whatsapp?: string }) {
  const number = (details.whatsapp || "").replace(/[\s()+-]/g, "");
  if (/^\d{8,15}$/.test(number)) return { href: `https://wa.me/${number}?text=${encodeURIComponent(brief)}`, direct: true, label: "Discuss this on WhatsApp" };
  if (/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(details.email || "")) return { href: `mailto:${details.email}?subject=${encodeURIComponent("Let’s build my project concept")}&body=${encodeURIComponent(brief)}`, direct: true, label: "Email us this concept" };
  return { href: "/contact?from=idea-studio", direct: false, label: "Get more. Make it real." };
}
