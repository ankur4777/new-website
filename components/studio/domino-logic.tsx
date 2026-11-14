"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatedIcon } from "./animated-icon";
import { applyHint, canPlace, DIFFICULTIES, dragPlacementAtPoint, inspectBoard, movePlacement, placementCells, PUZZLES, readProgress, REGION_COLORS, rotatePlacement, ruleDescription, ruleSymbol, type Difficulty, type Placement, type BoardGeometry } from "@/lib/domino-logic";

const SAVE_KEY = "studio-domino-logic-v1";
const TRAY_PAGE_SIZE = 4;
const RULE_KEYS = { sum: ["Σ", "Add the dots"], equal: ["=", "Same number"], different: ["≠", "All different"], less: ["<", "Total below"], greater: [">", "Total above"], none: ["·", "Any number"] };
const DIRECTIONS = ["right", "down", "left", "up"];
const ARROWS = ["→", "↓", "←", "↑"];
const PIPS = [[], [4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];
function PipFace({ value }: { value: number }) {
  return <span className="logic-pips" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} className={PIPS[value].includes(i) ? "on" : ""} />)}</span>;
}
function TileFaces({ a, b, rotation }: { a: number; b: number; rotation: number }) {
  return <><PipFace value={rotation >= 2 ? b : a}/><span className="logic-divider"/><PipFace value={rotation >= 2 ? a : b}/></>;
}
function FocusPortal({ active, children }: { active: boolean; children: ReactNode }) {
  return active ? createPortal(children, document.body) : children;
}
type Game = { levelId: number; placements: Placement[]; history: Placement[][]; selected: string | null; rotation: number; orientations: Record<string, number>; moves: number; hints: number };
function freshGame(levelId: number, placements: Placement[] = []): Game { return { levelId, placements, history: [], selected: null, rotation: 0, orientations: {}, moves: 0, hints: 0 }; }
type DragSession = { pointerId: number; tileId: string; rotation: number; startX: number; startY: number; x: number; y: number; grabX: number; grabY: number; active: boolean; fromBoard: boolean; source: HTMLButtonElement };
type DragVisual = ReturnType<typeof dragPlacementAtPoint> & { tileId: string; rotation: number; valid: boolean };

export default function DominoLogic() {
  const [game, setGame] = useState<Game>(() => freshGame(1));
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Drag a piece onto two empty squares. Tap it to rotate, and use Undo whenever you need.");
  const [feedback, setFeedback] = useState<"info" | "error" | "success">("info");
  const [hovered, setHovered] = useState<number | null>(null);
  const [focusCell, setFocusCell] = useState(0);
  const [showChecks, setShowChecks] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [drag, setDrag] = useState<DragVisual | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [trayPage, setTrayPage] = useState(0);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const board = useRef<HTMLDivElement>(null);
  const shelf = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const session = useRef<DragSession | null>(null);
  const help = useRef<HTMLDialogElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const puzzle = PUZZLES[game.levelId - 1];
  const inspection = useMemo(() => inspectBoard(puzzle, game.placements), [puzzle, game.placements]);
  const selectedTile = puzzle.tiles.find(tile => tile.id === game.selected);
  const selectedPlacement = game.placements.find(p => p.tileId === game.selected);
  const activeLevels = PUZZLES.filter(level => level.difficulty === puzzle.difficulty);
  const placedIds = new Set(game.placements.map(p => p.tileId));
  const candidate = drag ? drag.placement : selectedTile && !selectedPlacement && hovered !== null ? { tileId: selectedTile.id, cell: hovered, rotation: game.rotation } : null;
  const ghostCells = candidate ? placementCells(puzzle, candidate) : null;
  const ghostTile = puzzle.tiles.find(tile => tile.id === candidate?.tileId);
  const validGhost = drag ? drag.valid : candidate ? canPlace(puzzle, game.placements, candidate) : false;
  const goodRegions = inspection.regions.filter(r => r.status === "good").length;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY), saved = raw ? readProgress(JSON.parse(raw)) : null;
      if (saved) { setGame({ ...freshGame(saved.levelId, saved.placements), moves: saved.moves, hints: saved.hints, orientations: saved.orientations }); setCompleted(saved.completed); setFocusCell(PUZZLES[saved.levelId - 1].cells.findIndex(c => c !== null)); }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!expanded) { if (restoreFocus.current) { expandButton.current?.focus({ preventScroll: true }); restoreFocus.current = false; } return; }
    restoreFocus.current = true;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    expandButton.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ levelId: game.levelId, placements: game.placements, moves: game.moves, hints: game.hints, orientations: game.orientations, completed })); } catch {}
  }, [loaded, game.levelId, game.placements, game.moves, game.hints, game.orientations, completed]);
  useEffect(() => {
    if (!inspection.solved) return;
    setCompleted(previous => previous.includes(puzzle.id) ? previous : [...previous, puzzle.id]);
    notify(`Level ${puzzle.id} complete. Every piece fits and every region works. Choose the next level when you’re ready.`, "success");
  }, [inspection.solved, puzzle.id]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) cancelDrag(); };
    const blur = () => cancelDrag();
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    return () => { document.removeEventListener("visibilitychange", visibility); window.removeEventListener("blur", blur); };
  }, []);

  function notify(text: string, tone: "info" | "error" | "success" = "info") {
    setMessage(text); setFeedback(tone);
  }
  function clearBoard() {
    cancelDrag(false); setHovered(null);
    commit([], { selected: null });
    notify("Board cleared. Changed your mind? Undo will bring your pieces back.");
  }

  function cancelDrag(announce = true) {
    const current = session.current;
    session.current = null; setDrag(null);
    if (!current) return;
    if (current.source.hasPointerCapture(current.pointerId)) current.source.releasePointerCapture(current.pointerId);
    if (announce && current.active) notify("Move canceled. Your pieces stayed where they were.");
  }
  function geometry(): BoardGeometry | null {
    if (!board.current) return null;
    const rect = board.current.getBoundingClientRect(), style = getComputedStyle(board.current);
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, gapX: parseFloat(style.columnGap) || 0, gapY: parseFloat(style.rowGap) || 0, inset: 4 };
  }
  function dragVisual(current: DragSession): DragVisual | null {
    const layout = geometry(); if (!layout) return null;
    const result = dragPlacementAtPoint(puzzle, layout, { x: current.x, y: current.y, grabX: current.grabX, grabY: current.grabY }, current.tileId, current.rotation);
    return { ...result, tileId: current.tileId, rotation: current.rotation, valid: !!result.placement && !!movePlacement(puzzle, game.placements, result.placement) };
  }
  function pointerDown(event: ReactPointerEvent<HTMLButtonElement>, tileId: string, fromBoard: boolean) {
    if (event.button !== 0 || !event.isPrimary || inspection.solved || session.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const placed = game.placements.find(p => p.tileId === tileId);
    session.current = { pointerId: event.pointerId, tileId, rotation: placed?.rotation ?? game.orientations[tileId] ?? 0, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, grabX: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), grabY: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), active: false, fromBoard, source: event.currentTarget };
    event.preventDefault(); event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = session.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.x = event.clientX; current.y = event.clientY;
    if (!current.active && Math.hypot(current.x - current.startX, current.y - current.startY) < 6) return;
    current.active = true; setHovered(null); setDrag(dragVisual(current));
  }
  function pointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = session.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.x = event.clientX; current.y = event.clientY;
    const result = current.active ? dragVisual(current) : null;
    session.current = null; setDrag(null); setHovered(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!current.active) { if (current.fromBoard) turnPlaced(current.tileId); else tapRack(current.tileId); return; }
    const rack = shelf.current?.getBoundingClientRect();
    if (current.fromBoard && rack && current.x >= rack.left && current.x <= rack.right && current.y >= rack.top && current.y <= rack.bottom) {
      returnTile(current.tileId); return;
    }
    const moved = result?.placement ? movePlacement(puzzle, game.placements, result.placement) : null;
    if (!moved || !result?.placement) { notify("No room for both ends. Drop onto two empty squares; your piece is back where it was.", "error"); return; }
    const previous = game.placements.find(p => p.tileId === current.tileId);
    if (previous?.cell === result.placement.cell && previous.rotation === result.placement.rotation) return;
    commit(moved, { selected: null, orientations: { ...game.orientations, [current.tileId]: current.rotation } });
    notify(current.fromBoard ? "Piece moved. Tap it to rotate, or drag it back to the tray." : "Nicely placed. You can move or rotate this piece again.", "success");
  }
  function chooseLevel(id: number) {
    cancelDrag(false); setGame(freshGame(id)); setTrayPage(0); setHovered(null); setFocusCell(PUZZLES[id - 1].cells.findIndex(c => c !== null)); setShowChecks(false);
    notify(`Level ${id}: ${PUZZLES[id - 1].name}. Drag a domino onto the board to begin.`);
  }
  function chooseDifficulty(difficulty: Difficulty) {
    const levels = PUZZLES.filter(p => p.difficulty === difficulty);
    chooseLevel((levels.find(p => !completed.includes(p.id)) ?? levels[0]).id);
  }
  function commit(placements: Placement[], extra: Partial<Game> = {}) {
    setGame(previous => ({ ...previous, placements, history: [...previous.history.slice(-79), previous.placements], moves: previous.moves + 1, ...extra }));
    setShowChecks(false);
  }
  function turnPlaced(tileId: string) {
    if (inspection.solved) return;
    const moved = rotatePlacement(puzzle, game.placements, tileId);
    if (!moved) { notify("This piece cannot turn here. Move it into an open space, or drag it back to the tray.", "error"); return; }
    const turned = moved.find(p => p.tileId === tileId)!;
    commit(moved, { selected: tileId, rotation: turned.rotation, orientations: { ...game.orientations, [tileId]: turned.rotation } });
    notify(`Piece rotated to face ${DIRECTIONS[turned.rotation]}. Drag to move it, or use Return to tray.`);
  }
  function tapRack(tileId: string) {
    const rotation = ((game.orientations[tileId] ?? 0) + 1) % 4;
    const tile = puzzle.tiles.find(t => t.id === tileId)!;
    setGame(previous => ({ ...previous, selected: tileId, rotation, orientations: { ...previous.orientations, [tileId]: rotation } }));
    notify(`${tile.a} / ${tile.b} now faces ${DIRECTIONS[rotation]}. Drag it onto the board, or tap its first space.`);
  }
  function rotate() {
    const current = session.current;
    if (current?.active) {
      current.rotation = (current.rotation + 1) % 4;
      [current.grabX, current.grabY] = [1 - current.grabY, current.grabX];
      setDrag(dragVisual(current)); return;
    }
    if (!game.selected || inspection.solved) return;
    if (selectedPlacement) turnPlaced(game.selected); else tapRack(game.selected);
  }
  function returnTile(tileId: string) {
    if (inspection.solved) return;
    const original = game.placements.find(p => p.tileId === tileId);
    setTrayPage(Math.floor(puzzle.tiles.findIndex(tile => tile.id === tileId) / TRAY_PAGE_SIZE));
    commit(game.placements.filter(p => p.tileId !== tileId), { selected: null, orientations: { ...game.orientations, [tileId]: original?.rotation ?? 0 } });
    notify("Piece returned to the tray. Tap to turn it or drag it straight back onto the board.");
  }
  function place(cell: number) {
    if (inspection.solved) return;
    const existing = game.placements.find(p => placementCells(puzzle, p)?.includes(cell));
    if (existing) { turnPlaced(existing.tileId); return; }
    if (!game.selected || selectedPlacement) { notify("Drag a domino from the tray, or tap one to select and rotate it first."); return; }
    const next = { tileId: game.selected, cell, rotation: game.rotation };
    if (!canPlace(puzzle, game.placements, next)) { notify("Use two empty squares next to each other. Try rotating the piece, or choose another spot.", "error"); return; }
    commit([...game.placements, next], { selected: null }); notify("Nicely placed. Drag to move it again, or tap to rotate.", "success");
  }
  function undo() {
    cancelDrag(false); const previous = game.history.at(-1); if (!previous) return;
    setGame(g => ({ ...g, placements: previous, history: g.history.slice(0, -1), selected: null, moves: g.moves + 1 }));
    setShowChecks(false); notify("Last move undone.");
  }
  function hint() {
    cancelDrag(false); const result = applyHint(puzzle, game.placements);
    commit(result.placements, { selected: null, hints: game.hints + 1 });
    notify(result.removed ? `One piece placed for you. ${result.removed} conflicting ${result.removed === 1 ? "piece returned" : "pieces returned"} to the tray. Undo brings them back.` : "One piece placed for you. Follow its connections, or undo to try it yourself.");
  }
  function check() {
    setShowChecks(true); setShowRules(true);
    const bad = inspection.regions.filter(r => r.status === "bad").length;
    notify(bad ? `${bad} ${bad === 1 ? "region needs" : "regions need"} another look. Check the highlighted rules.` : game.placements.length < puzzle.tiles.length ? "So far, so good. Fill every space to finish; incomplete regions still need their remaining dots." : "Every piece fits and every region works. Nicely connected.", bad ? "error" : "info");
  }
  function boardKey(event: KeyboardEvent<HTMLButtonElement>, cell: number) {
    if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); const p = game.placements.find(p => placementCells(puzzle, p)?.includes(cell)); if (p) returnTile(p.tileId); return; }
    const direction = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: puzzle.width, ArrowUp: -puzzle.width }[event.key];
    if (!direction) return; event.preventDefault(); let next = cell + direction;
    while (next >= 0 && next < puzzle.cells.length && puzzle.cells[next] === null) next += direction;
    if (next >= 0 && next < puzzle.cells.length && (Math.abs(direction) !== 1 || Math.floor(next / puzzle.width) === Math.floor(cell / puzzle.width))) { setFocusCell(next); cells.current[next]?.focus(); }
  }
  function gameKey(event: KeyboardEvent<HTMLDivElement>) {
    if (expanded && event.key === "Tab") {
      const buttons = [...(panel.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])].filter(button => button.tabIndex >= 0 && button.getClientRects().length);
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.target instanceof Element && event.target.closest("button, [role='group']")) {
      if (event.key.toLowerCase() === "r") { event.preventDefault(); rotate(); }
      if (event.key === "Escape") { if (session.current) { event.preventDefault(); cancelDrag(); } else { setGame(g => ({ ...g, selected: null })); if (expanded && !document.fullscreenElement) { setExpanded(false); expandButton.current?.focus({ preventScroll: true }); } } }
    }
  }
  function toggleExpanded() {
    cancelDrag(false);
    setExpanded(previous => !previous);
  }
  function closeHelp() { help.current?.close(); helpButton.current?.focus(); }
  const nextLevel = game.levelId < PUZZLES.length ? game.levelId + 1 : 1;
  const dragTile = puzzle.tiles.find(tile => tile.id === drag?.tileId);

  return <section className="logic-section section-wrap" id="domino-logic" aria-labelledby="logic-title">
    <div className="logic-heading"><div><span className="eyebrow"><span className="tiny-square"/>A DIFFERENT WAY TO CONNECT THE DOTS</span><h2 id="logic-title">Small pieces.<br/><span className="serif-word">Bigger picture.</span></h2></div><div className="logic-heading-note"><span className="logic-heading-mark" aria-hidden="true"><PipFace value={3}/><PipFace value={2}/></span><p>A domino logic puzzle for curious minds. Fit the pieces. Follow the colors. Find your moment of clarity.</p><span>18 LEVELS · 3 DIFFICULTIES · YOUR OWN PACE</span></div></div>
    <FocusPortal active={expanded}><div ref={panel} className={`logic-game logic-hands-on ${expanded ? "is-expanded" : ""} ${inspection.solved ? "is-solved" : ""} ${drag ? "is-dragging" : ""}`} onKeyDown={gameKey} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? "Dot / Logic puzzle game" : undefined}>
      <div className="logic-topline"><span className="logic-wordmark"><AnimatedIcon name="layers" size={19}/>DOT <i>/</i> LOGIC <small>Domino puzzle</small></span><div className="logic-top-actions"><button ref={expandButton} onClick={toggleExpanded} aria-label={expanded ? "Back to website" : "Expand game"}><span aria-hidden="true">{expanded ? "↙" : "⛶"}</span>{expanded ? "Back to website" : "Expand game"}</button><button ref={helpButton} className="logic-help-button" onClick={() => help.current?.showModal()}><span aria-hidden="true">?</span>How to play</button></div></div>
      <div className="logic-level-controls"><div className="logic-difficulties" role="group" aria-label="Puzzle difficulty">{DIFFICULTIES.map(difficulty => <button key={difficulty} aria-pressed={puzzle.difficulty === difficulty} className={puzzle.difficulty === difficulty ? "active" : ""} onClick={() => chooseDifficulty(difficulty)}><i data-difficulty={difficulty}/>{difficulty}</button>)}</div><div className="logic-levels" role="group" aria-label={`${puzzle.difficulty} levels`}>{activeLevels.map(level => <button key={level.id} aria-label={`Level ${level.id}: ${level.name}${completed.includes(level.id) ? ", completed" : ""}`} aria-pressed={level.id === puzzle.id} className={`${level.id === puzzle.id ? "active" : ""} ${completed.includes(level.id) ? "completed" : ""}`} onClick={() => chooseLevel(level.id)}>{String(level.id).padStart(2, "0")}{completed.includes(level.id) && <span aria-hidden="true">✓</span>}</button>)}</div><span className="logic-total">{completed.length}<i>/18</i> complete</span></div>
      <div className="logic-game-layout">
        <div className="logic-board-column"><div className="logic-puzzle-title"><div><span>LEVEL {String(puzzle.id).padStart(2, "0")} / {puzzle.difficulty.toUpperCase()}</span><h3>{puzzle.name}</h3><p className="logic-goal">Fill the board. Meet each color’s rule.</p></div><span className="logic-pieces-count"><b>{game.placements.length}</b>/{puzzle.tiles.length}<small>pieces placed</small></span></div>
          <div className="logic-rule-key" aria-label="Symbols used in this puzzle">{[...new Set(puzzle.regions.map(region => region.kind))].map(kind => <span key={kind}><b>{RULE_KEYS[kind][0]}</b>{RULE_KEYS[kind][1]}</span>)}</div>
          <div className="logic-board-stage"><div ref={board} className="logic-board" role="group" aria-label="Domino puzzle board" aria-describedby="logic-controls" onPointerLeave={() => setHovered(null)} style={{ "--logic-columns": puzzle.width, "--logic-rows": puzzle.height } as CSSProperties}>
            {puzzle.cells.map((regionId, cell) => {
              if (regionId === null) return null;
              const region = puzzle.regions.find(r => r.id === regionId)!, occupied = inspection.values[cell] !== null, ghost = ghostCells?.includes(cell);
              return <button key={cell} ref={el => { cells.current[cell] = el; }} className={`logic-cell ${ghost ? validGhost ? "ghost-good" : "ghost-bad" : ""}`} style={{ gridColumn: cell % puzzle.width + 1, gridRow: Math.floor(cell / puzzle.width) + 1, "--region": REGION_COLORS[region.color % REGION_COLORS.length] } as CSSProperties} tabIndex={focusCell === cell ? 0 : -1} onFocus={() => { if (!session.current) setHovered(cell); setFocusCell(cell); }} onPointerEnter={() => { if (!session.current) setHovered(cell); }} onClick={() => place(cell)} onKeyDown={e => boardKey(e, cell)} disabled={inspection.solved} aria-label={`Row ${Math.floor(cell / puzzle.width) + 1}, column ${cell % puzzle.width + 1}, region ${regionId}. ${occupied ? `${inspection.values[cell]} dots. Tap to rotate` : "Empty. Place selected domino"}. ${ruleDescription(region)}.`}><span className="logic-region-letter" aria-hidden="true">{regionId}</span>{ghost && ghostTile && <span className="logic-ghost-dots"><PipFace value={cell === candidate?.cell ? ghostTile.a : ghostTile.b}/></span>}</button>;
            })}
            {game.placements.map(placement => {
              const tile = puzzle.tiles.find(t => t.id === placement.tileId)!, ends = placementCells(puzzle, placement)!, vertical = placement.rotation % 2 === 1, start = Math.min(...ends);
              return <button key={tile.id} className={`logic-placed-tile ${vertical ? "vertical" : ""} ${drag?.tileId === tile.id ? "drag-source" : ""} ${game.selected === tile.id ? "selected" : ""}`} style={{ gridColumn: `${start % puzzle.width + 1} / span ${vertical ? 1 : 2}`, gridRow: `${Math.floor(start / puzzle.width) + 1} / span ${vertical ? 2 : 1}` }} tabIndex={-1} disabled={inspection.solved} aria-label={`Move or rotate domino ${tile.a} / ${tile.b}, piece ${tile.id.slice(1)}`} onPointerDown={e => pointerDown(e, tile.id, true)} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => cancelDrag()} onLostPointerCapture={() => { if (session.current?.tileId === tile.id) cancelDrag(); }} onClick={e => { if (e.detail === 0) turnPlaced(tile.id); }}><TileFaces a={tile.a} b={tile.b} rotation={placement.rotation}/></button>;
            })}
            {puzzle.regions.filter(r => r.kind !== "none").map(region => {
              const cell = region.cells.at(-1)!, status = inspection.regions.find(r => r.region.id === region.id)!.status;
              return <span key={region.id} className={`logic-region-badge ${status === "good" ? "met" : ""}`} aria-hidden="true" style={{ gridColumn: cell % puzzle.width + 1, gridRow: Math.floor(cell / puzzle.width) + 1 }}>{ruleSymbol(region)}</span>;
            })}
          </div></div>
        </div>
        <div ref={shelf} className={`logic-tray-column logic-tray-shelf ${drag && game.placements.some(p => p.tileId === drag.tileId) ? "accepts-return" : ""}`}><div className="logic-tray-heading"><span>YOUR PIECES</span><b>{puzzle.tiles.length - game.placements.length} left to connect</b></div><p className="logic-tray-instruction">Drag to place · Tap to rotate · Drag back here to return</p>
          <div className="logic-tray-pager" data-multiple-pages={puzzle.tiles.length > TRAY_PAGE_SIZE}><button aria-label="Previous tray pieces" disabled={trayPage === 0} onClick={() => setTrayPage(previous => previous - 1)}>←</button><span>PIECES {trayPage * TRAY_PAGE_SIZE + 1}–{Math.min((trayPage + 1) * TRAY_PAGE_SIZE, puzzle.tiles.length)} / {puzzle.tiles.length}</span><button aria-label="Next tray pieces" disabled={(trayPage + 1) * TRAY_PAGE_SIZE >= puzzle.tiles.length} onClick={() => setTrayPage(previous => previous + 1)}>→</button></div><div className="logic-tray" role="group" aria-label="Domino tray">{puzzle.tiles.map((tile, tileIndex) => {
            const rotation = game.orientations[tile.id] ?? 0, placed = placedIds.has(tile.id);
            return <div key={tile.id} className={`logic-tray-slot ${placed ? "used" : ""}`} data-tray-page-active={Math.floor(tileIndex / TRAY_PAGE_SIZE) === trayPage}><button disabled={placed || inspection.solved} aria-label={`Domino ${tile.a} / ${tile.b}, piece ${tile.id.slice(1)}${placed ? ", placed" : ""}`} aria-pressed={game.selected === tile.id} data-rotation={rotation} className={`logic-tray-tile ${rotation % 2 ? "vertical" : ""} ${game.selected === tile.id ? "selected" : ""} ${placed ? "placed" : ""} ${drag?.tileId === tile.id ? "drag-source" : ""}`} onPointerDown={e => pointerDown(e, tile.id, false)} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => cancelDrag()} onLostPointerCapture={() => { if (session.current?.tileId === tile.id) cancelDrag(); }} onClick={e => { if (e.detail === 0) tapRack(tile.id); }}><TileFaces a={tile.a} b={tile.b} rotation={rotation}/>{placed && <span className="logic-tile-check" aria-hidden="true">✓</span>}</button></div>;
          })}</div>
          <div className="logic-toolbar"><div className={`logic-selection ${selectedTile ? "has-selection" : ""}`}><span>{selectedTile ? `${selectedTile.a} / ${selectedTile.b}` : "YOUR NEXT MOVE"}</span><b>{selectedTile ? <>{ARROWS[selectedPlacement?.rotation ?? game.rotation]} <small>FACING {DIRECTIONS[selectedPlacement?.rotation ?? game.rotation].toUpperCase()}</small></> : <small>DRAG A PIECE TO BEGIN</small>}</b><button onClick={rotate} disabled={!selectedTile || inspection.solved} aria-label="Rotate selected domino"><AnimatedIcon name="reset" size={16}/>Rotate</button>{selectedPlacement && <button onClick={() => returnTile(selectedPlacement.tileId)} aria-label="Return selected domino to tray">Return to tray</button>}</div><div className="logic-actions"><button onClick={undo} disabled={!game.history.length}><AnimatedIcon name="process" size={16}/>Undo</button><button onClick={hint} disabled={inspection.solved}><AnimatedIcon name="studio" size={16}/>Hint</button><button onClick={check} disabled={inspection.solved}><AnimatedIcon name="check" size={16}/>Check</button><button onClick={clearBoard} disabled={!game.placements.length} title="Return all pieces to the tray. You can undo this."><AnimatedIcon name="reset" size={16}/>Clear board</button></div></div>
        </div>
        <div className={`logic-message ${inspection.solved ? "success" : ""}`} data-tone={feedback} role="status" aria-live="polite">{feedback === "error" ? <span className="logic-feedback-mark" aria-hidden="true">!</span> : (inspection.solved || feedback === "success") ? <AnimatedIcon name="check" size={20}/> : <span className="logic-feedback-mark" aria-hidden="true">i</span>}<p>{message}</p></div>
        {inspection.solved && <div className="logic-complete"><div><span>PIECES CONNECTED. PERSPECTIVE FOUND.</span><h4>That all adds up.</h4><p>{game.moves} moves · {game.hints} {game.hints === 1 ? "hint" : "hints"} used</p></div><button onClick={() => chooseLevel(nextLevel)}>{puzzle.id === 18 ? "Play from the beginning" : "Next level"}<AnimatedIcon name="arrow" size={16}/></button></div>}
        <div className="logic-condition-panel"><button className="logic-condition-toggle" aria-expanded={showRules} aria-controls="logic-region-rules" onClick={() => setShowRules(previous => !previous)}><span>Region rules <b>{goodRegions}/{puzzle.regions.length} met</b></span><span aria-hidden="true">{showRules ? "−" : "+"}</span></button>{showRules && <div id="logic-region-rules" className="logic-region-list">{inspection.regions.map(({ region, filled, sum, status }) => <div key={region.id} className={`logic-region-rule ${status === "good" ? "good" : showChecks && status === "bad" ? "bad" : ""}`} style={{ "--region": REGION_COLORS[region.color % REGION_COLORS.length] } as CSSProperties}><span className="logic-rule-color">{region.id}</span><span><b>{ruleSymbol(region)}</b><small>{ruleDescription(region)}</small></span><span className="logic-rule-status" aria-label={`Region ${region.id}: ${status === "good" ? "condition met" : showChecks && status === "bad" ? "needs attention" : "in progress"}`}>{status === "good" ? "✓" : showChecks && status === "bad" ? "!" : <><b>{sum}</b><small>{filled}/{region.cells.length}</small></>}</span></div>)}</div>}</div>
      </div>
      <div className="logic-bottom"><p id="logic-controls">Keyboard: arrows to move, Enter to place, R to rotate. Full instructions in How to play.</p><span>Progress saved automatically</span></div>
      {loaded && drag && dragTile && createPortal(<div className={`logic-drag-preview ${drag.rotation % 2 ? "vertical" : ""} ${drag.valid ? "fits" : ""}`} style={{ left: drag.left, top: drag.top, width: drag.width, height: drag.height }} aria-hidden="true"><TileFaces a={dragTile.a} b={dragTile.b} rotation={drag.rotation}/></div>, document.fullscreenElement === panel.current && panel.current ? panel.current : document.body)}
    </div></FocusPortal>
    <dialog ref={help} className="logic-help" aria-labelledby="logic-help-title"><button className="logic-help-close" onClick={closeHelp} aria-label="Close how to play" autoFocus><AnimatedIcon name="close" size={22}/></button><span className="logic-help-kicker">DOT / LOGIC · A LITTLE GUIDANCE</span><h3 id="logic-help-title">Make every<br/><em>piece count.</em></h3><p>Fill every colored space with the dominoes in your tray. Every region must meet its own condition.</p><ol><li><b>Pick up and place.</b> Drag a domino from the tray onto two neighboring spaces. The outline previews where it will land.</li><li><b>Turn the piece.</b> Tap any domino to rotate it, or press R. Pieces can be moved and rotated after placing them.</li><li><b>Try another position.</b> Drag a placed piece directly to a new spot. Drag it to the tray to return it. A drop that does not fit restores its old position.</li><li><b>Follow the colors.</b> Count every dot inside each region, even when a domino crosses the border.</li></ol><div className="logic-help-rules"><p><b>Σ7</b><span>All dots in this color add up to 7.</span></p><p><b>=</b><span>Every number in this color is the same.</span></p><p><b>≠</b><span>Every number in this color is different.</span></p><p><b>&lt;7 / &gt;7</b><span>The total is below / above 7.</span></p><p><b>·</b><span>No condition. Any numbers fit.</span></p></div><p className="logic-help-last">Zero is a blank half. Prefer tapping or a keyboard? Select a tray piece, turn it with R, then tap its first board space or press Enter on it. Undo and Hint are always there to help.</p><button className="logic-help-start" onClick={closeHelp}>Let’s connect the dots<AnimatedIcon name="arrow" size={17}/></button></dialog>
  </section>;
}
