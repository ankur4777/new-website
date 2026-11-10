import test from "node:test";
import assert from "node:assert/strict";
import { buildConcept, conceptBrief, createConceptHandoff, defaultConceptDraft, detectProjectKind, getEnquiryLink, parseConceptHandoff, readableInk } from "../lib/project-concept.ts";

const draft = (changes) => ({ ...defaultConceptDraft, ...changes });
test("written requirements shape the project, industry, features, theme and palette", () => {
  const concept = buildConcept(draft({ idea: "A light minimal café website in forest green with online booking and a gallery" }));
  assert.equal(concept.kind, "website");
  assert.equal(concept.industry, "food");
  assert.equal(concept.theme, "light");
  assert.equal(concept.style, "minimal");
  assert.equal(concept.palette, "Forest / lime");
  assert.deepEqual(concept.features, ["booking", "gallery"]);
});
test("explicit controls override cues while manual features merge without duplicates", () => {
  const concept = buildConcept(draft({ idea: "A dark blue mobile app with login and payments", kind: "webapp", theme: "light", style: "editorial", palette: "gold", features: ["payments", "booking"] }));
  assert.equal(concept.kind, "webapp");
  assert.equal(concept.theme, "light");
  assert.equal(concept.style, "editorial");
  assert.equal(concept.palette, "Gold / cream");
  assert.deepEqual(concept.features, ["payments", "booking", "members"]);
});
test("all five service types are recognised", () => {
  for (const [idea, kind] of [["A restaurant website", "website"],["An online learning portal", "webapp"],["Desktop inventory software", "software"],["An Android app", "mobile"],["SEO and social media marketing", "marketing"]]) assert.equal(detectProjectKind(idea), kind);
});
test("a website with marketing features keeps its primary project type", () => {
  assert.equal(detectProjectKind("A restaurant website with SEO and social media"), "website");
  assert.equal(detectProjectKind("A website for mobile users"), "website");
  assert.equal(detectProjectKind("Custom software for campaign reporting"), "software");
});
test("visitors can remove inferred features and basic negative requirements are respected", () => {
  const concept = buildConcept(draft({ idea: "A website without login, with booking and payments", excludedFeatures: ["payments"] }));
  assert.deepEqual(concept.features, ["booking"]);
});
test("custom colors are validated and button text stays legible", () => {
  assert.equal(buildConcept(draft({ palette: "custom", customColor: "#001122" })).accent, "#001122");
  assert.equal(buildConcept(draft({ palette: "custom", customColor: "url(evil)" })).accent, "#bba2fa");
  assert.equal(readableInk("#ffffff"), "#000000");
  assert.equal(readableInk("#000000"), "#ffffff");
});
test("handoff carries the generated requirements and the correct enquiry service", () => {
  const concept = buildConcept(draft({ name: "Bright Academy", idea: "A mobile app for learning with login and courses", palette: "ocean" }));
  const handoff = createConceptHandoff(concept);
  assert.equal(parseConceptHandoff(JSON.stringify(handoff)).service, "app-development");
  assert.match(handoff.description, /Bright Academy/);
  assert.match(handoff.description, /Member login/);
  assert.match(handoff.description, /Ocean \/ ice/);
});
test("invalid, stale and oversized stored briefs are ignored", () => {
  assert.equal(parseConceptHandoff("invalid json"), null);
  assert.equal(parseConceptHandoff(null), null);
  const handoff = createConceptHandoff(buildConcept(draft({})));
  assert.equal(parseConceptHandoff(JSON.stringify({ ...handoff, createdAt: 0 })), null);
  assert.equal(parseConceptHandoff(JSON.stringify({ ...handoff, service: "unknown" })), null);
  assert.equal(parseConceptHandoff(JSON.stringify({ ...handoff, description: "x".repeat(3001) })), null);
});
test("contact links encode the brief and fall back to the local form until a real destination exists", () => {
  const text = "Name & idea?\nA café + shop";
  assert.equal(getEnquiryLink(text, {}).href, "/contact?from=idea-studio");
  assert.equal(getEnquiryLink(text, { whatsapp: "+91 98765 43210" }).href, `https://wa.me/919876543210?text=${encodeURIComponent(text)}`);
  assert.match(getEnquiryLink(text, { email: "hello@example.com" }).href, /body=Name%20%26%20idea/);
  assert.equal(getEnquiryLink(text, { email: "hello@example.com?bcc=other@example.com", whatsapp: "javascript:alert(1)" }).direct, false);
});
test("long and markup-like input stays bounded plain text", () => {
  const concept = buildConcept(draft({ name: "<img src=x onerror=alert(1)>".repeat(5), idea: "<script>bad()</script>".repeat(80) }));
  assert.ok(concept.name.length <= 40);
  assert.ok(concept.idea.length <= 600);
  assert.ok(conceptBrief(concept).includes("<script>"));
});

test("different briefs carry distinct visual fingerprints, copy and industry artwork", () => {
  const ideas=["A minimal café website with bookings","A cinematic travel website for hiking in the mountains","A luxury jewellery store in gold","A blue mobile app for learning","A dashboard for logistics with team tracking","A clean website for a skincare brand","A bold fitness website","A website for modern architecture","A website for a healthcare clinic","A website for community volunteers"];
  const concepts=ideas.map(idea=>buildConcept(draft({idea})));
  assert.equal(new Set(concepts.map(c=>c.design.id)).size,ideas.length);
  assert.ok(new Set(concepts.map(c=>c.design.visual)).size>=8);
  assert.ok(new Set(concepts.map(c=>c.design.layout)).size>=5);
  assert.equal(concepts[0].design.visual,"coffee");
  assert.equal(concepts[1].design.visual,"landscape");
  assert.equal(concepts[1].design.layout,"immersive");
  assert.notDeepEqual(concepts[0].headline,concepts[1].headline);
});
test("another direction changes composition while preserving the brief and explicit choices", () => {
  const input=draft({name:"Test Studio",idea:"An independent creative website",theme:"dark",palette:"forest",features:["gallery"]});
  const concepts=Array.from({length:7},(_,i)=>buildConcept(input,i));
  assert.equal(new Set(concepts.map(c=>c.design.layout)).size,7);
  assert.equal(new Set(concepts.map(c=>c.design.id)).size,7);
  for(const c of concepts){assert.equal(c.name,input.name);assert.equal(c.theme,"dark");assert.equal(c.palette,"Forest / lime");assert.deepEqual(c.features,["gallery"]);}
});
test("explicit composition, brand name and headline cues shape the result", () => {
  const c=buildConcept(draft({idea:'A minimal bento website for a café called "Cedar House". Use the headline "A table for everyone".'}));
  assert.equal(c.design.layout,"bento");
  assert.equal(c.name,"Cedar House");
  assert.deepEqual(c.headline,["A table for everyone"]);
  assert.ok(!c.design.description.includes(c.idea));
});
test("all directions are deterministic and the selected design travels with the enquiry", () => {
  const input=draft({idea:"A restaurant website with bookings"});
  assert.deepEqual(buildConcept(input,2),buildConcept(input,2));
  const c=buildConcept(input,2);
  assert.match(conceptBrief(c),new RegExp(c.design.id));
  assert.ok(conceptBrief(c).includes(c.design.label));
  assert.equal(buildConcept(input,NaN).design.variation,0);
});
