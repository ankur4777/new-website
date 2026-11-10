import test from "node:test";
import assert from "node:assert/strict";
import { advanceRound, createRound, ROUND_SECONDS, CATCH_LINE, MAX_SPARKS } from "../lib/spark-game.ts";

function playing() { const r=createRound(42); r.phase="playing"; r.spawnIn=100; return r; }
function atCatcher(id=0,glitch=false) { return {id,slot:0,x:0.5,y:CATCH_LINE-0.001,speed:0.3,spin:0,glitch}; }

test("catching sparks awards points and builds a multiplier",()=>{
  const r=playing();
  for(let i=0;i<4;i++){r.items=[atCatcher(i)];advanceRound(r,0.04,600);}
  assert.equal(r.caught,4); assert.equal(r.combo,4); assert.equal(r.score,50); assert.equal(r.items.length,0);
});
test("a glitch breaks the streak and the third ends the round",()=>{
  const r=playing();r.score=40;r.combo=6;
  for(let i=0;i<3;i++){r.items=[atCatcher(i,true)];advanceRound(r,0.04,600);}
  assert.equal(r.lives,0);assert.equal(r.combo,0);assert.equal(r.phase,"finished");assert.equal(r.endedBy,"glitches");assert.equal(r.score,25);
});
test("paused and finished rounds cannot advance time or score",()=>{
  const r=playing();r.phase="paused";r.items=[atCatcher()];advanceRound(r,0.04);
  assert.equal(r.elapsed,0);assert.equal(r.score,0);r.phase="finished";advanceRound(r,0.04);assert.equal(r.elapsed,0);
});
test("a full round ends at thirty seconds",()=>{
  const r=playing();for(let i=0;i<751;i++)advanceRound(r,0.04);
  assert.equal(r.elapsed,ROUND_SECONDS);assert.equal(r.phase,"finished");assert.equal(r.endedBy,"time");
});
test("missed sparks reset a streak without taking a life",()=>{
  const r=playing();r.combo=5;r.items=[{...atCatcher(),x:0.03,y:1.099}];advanceRound(r,0.04);
  assert.equal(r.combo,0);assert.equal(r.lives,3);assert.equal(r.score,0);
});
test("keyboard movement remains inside the responsive board",()=>{
  const r=playing();r.axis=-1;for(let i=0;i<60;i++)advanceRound(r,0.04,320);assert(r.paddle>0);
  r.axis=1;for(let i=0;i<60;i++)advanceRound(r,0.04,320);assert(r.paddle<1);
});
test("spawn slots remain unique and simulation is reproducible",()=>{
  const a=createRound(900),b=createRound(900);a.phase=b.phase="playing";
  for(let i=0;i<700;i++){advanceRound(a,0.04);advanceRound(b,0.04);assert(a.items.length<=MAX_SPARKS);assert.equal(new Set(a.items.map(x=>x.slot)).size,a.items.length);}
  assert.deepEqual(a,b);
});

test("a slow animation frame advances real time and still catches crossed sparks",()=>{
  const r=playing();r.items=[{...atCatcher(),y:0.1}];advanceRound(r,3,600);
  assert(Math.abs(r.elapsed-3)<1e-8);assert.equal(r.caught,1);assert.equal(r.score,10);
});
test("a long frame cannot extend a round beyond thirty seconds",()=>{
  const r=playing();advanceRound(r,45);
  assert.equal(r.elapsed,30);assert.equal(r.phase,"finished");
});
