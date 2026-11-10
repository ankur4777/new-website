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
  { id: "property", match: /\b(real estate|properties|property|housing|homes?|apartments?|architecture|interiors?)\b/i, brand: "Haven", title: ["A place to live.", "A place to belong."], action: "Explore spaces", cards: ["Thoughtful spaces", "A neighbourhood for you", "Every detail considered"] },
  { id: "travel", match: /\b(travel|tours?|flights?|trips?|hotel|holiday|vacation)\b/i, brand: "Elsewhere", title: ["Somewhere new.", "Something unforgettable."], action: "Find your next escape", cards: ["Go a little further", "Stay somewhere special", "Your journey, your way"] },
  { id: "beauty", match: /\b(beauty|skincare|skin care|cosmetic\w*|perfume|salon|spa|makeup|fragrance)\b/i, brand: "Aura", title: ["A daily ritual.", "Entirely yours."], action: "Discover your ritual", cards: ["The everyday ritual", "Considered ingredients", "A moment for yourself"] },
  { id: "finance", match: /\b(finance|fintech|bank\w*|investment|insurance|accounting|money|wealth)\b/i, brand: "Moneta", title: ["A clearer view.", "A confident next move."], action: "Explore your possibilities", cards: ["See the bigger picture", "Plan your next chapter", "Make everyday simpler"] },
  { id: "logistics", match: /\b(logistic\w*|trucking|transport|delivery|shipping|freight|courier|supply chain)\b/i, brand: "Northline", title: ["Always moving.", "Always connected."], action: "Plan a delivery", cards: ["Connect your routes", "Keep every step visible", "Move with confidence"] },
  { id: "music", match: /\b(music|musician|band|audio|recording|headphones?|podcast|concert|festival)\b/i, brand: "Frequency", title: ["Feel every note.", "Find your frequency."], action: "Find your sound", cards: ["Something worth hearing", "Made for the moment", "A sound of your own"] },
  { id: "events", match: /\b(events?|wedding|tickets?|conference|celebration)\b/i, brand: "Assembly", title: ["Make a moment.", "Make it memorable."], action: "Explore the experience", cards: ["A place to come together", "The details that matter", "Something to remember"] },
  { id: "shop", match: /\b(shop|store|e-?commerce|fashion|products?|jewel\w*|gem\w*|clothing|pottery|ceramics?|furniture|handmade|handbags?)\b/i, brand: "Forma", title: ["Considered things.", "Everyday possibility."], action: "Explore the collection", cards: ["The everyday edit", "Made to stay with you", "A thoughtful collection"] },
  { id: "creative", match: /\b(portfolio|photograph\w*|creative|agency|artist)\b/i, brand: "Outline", title: ["A different", "point of view."], action: "Explore the work", cards: ["Ideas with intention", "Details worth noticing", "A fresh perspective"] },
  { id: "community", match: /\b(charity|nonprofit|non-profit|community|donat\w*|foundation)\b/i, brand: "Together", title: ["Small acts.", "Lasting change."], action: "Make a difference", cards: ["People at the centre", "A shared purpose", "Build a better tomorrow"] },
];

export type CompositionLayout = "split" | "immersive" | "editorial" | "gallery" | "bento" | "poster" | "minimal" | "workspace" | "board" | "analytics" | "mobile-feed" | "mobile-focus" | "mobile-shop" | "campaign";
export type ConceptVisual = "coffee" | "culinary" | "landscape" | "architecture" | "botanical" | "product" | "learning" | "fitness" | "care" | "finance" | "logistics" | "music" | "creative" | "community" | "technology";
export type DesignDirection = {
  seed: number;
  id: string;
  variation: number;
  layout: CompositionLayout;
  label: string;
  visual: ConceptVisual;
  subject: string;
  eyebrow: string;
  description: string;
  storyTitle: string;
  story: string;
  navigation: string[];
  chapters: { title: string; detail: string; category: string }[];
  font: "sans" | "serif" | "display";
  paper: string;
  ink: string;
};

type ArtProfile = { visual: ConceptVisual; eyebrow: string; description: string; storyTitle: string; story: string; navigation: string[]; titles: string[][]; chapters: string[][]; palette: number; font: "sans" | "serif" | "display" };
const artProfiles: Record<string, ArtProfile> = {
  food: { visual:"culinary", eyebrow:"A SEAT AT OUR TABLE", description:"Seasonal ingredients. A generous table. A place to slow down and enjoy something thoughtfully made.", storyTitle:"Good things take a little care.", story:"From the first ingredient to the last conversation, the details make the experience. Come for something delicious. Stay for the feeling.", navigation:["Our story","The menu","Visit us"], titles:[["Good food.","Better company."],["Made slowly.","Enjoyed together."],["A taste of","something special."]], chapters:[["From the kitchen","Seasonal plates, full of possibility.","THE MENU"],["At our table","A place for your favourite people.","THE EXPERIENCE"],["Make it a moment","Find a little time for something good.","RESERVATIONS"]], palette:2,font:"serif" },
  travel:{visual:"landscape",eyebrow:"FOR THE PLACES YOU HAVEN’T FOUND YET",description:"Take the scenic route. Discover considered escapes, beautiful places and a journey that feels entirely your own.",storyTitle:"Go somewhere. Feel something.",story:"Some places stay with you long after you leave. Find the quiet corners, the extraordinary views and the experiences worth taking your time over.",navigation:["Destinations","Our journeys","Plan a trip"],titles:[["Somewhere","extraordinary."],["The world is","still surprising."],["A different way","to get away."]],chapters:[["Beyond the familiar","A fresh perspective on your next escape.","DISCOVER"],["Stay a little longer","Thoughtful places to make yourself at home.","STAY"],["Make it your journey","A considered route, shaped around you.","EXPLORE"]],palette:1,font:"display"},
  beauty:{visual:"botanical",eyebrow:"THE ART OF YOUR EVERYDAY",description:"Thoughtful essentials. Unhurried rituals. Discover a little more care in the moments you make for yourself.",storyTitle:"Less rush. More ritual.",story:"Beautiful things can be simple. Explore a collection of everyday essentials created around care, texture and a considered point of view.",navigation:["The collection","Our philosophy","Your ritual"],titles:[["A moment","all your own."],["Beauty, in","the everyday."],["Care comes","naturally."]],chapters:[["The daily ritual","A considered beginning to your day.","ESSENTIALS"],["A little more care","Thoughtful details, from first to last.","PHILOSOPHY"],["Find your favourites","A collection that feels like you.","DISCOVER"]],palette:2,font:"serif"},
  property:{visual:"architecture",eyebrow:"SPACES WITH A DIFFERENT PERSPECTIVE",description:"Architecture, light and a sense of place. Discover thoughtfully considered spaces for the way you want to live.",storyTitle:"A space to call your own.",story:"Good spaces begin with the people who use them. Explore the forms, materials and small details that turn a place into somewhere you belong.",navigation:["Selected spaces","Our approach","Enquire"],titles:[["Room for","a different life."],["A considered","sense of place."],["Space to live.","Room to belong."]],chapters:[["A quieter perspective","Light, material and thoughtful proportions.","SELECTED SPACES"],["Every detail considered","A closer look at what makes a place.","THE APPROACH"],["Find your next chapter","Make room for what comes next.","DISCOVER"]],palette:4,font:"serif"},
  learning:{visual:"learning",eyebrow:"CURIOSITY LOOKS GOOD ON YOU",description:"Find your next subject, build your confidence and make space for the things you have always wanted to learn.",storyTitle:"Small lessons. New possibilities.",story:"A clear path, useful practice and the freedom to learn in your own way. Take the next step with learning that fits around real life.",navigation:["Explore courses","How it works","Start learning"],titles:[["Learn something.","Change something."],["Your next chapter","starts with curiosity."],["Make room for","a curious mind."]],chapters:[["Design your next move","Explore a new skill, one lesson at a time.","CREATIVE SKILLS"],["Build something useful","Put new ideas into practical motion.","TECHNOLOGY"],["Find a clearer voice","Learn to share what you know.","COMMUNICATION"]],palette:0,font:"sans"},
  fitness:{visual:"fitness",eyebrow:"YOUR PACE. YOUR POSSIBILITY.",description:"Build a rhythm that feels like you. Thoughtful movement, simple goals and room to find your own momentum.",storyTitle:"Progress has a personal rhythm.",story:"Everyday movement can change how your day feels. Explore sessions, plans and a little encouragement for your next step.",navigation:["Find your movement","The approach","Join in"],titles:[["Find your","next gear."],["Move a little.","Feel a lot."],["Your rhythm.","Your momentum."]],chapters:[["A stronger start","A thoughtful foundation for your movement.","STRENGTH"],["Find your balance","A little space to reset and reconnect.","MOBILITY"],["Keep it moving","Build a rhythm that works for you.","EVERYDAY"]],palette:2,font:"display"},
  care:{visual:"care",eyebrow:"A MORE PERSONAL APPROACH TO CARE",description:"Make space for your wellbeing. Explore thoughtful services and a clear, comfortable path to your next appointment.",storyTitle:"Your wellbeing comes first.",story:"Good care starts with being heard. Find useful information, explore your options and connect with a team that understands the details.",navigation:["Our care","Meet the team","Appointments"],titles:[["Care that","feels closer."],["A little clarity.","A little more care."],["Your wellbeing.","Our starting point."]],chapters:[["A personal approach","Explore care around your everyday needs.","OUR SERVICES"],["Meet your care team","Start a comfortable conversation.","OUR PEOPLE"],["Make time for you","A clear path to your next appointment.","YOUR NEXT STEP"]],palette:1,font:"sans"},
  shop:{visual:"product",eyebrow:"CONSIDERED OBJECTS. EVERYDAY POSSIBILITY.",description:"Discover a collection of thoughtful things. Made to be used, enjoyed and kept a little longer.",storyTitle:"Fewer things. Better stories.",story:"Some objects have a way of becoming part of your everyday. Explore the materials, details and ideas behind a considered collection.",navigation:["The collection","Our story","The edit"],titles:[["Objects with","a point of view."],["Considered things.","Everyday possibility."],["Find your","new favourite."]],chapters:[["The signature edit","A considered selection of everyday favourites.","COLLECTION 01"],["A closer look","Details that make all the difference.","THE DETAILS"],["Made for your everyday","Thoughtful objects, useful by design.","THE EVERYDAY"]],palette:3,font:"display"},
  music:{visual:"music",eyebrow:"TURN UP WHAT MOVES YOU",description:"Find the sound, the story and the moments that move you. A different frequency for your everyday.",storyTitle:"A little closer to the sound.",story:"From a quiet first listen to a room full of possibility, make space for the music and voices you want to hear.",navigation:["Discover","The collection","Listen in"],titles:[["Feel every","frequency."],["Made to be","heard."],["Your world.","A better soundtrack."]],chapters:[["Find your frequency","A considered selection for your next listen.","DISCOVER"],["Behind the sound","A closer look at the people and the process.","STORIES"],["Something worth hearing","Make a little room for a new favourite.","THE EDIT"]],palette:0,font:"display"},
  finance:{visual:"finance",eyebrow:"CLARITY FOR WHAT COMES NEXT",description:"Bring your financial world into a clearer view. Useful tools, thoughtful guidance and a simpler way to plan ahead.",storyTitle:"A little clarity goes a long way.",story:"The most useful information is the information you can act on. Explore a considered experience that connects your priorities with your next step.",navigation:["The platform","How it works","Explore"],titles:[["A clearer view.","A confident next move."],["Make room for","what comes next."],["Everyday clarity.","Longer-term possibility."]],chapters:[["See it together","A clearer view of the moving parts.","OVERVIEW"],["Explore your options","Useful information, simply presented.","DISCOVER"],["Plan the next step","Connect your priorities and your possibilities.","YOUR DIRECTION"]],palette:1,font:"sans"},
  logistics:{visual:"logistics",eyebrow:"EVERY CONNECTION COUNTS",description:"Keep your people, routes and deliveries connected. A clear view of the details that keep your business moving.",storyTitle:"From the first mile to the next.",story:"Good logistics is a connected journey. Explore a clear path through planning, visibility and the next useful action.",navigation:["Our network","Our services","Track a journey"],titles:[["Always moving.","Better connected."],["Your next mile.","Our shared direction."],["Keep the world","in motion."]],chapters:[["A connected network","A clearer path from here to there.","OUR NETWORK"],["Keep it visible","A useful view of every moving part.","VISIBILITY"],["A practical next step","Find the service that fits your journey.","OUR SERVICES"]],palette:3,font:"display"},
  creative:{visual:"creative",eyebrow:"INDEPENDENT THINKING. DISTINCTIVE WORK.",description:"An independent point of view, made tangible through considered ideas, purposeful detail and a little curiosity.",storyTitle:"A different way of seeing.",story:"Good ideas become memorable when every detail has a reason to be there. Explore a collection of work shaped by curiosity and intention.",navigation:["Selected work","The studio","Get in touch"],titles:[["A different","point of view."],["Ideas, with","a little edge."],["Make something","worth noticing."]],chapters:[["A new perspective","Original thinking, brought into focus.","SELECTED 01"],["Room to experiment","Where curiosity becomes something useful.","SELECTED 02"],["Details with intention","A considered direction, from first to last.","SELECTED 03"]],palette:0,font:"display"},
  community:{visual:"community",eyebrow:"A LITTLE BETTER, TOGETHER",description:"Bring people and purpose together. Discover the stories, small actions and shared ideas that make a lasting difference.",storyTitle:"A shared purpose. A better possibility.",story:"Change starts with people. Explore a place to connect, learn and take a useful next step with your community.",navigation:["Our purpose","Our stories","Get involved"],titles:[["Small acts.","Shared possibility."],["Good things","start together."],["A place for","every one of us."]],chapters:[["People at the centre","Meet the stories behind the purpose.","OUR COMMUNITY"],["A little action","Find a useful way to get involved.","TAKE PART"],["Build what comes next","Connect your ideas with a shared ambition.","OUR PURPOSE"]],palette:2,font:"sans"},
  events:{visual:"creative",eyebrow:"FOR THE MOMENTS THAT BRING US TOGETHER",description:"An experience worth making time for. Discover the people, details and possibilities behind your next memorable moment.",storyTitle:"The details make the moment.",story:"A thoughtful experience has a way of staying with you. Explore the programme, find your people and make room in your calendar.",navigation:["The experience","The programme","Find your place"],titles:[["Be part of","the moment."],["Good people.","Extraordinary moments."],["Make a little","more of it."]],chapters:[["The experience","A considered programme of possibility.","DISCOVER"],["The people","A reason to come together.","CONNECT"],["Your next moment","Find your place in what comes next.","TAKE PART"]],palette:3,font:"display"},
  business:{visual:"technology",eyebrow:"A DIFFERENT PERSPECTIVE ON WHAT’S NEXT",description:"Bring a good idea into focus. A thoughtful experience that connects your purpose, your people and your next possibility.",storyTitle:"Thoughtfully connected. Distinctly yours.",story:"The right experience begins with understanding what matters. Clear structure, considered details and a useful next step bring the idea together.",navigation:["The experience","Our approach","Let’s talk"],titles:[["Good ideas.","New possibilities."],["A little clarity.","A bigger possibility."],["Make room for","something different."]],chapters:[["A thoughtful beginning","Start with what matters to your people.","DISCOVER"],["A connected experience","Useful details, beautifully considered.","EXPLORE"],["Room for what’s next","A clear path to your next possibility.","CONNECT"]],palette:0,font:"sans"},
};

const layoutNames: Record<CompositionLayout,string> = {split:"Sculpted split",immersive:"Cinematic landscape",editorial:"Editorial story",gallery:"Curated gallery",bento:"Modular canvas",poster:"Typographic statement",minimal:"Quiet luxury",workspace:"Connected workspace",board:"Project canvas",analytics:"Data in focus","mobile-feed":"Pocket journal","mobile-focus":"Daily companion","mobile-shop":"Pocket collection",campaign:"Campaign canvas"};
function briefHash(text:string) { let value=2166136261; for(const ch of text){value^=ch.codePointAt(0)!;value=Math.imul(value,16777619);}return value>>>0; }
function subjectFrom(idea:string) {
  const text=idea.match(/(?:for|about|selling|showcasing)\s+([^.!?;\n]{3,65})/i)?.[1]?.split(/\s+(?:with|using|that|in|and a|called|named)\s+/i)[0]?.trim();
  return text&&text.length<55?text.replace(/^(?:a|an|the|my|our)\s+/i,""):"your next possibility";
}

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
  design: DesignDirection;
};

/** Local, deterministic concept composition. Visitor text is rendered as text, never HTML or code. */
export function buildConcept(input: ConceptDraft, variation = 0): ProjectConcept {
  const idea = input.idea.trim().slice(0, 600);
  const cues = idea.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const kind = input.kind === "auto" ? detectProjectKind(cues) : input.kind;
  const industry = industries.find((x) => x.match.test(cues));
  const profile = artProfiles[industry?.id || "business"];
  const detected = conceptFeatures.filter((x) => {
    const match = x.match.exec(cues);
    return match && !/(?:no|not|without|exclude|avoid|don’t need|don't need)\s+(?:\w+\s+){0,2}$/i.test(cues.slice(Math.max(0, match.index - 24), match.index));
  }).map((x) => x.id);
  const features = [...new Set([...input.features.filter((id) => conceptFeatures.some((x) => x.id === id)), ...detected])].filter((id) => !input.excludedFeatures.includes(id));
  const theme = input.theme === "auto" ? /\b(white|light|bright|airy)\b/i.test(cues) ? "light" : /\b(dark|black|night|noir)\b/i.test(cues) ? "dark" : ["food","beauty","care","property"].includes(industry?.id||"") ? "light" : "dark" : input.theme;
  const style = input.style === "auto" ? /\b(editorial|serif|luxury|elegant)\b/i.test(cues) ? "editorial" : /\b(minimal|simple|clean)\b/i.test(cues) ? "minimal" : "expressive" : input.style;
  let palette = conceptPalettes.find((x) => x.id === input.palette);
  if (input.palette === "auto") {
    if (/\b(blue|ocean|cyan|teal)\b/i.test(cues)) palette = conceptPalettes[1];
    else if (/\b(green|forest|lime|emerald)\b/i.test(cues)) palette = conceptPalettes[2];
    else if (/\b(coral|orange|red|peach)\b/i.test(cues)) palette = conceptPalettes[3];
    else if (/\b(gold|yellow|amber|cream)\b/i.test(cues)) palette = conceptPalettes[4];
  }
  palette ??= conceptPalettes[profile.palette];
  const custom = input.palette === "custom" && /^#[a-f\d]{6}$/i.test(input.customColor);
  const accent = custom ? input.customColor : theme === "light" ? palette.dark : palette.color;
  const seed = briefHash(JSON.stringify({idea:idea.toLowerCase(),name:input.name.trim(),kind,theme,style,palette:input.palette,custom:input.customColor,features:[...features].sort()}));
  const direction = Number.isFinite(variation) ? Math.max(0,Math.floor(variation)) : 0;
  let pool: CompositionLayout[] = ["split","immersive","editorial","gallery","bento","poster","minimal"];
  if (kind==="webapp"||kind==="software") pool=["workspace","board","analytics"];
  else if (kind==="mobile") pool=["mobile-feed","mobile-focus","mobile-shop"];
  else if (kind==="marketing") pool=["campaign","poster","gallery"];
  else if (/\b(cinematic|immersive|full[ -]bleed|panorama)\b/i.test(cues)) pool=["immersive","split","gallery"];
  else if (style==="minimal") pool=["minimal","split","gallery"];
  else if (style==="editorial") pool=["editorial","gallery","minimal","split"];
  const preferred:CompositionLayout|undefined=kind==="website"? /\b(cinematic|immersive|full[ -]bleed|panorama)\b/i.test(cues)?"immersive":/\b(bento|modular)\b/i.test(cues)?"bento":/\b(poster|bold typography)\b/i.test(cues)?"poster":style==="minimal"?"minimal":style==="editorial"?"editorial":undefined:undefined;
  if(preferred&&!pool.includes(preferred))pool=[preferred,...pool];
  const start=preferred&&pool.includes(preferred)?pool.indexOf(preferred):seed%pool.length;
  const layout=pool[(start+direction)%pool.length];
  const quotedName=idea.match(/(?:called|named|brand(?: name)?(?: is|:)?|name is)\s*["“']([^"”'\n]{2,40})["”']/i)?.[1];
  const name=input.name.trim().slice(0,40)||quotedName||industry?.brand||(kind==="marketing"?"Brightside":kind==="software"||kind==="webapp"?"Flowstate":"Your next idea");
  const subject=subjectFrom(idea);
  const quotedTitle=idea.match(/(?:headline|heading|tagline)\s*(?:is|:|=)?\s*["“]([^"”\n]{4,90})["”]/i)?.[1];
  const headline=quotedTitle?[quotedTitle]:!industry&&subject!=="your next possibility"?[subject.charAt(0).toUpperCase()+subject.slice(1)+".",["Beautifully considered.","A different perspective.","Made for what’s next."][(seed+direction)%3]]:profile.titles[((seed>>>5)+direction)%profile.titles.length];
  let visual=profile.visual;
  if (industry?.id==="food"&&/\b(coffee|cafe|espresso)\b/i.test(cues)) visual="coffee";
  if (kind==="software"||kind==="webapp") visual="technology";
  const detail=features.includes("booking")?"Choose a time, explore the details and make it yours.":features.includes("shop")?"Explore the collection and discover your next favourite.":features.includes("members")?"A personal space keeps the experience connected.":"";
  const design:DesignDirection={seed,id:`${seed.toString(16).padStart(8,"0")}-${direction+1}`,variation:direction,layout,label:layoutNames[layout],visual,subject,eyebrow:profile.eyebrow,description:`${profile.description}${detail?" "+detail:""}`,storyTitle:profile.storyTitle,story:profile.story,navigation:profile.navigation,chapters:profile.chapters.map(([title,detail,category])=>({title,detail,category})),font:style==="editorial"?"serif":style==="minimal"?"sans":profile.font,paper:theme==="light"?["#f6f3ec","#f4f4ed","#f4f0ed"][(seed>>>3)%3]:["#101416","#14131a","#121718"][(seed>>>3)%3],ink:theme==="light"?"#222924":"#f5f3eb"};
  return {
    kind, name,
    idea, industry: industry?.id || "business", headline,
    action: features.includes("booking")&&industry?.id==="food"?"Find your table":industry?.action || "Explore the possibilities", cards: design.chapters.map(x=>x.title),
    features, detected, palette: custom ? `Custom ${input.customColor.toUpperCase()}` : palette.name,
    accent, secondary: custom ? input.customColor : palette.secondary, theme, style, design,
  };
}

export function readableInk(hex: string): "#000000" | "#ffffff" {
  const channels = [1, 3, 5].map((i) => { const c = parseInt(hex.slice(i, i + 2), 16) / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2] > .179 ? "#000000" : "#ffffff";
}

const serviceForKind: Record<ProjectKind, string> = { website: "web-development", webapp: "web-applications", software: "software-development", mobile: "app-development", marketing: "digital-marketing" };
export const CONCEPT_HANDOFF_KEY = "studio-project-concept-v1";
export function conceptBrief(concept: ProjectConcept): string {
  return `PROJECT CONCEPT: ${concept.name}\nProject: ${projectKinds.find((x) => x.id === concept.kind)!.label}\nIdea: ${concept.idea || "I would like to discuss this visual direction."}\nFeatures: ${concept.features.map((id) => conceptFeatures.find((x) => x.id === id)!.label).join(", ") || "Let’s explore together"}\nTheme: ${concept.theme}\nDesign: ${concept.style}\nComposition: ${concept.design.label}\nDirection: ${concept.design.id}\nPalette: ${concept.palette}\nAccent: ${concept.accent.toUpperCase()}\n\nI would like to discuss developing this concept further.`;
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
