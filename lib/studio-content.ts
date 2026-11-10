export const company = {
  name: "YourCompany",
  descriptor: "Digital, done differently.",
};

export type Service = {
  slug: string;
  number: string;
  name: string;
  short: string;
  headline: string[];
  description: string;
  accent: string;
  icon: string;
  tags: string[];
  capabilities: { title: string; description: string }[];
  workflow: string[];
  questions: { q: string; a: string }[];
};
export const services: Service[] = [
  {
    slug: "digital-marketing",
    number: "01",
    name: "Digital marketing",
    short: "Get discovered. Stay remembered.",
    headline: ["Attention is earned.", "Let’s earn yours."],
    description:
      "Bring your brand into the right conversations. We connect strategy, creative, and performance to help the right people discover what you do.",
    accent: "var(--accent)",
    icon: "growth",
    tags: ["SEO", "Social media", "Paid campaigns", "Content"],
    capabilities: [
      {
        title: "Search that finds your people",
        description:
          "Technical SEO, content planning, and search intent come together to build a stronger organic presence.",
      },
      {
        title: "Social with something to say",
        description:
          "A consistent voice, thoughtful creative, and platform-specific content that gives people a reason to engage.",
      },
      {
        title: "Campaigns with a clear purpose",
        description:
          "Paid search and social campaigns built around your audience, budget, and the actions that matter.",
      },
      {
        title: "Clarity behind every decision",
        description:
          "Useful reporting and conversion tracking that connect campaign activity to your business goals.",
      },
    ],
    workflow: [
      "Understand the audience",
      "Find the opportunity",
      "Launch and learn",
      "Refine the next move",
    ],
    questions: [
      {
        q: "Can you work with an existing brand?",
        a: "Yes. We can work within your current identity and messaging, or help refine them before a campaign begins.",
      },
      {
        q: "How do we measure progress?",
        a: "We agree on relevant goals first, such as qualified enquiries, organic visibility, or conversion rate. Reporting focuses on those goals rather than follower counts alone.",
      },
      {
        q: "Is advertising spend included?",
        a: "Media budgets and service fees are planned separately so you can see how your investment is being used.",
      },
    ],
  },
  {
    slug: "web-development",
    number: "02",
    name: "Web development",
    short: "A first impression that keeps working.",
    headline: ["More than a website.", "Your next advantage."],
    description:
      "Thoughtful design meets purposeful engineering. We build fast, expressive websites that make your business easier to understand and easier to choose.",
    accent: "var(--mint)",
    icon: "web",
    tags: ["Business websites", "E-commerce", "CMS", "Landing pages"],
    capabilities: [
      {
        title: "An experience that feels like you",
        description:
          "Original visual design, a clear content structure, and considered interactions built around your brand.",
      },
      {
        title: "Made for every screen",
        description:
          "Responsive layouts and accessible navigation that feel comfortable on phones, tablets, and desktops.",
      },
      {
        title: "Content you can control",
        description:
          "Manage your pages, products, and articles through a content system chosen for your needs.",
      },
      {
        title: "A solid foundation",
        description:
          "Performance, semantic structure, search basics, and a careful launch process are part of the build.",
      },
    ],
    workflow: [
      "Define the experience",
      "Design the details",
      "Build and test",
      "Launch with confidence",
    ],
    questions: [
      {
        q: "Can you redesign my existing website?",
        a: "Yes. We start by understanding what works, what feels difficult, and what content or integrations need to be retained.",
      },
      {
        q: "Will I be able to edit the content?",
        a: "If you need regular content updates, we plan an editing experience around your team and the type of content you publish.",
      },
      {
        q: "Can you build an online store?",
        a: "Yes. Product discovery, product pages, cart, checkout integration, and store management can be included in the agreed scope.",
      },
    ],
  },
  {
    slug: "web-applications",
    number: "03",
    name: "Web applications",
    short: "Complex challenges. Intuitive experiences.",
    headline: ["Big functionality.", "Beautifully simple."],
    description:
      "Turn a business idea into a product people enjoy using. From customer portals to SaaS platforms, we make complex workflows feel clear and connected.",
    accent: "var(--service-blue)",
    icon: "layers",
    tags: ["SaaS platforms", "Dashboards", "Customer portals", "APIs"],
    capabilities: [
      {
        title: "From possibility to product",
        description:
          "Map users, priorities, and the core experience before choosing what belongs in your first release.",
      },
      {
        title: "Workflows that make sense",
        description:
          "Clear interfaces, meaningful states, and connected journeys for the people doing the actual work.",
      },
      {
        title: "Connected by design",
        description:
          "Plan authentication, permissions, data models, and integrations around your product requirements.",
      },
      {
        title: "Room for what comes next",
        description:
          "A considered architecture and documented handover make future features and maintenance easier to plan.",
      },
    ],
    workflow: [
      "Map the problem",
      "Prototype the journey",
      "Build in iterations",
      "Test and evolve",
    ],
    questions: [
      {
        q: "Can you start with an MVP?",
        a: "Yes. We can define a focused first release that tests the most important workflows and leaves room for future development.",
      },
      {
        q: "Can you integrate existing systems?",
        a: "We review the available APIs, data formats, and permissions, then plan the integration around those constraints.",
      },
      {
        q: "Do you build role-based portals?",
        a: "Yes. User roles, permissions, and portal journeys can be designed around your organisation and its users.",
      },
    ],
  },
  {
    slug: "software-development",
    number: "04",
    name: "Software development",
    short: "Built around the way you work.",
    headline: ["Your business is unique.", "Your software can be too."],
    description:
      "Replace workarounds with tools that fit. We design custom software that connects processes, reduces repetitive work, and supports your next stage.",
    accent: "var(--service-warm)",
    icon: "code",
    tags: ["Custom software", "Business tools", "Automation", "Integrations"],
    capabilities: [
      {
        title: "Software for your real workflow",
        description:
          "Business tools shaped around your processes, from internal operations to customer-facing systems.",
      },
      {
        title: "Less repetitive work",
        description:
          "Connect routine steps, validation, and approvals so your team can spend more time on meaningful work.",
      },
      {
        title: "Make your systems talk",
        description:
          "Carefully planned integrations that move information between the tools your business relies on.",
      },
      {
        title: "A practical path forward",
        description:
          "Review legacy systems, prioritise changes, and introduce improvements with a clear migration plan.",
      },
    ],
    workflow: [
      "Explore your operations",
      "Plan the architecture",
      "Build and validate",
      "Hand over and support",
    ],
    questions: [
      {
        q: "Can you improve an existing system?",
        a: "Yes. An initial review helps identify the code, dependencies, data, and workflows that need attention before we propose changes.",
      },
      {
        q: "Who owns the finished software?",
        a: "Ownership, licensing, third-party components, and handover expectations are documented in the project agreement before development.",
      },
      {
        q: "Can maintenance be included?",
        a: "Ongoing maintenance can be scoped around your software, hosting environment, and the level of support your team needs.",
      },
    ],
  },
  {
    slug: "app-development",
    number: "05",
    name: "App development",
    short: "Good ideas, in the palm of your hand.",
    headline: ["A little screen.", "A world of possibility."],
    description:
      "Make the everyday feel effortless. We create mobile app experiences that bring your service closer to the people who need it.",
    accent: "var(--service-rose)",
    icon: "mobile",
    tags: ["iOS", "Android", "Cross-platform", "Product design"],
    capabilities: [
      {
        title: "A reason to come back",
        description:
          "Purposeful onboarding and carefully designed journeys that help people get value from the first session.",
      },
      {
        title: "Designed for life on the move",
        description:
          "Touch-friendly interfaces, readable content, and interactions that suit real mobile use.",
      },
      {
        title: "The right technical approach",
        description:
          "Choose native or cross-platform development based on your features, users, timeline, and budget.",
      },
      {
        title: "Ready for the next step",
        description:
          "Test key journeys, plan store submission requirements, and prepare your team for launch and updates.",
      },
    ],
    workflow: [
      "Shape the idea",
      "Prototype the moments",
      "Develop the experience",
      "Prepare for release",
    ],
    questions: [
      {
        q: "Can one app work on iOS and Android?",
        a: "A cross-platform approach can support both. We assess your features and device requirements before recommending a development approach.",
      },
      {
        q: "Can you connect an app to our website?",
        a: "Yes. An app can use shared APIs and backend services so the experience connects to your existing platform.",
      },
      {
        q: "Do you help with app store submission?",
        a: "Store assets, testing, and submission preparation can be included. The final review and approval belong to the relevant app store.",
      },
    ],
  },
];
export const projects = [
  {
    slug: "orbit",
    name: "Orbit",
    category: "Applications",
    type: "SaaS platform concept",
    headline: "Less noise. More clarity.",
    summary:
      "A calm command centre for the moving parts of a growing business.",
    theme: "orbit",
    tags: ["Product strategy", "Web application", "UI/UX design"],
    challenge:
      "Bring scattered operational information into a clear daily view, without overwhelming the people who use it.",
    approach:
      "A focused dashboard, a flexible navigation system, and useful visual hierarchy make the most important actions easy to find.",
  },
  {
    slug: "mono",
    name: "Mono",
    category: "Websites",
    type: "E-commerce concept",
    headline: "Designed to be heard.",
    summary: "An expressive shopping experience for a modern audio brand.",
    theme: "mono",
    tags: ["Brand experience", "Web development", "E-commerce"],
    challenge:
      "Translate the quality and personality of a physical product into an engaging online shopping experience.",
    approach:
      "Confident typography, a focused product story, and a considered path from discovery to purchase keep the product at the centre.",
  },
  {
    slug: "stride",
    name: "Stride",
    category: "Applications",
    type: "Mobile app concept",
    headline: "A little momentum. Every day.",
    summary: "A movement companion that makes everyday progress feel personal.",
    theme: "stride",
    tags: ["Mobile app", "Interaction design", "Prototyping"],
    challenge:
      "Create an approachable activity experience that encourages consistency without making the interface feel demanding.",
    approach:
      "A warm visual language, clear daily goals, and simple activity summaries help people focus on the next small step.",
  },
  {
    slug: "onda",
    name: "Onda",
    category: "Marketing",
    type: "Digital campaign concept",
    headline: "Make a little more noise.",
    summary:
      "A bold visual direction that brings a fresh brand into the conversation.",
    theme: "onda",
    tags: ["Creative direction", "Digital marketing", "Social content"],
    challenge:
      "Build a coherent digital presence for a new brand while making each piece of content feel recognisable.",
    approach:
      "A flexible typographic system, a focused message, and a playful visual rhythm create a consistent campaign across formats.",
  },
];
export const processSteps = [
  {
    number: "01",
    name: "Discover",
    line: "The right questions come first.",
    description:
      "We get to know your business, your audience, and the problem you want to solve. Together, we define what a useful outcome looks like.",
    output: "A shared direction",
  },
  {
    number: "02",
    name: "Design",
    line: "Make the possibilities tangible.",
    description:
      "Ideas take shape through structure, visual exploration, and interactive prototypes. You can see the experience before development begins.",
    output: "A considered experience",
  },
  {
    number: "03",
    name: "Develop",
    line: "Build it with intention.",
    description:
      "Design becomes a working product in clear stages. Regular reviews keep the details, priorities, and technical decisions connected.",
    output: "A working product",
  },
  {
    number: "04",
    name: "Evolve",
    line: "Launch is a new beginning.",
    description:
      "We test the important journeys, prepare the handover, and plan what comes next. Feedback becomes a practical roadmap for improvement.",
    output: "A confident next step",
  },
];
export const faqs = [
  {
    q: "I have an idea, but not a detailed brief. Where do we start?",
    a: "Start with the problem you want to solve and the people you want to help. We can work with you to turn that starting point into a clear scope and a practical first step.",
  },
  {
    q: "Can you handle both development and digital marketing?",
    a: "Yes. The services are designed to connect your website or product experience with the way people discover and engage with your business. We can also help with one focused part of a project.",
  },
  {
    q: "How is a project priced?",
    a: "Pricing depends on the scope, complexity, integrations, content, and level of support. A project proposal should make the deliverables, assumptions, payment stages, and exclusions clear before work starts.",
  },
  {
    q: "How long will my project take?",
    a: "Timelines depend on the size of the project and how quickly content, feedback, and access are available. We define a realistic schedule once the scope is clear, rather than promising a generic turnaround.",
  },
  {
    q: "Can you work with an existing website or application?",
    a: "Yes. We begin with a review of the existing experience, technology, and requirements to understand what can be improved and what needs to be preserved.",
  },
  {
    q: "What happens after launch?",
    a: "We can plan documentation, training, maintenance, and future improvements as part of the project. Ongoing support is agreed separately so expectations stay clear.",
  },
];
