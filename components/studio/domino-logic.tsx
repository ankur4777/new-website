"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatedIcon } from "./animated-icon";
import { applyHint, canPlace, DIFFICULTIES, inspectBoard, placementCells, PUZZLES, readProgress, REGION_COLORS, ruleDescription, ruleSymbol, type Difficulty, type Placement } from "@/lib/domino-logic";

const SAVE_KEY = "studio-domino-logic-v1";
const DIRECTIONS = ["right", "down", "left", "up"];
const ARROWS = ["→", "↓", "←", "↑"];
const PIPS = [[], [4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];
function PipFace({ value }: { value: number }) {
  return <span className="logic-pips" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} className={PIPS[value].includes(i) ? "on" : ""} />)}</span>;
}
type Game = { levelId: number; placements: Placement[]; history: Placement[][]; selected: string | null; rotation: number; moves: number; hints: number };
function freshGame(levelId: number, placements: Placement[] = []): Game { return { levelId, placements, history: [], selected: null, rotation: 0, moves: 0, hints: 0 }; }

export default function DominoLogic() {
  const [game, setGame] = useState<Game>(() => freshGame(1));
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Choose a domino, then choose a space on the board.");
  const [hovered, setHovered] = useState<number | null>(null);
  const [focusCell, setFocusCell] = useState(0);
  const [showChecks, setShowChecks] = useState(false);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const help = useRef<HTMLDialogElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const puzzle = PUZZLES[game.levelId - 1];
  const inspection = useMemo(() => inspectBoard(puzzle, game.placements), [puzzle, game.placements]);
  const selectedTile = puzzle.tiles.find(tile => tile.id === game.selected);
  const activeLevels = PUZZLES.filter(level => level.difficulty === puzzle.difficulty);
  const placedIds = new Set(game.placements.map(p => p.tileId));
  const candidate = selectedTile && hovered !== null ? { tileId: selectedTile.id, cell: hovered, rotation: game.rotation } : null;
  const ghostCells = candidate ? placementCells(puzzle, candidate) : null;
  const validGhost = candidate ? canPlace(puzzle, game.placements, candidate) : false;
  const goodRegions = inspection.regions.filter(r => r.status === "good").length;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY), saved = raw ? readProgress(JSON.parse(raw)) : null;
      if (saved) { setGame({ ...freshGame(saved.levelId, saved.placements), moves: saved.moves, hints: saved.hints }); setCompleted(saved.completed); setFocusCell(PUZZLES[saved.levelId - 1].cells.findIndex(c => c !== null)); }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ levelId: game.levelId, placements: game.placements, moves: game.moves, hints: game.hints, completed })); } catch {}
  }, [loaded, game.levelId, game.placements, game.moves, game.hints, completed]);
  useEffect(() => {
    if (!inspection.solved) return;
    setCompleted(previous => previous.includes(puzzle.id) ? previous : [...previous, puzzle.id]);
    setMessage(`Level ${puzzle.id} complete. Every piece fits and every region works. Choose the next level when you’re ready.`);
  }, [inspection.solved, puzzle.id]);

  function chooseLevel(id: number) {
    setGame(freshGame(id)); setHovered(null); setFocusCell(PUZZLES[id - 1].cells.findIndex(c => c !== null)); setShowChecks(false);
    setMessage(`Level ${id}: ${PUZZLES[id - 1].name}. Choose a domino to begin.`);
  }
  function chooseDifficulty(difficulty: Difficulty) {
    const levels = PUZZLES.filter(p => p.difficulty === difficulty);
    chooseLevel((levels.find(p => !completed.includes(p.id)) ?? levels[0]).id);
  }
  function rotate() {
    if (!game.selected || inspection.solved) return;
    setGame(previous => ({ ...previous, rotation: (previous.rotation + 1) % 4 }));
    setMessage(`Domino turned to face ${DIRECTIONS[(game.rotation + 1) % 4]}. Choose its first space.`);
  }
  function select(tileId: string) {
    if (game.selected === tileId) { rotate(); return; }
    const tile = puzzle.tiles.find(t => t.id === tileId)!;
    setGame(previous => ({ ...previous, selected: tileId, rotation: 0 }));
    setMessage(`${tile.a} / ${tile.b} selected. Place its ${tile.a} end first; the ${tile.b} end will face right. Tap it again or use Rotate to turn it.`);
  }
  function commit(placements: Placement[], extra: Partial<Game> = {}) {
    setGame(previous => ({ ...previous, placements, history: [...previous.history.slice(-79), previous.placements], moves: previous.moves + 1, ...extra }));
    setShowChecks(false);
  }
  function returnTile(tileId: string) {
    if (inspection.solved) return;
    commit(game.placements.filter(p => p.tileId !== tileId));
    setMessage("Domino returned to the tray. Choose it again to try another position.");
  }
  function place(cell: number) {
    if (inspection.solved) return;
    const existing = game.placements.find(p => placementCells(puzzle, p)?.includes(cell));
    if (existing && !game.selected) { returnTile(existing.tileId); return; }
    if (!game.selected) { setMessage("Choose a domino from the tray first."); return; }
    const next = { tileId: game.selected, cell, rotation: game.rotation };
    if (!canPlace(puzzle, game.placements, next)) { setMessage("That domino needs two empty neighboring spaces. Try another spot or rotate it."); return; }
    commit([...game.placements, next], { selected: null });
    setMessage("Placed. Choose another domino, or tap a placed piece to return it.");
  }
  function undo() {
    const previous = game.history.at(-1);
    if (!previous) return;
    setGame(g => ({ ...g, placements: previous, history: g.history.slice(0, -1), selected: null, moves: g.moves + 1 }));
    setShowChecks(false); setMessage("Last move undone.");
  }
  function hint() {
    const result = applyHint(puzzle, game.placements);
    commit(result.placements, { selected: null, hints: game.hints + 1 });
    setMessage(result.removed ? `One piece placed for you. ${result.removed} conflicting ${result.removed === 1 ? "piece returned" : "pieces returned"} to the tray. Undo brings them back.` : "One piece placed for you. Follow its connections, or undo to try it yourself.");
  }
  function check() {
    setShowChecks(true);
    const bad = inspection.regions.filter(r => r.status === "bad").length;
    setMessage(bad ? `${bad} ${bad === 1 ? "region needs" : "regions need"} another look. Check the highlighted rules below the board.` : game.placements.length < puzzle.tiles.length ? "So far, so good. Fill every space to finish; incomplete regions still need their remaining dots." : "Every piece fits and every region works. Nicely connected.");
  }
  function boardKey(event: KeyboardEvent<HTMLButtonElement>, cell: number) {
    if (event.key.toLowerCase() === "r") { event.preventDefault(); rotate(); return; }
    if (event.key === "Escape") { setGame(g => ({ ...g, selected: null })); return; }
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault(); const p = game.placements.find(p => placementCells(puzzle, p)?.includes(cell)); if (p) returnTile(p.tileId); return;
    }
    const direction = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: puzzle.width, ArrowUp: -puzzle.width }[event.key];
    if (!direction) return;
    event.preventDefault();
    let next = cell + direction;
    while (next >= 0 && next < puzzle.cells.length && puzzle.cells[next] === null) next += direction;
    if (next >= 0 && next < puzzle.cells.length && (Math.abs(direction) !== 1 || Math.floor(next / puzzle.width) === Math.floor(cell / puzzle.width))) { setFocusCell(next); cells.current[next]?.focus(); }
  }
  function closeHelp() { help.current?.close(); helpButton.current?.focus(); }
  const nextLevel = game.levelId < PUZZLES.length ? game.levelId + 1 : 1;

  return <section className="logic-section section-wrap" id="domino-logic" aria-labelledby="logic-title">
    <div className="logic-heading"><div><span className="eyebrow"><span className="tiny-square"/>A DIFFERENT WAY TO CONNECT THE DOTS</span><h2 id="logic-title">Small pieces.<br/><span className="serif-word">Bigger picture.</span></h2></div><div className="logic-heading-note"><span className="logic-heading-mark" aria-hidden="true"><PipFace value={3}/><PipFace value={2}/></span><p>A domino logic puzzle for curious minds. Fit the pieces. Follow the colors. Find your moment of clarity.</p><span>18 LEVELS · 3 DIFFICULTIES · YOUR OWN PACE</span></div></div>
    <div className={`logic-game ${inspection.solved ? "is-solved" : ""}`}>
      <div className="logic-topline"><span className="logic-wordmark"><AnimatedIcon name="layers" size={19}/>DOT <i>/</i> LOGIC <small>THE THINKING ROOM</small></span><button ref={helpButton} className="logic-help-button" onClick={() => help.current?.showModal()}><span aria-hidden="true">?</span>How to play</button></div>
      <div className="logic-level-controls"><div className="logic-difficulties" role="group" aria-label="Puzzle difficulty">{DIFFICULTIES.map(difficulty => <button key={difficulty} aria-pressed={puzzle.difficulty === difficulty} className={puzzle.difficulty === difficulty ? "active" : ""} onClick={() => chooseDifficulty(difficulty)}><i data-difficulty={difficulty}/>{difficulty}</button>)}</div><div className="logic-levels" role="group" aria-label={`${puzzle.difficulty} levels`}>{activeLevels.map(level => <button key={level.id} aria-label={`Level ${level.id}: ${level.name}${completed.includes(level.id) ? ", completed" : ""}`} aria-pressed={level.id === puzzle.id} className={`${level.id === puzzle.id ? "active" : ""} ${completed.includes(level.id) ? "completed" : ""}`} onClick={() => chooseLevel(level.id)}>{String(level.id).padStart(2, "0")}{completed.includes(level.id) && <span aria-hidden="true">✓</span>}</button>)}</div><span className="logic-total">{completed.length}<i>/18</i> complete</span></div>
      <div className="logic-game-layout">
        <div className="logic-board-column"><div className="logic-puzzle-title"><div><span>LEVEL {String(puzzle.id).padStart(2, "0")} / {puzzle.difficulty.toUpperCase()}</span><h3>{puzzle.name}</h3></div><span className="logic-pieces-count"><b>{game.placements.length}</b>/{puzzle.tiles.length}<small>PIECES PLACED</small></span></div>
          <div className="logic-board-stage">
            <div className="logic-board" role="group" aria-label="Domino puzzle board" aria-describedby="logic-controls" onPointerLeave={() => setHovered(null)} style={{ "--logic-columns": puzzle.width, "--logic-rows": puzzle.height } as CSSProperties}>
              {puzzle.cells.map((regionId, cell) => {
                if (regionId === null) return null;
                const region = puzzle.regions.find(r => r.id === regionId)!;
                const occupied = inspection.values[cell] !== null;
                const ghost = ghostCells?.includes(cell);
                return <button key={cell} ref={el => { cells.current[cell] = el; }} className={`logic-cell ${ghost ? validGhost ? "ghost-good" : "ghost-bad" : ""}`} style={{ gridColumn: cell % puzzle.width + 1, gridRow: Math.floor(cell / puzzle.width) + 1, "--region": REGION_COLORS[region.color % REGION_COLORS.length] } as CSSProperties} tabIndex={focusCell === cell ? 0 : -1} onFocus={() => { setHovered(cell); setFocusCell(cell); }} onPointerEnter={() => setHovered(cell)} onClick={() => place(cell)} onKeyDown={e => boardKey(e, cell)} disabled={inspection.solved} aria-label={`Row ${Math.floor(cell / puzzle.width) + 1}, column ${cell % puzzle.width + 1}, region ${regionId}. ${occupied ? `${inspection.values[cell]} dots. Return domino to tray` : "Empty. Place selected domino"}. ${ruleDescription(region)}.`}><span className="logic-region-letter" aria-hidden="true">{regionId}</span>{ghost && !occupied && <span className="logic-ghost-dots"><PipFace value={cell === candidate?.cell ? selectedTile!.a : selectedTile!.b}/></span>}</button>;
              })}
              {game.placements.map(placement => {
                const tile = puzzle.tiles.find(t => t.id === placement.tileId)!;
                const ends = placementCells(puzzle, placement)!;
                const vertical = placement.rotation % 2 === 1;
                const reversed = placement.rotation >= 2;
                const start = Math.min(...ends);
                return <button key={tile.id} className={`logic-placed-tile ${vertical ? "vertical" : ""}`} style={{ gridColumn: `${start % puzzle.width + 1} / span ${vertical ? 1 : 2}`, gridRow: `${Math.floor(start / puzzle.width) + 1} / span ${vertical ? 2 : 1}` }} tabIndex={-1} disabled={inspection.solved} aria-label={`Return domino ${tile.a} / ${tile.b} to tray`} onClick={() => returnTile(tile.id)}><PipFace value={reversed ? tile.b : tile.a}/><span className="logic-divider"/><PipFace value={reversed ? tile.a : tile.b}/></button>;
              })}
              {puzzle.regions.filter(r => r.kind !== "none").map(region => {
                const cell = region.cells.at(-1)!;
                const status = inspection.regions.find(r => r.region.id === region.id)!.status;
                return <span key={region.id} className={`logic-region-badge ${status === "good" ? "met" : ""}`} aria-hidden="true" style={{ gridColumn: cell % puzzle.width + 1, gridRow: Math.floor(cell / puzzle.width) + 1 }}>{ruleSymbol(region)}</span>;
              })}
            </div>
          </div>
          <div className="logic-region-heading"><span>THE COLOR CONDITIONS</span><b>{goodRegions}/{puzzle.regions.length} met</b></div>
          <div className="logic-region-list">{inspection.regions.map(({ region, filled, sum, status }) => <div key={region.id} className={`logic-region-rule ${status === "good" ? "good" : showChecks && status === "bad" ? "bad" : ""}`} style={{ "--region": REGION_COLORS[region.color % REGION_COLORS.length] } as CSSProperties}><span className="logic-rule-color">{region.id}</span><span><b>{ruleSymbol(region)}</b><small>{ruleDescription(region)}</small></span><span className="logic-rule-status" aria-label={`Region ${region.id}: ${status === "good" ? "condition met" : showChecks && status === "bad" ? "needs attention" : "in progress"}`}>{status === "good" ? "✓" : showChecks && status === "bad" ? "!" : <><b>{sum}</b><small>{filled}/{region.cells.length}</small></>}</span></div>)}</div>
        </div>
        <div className="logic-tray-column"><div className="logic-tray-heading"><span>YOUR PIECES</span><b>{puzzle.tiles.length - game.placements.length} left to connect</b></div><p className="logic-tray-instruction">Choose a piece. Tap it again to rotate.<br/>Then tap its first space on the board.</p>
          <div className="logic-tray" role="group" aria-label="Domino tray">{puzzle.tiles.map(tile => <button key={tile.id} disabled={placedIds.has(tile.id) || inspection.solved} aria-label={`Domino ${tile.a} / ${tile.b}, piece ${tile.id.slice(1)}${placedIds.has(tile.id) ? ", placed" : ""}`} aria-pressed={game.selected === tile.id} className={`logic-tray-tile ${game.selected === tile.id ? "selected" : ""} ${placedIds.has(tile.id) ? "placed" : ""}`} onClick={() => select(tile.id)}><PipFace value={tile.a}/><span className="logic-divider"/><PipFace value={tile.b}/>{placedIds.has(tile.id) && <span className="logic-tile-check" aria-hidden="true">✓</span>}</button>)}</div>
          <div className={`logic-selection ${selectedTile ? "has-selection" : ""}`}><span>{selectedTile ? `${selectedTile.a} / ${selectedTile.b}` : "Your next move"}</span><b>{selectedTile ? <>{ARROWS[game.rotation]} <small>FACING {DIRECTIONS[game.rotation].toUpperCase()}</small></> : <small>START WITH A PIECE</small>}</b><button onClick={rotate} disabled={!selectedTile || inspection.solved} aria-label="Rotate selected domino"><AnimatedIcon name="reset" size={17}/>Rotate 90°</button></div>
          <div className="logic-actions"><button onClick={undo} disabled={!game.history.length}><AnimatedIcon name="process" size={16}/>Undo</button><button onClick={hint} disabled={inspection.solved}><AnimatedIcon name="studio" size={16}/>Hint</button><button onClick={check} disabled={inspection.solved}><AnimatedIcon name="check" size={16}/>Check</button><button onClick={() => { setGame(freshGame(puzzle.id)); setShowChecks(false); setMessage("A fresh board. Your completed levels are saved."); }} disabled={!game.placements.length && !game.selected}><AnimatedIcon name="reset" size={16}/>Reset</button></div>
          <div className={`logic-message ${inspection.solved ? "success" : ""}`} role="status" aria-live="polite">{inspection.solved && <AnimatedIcon name="check" size={20}/>}<p>{message}</p></div>
          {inspection.solved ? <div className="logic-complete"><span>PIECES CONNECTED. PERSPECTIVE FOUND.</span><h4>That all adds up.</h4><p>{game.moves} moves · {game.hints} {game.hints === 1 ? "hint" : "hints"} used</p><button onClick={() => chooseLevel(nextLevel)}>{puzzle.id === 18 ? "Play from the beginning" : "Next level"}<AnimatedIcon name="arrow" size={16}/></button></div> : <div className="logic-small-note"><span aria-hidden="true">✳</span><p>A different angle often helps.<br/>No clock. Just a little curiosity.</p></div>}
        </div>
      </div>
      <div className="logic-bottom"><p id="logic-controls">Select → rotate → place. Tap a placed piece to lift it. Keyboard: arrows to move, Enter to place, R to rotate.</p><span>Progress saved in this browser</span></div>
    </div>
    <dialog ref={help} className="logic-help" aria-labelledby="logic-help-title"><button className="logic-help-close" onClick={closeHelp} aria-label="Close how to play" autoFocus><AnimatedIcon name="close" size={22}/></button><span className="logic-help-kicker">DOT / LOGIC · A LITTLE GUIDANCE</span><h3 id="logic-help-title">Make every<br/><em>piece count.</em></h3><p>Fill every colored space with the dominoes in your tray. Every region must meet its own condition.</p><ol><li><b>Choose a domino.</b> Its two numbers stay together.</li><li><b>Find the right angle.</b> Tap the selected piece again, use Rotate, or press R. The arrow shows where its second end will go.</li><li><b>Place it.</b> Tap the first space. Both spaces must be empty and share an edge. A domino can cross between colors.</li><li><b>Follow the colors.</b> The rule counts every dot inside that region, even when pieces cross its border.</li></ol><div className="logic-help-rules"><p><b>Σ7</b><span>All dots in this color add up to 7.</span></p><p><b>=</b><span>Every number in this color is the same.</span></p><p><b>≠</b><span>Every number in this color is different.</span></p><p><b>&lt;7 / &gt;7</b><span>The total is below / above 7.</span></p><p><b>·</b><span>No condition. Any numbers fit.</span></p></div><p className="logic-help-last">Zero is a blank half with no dots. Use Undo freely, or Hint for one helpful placement. All 18 levels are ready to explore.</p><button className="logic-help-start" onClick={closeHelp}>Let’s connect the dots<AnimatedIcon name="arrow" size={17}/></button></dialog>
  </section>;
}
