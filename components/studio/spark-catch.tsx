"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedIcon } from "./animated-icon";
import { advanceRound, CATCH_LINE, comboMultiplier, createRound, MAX_SPARKS, paddleWidth, ROUND_SECONDS, STARTING_LIVES, TIME_BONUSES, timeRemaining, type GamePhase } from "@/lib/spark-game";

const faces = ["front", "back", "left", "right", "top", "bottom"];
const scoreText = (n: number) => String(n).padStart(3, "0");

function SparkCube({ decorative = false }: { decorative?: boolean }) {
  return <span className={`spark-cube ${decorative ? "decorative-cube" : ""}`} aria-hidden="true">{faces.map((face) => <i key={face} className={`spark-face face-${face}`}><span className="spark-symbol">✦</span><span className="glitch-symbol">×</span><span className="time-symbol">◷</span></i>)}</span>;
}

export default function SparkCatch() {
  const round = useRef(createRound());
  const board = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const catcher = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const feedbackSlots = useRef<(HTMLSpanElement | null)[]>([]);
  const width = useRef(600), height = useRef(340);
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [hud, setHud] = useState({ score: 0, seconds: ROUND_SECONDS, lives: STARTING_LIVES, combo: 1, caught: 0, bonusSeconds: 0 });
  const [best, setBest] = useState(0);
  const bestRef = useRef(0);
  const lowMotion = useRef(false);
  const [announcement, setAnnouncement] = useState("");

  const pause = useCallback(() => {
    if (round.current.phase !== "playing") return;
    round.current.phase = "paused";
    round.current.axis = 0;
    setPhase("paused");
    setAnnouncement("Round paused. Your time and score are saved until you resume.");
  }, []);

  useEffect(() => {
    try { const stored = Number(localStorage.getItem("studio-spark-best")); if (Number.isFinite(stored) && stored > 0) { bestRef.current = stored; setBest(stored); } } catch {}
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const preferences = () => { lowMotion.current = media.matches || document.documentElement.dataset.motion === "off"; };
    preferences();
    const observer = new MutationObserver(preferences);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    media.addEventListener("change", preferences);
    const resize = new ResizeObserver(() => { if (field.current) { width.current = field.current.clientWidth; height.current = field.current.clientHeight; } });
    if (field.current) resize.observe(field.current);
    const visibility = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", pause);
    const intersection = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); }, { threshold: 0 });
    if (board.current) intersection.observe(board.current);
    return () => { observer.disconnect(); resize.disconnect(); intersection.disconnect(); media.removeEventListener("change", preferences); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("blur", pause); };
  }, [pause]);

  const clearScene = useCallback(() => {
    slots.current.forEach((slot) => { if (slot) slot.style.visibility = "hidden"; });
    feedbackSlots.current.forEach((slot) => { if (slot) slot.style.opacity = "0"; });
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    let frame = 0, previousTime = 0, lastHud = "", lastBonus = round.current.bonusSeconds;
    const loop = (now: number) => {
      const state = round.current;
      if (state.phase !== "playing") return;
      const dt = previousTime ? (now - previousTime) / 1000 : 0;
      previousTime = now;
      const updatedPhase = advanceRound(state, dt, width.current);
      const occupied = new Set<number>();
      state.items.forEach((item) => {
        const slot = slots.current[item.slot]; if (!slot) return;
        occupied.add(item.slot);
        slot.style.visibility = "visible";
        slot.dataset.kind = item.kind === "spark" && item.id % 2 ? "violet" : item.kind;
        if (item.kind === "time") (slot.lastElementChild as HTMLElement).textContent = `+${item.bonusSeconds}s`;
        const z = -85 * (1 - Math.min(1, item.y / CATCH_LINE));
        slot.style.transform = `translate3d(${item.x * width.current}px, ${item.y * height.current}px, ${lowMotion.current ? 0 : z}px)`;
        const cube = slot.firstElementChild as HTMLElement;
        cube.style.transform = lowMotion.current ? "rotateX(-12deg) rotateY(24deg) rotateZ(-12deg)" : `rotateX(${-18 + Math.sin(now * 0.001 + item.id) * 13}deg) rotateY(${item.spin + now * 0.025}deg) rotateZ(${item.spin * 0.2}deg)`;
      });
      slots.current.forEach((slot, i) => { if (slot && !occupied.has(i)) slot.style.visibility = "hidden"; });
      if (catcher.current) {
        catcher.current.style.width = `${paddleWidth(width.current)}px`;
        catcher.current.style.transform = `translate3d(${state.paddle * width.current}px, ${CATCH_LINE * height.current}px, 0)`;
      }
      feedbackSlots.current.forEach((slot, i) => {
        if (!slot) return;
        const effect = state.effects[i];
        slot.style.opacity = effect ? String(Math.min(1, effect.life * 3)) : "0";
        if (effect) {
          slot.textContent = effect.kind === "glitch" ? "−1 life" : effect.kind === "time" ? `+${effect.bonusSeconds}s` : `+${effect.points}`;
          slot.dataset.kind = effect.kind;
          slot.style.transform = `translate(${effect.x * width.current}px, ${(CATCH_LINE - 0.05) * height.current - (lowMotion.current ? 0 : (0.75 - effect.life) * 42)}px)`;
        }
      });
      const seconds = Math.ceil(timeRemaining(state));
      const nextHud = [state.score, seconds, state.lives, comboMultiplier(state.combo), state.caught, state.bonusSeconds].join("/");
      if (nextHud !== lastHud) { lastHud = nextHud; setHud({ score: state.score, seconds, lives: state.lives, combo: comboMultiplier(state.combo), caught: state.caught, bonusSeconds: state.bonusSeconds }); }
      if (state.bonusSeconds > lastBonus) { setAnnouncement(`Time drop caught. ${state.bonusSeconds - lastBonus} seconds added. ${seconds} seconds remaining.`); lastBonus = state.bonusSeconds; }
      if (updatedPhase === "finished") {
        if (state.score > bestRef.current) {
          bestRef.current = state.score; setBest(state.score);
          try { localStorage.setItem("studio-spark-best", String(state.score)); } catch {}
        }
        setPhase("finished");
        setAnnouncement(`Round complete. ${state.score} points, ${state.caught} sparks caught. Your best is ${bestRef.current} points. Choose Play again for another round.`);
        clearScene();
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase, clearScene]);

  function start() {
    clearScene(); round.current = createRound(Date.now()); round.current.phase = "playing";
    setHud({ score: 0, seconds: ROUND_SECONDS, lives: STARTING_LIVES, combo: 1, caught: 0, bonusSeconds: 0 });
    setPhase("playing"); setAnnouncement("Round started. Catch sparks and gold time drops worth one to four extra seconds. Avoid the coral cubes marked with a cross.");
    board.current?.focus({ preventScroll: true });
  }
  function resume() { if (round.current.phase !== "paused") return; round.current.phase = "playing"; setPhase("playing"); setAnnouncement("Round resumed."); board.current?.focus({ preventScroll: true }); }
  function steer(clientX: number) {
    if (round.current.phase !== "playing" || !field.current) return;
    const rect = field.current.getBoundingClientRect();
    round.current.target = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    round.current.axis = 0;
  }
  const resultTitle = hud.score >= 240 ? "A mind full of bright ideas." : hud.score >= 100 ? "That’s a good spark." : "Every big idea starts small.";

  return <section className="spark-section section-wrap" id="spark-catch" aria-labelledby="spark-title">
    <div className="spark-intro">
      <span className="eyebrow"><span className="tiny-square"/>A LITTLE PLAY. A DIFFERENT PERSPECTIVE.</span>
      <h2 id="spark-title">Catch a little<br/><span className="serif-word">inspiration.</span></h2>
      <p>Big ideas often start with a little play. Take thirty seconds, follow your curiosity, and see what you can catch.</p>
      <div className="spark-rule"><span className="rule-token token-good">✦</span><div><b>Catch the bright ideas.</b><small>Every spark adds points. Build a streak for up to 3×.</small></div></div>
      <div className="spark-rule"><span className="rule-token token-time" aria-hidden="true">◷</span><div><b>A little extra time.</b><small>Catch a gold clock to add its time to your timer.</small><div className="spark-time-values" aria-label="Time drops add 1, 2, 3 or 4 seconds">{TIME_BONUSES.map((seconds)=><span key={seconds}>+{seconds}s</span>)}</div></div></div>
      <div className="spark-rule"><span className="rule-token token-glitch">×</span><div><b>Give the glitches some space.</b><small>A coral cross costs one of your three chances.</small></div></div>
      <div className="spark-inputs"><span><span aria-hidden="true">↔</span> Move your cursor</span><span><kbd>←</kbd><kbd>→</kbd> Arrow keys</span><span>or drag on touch</span></div>
      <p className="spark-private-note">JUST FOR FUN · NO DOWNLOAD · NO SIGN-UP</p>
    </div>
    <div className={`spark-arcade phase-${phase}`}>
      <div className="spark-arcade-top"><span><i/>SPARK CATCH <small>ARCADE / 01</small></span><span>YOUR BEST <b>{scoreText(best)}</b></span></div>
      <div className="spark-hud" aria-label="Game statistics"><div><span>SCORE</span><b>{scoreText(hud.score)}</b></div><div><span>TIME LEFT</span><b role="timer" aria-live="off" aria-label={`${hud.seconds} seconds remaining`} className={hud.seconds <= 5 ? "time-short" : ""}>{String(hud.seconds).padStart(2,"0")}<small>s</small></b>{hud.bonusSeconds > 0 && <span key={hud.bonusSeconds} className="spark-time-earned">+{hud.bonusSeconds}s earned</span>}</div><div className="spark-lives"><span>CHANCES</span><div aria-label={`${hud.lives} chances remaining`}>{Array.from({length:STARTING_LIVES},(_,i)=><i key={i} className={i < hud.lives ? "full" : ""}>✦</i>)}</div></div><div className="spark-combo"><span>STREAK</span><b>×{hud.combo}</b></div></div>
      <div ref={board} className="spark-board" tabIndex={0} role="group" aria-label="Spark Catch game board" aria-describedby="spark-controls" data-running={phase === "playing"}
        onPointerMove={(e) => steer(e.clientX)}
        onPointerDown={(e) => { if (round.current.phase !== "playing" || e.button !== 0) return; steer(e.clientX); e.currentTarget.focus({preventScroll:true}); e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerUp={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
        onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); if (round.current.phase === "playing") round.current.axis = e.key === "ArrowLeft" ? -1 : 1; } if (e.code === "Space") { e.preventDefault(); if(round.current.phase === "playing") pause(); else if(round.current.phase === "paused") resume(); } }}
        onKeyUp={(e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") round.current.axis = 0; }}
        onBlur={() => { round.current.axis = 0; }}>
        <div ref={field} className="spark-field" aria-hidden="true">
          <div className="spark-horizon"/><div className="spark-grid"/><div className="spark-catch-line"/>
          {Array.from({length:MAX_SPARKS},(_,i)=><div key={i} ref={(el)=>{slots.current[i]=el;}} className="falling-spark"><SparkCube/><span className="spark-time-label"/></div>)}
          <div ref={catcher} className="spark-catcher"><div className="catcher-mouth"/><div className="catcher-body"><i/><i/></div><span>YOU</span></div>
          {Array.from({length:4},(_,i)=><span key={i} className="spark-catch-feedback" ref={(el)=>{feedbackSlots.current[i]=el;}}/>)}
        </div>
        {phase !== "playing" && <div className="spark-overlay">
          {phase === "ready" && <><div className="spark-trophy"><SparkCube decorative/><span className="trophy-orbit"/></div><span className="spark-overlay-kicker">THIRTY SECONDS. ENDLESS CURIOSITY.</span><h3>Good ideas<br/><span>move fast.</span></h3><p>Catch the sparks. Dodge the glitches.<br/>Gold clocks give you +1s, +2s, +3s or +4s.</p><button className="spark-play" onClick={start}><span className="play-triangle"/>Play a round<AnimatedIcon name="arrow" size={17}/></button></>}
          {phase === "paused" && <><span className="spark-pause-symbol" aria-hidden="true"><i/><i/></span><span className="spark-overlay-kicker">TAKE YOUR TIME</span><h3>A little<br/><span>breathing room.</span></h3><p>Your score and timer are waiting for you.</p><button className="spark-play" onClick={resume}><span className="play-triangle"/>Keep catching<AnimatedIcon name="arrow" size={17}/></button></>}
          {phase === "finished" && <><span className="spark-overlay-kicker">{round.current.endedBy === "time" ? "TIME WELL PLAYED" : "A FEW GLITCHES. ANOTHER CHANCE."}</span><div className="spark-result-score">{scoreText(hud.score)}<small>POINTS</small></div><h3 className="spark-result-title">{resultTitle}</h3><p>{hud.caught} sparks caught · Best {scoreText(best)}{hud.bonusSeconds > 0 && <><br/>+{hud.bonusSeconds}s earned from time drops</>}</p><div className="spark-end-actions"><button className="spark-play" onClick={start}><AnimatedIcon name="reset" size={16}/>Play again</button><Link href="/contact">Let’s build something real<AnimatedIcon name="arrow" size={14}/></Link></div></>}
        </div>}
      </div>
      <div className="spark-arcade-bottom"><p id="spark-controls">{phase === "playing" ? "Move or drag to catch · ← → to steer · Space to pause" : "Start with 30s · Catch gold clocks for extra time"}</p><div><button onClick={phase === "paused" ? resume : pause} disabled={phase !== "playing" && phase !== "paused"} aria-label={phase === "paused" ? "Resume Spark Catch" : "Pause Spark Catch"}><i className={phase === "paused" ? "play-triangle" : "pause-bars"} aria-hidden="true"/><span className="spark-control-label">{phase === "paused" ? "Resume" : "Pause"}</span></button><button onClick={start} disabled={phase === "ready"} aria-label="Restart Spark Catch"><AnimatedIcon name="reset" size={14}/><span className="spark-control-label">Restart</span></button></div></div>
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    </div>
  </section>;
}
