import test from "node:test";
import assert from "node:assert/strict";
import { PUZZLES, DIFFICULTIES, placementCells, canPlace, inspectBoard, applyHint, readProgress, movePlacement, rotatePlacement, dragPlacementAtPoint } from "../lib/domino-logic.ts";

function fixture(kind, values, target=0) {
  const tiles=[{id:"a",a:values[0],b:values[1]},{id:"b",a:values[2],b:values[3]}];
  return {id:99,name:"Rule fixture",difficulty:"Easy",width:2,height:2,cells:["A","A","A","A"],regions:[{id:"A",cells:[0,1,2,3],kind,target,color:0}],tiles,solution:[{tileId:"a",cell:0,rotation:0},{tileId:"b",cell:2,rotation:0}]};
}

test("18 original levels have six puzzles in each difficulty",()=>{
  assert.equal(PUZZLES.length,18);assert.equal(new Set(PUZZLES.map(p=>p.name)).size,18);
  for(const difficulty of DIFFICULTIES)assert.equal(PUZZLES.filter(p=>p.difficulty===difficulty).length,6);
  assert.equal(new Set(PUZZLES.map(p=>JSON.stringify([p.width,p.cells,p.tiles,p.regions]))).size,18);
});

for(const puzzle of PUZZLES) {
  test(`level ${puzzle.id} is tileable and satisfies every region`,()=>{
    assert.equal(puzzle.solution.length*2,puzzle.cells.filter(Boolean).length);
    assert(puzzle.tiles.every(t=>[t.a,t.b].every(v=>Number.isInteger(v)&&v>=0&&v<=6)));
    const placements=[];
    for(const placement of puzzle.solution){assert(canPlace(puzzle,placements,placement));placements.push(placement);}
    const result=inspectBoard(puzzle,placements);
    assert.equal(result.valid,true);assert.equal(result.solved,true);assert(result.regions.every(r=>r.status==="good"));
  });
  test(`hints finish level ${puzzle.id} without overlap or repeated pieces`,()=>{
    let placements=[];
    for(let i=0;i<puzzle.tiles.length;i++){
      placements=applyHint(puzzle,placements).placements;
      assert.equal(inspectBoard(puzzle,placements).valid,true);
      assert.equal(placements.length,i+1);
    }
    assert.equal(inspectBoard(puzzle,placements).solved,true);
  });
}

test("rotation follows four compass directions and cannot wrap across edges",()=>{
  const p=PUZZLES[0],base={tileId:p.tiles[0].id,cell:5};
  assert.deepEqual([0,1,2,3].map(rotation=>placementCells(p,{...base,rotation})),[[5,6],[5,9],[5,4],[5,1]]);
  for(const candidate of [{cell:3,rotation:0},{cell:0,rotation:2},{cell:0,rotation:3},{cell:8,rotation:1},{cell:-1,rotation:0},{cell:0,rotation:4}])assert.equal(placementCells(p,{...base,...candidate}),null);
});

test("holes, overlap, unknown pieces, and piece reuse are rejected",()=>{
  const shaped=PUZZLES[16];assert.equal(placementCells(shaped,{tileId:shaped.tiles[0].id,cell:0,rotation:0}),null);
  const p=PUZZLES[0],first=p.solution[0],ends=placementCells(p,first),other=p.tiles.find(t=>t.id!==first.tileId);
  assert.equal(canPlace(p,[first],first),false);
  assert.equal(canPlace(p,[first],{tileId:other.id,cell:ends[0],rotation:0}),false);
  assert.equal(canPlace(p,[],{tileId:"unknown",cell:0,rotation:0}),false);
  assert.equal(inspectBoard(p,[...p.solution,first]).solved,false);
});

const ruleCases=[
  ["sum",[0,1,2,3],6,true],["sum",[0,1,2,4],6,false],
  ["equal",[3,3,3,3],0,true],["equal",[3,3,2,3],0,false],
  ["different",[0,1,2,3],0,true],["different",[0,1,1,3],0,false],
  ["less",[0,1,2,2],6,true],["less",[0,1,2,3],6,false],
  ["greater",[0,1,2,4],6,true],["greater",[0,1,2,3],6,false],
  ["none",[6,6,0,6],0,true],
];
for(const [kind,values,target,expected] of ruleCases)test(`${kind} condition checks ${values.join("+")} against ${target}`,()=>{
  const p=fixture(kind,values,target);assert.equal(inspectBoard(p,p.solution).solved,expected);
});

test("a partially filled region is never considered solved",()=>{
  const p=fixture("sum",[2,2,0,0],4),r=inspectBoard(p,[p.solution[0]]);
  assert.equal(r.solved,false);assert.equal(r.regions[0].status,"open");
});

test("valid alternative solutions are accepted, independent of the hint arrangement",()=>{
  const p=fixture("sum",[1,2,1,2],6);
  const alternate=[{tileId:"a",cell:3,rotation:2},{tileId:"b",cell:1,rotation:2}];
  assert.equal(inspectBoard(p,alternate).solved,true);
  assert.deepEqual(applyHint(p,alternate).placements,alternate);
});

test("hint resolves conflicts without mutating the previous board for undo",()=>{
  const p=fixture("sum",[1,2,3,4],10);
  p.regions=[{id:"A",cells:[0,1],kind:"sum",target:3,color:0},{id:"B",cells:[2,3],kind:"sum",target:7,color:1}];
  p.cells=["A","A","B","B"];
  const before=[{tileId:"b",cell:0,rotation:0},{tileId:"a",cell:2,rotation:0}],snapshot=structuredClone(before);
  const hint=applyHint(p,before);
  assert.equal(hint.removed,2);assert.equal(hint.placements.length,1);assert.deepEqual(before,snapshot);
  assert.equal(inspectBoard(p,applyHint(p,hint.placements).placements).solved,true);
});

test("saved progress restores only known levels and structurally valid placements",()=>{
  const p=PUZZLES[0];
  const saved=readProgress({levelId:1,completed:[1,1,18,99,"2"],placements:[p.solution[0]]});
  assert.deepEqual(saved.completed,[1,18]);assert.deepEqual(saved.placements,[p.solution[0]]);
  assert.equal(readProgress({levelId:99,completed:[],placements:[]}),null);
  assert.equal(readProgress(null),null);
  for(const placements of [[p.solution[0],p.solution[0]],[{tileId:"bad",cell:0,rotation:0}],[null]])assert.deepEqual(readProgress({levelId:1,completed:[1],placements}).placements,[]);
});

test("a placed piece can move directly without colliding with its previous cells",()=>{
  const p=PUZZLES[0],before=[{tileId:p.tiles[0].id,cell:0,rotation:0}],snapshot=structuredClone(before);
  const moved=movePlacement(p,before,{...before[0],cell:1});
  assert.equal(moved.length,1);assert.equal(moved[0].cell,1);assert.deepEqual(before,snapshot);
});

test("an invalid move keeps the source intact and never overwrites another piece",()=>{
  const p=PUZZLES[0],before=[{tileId:p.tiles[0].id,cell:0,rotation:0},{tileId:p.tiles[1].id,cell:2,rotation:0}],snapshot=structuredClone(before);
  assert.equal(movePlacement(p,before,{...before[0],cell:1}),null);
  assert.equal(movePlacement(p,before,{...before[0],cell:3}),null);
  assert.deepEqual(before,snapshot);
});

test("tap rotation ignores the piece's own footprint and skips blocked angles",()=>{
  const p=PUZZLES[0],original={tileId:p.tiles[0].id,cell:0,rotation:0};
  assert.equal(rotatePlacement(p,[original],original.tileId)[0].rotation,1);
  const edge={...original,cell:8};assert.equal(rotatePlacement(p,[edge],edge.tileId)[0].rotation,3);
  assert.equal(rotatePlacement(p,p.solution,p.solution[0].tileId),null);
});

const geometry={left:100,top:80,width:255,height:190,gapX:5,gapY:5,inset:4};
for(const rotation of [0,1,2,3])for(const [grabX,grabY] of [[0.1,0.2],[0.5,0.5],[0.9,0.8]])test(`drag snapping preserves grab point at rotation ${rotation}, grip ${grabX}/${grabY}`,()=>{
  const p=PUZZLES[0],vertical=rotation%2===1;
  const width=vertical?52:117,height=vertical?117:52;
  const left=169-(rotation===2?65:0),top=149-(rotation===3?65:0);
  const result=dragPlacementAtPoint(p,geometry,{x:left+grabX*width,y:top+grabY*height,grabX,grabY},p.tiles[0].id,rotation);
  assert.equal(result.placement.cell,5);assert.equal(result.placement.rotation,rotation);
  assert(Math.abs(result.left-left)<1e-8);assert(Math.abs(result.top-top)<1e-8);
  assert.equal(result.width,width);assert.equal(result.height,height);
});

test("drops outside the board or over holes do not produce placements",()=>{
  const p=PUZZLES[0];
  for(const point of [{x:-100,y:0},{x:900,y:900}])assert.equal(dragPlacementAtPoint(p,geometry,{...point,grabX:0.5,grabY:0.5},p.tiles[0].id,0).placement,null);
  const shaped=PUZZLES[16],shapeGeometry={left:0,top:0,width:385,height:255,gapX:5,gapY:5,inset:4};
  assert.equal(dragPlacementAtPoint(shaped,shapeGeometry,{x:58.5,y:30,grabX:0.5,grabY:0.5},shaped.tiles[0].id,0).placement,null);
});

test("rack orientations save safely and old progress remains compatible",()=>{
  const p=PUZZLES[0],saved=readProgress({levelId:1,completed:[],placements:[],orientations:{[p.tiles[0].id]:3,[p.tiles[1].id]:9,unknown:2}});
  assert.deepEqual(saved.orientations,{[p.tiles[0].id]:3});
  assert.deepEqual(readProgress({levelId:1,completed:[],placements:[]}).orientations,{});
});
