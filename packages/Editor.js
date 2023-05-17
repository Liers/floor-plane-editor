/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import $ from 'jquery';
import { isObjectsEquals } from './utils.js';
import * as qSVG from './QuickSVG.js';

class Editor {
    constructor(start, end, type, thick, container) {
        this.container = container;
        this.thick = thick;
        this.start = start;
        this.end = end;
        this.type = type;
        this.parent = null;
        this.child = null;
        this.angle = 0;
        this.equations = {};
        this.coords = [];
        this.backUp = false;
    }

    // RETURN OBJECTS ARRAY INDEX OF WALLS [WALL1, WALL2, n...] WALLS WITH THIS NODE, EXCEPT PARAM = OBJECT WALL
    getWallNode(coords, except = false) {
        const { WALLS } = this;
        const nodes = [];
        for (let k in WALLS) {
          if (!isObjectsEquals(WALLS[k], except)) {
            if (isObjectsEquals(WALLS[k].start,coords)) {
                nodes.push({wall: WALLS[k], type: "start"});
            }
            if (isObjectsEquals(WALLS[k].end, coords)) {
                nodes.push({wall: WALLS[k], type: "end"});
            }
          }
        }
        if (nodes.length == 0) return false;
        else return nodes;
    }
  
    wallsComputing(WALLS, action = false) {
      // IF ACTION == MOVE -> equation2 exist !!!!!
      document.querySelector('#boxwall').empty();
      document.querySelector('#boxArea').empty();
  
      for (let vertice = 0; vertice < WALLS.length; vertice++) {
        const wall = WALLS[vertice];
        if (wall.parent != null) {
          if (!isObjectsEquals(wall.parent.start, wall.start) && !isObjectsEquals(wall.parent.end, wall.start)) {
            wall.parent = null;
          }
        }
        if (wall.child != null) {
          if (!isObjectsEquals(wall.child.start, wall.end) && !isObjectsEquals(wall.child.end, wall.end)) {
            wall.child = null;
          }
        }
      }
  
      for (let vertice = 0; vertice < WALLS.length; vertice++) {
        const wall = WALLS[vertice];
          if (wall.parent != null) {
            if (isObjectsEquals(wall.parent.start, wall.start)) {
              const previousWall = wall.parent;
              const previousWallStart = previousWall.end;
              const previousWallEnd = previousWall.start;
            }
            if (isObjectsEquals(wall.parent.end, wall.start)) {
              const previousWall = wall.parent;
              const previousWallStart = previousWall.start;
              const previousWallEnd = previousWall.end;
            }
          }
          else {
            const S = this.getWallNode(wall.start, wall);
            // if (wallInhibation && isObjectsEquals(wall, wallInhibation)) S = false;
            for (let k in S) {
              const eqInter = this.createEquationFromWall(S[k].wall);
              let angleInter = 90; // TO PASS TEST
              if (action == "move") {
                angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
              }
              if (S[k].type == 'start' && S[k].wall.parent == null && angleInter > 20 && angleInter < 160) {
                wall.parent = S[k].wall;
                S[k].wall.parent = wall;
                const previousWall = wall.parent;
                const previousWallStart = previousWall.end;
                const previousWallEnd = previousWall.start;
              }
              if (S[k].type == 'end' && S[k].wall.child == null && angleInter > 20 && angleInter < 160) {
                wall.parent = S[k].wall;
                S[k].wall.child = wall;
                const previousWall = wall.parent;
                const previousWallStart = previousWall.start;
                const previousWallEnd = previousWall.end;
              }
            }
          }

        if (wall.child != null) {
            if (isObjectsEquals(wall.child.end, wall.end)) {
                const nextWall = wall.child;
                const nextWallStart = nextWall.end;
                const nextWallEnd = nextWall.start;
            } else {
                const nextWall = wall.child;
                const nextWallStart = nextWall.start;
                const nextWallEnd = nextWall.end;
            }
        } else {
            const E = this.getWallNode(wall.end, wall);
            // if (wallInhibation && isObjectsEquals(wall, wallInhibation)) E = false;
            for (let k in E) {
                const eqInter = this.createEquationFromWall(E[k].wall);
                let angleInter = 90; // TO PASS TEST
                if (action == "move") {
                    angleInter = qSVG.angleBetweenEquations(eqInter.A, equation2.A);
                }
                if (E[k].type == 'end' && E[k].wall.child == null && angleInter > 20 && angleInter < 160) {
                    wall.child = E[k].wall;
                    E[k].wall.child = wall;
                    const nextWall = wall.child;
                    const nextWallStart = nextWall.end;
                    const nextWallEnd = nextWall.start;
                }
                if (E[k].type == 'start' && E[k].wall.parent == null && angleInter > 20 && angleInter < 160) {
                    wall.child = E[k].wall;
                    E[k].wall.parent = wall;
                    const nextWall = wall.child;
                    const nextWallStart = nextWall.start;
                    const nextWallEnd = nextWall.end;
                }
            }
        }
  
        const angleWall = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
        wall.angle = angleWall;
        const wallThickX = (wall.thick/2) * Math.sin(angleWall);
        const wallThickY = (wall.thick/2) * Math.cos(angleWall);
        const eqWallUp = qSVG.createEquation(wall.start.x + wallThickX, wall.start.y - wallThickY, wall.end.x + wallThickX, wall.end.y - wallThickY);
        const eqWallDw = qSVG.createEquation(wall.start.x - wallThickX, wall.start.y + wallThickY, wall.end.x - wallThickX, wall.end.y + wallThickY);
        const eqWallBase = qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
        wall.equations = {up: eqWallUp, down: eqWallDw, base: eqWallBase};
        let dWay;
        let interUp;
        let interDw;
        let interUp2;
        let interDw2;
  
        // WALL STARTED
        if (wall.parent == null) {
          const eqP = qSVG.perpendicularEquation(eqWallUp, wall.start.x, wall.start.y);
          interUp = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
          interDw = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
          dWay = "M"+interUp.x+","+interUp.y+" L"+interDw.x+","+interDw.y+" ";
        } else {
          const eqP = qSVG.perpendicularEquation(eqWallUp, wall.start.x, wall.start.y);
          // const previousWall = wall.parent;
          //   const previousWallStart = previousWall.start;
          //   const previousWallEnd = previousWall.end;
          const anglePreviousWall = Math.atan2(previousWallEnd.y - previousWallStart.y, previousWallEnd.x - previousWallStart.x);
          const previousWallThickX = (previousWall.thick/2) * Math.sin(anglePreviousWall);
          const previousWallThickY = (previousWall.thick/2) * Math.cos(anglePreviousWall);
          const eqPreviousWallUp = qSVG.createEquation(previousWallStart.x + previousWallThickX, previousWallStart.y - previousWallThickY, previousWallEnd.x + previousWallThickX, previousWallEnd.y - previousWallThickY);
          const eqPreviousWallDw = qSVG.createEquation(previousWallStart.x - previousWallThickX, previousWallStart.y + previousWallThickY, previousWallEnd.x - previousWallThickX, previousWallEnd.y + previousWallThickY);
          if (Math.abs(anglePreviousWall-angleWall) > 0.09) {
            interUp = qSVG.intersectionOfEquations(eqWallUp, eqPreviousWallUp, "object");
            interDw = qSVG.intersectionOfEquations(eqWallDw, eqPreviousWallDw, "object");
  
            if (eqWallUp.A == eqPreviousWallUp.A) {
              interUp = {x: wall.start.x + wallThickX, y: wall.start.y - wallThickY};
              interDw = {x: wall.start.x - wallThickX, y: wall.start.y + wallThickY};
            }
  
            const miter = qSVG.gap(interUp, {x:previousWallEnd.x, y:previousWallEnd.y});
            if (miter > 1000) {
              interUp = qSVG.intersectionOfEquations(eqP, eqWallUp, "object");
              interDw = qSVG.intersectionOfEquations(eqP, eqWallDw, "object");
            }
          } else  {
            interUp = qSVG.intersectionOfEquations(eqP, eqWallUp, "object");
            interDw = qSVG.intersectionOfEquations(eqP, eqWallDw, "object");
          }
          dWay = "M"+interUp.x+","+interUp.y+" L"+interDw.x+","+interDw.y+" ";
        }
        wall.coords = [interUp, interDw];
  
        // WALL FINISHED
        if (wall.child == null) {
          const eqP = qSVG.perpendicularEquation(eqWallUp, wall.end.x, wall.end.y);
          interUp2 = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
          interDw2 = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
          dWay = dWay + "L"+interDw2.x+","+interDw2.y+" L"+interUp2.x+","+interUp2.y+" Z";
        } else {
          const eqP = qSVG.perpendicularEquation(eqWallUp, wall.end.x, wall.end.y);
          // const nextWall = wall.child;
          //   const nextWallStart = nextWall.start;
          //   const nextWallEnd = nextWall.end;
          const angleNextWall = Math.atan2(nextWallEnd.y - nextWallStart.y, nextWallEnd.x - nextWallStart.x);
          const nextWallThickX = (nextWall.thick/2) * Math.sin(angleNextWall);
          const nextWallThickY = (nextWall.thick/2) * Math.cos(angleNextWall);
          const eqNextWallUp = qSVG.createEquation(nextWallStart.x + nextWallThickX, nextWallStart.y - nextWallThickY, nextWallEnd.x + nextWallThickX, nextWallEnd.y - nextWallThickY);
          const eqNextWallDw = qSVG.createEquation(nextWallStart.x - nextWallThickX, nextWallStart.y + nextWallThickY, nextWallEnd.x - nextWallThickX, nextWallEnd.y + nextWallThickY);
          if (Math.abs(angleNextWall-angleWall) > 0.09) {
            interUp2 = qSVG.intersectionOfEquations(eqWallUp, eqNextWallUp, "object");
            interDw2 = qSVG.intersectionOfEquations(eqWallDw, eqNextWallDw, "object");
  
            if (eqWallUp.A == eqNextWallUp.A) {
              interUp2 = {x: wall.end.x + wallThickX, y: wall.end.y - wallThickY};
              interDw2 = {x: wall.end.x - wallThickX, y: wall.end.y + wallThickY};
            }
  
            const miter = qSVG.gap(interUp, {x:nextWallStart.x, y:nextWallStart.y});
            if (miter > 1000) {
              interUp2 = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
              interDw2 = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
            }
          } else  {
            interUp2 = qSVG.intersectionOfEquations(eqWallUp, eqP, "object");
            interDw2 = qSVG.intersectionOfEquations(eqWallDw, eqP, "object");
          }
          dWay = dWay + "L"+interDw2.x+","+interDw2.y+" L"+interUp2.x+","+interUp2.y+" Z";
        }
        wall.coords.push(interDw2, interUp2);
        wall.graph = this.makeWall(dWay);
        document.querySelector('#boxwall').append(wall.graph);
      }
    }
  
    makeWall(way) {
      const wallScreen = qSVG.create('none', 'path', {
          d: way,
          stroke: "none",
          fill: this.colorWall,
          "stroke-width": 1,
          "stroke-linecap": "butt",
          "stroke-linejoin": "miter",
          "stroke-miterlimit": 4,
          "fill-rule": "nonzero"
      });
      return wallScreen;
    }
  
    invisibleWall(wallToInvisble = false) {
      if (!wallToInvisble) wallToInvisble = binder.wall;
      const objWall = this.objFromWall(wallBind);
      if (objWall.length == 0) {
        wallToInvisble.type = "separate";
        wallToInvisble.backUp = wallToInvisble.thick;
        wallToInvisble.thick = 0.07;
        this.architect(WALLS);
        mode = "select_mode";
        $('#panel').show(200);
        save();
        return true;
      }
      else {
        $('#boxinfo').html('Les murs contenant des portes ou des fenêtres ne peuvent être une séparation !');
        return false;
      }
    }
  
    visibleWall(wallToInvisble = false) {
      if (!wallToInvisble) wallToInvisble = binder.wall;
      wallToInvisble.type = "normal";
      wallToInvisble.thick = wallToInvisble.backUp;
      wallToInvisble.backUp = false;
      this.architect(WALLS);
      mode = "select_mode";
      $('#panel').show(200);
      save();
      return true;
    }
  
    architect(WALLS) {
      this.wallsComputing(WALLS);
      Rooms = qSVG.polygonize(WALLS);
      $('#boxRoom').empty();
      $('#boxSurface').empty();
      this.roomMaker(Rooms);
      return true;
    }
  
    splitWall(wallToSplit = false) {
      if (!wallToSplit) wallToSplit = binder.wall;
      const eqWall = this.createEquationFromWall(wallToSplit);
      const wallToSplitLength = qSVG.gap(wallToSplit.start, wallToSplit.end);
      const newWalls = [];
      for (let k in WALLS) {
        const eq = this.createEquationFromWall(WALLS[k]);
        const inter = qSVG.intersectionOfEquations(eqWall, eq, 'obj');
        if (qSVG.btwn(inter.x, binder.wall.start.x, binder.wall.end.x, 'round') && qSVG.btwn(inter.y, binder.wall.start.y, binder.wall.end.y, 'round') && qSVG.btwn(inter.x, WALLS[k].start.x, WALLS[k].end.x, 'round') && qSVG.btwn(inter.y, WALLS[k].start.y, WALLS[k].end.y, 'round')) {
          const distance = qSVG.gap(wallToSplit.start, inter);
          if (distance > 5 && distance < wallToSplitLength) newWalls.push({distance: distance, coords: inter});
        }
      }
      newWalls.sort(function(a,b) {
        return (a.distance - b.distance).toFixed(2);
      });
      let initCoords = wallToSplit.start;
      const initThick = wallToSplit.thick;
      // CLEAR THE WALL BEFORE PIECES RE-BUILDER
      for (let k in WALLS) {
          if (isObjectsEquals(WALLS[k].child, wallToSplit)) WALLS[k].child = null;
          if (isObjectsEquals(WALLS[k].parent, wallToSplit)) {WALLS[k].parent = null;}
      }
      WALLS.splice(WALLS.indexOf(wallToSplit),1);
      let wall;
      for (let k in newWalls) {
        wall = this.wall(initCoords, newWalls[k].coords, "normal", initThick);
        WALLS.push(wall);
        wall.child = WALLS[WALLS.length];
        initCoords = newWalls[k].coords;
      }
      // LAST WALL ->
      wall = this.wall(initCoords, wallToSplit.end, "normal", initThick);
      WALLS.push(wall);
      this.architect(WALLS);
      mode = "select_mode";
      $('#panel').show(200);
      save();
      return true;
    }
  
    nearWallNode(snap, range = Infinity, except = ['']) {
      let best;
      let bestWall;
      let scan;
      const i = 0;
      let scanDistance;
      let bestDistance = Infinity;
      for (let k = 0; k < WALLS.length; k++) {
        if (except.indexOf(WALLS[k]) == -1) {
          scanStart = WALLS[k].start;
          scanEnd = WALLS[k].end;
          scanDistance = qSVG.measure(scanStart, snap);
          if (scanDistance < bestDistance) {
              best = scanStart;
              bestDistance = scanDistance;
              bestWall = k;
          }
          scanDistance = qSVG.measure(scanEnd, snap);
          if (scanDistance < bestDistance) {
              best = scanEnd;
              bestDistance = scanDistance;
              bestWall = k;
          }
        }
      }
      if (bestDistance <= range) {
          return ({
              x: best.x,
              y: best.y,
              bestWall: bestWall
          });
      } else {
          return false;
      }
    }
  
    // USING WALLS SUPER WALL OBJECTS ARRAY
    rayCastingWall(snap) {
      const wallList = [];
      for (let i = 0; i < WALLS.length; i++) {
        const polygon = [];
        for (let pp = 0; pp < 4; pp++) {
          polygon.push({x: WALLS[i].coords[pp].x, y: WALLS[i].coords[pp].y}); // FOR Z
        }
        if (qSVG.rayCasting(snap, polygon)) {
          wallList.push(WALLS[i]); // Return EDGES Index
        }
        }
        if (wallList.length == 0) return false;
        else {
          if (wallList.length == 1) return wallList[0];
          else return wallList;
        }
      }
  
    stickOnWall(snap) {
      if (WALLS.length == 0) return false;
      let wallDistance = Infinity;
      let wallSelected = {};
      let result;
      if (WALLS.length == 0) return false;
      for (let e = 0; e < WALLS.length; e++) {
        const eq1 = qSVG.createEquation(WALLS[e].coords[0].x, WALLS[e].coords[0].y, WALLS[e].coords[3].x, WALLS[e].coords[3].y);
        result1 = qSVG.nearPointOnEquation(eq1, snap);
        const eq2 = qSVG.createEquation(WALLS[e].coords[1].x, WALLS[e].coords[1].y, WALLS[e].coords[2].x, WALLS[e].coords[2].y);
        result2 = qSVG.nearPointOnEquation(eq2, snap);
        if (result1.distance < wallDistance && qSVG.btwn(result1.x, WALLS[e].coords[0].x, WALLS[e].coords[3].x) && qSVG.btwn(result1.y, WALLS[e].coords[0].y, WALLS[e].coords[3].y)) {
            wallDistance = result1.distance;
            wallSelected = {wall: WALLS[e], x: result1.x, y: result1.y, distance: result1.distance};
        }
        if (result2.distance < wallDistance && qSVG.btwn(result2.x, WALLS[e].coords[1].x, WALLS[e].coords[2].x) && qSVG.btwn(result2.y, WALLS[e].coords[1].y, WALLS[e].coords[2].y)) {
            wallDistance = result2.distance;
            wallSelected = {wall: WALLS[e], x: result2.x, y: result2.y, distance: result2.distance};
        }
      }
      const vv = this.nearVertice(snap);
      if (vv.distance < wallDistance) {
          const eq1 = qSVG.createEquation(vv.number.coords[0].x, vv.number.coords[0].y, vv.number.coords[3].x, vv.number.coords[3].y);
          result1 = qSVG.nearPointOnEquation(eq1, vv);
          const eq2 = qSVG.createEquation(vv.number.coords[1].x, vv.number.coords[1].y, vv.number.coords[2].x, vv.number.coords[2].y);
          result2 = qSVG.nearPointOnEquation(eq2, vv);
          if (result1.distance < wallDistance && qSVG.btwn(result1.x, vv.number.coords[0].x, vv.number.coords[3].x) && qSVG.btwn(result1.y, vv.number.coords[0].y, vv.number.coords[3].y)) {
              wallDistance = result1.distance;
              wallSelected = {wall: vv.number, x: result1.x, y: result1.y, distance: result1.distance};
          }
          if (result2.distance < wallDistance && qSVG.btwn(result2.x, vv.number.coords[1].x, vv.number.coords[2].x) && qSVG.btwn(result2.y, vv.number.coords[1].y, vv.number.coords[2].y)) {
              wallDistance = result2.distance;
              wallSelected = {wall: vv.number, x: result2.x, y: result2.y, distance: result2.distance};
          }
      }
      return wallSelected;
    }
  
  
    // RETURN OBJDATA INDEX LIST FROM AN WALL
    objFromWall(wall, typeObj = false) {
      const objList = [];
      for (let scan = 0; scan < OBJDATA.length; scan++) {
        let search;
        if (OBJDATA[scan].family == 'inWall') {
          const eq = qSVG.createEquation(wall.start.x, wall.start.y,wall.end.x,wall.end.y);
          search = qSVG.nearPointOnEquation(eq, OBJDATA[scan]);
          if (search.distance < 0.01 && qSVG.btwn(OBJDATA[scan].x, wall.start.x, wall.end.x) && qSVG.btwn(OBJDATA[scan].y, wall.start.y, wall.end.y)) objList.push(OBJDATA[scan]);
          // WARNING 0.01 TO NO COUNT OBJECT ON LIMITS OF THE EDGE !!!!!!!!!!!! UGLY CODE( MOUSE PRECISION)
          // TRY WITH ANGLE MAYBE ???
        }
      }
      return objList;
    }
  
    createEquationFromWall(wall) {
      return qSVG.createEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
    }
  
    // WALLS SUPER ARRAY
    rayCastingWalls(snap) {
      const wallList = [];
      for (let i = 0; i < WALLS.length; i++) {
        const polygon = [];
        for (let pp = 0; pp < 4; pp++) {
          polygon.push({x: WALLS[i].coords[pp].x, y: WALLS[i].coords[pp].y}); // FOR Z
        }
        if (qSVG.rayCasting(snap, polygon)) {
          wallList.push(WALLS[i]); // Return EDGES Index
        }
        }
        if (wallList.length == 0) return false;
        else {
          if (wallList.length == 1) return wallList[0];
          else return wallList;
        }
      }
  
    inWallRib2(wall, option = false) {
      if (!option) document.querySelector('#boxRib').empty();
      const ribMaster = [];
      const emptyArray = [];
      ribMaster.push(emptyArray);
      ribMaster.push(emptyArray);
      let inter;
      let distance;
      let cross;
      const angleTextValue = wall.angle*(180/Math.PI);
      const objWall = this.objFromWall(wall); // LIST OBJ ON EDGE
      ribMaster[0].push({wall: wall, crossObj: false, side : 'up', coords: wall.coords[0], distance: 0});
      ribMaster[1].push({wall: wall, crossObj: false, side : 'down', coords: wall.coords[1], distance: 0});
      for (let ob in objWall) {
        const objTarget = objWall[ob];
        objTarget.up = [
          qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[0]),
          qSVG.nearPointOnEquation(wall.equations.up, objTarget.limit[1])
        ];
        objTarget.down = [
          qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[0]),
          qSVG.nearPointOnEquation(wall.equations.down, objTarget.limit[1])
        ];
  
        distance = qSVG.measure(wall.coords[0], objTarget.up[0]) / meter;
        ribMaster[0].push({wall: wall, crossObj: ob, side : 'up', coords: objTarget.up[0], distance: distance.toFixed(2)});
        distance = qSVG.measure(wall.coords[0], objTarget.up[1]) / meter;
        ribMaster[0].push({wall: wall, crossObj: ob, side : 'up', coords: objTarget.up[1], distance: distance.toFixed(2)});
        distance = qSVG.measure(wall.coords[1], objTarget.down[0]) / meter;
        ribMaster[1].push({wall: wall, crossObj: ob, side : 'down', coords: objTarget.down[0], distance: distance.toFixed(2)});
        distance = qSVG.measure(wall.coords[1], objTarget.down[1]) / meter;
        ribMaster[1].push({wall: wall, crossObj: ob, side : 'down', coords: objTarget.down[1], distance: distance.toFixed(2)});
      }
      distance = qSVG.measure(wall.coords[0], wall.coords[3]) / meter;
      ribMaster[0].push({wall: wall, crossObj: false, side : 'up', coords: wall.coords[3], distance: distance});
      distance = qSVG.measure(wall.coords[1], wall.coords[2]) / meter;
      ribMaster[1].push({wall: wall, crossObj: false, side : 'down', coords: wall.coords[2], distance: distance});
        ribMaster[0].sort(function(a,b) {
          return (a.distance - b.distance).toFixed(2);
        });
        ribMaster[1].sort(function(a,b) {
          return (a.distance - b.distance).toFixed(2);
        });
      for (let t in ribMaster) {
        for (let n = 1; n < ribMaster[t].length; n++) {
          const found = true;
          let shift = -5;
          const valueText = Math.abs(ribMaster[t][n-1].distance - ribMaster[t][n].distance);
          let angleText = angleTextValue;
          if (found) {
              if (ribMaster[t][n-1].side == 'down') {shift = -shift+10;}
              if (angleText > 89 || angleText < -89) {
                angleText-=180;
                if (ribMaster[t][n-1].side == 'down') {shift = -5;}
                else shift = -shift+10;
              }
  
  
  
              sizeText[n] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              const startText = qSVG.middle(ribMaster[t][n-1].coords.x, ribMaster[t][n-1].coords.y, ribMaster[t][n].coords.x, ribMaster[t][n].coords.y);
              sizeText[n].setAttributeNS(null, 'x', startText.x);
              sizeText[n].setAttributeNS(null, 'y', (startText.y)+shift);
              sizeText[n].setAttributeNS(null, 'text-anchor', 'middle');
              sizeText[n].setAttributeNS(null, 'font-family', 'roboto');
              sizeText[n].setAttributeNS(null, 'stroke', '#ffffff');
              sizeText[n].textContent = valueText.toFixed(2);
              if (sizeText[n].textContent < 1) {
                sizeText[n].setAttributeNS(null, 'font-size', '0.8em');
                sizeText[n].textContent = sizeText[n].textContent.substring(1, sizeText[n].textContent.length);
              }
              else sizeText[n].setAttributeNS(null, 'font-size', '1em');
              sizeText[n].setAttributeNS(null, 'stroke-width', '0.4px');
              sizeText[n].setAttributeNS(null, 'fill', '#666666');
              sizeText[n].setAttribute("transform", "rotate("+angleText+" "+startText.x+","+(startText.y)+")");
  
              $('#boxRib').append(sizeText[n]);
          }
        }
      }
    }
  
    // value can be "text label", "step number in stair", etc...
    obj2D(family, classe, type, pos, angle, angleSign, size, hinge = 'normal', thick, value) {
        this.family = family   // inWall, stick, collision, free
        this.class = classe;  // door, window, energy, stair, measure, text ?
        this.type = type; // simple, double, simpleSlide, aperture, doubleSlide, fixed, switch, lamp....
        this.x = pos.x;
        this.y = pos.y;
        this.angle = angle;
        this.angleSign = angleSign;
        this.limit = [];
        this.hinge = hinge; // normal, reverse
        this.graph = qSVG.create('none', 'g');
        this.scale = {x:1, y:1};
        this.value = value;
        this.size = size;
        this.thick = thick;
        this.width = (this.size / meter).toFixed(2);
        this.height= (this.thick / meter).toFixed(2);
    
        let cc = carpentryCalc(classe, type, size, thick, value);
        let blank;
    
        for (let tt = 0; tt < cc.length; tt++) {
            if (cc[tt].path) {
            blank = qSVG.create('none', 'path', {
                d : cc[tt].path,
                "stroke-width": 1,
                fill: cc[tt].fill,
                stroke: cc[tt].stroke,
                'stroke-dasharray': cc[tt].strokeDashArray
            });
            }
            if (cc[tt].text) {
            blank = qSVG.create("none", "text", {
                x: cc[tt].x,
                y: cc[tt].y,
                'font-size': cc[tt].fontSize,
                stroke: cc[tt].stroke,
                "stroke-width": cc[tt].strokeWidth,
                'font-family': 'roboto',
                'text-anchor': 'middle',
                fill : cc[tt].fill
            });
            blank[0].textContent = cc[tt].text;
            }
            this.graph.append(blank);
    
        } // ENDFOR
        const bbox = this.graph.get(0).getBoundingClientRect();
        bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
        bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
        bbox.origin = {x: this.x, y: this.y};
        this.bbox = bbox;
        this.realBbox = [{x: -this.size/2, y: -this.thick/2}, {x: this.size/2, y: -this.thick/2},{x: this.size/2, y: this.thick/2},{x: -this.size/2, y: this.thick/2}];
        if (family == "byObject") this.family = cc.family;
        this.params = cc.params; // (bindBox, move, resize, rotate)
        cc.params.width ? this.size = cc.params.width : this.size = size;
        cc.params.height ? this.thick = cc.params.height : this.thick = thick;
  
        this.update = function() {
          console.log("update")
          this.width = (this.size / meter).toFixed(2);
          this.height= (this.thick / meter).toFixed(2);
          cc = carpentryCalc(this.class, this.type, this.size, this.thick, this.value);
          for (let tt = 0; tt < cc.length; tt++) {
              if (cc[tt].path)  {
                this.graph.find('path')[tt].setAttribute("d", cc[tt].path);
              }
              else {
                // this.graph.find('text').context.textContent = cc[tt].text;
              }
            }
            const hingeStatus = this.hinge; // normal - reverse
            let hingeUpdate;
            if (hingeStatus == 'normal') hingeUpdate = 1;
            else hingeUpdate = -1;
            this.graph.attr({"transform": "translate(" + (this.x) + "," + (this.y) + ") rotate(" +this.angle+ ",0,0) scale("+hingeUpdate+", 1)"});
            const bbox = this.graph.get(0).getBoundingClientRect();
            bbox.x = (bbox.x * factor) - (offset.left * factor) + originX_viewbox;
            bbox.y = (bbox.y * factor) - (offset.top * factor) + originY_viewbox;
            bbox.origin = {x: this.x, y: this.y};
            this.bbox = bbox;
  
            if (this.class == "text" && this.angle == 0){ this.realBbox = [
              {x: this.bbox.x, y: this.bbox.y}, {x: this.bbox.x+this.bbox.width, y: this.bbox.y},{x: this.bbox.x+this.bbox.width, y: this.bbox.y+this.bbox.height}, {x: this.bbox.x, y: this.bbox.y+this.bbox.height}];
              this.size = this.bbox.width;
              this.thick = this.bbox.height;
            }
  
              const angleRadian = -(this.angle) * (Math.PI / 180);
              this.realBbox = [{x: -this.size/2, y: -this.thick/2}, {x: this.size/2, y: -this.thick/2},{x: this.size/2, y: this.thick/2},{x: -this.size/2, y: this.thick/2}];
              const newRealBbox = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
                newRealBbox[0].x = (this.realBbox[0].y*Math.sin(angleRadian) + this.realBbox[0].x*Math.cos(angleRadian))+this.x;
                newRealBbox[1].x = (this.realBbox[1].y*Math.sin(angleRadian) + this.realBbox[1].x*Math.cos(angleRadian))+this.x;
                newRealBbox[2].x = (this.realBbox[2].y*Math.sin(angleRadian) + this.realBbox[2].x*Math.cos(angleRadian))+this.x;
                newRealBbox[3].x = (this.realBbox[3].y*Math.sin(angleRadian) + this.realBbox[3].x*Math.cos(angleRadian))+this.x;
                newRealBbox[0].y = (this.realBbox[0].y*Math.cos(angleRadian) - this.realBbox[0].x*Math.sin(angleRadian))+this.y;
                newRealBbox[1].y = (this.realBbox[1].y*Math.cos(angleRadian) - this.realBbox[1].x*Math.sin(angleRadian))+this.y;
                newRealBbox[2].y = (this.realBbox[2].y*Math.cos(angleRadian) - this.realBbox[2].x*Math.sin(angleRadian))+this.y;
                newRealBbox[3].y = (this.realBbox[3].y*Math.cos(angleRadian) - this.realBbox[3].x*Math.sin(angleRadian))+this.y;
              this.realBbox = newRealBbox;
            return true;
        }
    }
  
    roomMaker(Rooms) {
      globalArea = 0;
      const oldVertexNumber = [];
      if (Rooms.polygons.length == 0) ROOM = [];
      for (let pp = 0; pp < Rooms.polygons.length; pp++) {
        let foundRoom = false;
        let roomId;
        for (let rr = 0; rr < ROOM.length; rr++) {
          roomId = rr;
          let countCoords = Rooms.polygons[pp].coords.length;
          const diffCoords = qSVG.diffObjIntoArray(Rooms.polygons[pp].coords, ROOM[rr].coords);
          if (Rooms.polygons[pp].way.length == ROOM[rr].way.length) {
              if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 0 || diffCoords == 0)
                {
                  countCoords =  0;
                }
          }
          if (Rooms.polygons[pp].way.length == ROOM[rr].way.length + 1) {
            if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1 || diffCoords == 2) {
              countCoords = 0;
            }
          }
          if (Rooms.polygons[pp].way.length == ROOM[rr].way.length-1) {
            if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1) {
              countCoords = 0;
            }
          }
          if (countCoords == 0) {
            foundRoom = true;
            ROOM[rr].area = Rooms.polygons[pp].area;
            ROOM[rr].inside = Rooms.polygons[pp].inside;
            ROOM[rr].coords = Rooms.polygons[pp].coords;
            ROOM[rr].coordsOutside = Rooms.polygons[pp].coordsOutside;
            ROOM[rr].way = Rooms.polygons[pp].way;
            ROOM[rr].coordsInside = Rooms.polygons[pp].coordsInside;
            break;
          }
        }
        if (!foundRoom) {
            ROOM.push({coords: Rooms.polygons[pp].coords, coordsOutside : Rooms.polygons[pp].coordsOutside, coordsInside : Rooms.polygons[pp].coordsInside, inside: Rooms.polygons[pp].inside, way: Rooms.polygons[pp].way, area: Rooms.polygons[pp].area, surface: '', name: '', color: 'gradientWhite', showSurface: true, action: 'add'});
        }
      }
  
      const toSplice = [];
      for (let rr = 0; rr < ROOM.length; rr++) {
        let found = true;
        for (let pp = 0; pp < Rooms.polygons.length; pp++) {
          let countRoom = ROOM[rr].coords.length;
          const diffCoords = qSVG.diffObjIntoArray(Rooms.polygons[pp].coords, ROOM[rr].coords);
          if (Rooms.polygons[pp].way.length == ROOM[rr].way.length) {
              if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 0 || diffCoords == 0)
                {
                  countRoom =  0;
                }
          }
          if (Rooms.polygons[pp].way.length == ROOM[rr].way.length + 1) {
            if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1 || diffCoords == 2) {
              countRoom = 0;
            }
          }
          if (Rooms.polygons[pp].way.length == ROOM[rr].way.length - 1) {
            if (qSVG.diffArray(Rooms.polygons[pp].way, ROOM[rr].way).length == 1) {
              countRoom = 0;
            }
          }
          if (countRoom == 0) {found = true;break;}
          else found = false;
        }
        if (!found) toSplice.push(rr);
      }
  
      toSplice.sort(function(a, b) {
          return b-a;
        });
      for (let ss = 0; ss < toSplice.length; ss++) {
       ROOM.splice(toSplice[ss], 1);
      }
      $('#boxRoom').empty();
      $('#boxSurface').empty();
      $('#boxArea').empty();
      for (let rr = 0; rr < ROOM.length; rr++) {
  
          if (ROOM[rr].action == 'add') globalArea = globalArea + ROOM[rr].area;
  
          const pathSurface = ROOM[rr].coords;
          let pathCreate = "M"+pathSurface[0].x+","+pathSurface[0].y;
          for (let p = 1; p < pathSurface.length; p++) {
            pathCreate = pathCreate + " "+"L"+pathSurface[p].x+","+pathSurface[p].y;
            }
          if (ROOM[rr].inside.length > 0) {
            for (let ins = 0; ins < ROOM[rr].inside.length; ins++) {
              pathCreate = pathCreate+" M"+Rooms.polygons[ROOM[rr].inside[ins]].coords[Rooms.polygons[ROOM[rr].inside[ins]].coords.length-1].x+","+Rooms.polygons[ROOM[rr].inside[ins]].coords[Rooms.polygons[ROOM[rr].inside[ins]].coords.length-1].y;
              for (let free = Rooms.polygons[ROOM[rr].inside[ins]].coords.length-2; free > -1; free--) {
                pathCreate = pathCreate+" L"+Rooms.polygons[ROOM[rr].inside[ins]].coords[free].x+","+Rooms.polygons[ROOM[rr].inside[ins]].coords[free].y;
              }
            }
          }
          qSVG.create('boxRoom', 'path', {
                d: pathCreate,
                fill: 'url(#'+ROOM[rr].color+')',
                'fill-opacity': 1, stroke: 'none', 'fill-rule': 'evenodd', class: 'room'});
  
          qSVG.create('boxSurface', 'path', {
                d: pathCreate,
                fill: '#fff', 'fill-opacity': 1, stroke: 'none', 'fill-rule': 'evenodd', class: 'room'});
  
          const centroid = qSVG.polygonVisualCenter(ROOM[rr]);
  
          if (ROOM[rr].name != '') {
            const styled = {color:'#343938'};
            if (ROOM[rr].color == 'gradientBlack' || ROOM[rr].color == 'gradientBlue') styled.color = 'white';
            qSVG.textOnDiv(ROOM[rr].name, centroid, styled, 'boxArea');
          }
  
          if (ROOM[rr].name != '') centroid.y = centroid.y + 20;
          let area = ((ROOM[rr].area)/(meter*meter)).toFixed(2)+' m²';
          const styled = {color:'#343938', fontSize:'12.5px', fontWeight:'normal'};
          if (ROOM[rr].surface != '') {
            styled.fontWeight = 'bold';
            area = ROOM[rr].surface+' m²';
          }
          if (ROOM[rr].color == 'gradientBlack' || ROOM[rr].color == 'gradientBlue') styled.color = 'white';
          if (ROOM[rr].showSurface) qSVG.textOnDiv(area, centroid, styled, 'boxArea');
      }
      if (globalArea <= 0) {
        globalArea = 0;
        $('#areaValue').html('');
      }
      else {
        $('#areaValue').html('<i class="fa fa-map-o" aria-hidden="true"></i> '+(globalArea/3600).toFixed(1)+ ' m²');
      }
    }
  
    rayCastingRoom(point) {
      const x = point.x, y = point.y;
      const roomGroup = [];
      for (let polygon = 0; polygon < ROOM.length; polygon++) {
        const inside = qSVG.rayCasting(point, ROOM[polygon].coords);
  
        if (inside) {
          roomGroup.push(polygon);
        }
      }
      if (roomGroup.length > 0) {
        let bestArea = ROOM[roomGroup[0]].area;
        let roomTarget;
        for (let siz = 0; siz < roomGroup.length; siz++) {
          if (ROOM[roomGroup[siz]].area <= bestArea) {
            bestArea = ROOM[roomGroup[siz]].area;
            roomTarget = ROOM[roomGroup[siz]];
          }
        }
        return roomTarget;
      }
      else {
        return false;
      }
    }
  
    nearVertice(snap, range = 10000) {
      let bestDistance = Infinity;
      let bestVertice;
      for (let i = 0; i < WALLS.length; i++) {
        const distance1 = qSVG.gap(snap, {x: WALLS[i].start.x, y: WALLS[i].start.y});
        const distance2 = qSVG.gap(snap, {x: WALLS[i].end.x, y: WALLS[i].end.y});
        if (distance1 < distance2 && distance1 < bestDistance) {
          bestDistance = distance1;
          bestVertice = {number: WALLS[i], x: WALLS[i].start.x, y: WALLS[i].start.y, distance: Math.sqrt(bestDistance)};
        }
        if (distance2 < distance1 && distance2 < bestDistance) {
          bestDistance = distance2;
          bestVertice = {number: WALLS[i], x: WALLS[i].end.x, y: WALLS[i].end.y, distance: Math.sqrt(bestDistance)};
        }
      }
      if (bestDistance < range*range) return bestVertice;
      else return false;
    }
  
    nearWall(snap, range = Infinity) {
      let wallDistance = Infinity;
      let wallSelected = {};
      let result;
      if (WALLS.length == 0) return false;
      for (let e = 0; e < WALLS.length; e++) {
        const eq = qSVG.createEquation(WALLS[e].start.x, WALLS[e].start.y, WALLS[e].end.x, WALLS[e].end.y);
        result = qSVG.nearPointOnEquation(eq, snap);
        if (result.distance < wallDistance && qSVG.btwn(result.x, WALLS[e].start.x, WALLS[e].end.x) && qSVG.btwn(result.y, WALLS[e].start.y, WALLS[e].end.y)) {
            wallDistance = result.distance;
            wallSelected = {wall: WALLS[e], x: result.x, y: result.y, distance: result.distance};
        }
      }
      const vv = this.nearVertice(snap);
      if (vv.distance < wallDistance) {
          wallDistance = vv.distance;
          wallSelected = {wall: vv.number, x: vv.x, y: vv.y, distance: vv.distance};
      }
      if (wallDistance <= range) return wallSelected;
      else return false;
    }
  
    showScaleBox() {
      if (ROOM.length > 0) {
        let minX, minY, maxX, maxY;
        let px, py;
        for (let i = 0; i < WALLS.length; i++) {
          px = WALLS[i].start.x;
          py = WALLS[i].start.y;
          if (!i || px < minX) minX = px;
          if (!i || py < minY) minY = py;
          if (!i || px > maxX) maxX = px;
          if (!i || py > maxY) maxY = py;
          px = WALLS[i].end.x;
          py = WALLS[i].end.y;
          if (!i || px < minX) minX = px;
          if (!i || py < minY) minY = py;
          if (!i || px > maxX) maxX = px;
          if (!i || py > maxY) maxY = py;
        }
        const width = maxX - minX;
        const height = maxY - minY;
  
        const labelWidth = ((maxX - minX) / meter).toFixed(2);
        const labelHeight = ((maxY - minY) / meter).toFixed(2);
  
        let sideRight = 'm'+(maxX+40)+','+minY;
        sideRight = sideRight + ' l60,0 m-40,10 l10,-10 l10,10 m-10,-10';
        sideRight = sideRight + ' l0,'+height;
        sideRight = sideRight + ' m-30,0 l60,0 m-40,-10 l10,10 l10,-10';
  
        sideRight = sideRight + 'M'+(minX)+','+(minY-40);
        sideRight = sideRight + ' l0,-60 m10,40 l-10,-10 l10,-10 m-10,10';
        sideRight = sideRight + ' l'+width+',0';
        sideRight = sideRight + ' m0,30 l0,-60 m-10,40 l10,-10 l-10,-10';
  
        $('#boxScale').empty();
  
        qSVG.create('boxScale', 'path', {
            d: sideRight,
            stroke: "#555",
            fill: "none",
            "stroke-width": 0.3,
            "stroke-linecap": "butt",
            "stroke-linejoin": "miter",
            "stroke-miterlimit": 4,
            "fill-rule": "nonzero"
        });
  
        let text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text1.setAttributeNS(null, 'x', (maxX+70));
        text1.setAttributeNS(null, 'y', ((maxY + minY) /2) + 35);
        text1.setAttributeNS(null, 'fill', '#555');
        text1.setAttributeNS(null, 'text-anchor', 'middle');
        text1.textContent = labelHeight + ' m';
        text1.setAttribute("transform", "rotate(270 " + (maxX+70) + "," + (maxY + minY) /2 + ")");
        $('#boxScale').append(text1);
  
        const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text2.setAttributeNS(null, 'x', (maxX + minX) /2);
        text2.setAttributeNS(null, 'y', (minY-95));
        text2.setAttributeNS(null, 'fill', '#555');
        text2.setAttributeNS(null, 'text-anchor', 'middle');
        text2.textContent = labelWidth + ' m';
        $('#boxScale').append(text2);
  
      }
    }

    // *****************************************************************************************************
// ******************************        MOUSE MOVE          *******************************************
// *****************************************************************************************************

   _MOUSEMOVE(event) {
        event.preventDefault();
        $('.sub').hide(100);

        //**************************************************************************
        //********************   TEXTE   MODE **************************************
        //**************************************************************************
        if (mode == 'text_mode') {
            snap = calcul_snap(event, grid_snap);
            if (action == 0) {
                cursor('text');
            } else {
                cursor('none');
            }
        }

        //**************************************************************************
        //**************        OBJECT   MODE **************************************
        //**************************************************************************
        if (mode == 'object_mode') {
            snap = calcul_snap(event, grid_snap);
            if (typeof(binder) == 'undefined') {
                $('#object_list').hide(200);
                if (modeOption == 'simpleStair') {
                    binder = new editor.obj2D("free", "stair", "simpleStair", snap, 0, 0, 0, "normal", 0, 15);
                } else {
                    const typeObj = modeOption;
                    binder = new editor.obj2D("free", "energy", typeObj, snap, 0, 0, 0, "normal", 0);
                }
                $('#boxbind').append(binder.graph);
            } else {
                if ((binder.family != 'stick' && binder.family != 'collision') || WALLS.length == 0) {
                    binder.x = snap.x;
                    binder.y = snap.y;
                    binder.oldX = binder.x;
                    binder.oldY = binder.y;
                    binder.update();
                }
                if (binder.family == 'collision') {
                    let found = false;

                    if (editor.rayCastingWalls({x: binder.bbox.left, y:binder.bbox.top})) found = true;
                    if (!found && editor.rayCastingWalls({x: binder.bbox.left, y:binder.bbox.bottom})) found = true;
                    if (!found && editor.rayCastingWalls({x: binder.bbox.right, y:binder.bbox.top})) found = true;
                    if (!found && editor.rayCastingWalls({x: binder.bbox.right, y:binder.bbox.bottom})) found = true;

                    if (!found) {
                        binder.x = snap.x;
                        binder.y = snap.y;
                        binder.oldX = binder.x;
                        binder.oldY = binder.y;
                        binder.update();
                    } else {
                        binder.x = binder.oldX;
                        binder.y = binder.oldY;
                        binder.update();
                    }
                }
                if (binder.family == 'stick') {
                    pos = editor.stickOnWall(snap);
                    binder.oldX = pos.x;
                    binder.oldY = pos.y;
                    let angleWall = qSVG.angleDeg(pos.wall.start.x, pos.wall.start.y, pos.wall.end.x, pos.wall.end.y);
                    const v1 = qSVG.vectorXY({x:pos.wall.start.x, y:pos.wall.start.y}, {x:pos.wall.end.x, y:pos.wall.end.y});
                    const v2 = qSVG.vectorXY({x:pos.wall.end.x, y:pos.wall.end.y}, snap);
                    binder.x = pos.x - Math.sin(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
                    binder.y = pos.y - Math.cos(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
                    const newAngle = qSVG.vectorDeter(v1, v2);
                    if (Math.sign(newAngle) == 1) {
                        angleWall+=180;
                        binder.x = pos.x + Math.sin(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
                        binder.y = pos.y + Math.cos(pos.wall.angle*(360/2*Math.PI))*binder.thick/2;
                    }
                    binder.angle = angleWall;
                    binder.update();
                }
            }
        }

        //**************************************************************************
        //**************        DISTANCE MODE **************************************
        //**************************************************************************
        if (mode == 'distance_mode') {
            snap = calcul_snap(event, grid_snap);
            if (typeof(binder) == 'undefined') {
                cross = qSVG.create("boxbind", "path", {
                    d: "M-3000,0 L3000,0 M0,-3000 L0,3000",
                    "stroke-width": 0.5,
                    "stroke-opacity": "0.8",
                    stroke: "#e2b653",
                    fill : "#e2b653"
                });
                binder = new editor.obj2D("free", "measure", "", {x:0,y:0}, 0, 0, 0, "normal", 0, "");
                labelMeasure = qSVG.create("none", "text", {
                    x: 0,
                    y: - 10,
                'font-size': '1.2em',
                    stroke: "#ffffff",
                    "stroke-width": "0.4px",
                    'font-family': 'roboto',
                    'text-anchor': 'middle',
                    fill : "#3672d9"
                });
                binder.graph.append(labelMeasure);
                $('#boxbind').append(binder.graph);
            } else {
                x = snap.x;
                y = snap.y;
                cross.attr({
                    "transform": "translate(" + (snap.x) + "," + (snap.y) + ")"
                });
                if (action == 1) {
                    const startText = qSVG.middle(pox, poy, x, y);
                    const angleText = qSVG.angle(pox, poy, x, y);
                    let valueText = qSVG.measure({
                        x: pox,
                        y: poy
                    }, {
                        x: x,
                        y: y
                    });
                    binder.size = valueText;
                    binder.x = startText.x;
                    binder.y = startText.y;
                    binder.angle = angleText.deg;
                    valueText = (valueText / meter).toFixed(2) + ' m';
                    //labelMeasure.context.textContent = valueText;
                    labelMeasure[0].textContent = valueText;

                    binder.update();
                }
            }
        }

        //**************************************************************************
        //**************        ROOM MODE *****************************************
        //**************************************************************************

        if (mode == 'room_mode') {
            snap = calcul_snap(event, grid_snap);
            let roomTarget = editor.rayCastingRoom(snap);
            if (roomTarget) {
                if (typeof(binder) != 'undefined') {
                    binder.remove();
                }

                const pathSurface = roomTarget.coords;
                let pathCreate = "M"+pathSurface[0].x+","+pathSurface[0].y;
                for (let p = 1; p < pathSurface.length-1; p++) {
                    pathCreate = pathCreate + " "+"L"+pathSurface[p].x+","+pathSurface[p].y;
                }
                pathCreate = pathCreate + "Z";

                if (roomTarget.inside.length > 0) {
                    for (let ins = 0; ins < roomTarget.inside.length; ins++) {
                        pathCreate = pathCreate+" M"+Rooms.polygons[roomTarget.inside[ins]].coords[Rooms.polygons[roomTarget.inside[ins]].coords.length-1].x+","+Rooms.polygons[roomTarget.inside[ins]].coords[Rooms.polygons[roomTarget.inside[ins]].coords.length-1].y;
                        for (let free = Rooms.polygons[roomTarget.inside[ins]].coords.length-2; free > -1; free--) {
                            pathCreate = pathCreate+" L"+Rooms.polygons[roomTarget.inside[ins]].coords[free].x+","+Rooms.polygons[roomTarget.inside[ins]].coords[free].y;
                        }
                    }
                }

                binder = qSVG.create('boxbind', 'path', {
                        id: 'roomSelected',
                        d: pathCreate,
                        fill: '#c9c14c',
                        'fill-opacity': 0.5,
                        stroke: '#c9c14c',
                        'fill-rule': 'evenodd',
                        'stroke-width': 3
                });
                binder.type = 'room';
                binder.area = roomTarget.area;
                binder.id = ROOM.indexOf(roomTarget);
            } else {
                if (typeof(binder) != 'undefined') {
                    binder.remove();
                }
            }
        }

        //**************************************************************************
        //**************        DOOR/WINDOW MODE   *********************************
        //**************************************************************************

        if (mode == 'door_mode') {
            snap = calcul_snap(event, grid_snap);
            let wallSelect = editor.nearWall(snap);
            if (wallSelect) {
                const wall = wallSelect.wall;
                if (wall.type != 'separate') {
                    if (typeof(binder) == 'undefined') {
                                            // family, classe, type, pos, angle, angleSign, size, hinge, thick
                        binder = new editor.obj2D("inWall", "doorWindow", modeOption, wallSelect, 0, 0, 60, "normal", wall.thick);
                        let angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                        const v1 = qSVG.vectorXY({x:wall.start.x, y:wall.start.y}, {x:wall.end.x, y:wall.end.y});
                        const v2 = qSVG.vectorXY({x:wall.end.x, y:wall.end.y}, snap);
                        const newAngle = qSVG.vectorDeter(v1, v2);
                        if (Math.sign(newAngle) == 1)  {
                            angleWall+=180;
                            binder.angleSign = 1;
                        }
                        const startCoords = qSVG.middle(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                        binder.x = startCoords.x;
                        binder.y = startCoords.y;
                        binder.angle = angleWall;
                        binder.update();
                        $('#boxbind').append(binder.graph);
                    } else {
                        let angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                        const v1 = qSVG.vectorXY({x:wall.start.x, y:wall.start.y}, {x:wall.end.x, y:wall.end.y});
                        const v2 = qSVG.vectorXY({x:wall.end.x, y:wall.end.y}, snap);
                        const newAngle = qSVG.vectorDeter(v1, v2);
                        binder.angleSign = 0;
                        if (Math.sign(newAngle) == 1) {
                            binder.angleSign = 1;
                            angleWall+=180;
                        }

                        const limits = limitObj(wall.equations.base, binder.size, wallSelect);
                        if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                            binder.x = wallSelect.x;
                            binder.y = wallSelect.y;
                            binder.angle = angleWall;
                            binder.thick = wall.thick;
                            binder.limit = limits;
                            binder.update();
                        }

                        if ((wallSelect.x == wall.start.x && wallSelect.y == wall.start.y) || (wallSelect.x == wall.end.x && wallSelect.y == wall.end.y)) {
                            if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y)) {
                                binder.x = limits[0].x;
                                binder.y = limits[0].y;                  
                            }
                            if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                                binder.x = limits[1].x;
                                binder.y = limits[1].y;
                            }
                            binder.limit = limits;
                            binder.angle = angleWall;
                            binder.thick = wall.thick;
                            binder.update();
                        }
                    }
                }
            }else {
                if (typeof(binder) != 'undefined') {
                    binder.graph.remove();
                }
            }
        } // END DOOR MODE

        //**************************************************************************
        //**************        NODE MODE *****************************************
        //**************************************************************************

        if (mode == 'node_mode') {
            snap = calcul_snap(event, grid_snap);
            let addNode = editor.nearWall(snap, 30);

            if (typeof(binder) == 'undefined') {
                if (addNode) {
                    const x2 = addNode.wall.end.x;
                    const y2 = addNode.wall.end.y;
                    const x1 = addNode.wall.start.x;
                    const y1 = addNode.wall.start.y;
                    angleWall = qSVG.angle(x1, y1, x2, y2);
                    binder = qSVG.create('boxbind', 'path', {
                        id: "circlebinder",
                        d: "M-20,-10 L-13,0 L-20,10 Z M-13,0 L13,0 M13,0 L20,-10 L20,10 Z",
                        stroke: "#5cba79",
                        fill : "#5cba79",
                        "stroke-width": "1.5px"
                    });
                    binder.attr({
                        "transform": "translate(" + (addNode.x) + "," + (addNode.y) + ") rotate(" + (angleWall.deg+90) + ",0,0)"
                    });
                    binder.data = addNode;
                    binder.x1 = x1;
                    binder.x2 = x2;
                    binder.y1 = y1;
                    binder.y2 = y2;
                }
            } else {
                if (addNode) {
                    if (addNode) {
                        const x2 = addNode.wall.end.x;
                        const y2 = addNode.wall.end.y;
                        const x1 = addNode.wall.start.x;
                        const y1 = addNode.wall.start.y;
                        angleWall = qSVG.angle(x1, y1, x2, y2);
                        binder.attr({
                            "transform": "translate(" + (addNode.x) + "," + (addNode.y) + ") rotate(" + (angleWall.deg+90) + ",0,0)"
                        });
                        binder.data = addNode;
                    } else {
                        binder.remove();
                    }
                } else {
                    binder.remove();
                }
            }
        } // END NODE MODE

        //**********************************  SELECT MODE ***************************************************************
        if (mode == 'select_mode' && drag == 'off') { // FIRST TEST ON SELECT MODE (and drag OFF) to detect MOUSEOVER DOOR

            snap = calcul_snap(event, 'off');

            let objTarget = false;
            for (let i = 0; i < OBJDATA.length; i++) {
                const objX1 = OBJDATA[i].bbox.left;
                const objX2 = OBJDATA[i].bbox.right;
                const objY1 = OBJDATA[i].bbox.top;
                const objY2 = OBJDATA[i].bbox.bottom;
                const realBboxCoords = OBJDATA[i].realBbox;
                if (qSVG.rayCasting(snap, realBboxCoords)) {
                    objTarget = OBJDATA[i];
                }
            }
            if (objTarget !== false) {
                if (typeof(binder) != 'undefined' && (binder.type == 'segment')) {
                    binder.graph.remove();
                    cursor('default');
                }
                if (objTarget.params.bindBox) { // OBJ -> BOUNDINGBOX TOOL
                    if (typeof(binder) == 'undefined') {
                        binder = new editor.obj2D("free", "boundingBox", "", objTarget.bbox.origin, objTarget.angle, 0, objTarget.size, "normal", objTarget.thick, objTarget.realBbox);
                        binder.update();
                        binder.obj = objTarget;
                        binder.type = 'boundingBox';
                        binder.oldX = binder.x;
                        binder.oldY = binder.y;
                        $('#boxbind').append(binder.graph);
                        if (!objTarget.params.move) cursor('trash'); // LIKE MEASURE ON PLAN
                        if (objTarget.params.move) cursor('move');
                    }
                } else {  // DOOR, WINDOW, APERTURE.. -- OBJ WITHOUT BINDBOX (params.bindBox = False) -- !!!!
                    if (typeof(binder) == 'undefined') {
                        let wallList = editor.rayCastingWall(objTarget);
                        if (wallList.length > 1) wallList = wallList[0];
                        inWallRib(wallList);
                        const thickObj = wallList.thick;
                        const sizeObj = objTarget.size;

                        binder = new editor.obj2D("inWall", "socle", "", objTarget, objTarget.angle, 0, sizeObj, "normal", thickObj);
                        binder.update();

                        binder.oldXY = {x: objTarget.x, y: objTarget.y}; // FOR OBJECT MENU
                        $('#boxbind').append(binder.graph);
                    } else {
                        if (event.target == binder.graph.get(0).firstChild) {
                        cursor('move');
                        binder.graph.get(0).firstChild.setAttribute("class","circle_css_2");
                        binder.type = "obj";
                        binder.obj = objTarget;
                        }
                        else {
                        cursor('default');
                        binder.graph.get(0).firstChild.setAttribute("class","circle_css_1");
                        binder.type = false;
                        }
                    }
                }
            } else {
                if (typeof(binder) != 'undefined') {
                    if (typeof(binder.graph) != 'undefined') binder.graph.remove();
                    console.log(binder)
                    if (binder.type == 'node') binder.remove();
                    cursor('default');
                    rib();

                }
            }

            // BIND CIRCLE IF nearNode and GROUP ALL SAME XY SEG POINTS
            let wallNode = editor.nearWallNode(snap, 20);
            if (wallNode) {
                if (typeof(binder) == 'undefined' || binder.type == 'segment') {
                    binder = qSVG.create('boxbind', 'circle', {
                        id: "circlebinder",
                        class: "circle_css_2",
                        cx: wallNode.x,
                        cy: wallNode.y,
                        r: Rcirclebinder
                    });
                    binder.data = wallNode;
                    binder.type = "node";
                    if ($('#linebinder').length) $('#linebinder').remove();
                } else {
                // REMAKE CIRCLE_CSS ON BINDER AND TAKE DATA SEG GROUP
                    // if (typeof(binder) != 'undefined') {
                    //     binder.attr({
                    //         class: "circle_css_2"
                    //     });
                    // }
                }
                cursor('move');
            } else {
                if (typeof(binder) != "undefined" && binder.type == 'node') {
                    binder.remove();
                    hideAllSize();
                    cursor('default');
                    rib();
                }
            }


            // BIND WALL WITH NEARPOINT function ---> WALL BINDER CREATION
            wallBind = editor.rayCastingWalls(snap, WALLS)
            if (wallBind) {
                if (wallBind.length > 1) wallBind = wallBind[wallBind.length-1];
                if (wallBind && typeof(binder) == 'undefined') {
                    const objWall = editor.objFromWall(wallBind);
                    if (objWall.length > 0) editor.inWallRib2(wallBind);
                    binder = {};
                    binder.wall = wallBind;
                    inWallRib(binder.wall);
                    const line = qSVG.create('none', 'line', {
                        x1: binder.wall.start.x, y1: binder.wall.start.y, x2: binder.wall.end.x, y2: binder.wall.end.y,
                        "stroke-width": 5,
                        stroke: "#5cba79"
                    });
                    const ball1 = qSVG.create('none', 'circle', {
                        class: "circle_css",
                        cx: binder.wall.start.x, cy: binder.wall.start.y,
                        r: Rcirclebinder/1.8
                    });
                    const ball2 = qSVG.create('none', 'circle', {
                        class: "circle_css",
                        cx: binder.wall.end.x, cy: binder.wall.end.y,
                        r: Rcirclebinder/1.8
                    });
                    binder.graph = qSVG.create('none', 'g');
                    binder.graph.append(line);
                    binder.graph.append(ball1);
                    binder.graph.append(ball2);
                    $('#boxbind').append(binder.graph);
                    binder.type = "segment";
                    cursor('pointer');
                }
            } else {
                wallBind = editor.nearWall(snap, 6)
                if (wallBind) {
                    if (wallBind && typeof(binder) == 'undefined') {
                        wallBind = wallBind.wall;
                        const objWall = editor.objFromWall(wallBind);
                        if (objWall.length > 0) editor.inWallRib2(wallBind);
                        binder = {};
                        binder.wall = wallBind;
                        inWallRib(binder.wall);
                        const line = qSVG.create('none', 'line', {
                            x1: binder.wall.start.x, y1: binder.wall.start.y, x2: binder.wall.end.x, y2: binder.wall.end.y,
                            "stroke-width": 5,
                            stroke: "#5cba79"
                        });
                        const ball1 = qSVG.create('none', 'circle', {
                            class: "circle_css",
                            cx: binder.wall.start.x, cy: binder.wall.start.y,
                            r: Rcirclebinder/1.8
                        });
                        const ball2 = qSVG.create('none', 'circle', {
                            class: "circle_css",
                            cx: binder.wall.end.x, cy: binder.wall.end.y,
                            r: Rcirclebinder/1.8
                        });
                        binder.graph = qSVG.create('none', 'g');
                        binder.graph.append(line);
                        binder.graph.append(ball1);
                        binder.graph.append(ball2);
                        $('#boxbind').append(binder.graph);
                        binder.type = "segment";
                        cursor('pointer');
                    }
                }
                else {
                    if (typeof(binder) != "undefined" && binder.type == 'segment') {
                        binder.graph.remove();
                        hideAllSize();
                        cursor('default');
                        rib();
                    }
                }
            }
        } // END mode == 'select_mode' && drag == 'off'

        // ------------------------------  LINE MODE ------------------------------------------------------

        if ((mode == 'line_mode' || mode == 'partition_mode') && action == 0) {
            snap = calcul_snap(event, 'off');
            cursor('grab');
            pox = snap.x;
            poy = snap.y;
            let helpConstruc = intersection(snap, 25);
            if (helpConstruc) {
                if (helpConstruc.distance < 10) {
                    pox = helpConstruc.x;
                    poy = helpConstruc.y;
                    cursor('grab');
                } else {
                    cursor('crosshair');
                }
            }
            let wallNode = editor.nearWallNode(snap, 20);
            if (wallNode) {
                pox = wallNode.x;
                poy = wallNode.y;
                cursor('grab');
                if (typeof(binder) == 'undefined') {
                    binder = qSVG.create('boxbind', 'circle', {
                        id: "circlebinder",
                        class: "circle_css_2",
                        cx: wallNode.x,
                        cy: wallNode.y,
                        r: Rcirclebinder / 1.5
                    });
                }
                intersectionOff();
            } else {
                if (!helpConstruc) cursor('crosshair');
                if (typeof(binder) != "undefined") {
                if (binder.graph) binder.graph.remove();
                else binder.remove();
                }
            }
        }

        // ******************************************************************************************************
        // ************************** ACTION = 1   LINE MODE => WALL CREATE                 *********************
        // ******************************************************************************************************

        if (action == 1 && (mode == 'line_mode' || mode == 'partition_mode')) {

            snap = calcul_snap(event, grid_snap);
            x = snap.x;
            y = snap.y;
            starter = minMoveGrid(snap);

                if (!$('#line_construc').length) {
                    let wallNode = editor.nearWallNode(snap, 20);
                    if (wallNode) {
                        pox = wallNode.x;
                        poy = wallNode.y;

                        wallStartConstruc = false;
                        if (wallNode.bestWall == WALLS.length-1) {
                        cursor('validation');
                        }
                        else {
                        cursor('grab');
                        }
                    } else {
                        cursor('crosshair');
                    }
                }

                if (starter > grid) {
                    if (!$('#line_construc').length) {
                    let ws = 20;
                    if (mode == 'partition_mode') ws = 10;
                        lineconstruc = qSVG.create("boxbind", "line", {
                            id: "line_construc",
                            x1: pox,
                            y1: poy,
                            x2: x,
                            y2: y,
                            "stroke-width": ws,
                            "stroke-linecap": "butt",
                            "stroke-opacity": 0.7,
                            stroke: "#9fb2e2"
                        });

                        svgadd = qSVG.create("boxbind", "line", { // ORANGE TEMP LINE FOR ANGLE 0 90 45 -+
                            id: "linetemp",
                            x1: pox,
                            y1: poy,
                            x2: x,
                            y2: y,
                            "stroke": "transparent",
                            "stroke-width": 0.5,
                            "stroke-opacity": "0.9"
                        });
                    } else { // THE LINES AND BINDER ARE CREATED

                        $('#linetemp').attr({
                            x2: x,
                            y2: y
                        });
                        let helpConstrucEnd = intersection(snap, 10);
                        if (helpConstrucEnd) {
                            x = helpConstrucEnd.x;
                            y = helpConstrucEnd.y;
                        }
                        let wallEndConstruc = editor.nearWall(snap, 12);
                        if (wallEndConstruc) { // TO SNAP SEGMENT TO FINALIZE X2Y2
                            x = wallEndConstruc.x;
                            y = wallEndConstruc.y;
                            cursor('grab');
                        } else {
                            cursor('crosshair');
                        }

                        // nearNode helped to attach the end of the construc line
                        let wallNode = editor.nearWallNode(snap, 20);
                        if (wallNode) {
                            if (typeof(binder) == 'undefined') {
                                binder = qSVG.create('boxbind', 'circle', {
                                    id: "circlebinder",
                                    class: "circle_css_2",
                                    cx: wallNode.x,
                                    cy: wallNode.y,
                                    r: Rcirclebinder / 1.5
                                });
                            }
                            $('#line_construc').attr({
                                x2: wallNode.x,
                                y2: wallNode.y
                            });
                            x = wallNode.x;
                            y = wallNode.y;
                            wallEndConstruc = true;
                            intersectionOff();
                            if (wallNode.bestWall == WALLS.length-1 && document.getElementById("multi").checked) {
                            cursor('validation');
                            }
                            else {
                            cursor('grab');
                            }
                        } else {
                            if (typeof(binder) != "undefined") {
                                binder.remove();
                            }
                            if (wallEndConstruc === false) cursor('crosshair');
                        }
                        // LINETEMP AND LITLLE SNAPPING FOR HELP TO CONSTRUC ANGLE 0 90 45 *****************************************
                        const fltt = qSVG.angle(pox, poy, x, y);
                        const flt = Math.abs(fltt.deg);
                        const coeff = fltt.deg / flt; // -45 -> -1     45 -> 1
                        const phi = poy - (coeff * pox);
                        const Xdiag = (y - phi) / coeff;
                        if (typeof(binder) == 'undefined') {
                            // HELP FOR H LINE
                            let found = false;
                            if (flt < 15 && Math.abs(poy - y) < 25) {
                                y = poy;
                                found = true;
                            } // HELP FOR V LINE
                            if (flt > 75 && Math.abs(pox - x) < 25) {
                                x = pox;
                                found = true;
                            } // HELP FOR DIAG LINE
                            if (flt < 55 && flt > 35 && Math.abs(Xdiag - x) < 20) {
                                x = Xdiag;
                                found = true;
                            }
                            if (found) $('#line_construc').attr({"stroke-opacity": 1});
                            else $('#line_construc').attr({"stroke-opacity": 0.7});
                        }
                        $('#line_construc').attr({
                            x2: x,
                            y2: y
                        });

                        // SHOW WALL SIZE -------------------------------------------------------------------------
                        const startText = qSVG.middle(pox, poy, x, y);
                        const angleText = qSVG.angle(pox, poy, x, y);
                        const valueText = ((qSVG.measure({
                            x: pox,
                            y: poy
                        },{
                            x: x,
                            y: y
                        })) / 60).toFixed(2);
                        if (typeof(lengthTemp) == 'undefined') {
                        lengthTemp = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        lengthTemp.setAttributeNS(null, 'x', startText.x);
                        lengthTemp.setAttributeNS(null, 'y', (startText.y) - 15);
                        lengthTemp.setAttributeNS(null, 'text-anchor', 'middle');
                        lengthTemp.setAttributeNS(null, 'stroke', 'none');
                        lengthTemp.setAttributeNS(null, 'stroke-width', '0.6px');
                        lengthTemp.setAttributeNS(null, 'fill', '#777777');
                        lengthTemp.textContent = valueText + 'm';
                        $('#boxbind').append(lengthTemp);
                        }
                        if (typeof(lengthTemp) != 'undefined' && valueText > 0.1)
                        {
                        lengthTemp.setAttributeNS(null, 'x', startText.x);
                        lengthTemp.setAttributeNS(null, 'y', (startText.y) - 15);
                        lengthTemp.setAttribute("transform", "rotate(" + angleText.deg + " " + startText.x + "," + startText.y + ")");
                        lengthTemp.textContent = valueText + ' m';
                        }
                        if (typeof(lengthTemp) != 'undefined' && valueText < 0.1)
                        {
                        lengthTemp.textContent = "";
                        }
                    }
                }
        } // END LINE MODE DETECT && ACTION = 1

        //ONMOVE
        // **************************************************************************************************
        //        ____ ___ _   _ ____  _____ ____
        //        | __ )_ _| \ | |  _ \| ____|  _ \
        //        |  _ \| ||  \| | | | |  _| | |_) |
        //        | |_) | || |\  | |_| | |___|  _ <
        //        |____/___|_| \_|____/|_____|_| \_\
        //
        // **************************************************************************************************

        if (mode == 'bind_mode') {

            snap = calcul_snap(event, grid_snap);

            if (binder.type == 'node') {
                const coords = snap;
                let magnetic = false;
                for (const k in wallListRun) {
                if (isObjectsEquals(wallListRun[k].end, binder.data)) {
                    if (Math.abs(wallListRun[k].start.x - snap.x) < 20) {coords.x = wallListRun[k].start.x;magnetic="H";}
                    if (Math.abs(wallListRun[k].start.y - snap.y) < 20) {coords.y = wallListRun[k].start.y;magnetic="V";}
                }
                if (isObjectsEquals(wallListRun[k].start, binder.data)) {
                    if (Math.abs(wallListRun[k].end.x - snap.x) < 20) {coords.x = wallListRun[k].end.x;magnetic="H";}
                    if (Math.abs(wallListRun[k].end.y - snap.y) < 20) {coords.y = wallListRun[k].end.y;magnetic="V";}
                }
                }
                let nodeMove = editor.nearWallNode(snap, 15, wallListRun)
                if (nodeMove) {
                    coords.x = nodeMove.x;
                    coords.y = nodeMove.y;
                    $('#circlebinder').attr({"class": "circleGum", cx: coords.x, cy: coords.y});
                    cursor('grab');
                } else {
                    if (magnetic != false) {
                        if (magnetic == "H") snap.x = coords.x;
                        else snap.y = coords.y;
                    }
                    let helpConstruc = intersection(snap, 10, wallListRun);
                    if (helpConstruc) {
                        coords.x = helpConstruc.x;
                        coords.y = helpConstruc.y;
                        snap.x = helpConstruc.x;
                        snap.y = helpConstruc.y;
                        if (magnetic != false) {
                            if (magnetic == "H") snap.x = coords.x;
                            else snap.y = coords.y;
                        }
                        cursor('grab');
                    } else {
                        cursor('move');
                    }
                    binder.remove()
                //$('#circlebinder').attr({"class": "circle_css", cx: coords.x, cy: coords.y});
                }
                for (const k in wallListRun) {
                if (isObjectsEquals(wallListRun[k].start, binder.data)) {
                    wallListRun[k].start.x = coords.x;
                    wallListRun[k].start.y = coords.y;
                }
                if (isObjectsEquals(wallListRun[k].end, binder.data)) {
                    wallListRun[k].end.x = coords.x;
                    wallListRun[k].end.y = coords.y;
                }
                }
                binder.data = coords;
                editor.wallsComputing(WALLS, false); // UPDATE FALSE

                for (const k in wallListObj) {
                const wall = wallListObj[k].wall;
                const objTarget = wallListObj[k].obj;
                const angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                const limits = limitObj(wall.equations.base, 2*wallListObj[k].distance, wallListObj[k].from); // COORDS OBJ AFTER ROTATION
                let indexLimits = 0;
                if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) indexLimits = 1;
                // NEW COORDS OBJDATA[obj]
                objTarget.x = limits[indexLimits].x;
                objTarget.y = limits[indexLimits].y;
                objTarget.angle = angleWall;
                if (objTarget.angleSign == 1) objTarget.angle = angleWall + 180;

                const limitBtwn = limitObj(wall.equations.base, objTarget.size, objTarget); // OBJ SIZE OK BTWN xy1/xy2

                if (qSVG.btwn(limitBtwn[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limitBtwn[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limitBtwn[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limitBtwn[1].y, wall.start.y, wall.end.y)) {
                    objTarget.limit = limitBtwn;
                    objTarget.update();
                }
                else {
                    objTarget.graph.remove();
                    OBJDATA.splice(wall.indexObj, 1);
                    wallListObj.splice(k, 1);
                }
                }
                // for (k in toClean)
                $('#boxRoom').empty();
                $('#boxSurface').empty();
                Rooms = qSVG.polygonize(WALLS);
                editor.roomMaker(Rooms);
            }

            // WALL MOVING ----BINDER TYPE SEGMENT-------- FUNCTION FOR H,V and Calculate Vectorial Translation

            if (binder.type == 'segment' && action == 1) {
                rib();

                if (equation2.A == 'v') { equation2.B = snap.x;}
                else if (equation2.A == 'h') { equation2.B = snap.y;}
                else { equation2.B = snap.y - (snap.x * equation2.A);}

                const intersection1 = qSVG.intersectionOfEquations(equation1, equation2, "obj");
                const intersection2 = qSVG.intersectionOfEquations(equation2, equation3, "obj");
                const intersection3 = qSVG.intersectionOfEquations(equation1, equation3, "obj");

                if (binder.wall.parent != null) {
                if (isObjectsEquals(binder.wall.parent.end, binder.wall.start)) binder.wall.parent.end = intersection1;
                else if (isObjectsEquals(binder.wall.parent.start, binder.wall.start)) binder.wall.parent.start = intersection1;
                else binder.wall.parent.end = intersection1;
                }

                if (binder.wall.child != null) {
                if (isObjectsEquals(binder.wall.child.start, binder.wall.end)) binder.wall.child.start = intersection2;
                else if (isObjectsEquals(binder.wall.child.end, binder.wall.end)) binder.wall.child.end = intersection2;
                else binder.wall.child.start = intersection2;
                }

                binder.wall.start = intersection1;
                binder.wall.end = intersection2;
                binder.graph.remove()
                // binder.graph[0].children[0].setAttribute("x1",intersection1.x);
                // binder.graph[0].children[0].setAttribute("x2",intersection2.x);
                // binder.graph[0].children[0].setAttribute("y1",intersection1.y);
                // binder.graph[0].children[0].setAttribute("y2",intersection2.y);
                // binder.graph[0].children[1].setAttribute("cx",intersection1.x);
                // binder.graph[0].children[1].setAttribute("cy",intersection1.y);
                // binder.graph[0].children[2].setAttribute("cx",intersection2.x);
                // binder.graph[0].children[2].setAttribute("cy",intersection2.y);

                // THE EQ FOLLOWED BY eq (PARENT EQ1 --- CHILD EQ3)
                if (equation1.follow != undefined) {
                if (!qSVG.rayCasting(intersection1, equation1.backUp.coords)) { // IF OUT OF WALL FOLLOWED
                    const distanceFromStart = qSVG.gap(equation1.backUp.start, intersection1);
                    const distanceFromEnd = qSVG.gap(equation1.backUp.end, intersection1);
                    if (distanceFromStart > distanceFromEnd) { // NEAR FROM End
                    equation1.follow.end = intersection1;
                    }
                    else {
                    equation1.follow.start = intersection1;
                    }
                }
                else {
                    equation1.follow.end = equation1.backUp.end;
                    equation1.follow.start = equation1.backUp.start;
                }
                }
                if (equation3.follow != undefined) {
                if (!qSVG.rayCasting(intersection2, equation3.backUp.coords)) { // IF OUT OF WALL FOLLOWED
                    const distanceFromStart = qSVG.gap(equation3.backUp.start, intersection2);
                    const distanceFromEnd = qSVG.gap(equation3.backUp.end, intersection2);
                    if (distanceFromStart > distanceFromEnd) { // NEAR FROM End
                    equation3.follow.end = intersection2;
                    }
                    else {
                    equation3.follow.start = intersection2;
                    }
                }
                else {
                    equation3.follow.end = equation3.backUp.end;
                    equation3.follow.start = equation3.backUp.start;
                }
                }

                // EQ FOLLOWERS WALL MOVING
            for (let i = 0; i < equationFollowers.length; i++) {
                const intersectionFollowers = qSVG.intersectionOfEquations(equationFollowers[i].eq, equation2, "obj");
                if (qSVG.btwn(intersectionFollowers.x, binder.wall.start.x, binder.wall.end.x, 'round') && qSVG.btwn(intersectionFollowers.y, binder.wall.start.y, binder.wall.end.y, 'round')) {
                    const size = qSVG.measure(equationFollowers[i].wall.start, equationFollowers[i].wall.end);
                    if (equationFollowers[i].type == "start") {
                    equationFollowers[i].wall.start = intersectionFollowers;
                    if (size < 5) {
                        if (equationFollowers[i].wall.child == null) {
                        WALLS.splice(WALLS.indexOf(equationFollowers[i].wall), 1);
                        equationFollowers.splice(i,1);
                        }
                    }
                    }
                    if (equationFollowers[i].type == "end") {
                    equationFollowers[i].wall.end = intersectionFollowers;
                    if (size < 5) {
                        if (equationFollowers[i].wall.parent == null) {
                        WALLS.splice(WALLS.indexOf(equationFollowers[i].wall), 1);
                        equationFollowers.splice(i,1);
                        }
                    }
                    }
                }
                }
                    // WALL COMPUTING, BLOCK FAMILY OF BINDERWALL IF NULL (START OR END) !!!!!
                    editor.wallsComputing(WALLS, "move");
                    Rooms = qSVG.polygonize(WALLS);

                    // OBJDATA(s) FOLLOW 90° EDGE SELECTED
                    for (let rp= 0; rp < equationsObj.length; rp++) {
                    const objTarget = equationsObj[rp].obj;
                    const intersectionObj = qSVG.intersectionOfEquations(equationsObj[rp].eq, equation2);
                    // NEW COORDS OBJDATA[o]
                    objTarget.x = intersectionObj[0];
                    objTarget.y = intersectionObj[1];
                    const limits = limitObj(equation2, objTarget.size, objTarget);
                    if (qSVG.btwn(limits[0].x, binder.wall.start.x, binder.wall.end.x) && qSVG.btwn(limits[0].y, binder.wall.start.y, binder.wall.end.y) && qSVG.btwn(limits[1].x, binder.wall.start.x, binder.wall.end.x) && qSVG.btwn(limits[1].y, binder.wall.start.y, binder.wall.end.y)) {
                        objTarget.limit = limits;
                        objTarget.update();
                    }
                    }
                    // DELETING ALL OBJECT "INWALL" OVERSIZED INTO ITS EDGE (EDGE BY EDGE CONTROL)
                    for (const k in WALLS) {
                    const objWall = editor.objFromWall(WALLS[k]); // LIST OBJ ON EDGE
                    for (const ob in objWall) {
                        const objTarget = objWall[ob];
                        const eq = editor.createEquationFromWall(WALLS[k]);
                        const limits = limitObj(eq, objTarget.size, objTarget);
                        if (!qSVG.btwn(limits[0].x, WALLS[k].start.x, WALLS[k].end.x) || !qSVG.btwn(limits[0].y, WALLS[k].start.y, WALLS[k].end.y) || !qSVG.btwn(limits[1].x, WALLS[k].start.x, WALLS[k].end.x) || !qSVG.btwn(limits[1].y, WALLS[k].start.y, WALLS[k].end.y)) {
                        objTarget.graph.remove();
                        const indexObj = OBJDATA.indexOf(objTarget);
                        OBJDATA.splice(indexObj, 1);
                        }
                    }
                    }

                    equationsObj = []; // REINIT eqObj -> MAYBE ONE OR PLUS OF OBJDATA REMOVED !!!!
                    const objWall = editor.objFromWall(binder.wall); // LIST OBJ ON EDGE
                    for (let ob = 0; ob < objWall.length; ob++) {
                    const objTarget = objWall[ob];
                    equationsObj.push({obj: objTarget, wall: binder.wall,  eq: qSVG.perpendicularEquation(equation2, objTarget.x, objTarget.y)});
                    }

                    $('#boxRoom').empty();
                    $('#boxSurface').empty();
                    editor.roomMaker(Rooms);
                    $('#lin').css('cursor', 'pointer');
            }

    // **********************************************************************
    // ----------------------  BOUNDING BOX ------------------------------
    // **********************************************************************
    // binder.obj.params.move ---> FOR MEASURE DONT MOVE
        if (binder.type == 'boundingBox' && action == 1 && binder.obj.params.move) {
            binder.x = snap.x;
            binder.y = snap.y;
            binder.obj.x = snap.x;
            binder.obj.y = snap.y;
            binder.obj.update();
            binder.update();
        }

    // **********************************************************************
    // OBJ MOVING
    // **********************************************************************
            if (binder.type == 'obj' && action == 1) {
            let wallSelect = editor.nearWall(snap);
            if (wallSelect) {
                if (wallSelect.wall.type != 'separate') {
                inWallRib(wallSelect.wall);

                const objTarget = binder.obj;
                const wall = wallSelect.wall;
                let angleWall = qSVG.angleDeg(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
                const v1 = qSVG.vectorXY({x:wall.start.x, y:wall.start.y}, {x:wall.end.x, y:wall.end.y});
                const v2 = qSVG.vectorXY({x:wall.end.x, y:wall.end.y}, snap);
                const newAngle = qSVG.vectorDeter(v1, v2);
                binder.angleSign = 0;
                objTarget.angleSign = 0;
                if (Math.sign(newAngle) == 1) {
                    angleWall+=180;
                    binder.angleSign = 1;
                    objTarget.angleSign = 1;
                }
                const limits = limitObj(wall.equations.base, binder.size, wallSelect);
                if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y) && qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                    binder.x = wallSelect.x;
                    binder.y = wallSelect.y;
                    binder.angle = angleWall;
                    binder.thick = wall.thick;
                    objTarget.x = wallSelect.x;
                    objTarget.y = wallSelect.y;
                    objTarget.angle = angleWall;
                    objTarget.thick = wall.thick;
                    objTarget.limit = limits;
                    binder.update();
                    objTarget.update();
                }

                if ((wallSelect.x == wall.start.x && wallSelect.y == wall.start.y) || (wallSelect.x == wall.end.x && wallSelect.y == wall.end.y)) {
                    if (qSVG.btwn(limits[0].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[0].y, wall.start.y, wall.end.y)) {
                    binder.x = limits[0].x;
                    binder.y = limits[0].y;
                    objTarget.x = limits[0].x;
                    objTarget.y = limits[0].y;
                    objTarget.limit = limits;
                    }
                    if (qSVG.btwn(limits[1].x, wall.start.x, wall.end.x) && qSVG.btwn(limits[1].y, wall.start.y, wall.end.y)) {
                    binder.x = limits[1].x;
                    binder.y = limits[1].y;
                    objTarget.x = limits[1].x;
                    objTarget.y = limits[1].y;
                    objTarget.limit = limits;
                    }
                    binder.angle = angleWall;
                    binder.thick = wall.thick;
                    objTarget.angle = angleWall;
                    objTarget.thick = wall.thick;
                    binder.update();
                    objTarget.update();
                }
                }
            }
            } // END OBJ MOVE
        if (binder.type != 'obj' && binder.type != 'segment') rib();
        }
        // ENDBIND ACTION MOVE **************************************************************************

        // ---DRAG VIEWBOX PANNING -------------------------------------------------------

        if (mode == 'select_mode' && drag == 'on') {
            snap = calcul_snap(event, grid_snap);
            $('#lin').css('cursor', 'move');
            distX = (snap.xMouse - pox) * factor;
            distY = (snap.yMouse - poy) * factor;
            // pox = event.pageX;
            // poy = event.pageY;
            zoom_maker('zoomdrag', distX, distY);
        }
    } // END MOUSEMOVE

    initEngine() {
        document.querySelector('#lin').addEventListener("mouseup", _MOUSEUP);
        document.querySelector('#lin').addEventListener("mousemove", throttle(function(event){ _MOUSEMOVE(event);},30));
        document.querySelector('#lin').addEventListener("mousedown", _MOUSEDOWN, true);

        $(document).on('click', '#lin', function(event) {
            event.preventDefault();
        });

        document.querySelector('#panel').addEventListener('mousemove', function(event) {
        if ((mode == 'line_mode' || mode == 'partition_mode') && action == 1) {
            action = 0;
            if (typeof(binder) != 'undefined') {
                binder.remove();
            }
            $('#linetemp').remove();
            $('#line_construc').remove();
            lengthTemp.remove();
        }
        });

        window.addEventListener('resize', function(event){
        width_viewbox = $('#lin').width();
        height_viewbox = $('#lin').height();
        document.querySelector('#lin').setAttribute('viewBox', originX_viewbox + ' ' + originY_viewbox + ' ' + width_viewbox + ' ' + height_viewbox)
        });

        // *****************************************************************************************************
        // ******************************        KEYPRESS on KEYBOARD          *********************************
        // *****************************************************************************************************
        document.addEventListener("keydown", function(event) {
            if (mode != "text_mode") {
            if (event.keyCode == '37') {
                //LEFT
                zoom_maker('zoomleft', 100, 30);
            }
            if (event.keyCode == '38') {
                //UP
                zoom_maker('zoomtop', 100, 30);
            }
            if (event.keyCode == '39') {
                //RIGHT
                zoom_maker('zoomright', 100, 30);
            }
            if (event.keyCode == '40') {
                //DOWN
                zoom_maker('zoombottom', 100, 30);
            }
            if (event.keyCode == '107') {
                //+
                zoom_maker('zoomin', 20, 50);
            }
            if (event.keyCode == '109') {
                //-
                zoom_maker('zoomout', 20, 50);
            }
            }
            // else {
            //   if (action == 1) {
            //     binder.textContent = binder.textContent + event.key;
            //     console.log(field.value);
            //   }
            // }
        });
    }

    initMouseWheel() {
        (function (factory) {
            if ( typeof define === 'function' && define.amd ) {
                // AMD. Register as an anonymous module.
                define(['jquery'], factory);
            } else if (typeof exports === 'object') {
                // Node/CommonJS style for Browserify
                module.exports = factory;
            } else {
                // Browser globals
                factory(jQuery);
            }
        }(function ($) {
        
            const toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
            const toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                            ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
            const slice  = Array.prototype.slice;
            let nullLowestDeltaTimeout;
            let lowestDelta;
        
            if ($.event.fixHooks) {
                for (let i = toFix.length; i;) {
                    $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
                }
            }
        
            const special = $.event.special.mousewheel = {
                version: '3.1.12',
        
                setup: function() {
                    if (this.addEventListener) {
                        for (let i = toBind.length; i;) {
                            this.addEventListener(toBind[--i], handler, false);
                        }
                    } else {
                        this.onmousewheel = handler;
                    }
                    // Store the line height and page height for this particular element
                    $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
                    $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
                },
        
                teardown: function() {
                    if (this.removeEventListener) {
                        for (let i = toBind.length; i;) {
                            this.removeEventListener( toBind[--i], handler, false );
                        }
                    } else {
                        this.onmousewheel = null;
                    }
                    // Clean up the data we added to the element
                    $.removeData(this, 'mousewheel-line-height');
                    $.removeData(this, 'mousewheel-page-height');
                },
        
                getLineHeight: function(elem) {
                    const $elem = $(elem);
                    let $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
                    if (!$parent.length) {
                        $parent = $('body');
                    }
                    return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
                },
        
                getPageHeight: function(elem) {
                    return $(elem).height();
                },
        
                settings: {
                    adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
                    normalizeOffset: true  // calls getBoundingClientRect for each event
                }
            };
        
            $.fn.extend({
                mousewheel: function(fn) {
                    return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
                },
        
                unmousewheel: function(fn) {
                    return this.unbind('mousewheel', fn);
                }
            });
        
        
            function handler(event) {
                const orgEvent = event || window.event;
                const args = slice.call(arguments, 1);
                let delta = 0;
                let deltaX = 0;
                let deltaY = 0;
                let absDelta = 0;
                let offsetX = 0;
                let offsetY = 0;
                event = $.event.fix(orgEvent);
                event.type = 'mousewheel';
        
                // Old school scrollwheel delta
                if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
                if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
                if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
                if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }
        
                // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
                if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
                    deltaX = deltaY * -1;
                    deltaY = 0;
                }
        
                // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
                delta = deltaY === 0 ? deltaX : deltaY;
        
                // New school wheel delta (wheel event)
                if ( 'deltaY' in orgEvent ) {
                    deltaY = orgEvent.deltaY * -1;
                    delta  = deltaY;
                }
                if ( 'deltaX' in orgEvent ) {
                    deltaX = orgEvent.deltaX;
                    if ( deltaY === 0 ) { delta  = deltaX * -1; }
                }
        
                // No change actually happened, no reason to go any further
                if ( deltaY === 0 && deltaX === 0 ) { return; }
        
                // Need to convert lines and pages to pixels if we aren't already in pixels
                // There are three delta modes:
                //   * deltaMode 0 is by pixels, nothing to do
                //   * deltaMode 1 is by lines
                //   * deltaMode 2 is by pages
                if ( orgEvent.deltaMode === 1 ) {
                    const lineHeight = $.data(this, 'mousewheel-line-height');
                    delta  *= lineHeight;
                    deltaY *= lineHeight;
                    deltaX *= lineHeight;
                } else if ( orgEvent.deltaMode === 2 ) {
                    const pageHeight = $.data(this, 'mousewheel-page-height');
                    delta  *= pageHeight;
                    deltaY *= pageHeight;
                    deltaX *= pageHeight;
                }
        
                // Store lowest absolute delta to normalize the delta values
                absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );
        
                if ( !lowestDelta || absDelta < lowestDelta ) {
                    lowestDelta = absDelta;
        
                    // Adjust older deltas if necessary
                    if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                        lowestDelta /= 40;
                    }
                }
        
                // Adjust older deltas if necessary
                if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                    // Divide all the things by 40!
                    delta  /= 40;
                    deltaX /= 40;
                    deltaY /= 40;
                }
        
                // Get a whole, normalized value for the deltas
                delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
                deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
                deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);
        
                // Normalise offsetX and offsetY properties
                if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
                    const boundingRect = this.getBoundingClientRect();
                    offsetX = event.clientX - boundingRect.left;
                    offsetY = event.clientY - boundingRect.top;
                }
        
                // Add information to the event object
                event.deltaX = deltaX;
                event.deltaY = deltaY;
                event.deltaFactor = lowestDelta;
                event.offsetX = offsetX;
                event.offsetY = offsetY;
                // Go ahead and set deltaMode to 0 since we converted to pixels
                // Although this is a little odd since we overwrite the deltaX/Y
                // properties with normalized deltas.
                event.deltaMode = 0;
        
                // Add event and delta to the front of the arguments
                args.unshift(event, delta, deltaX, deltaY);
        
                // Clearout lowestDelta after sometime to better
                // handle multiple device types that give different
                // a different lowestDelta
                // Ex: trackpad = 3 and mouse wheel = 120
                if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
                nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
        
                return ($.event.dispatch || $.event.handle).apply(this, args);
            }
        
            function nullLowestDelta() {
                lowestDelta = null;
            }
        
            function shouldAdjustOldDeltas(orgEvent, absDelta) {
                // If this is an older event and the delta is divisable by 120,
                // then we are assuming that the browser is treating this as an
                // older mouse wheel event and that we should divide the deltas
                // by 40 to try and get a more usable deltaFactor.
                // Side note, this actually impacts the reported scroll distance
                // in older browsers and can cause scrolling to be slower than native.
                // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
                return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
            }
        
        }));
    }

    addEventListener() {

    }

    initEditor() {
        //init
        this.WALLS = [];
        this.OBJDATA = [];
        this.ROOM = [];
        this.HISTORY = [];
        this.wallSize = 20;
        this.partitionSize = 8;
        this.taille_w = linElement.width();
        this.taille_h = linElement.height();
        this.grid = 20;
        this.showRib = true;
        this.showArea = true;
        this.meter = 60;
        this.grid_snap = 'off';
        this.colorbackground = "#ffffff";
        this.colorline = "#fff";
        this.colorroom = "#f0daaf";
        this.colorWall = "#666";
        this.pox = 0;
        this.poy = 0;
        this.segment = 0;
        this.xpath = 0;
        this.ypath = 0;
        let drag = 'off';
        let action = 0;
        let magnetic = 0;
        let construc = 0;
        let Rcirclebinder = 8;
        let mode = 'select_mode';
        let modeOption;
        let linElement = $('#lin');
        let width_viewbox = taille_w;
        let height_viewbox = taille_h;
        let ratio_viewbox = height_viewbox / width_viewbox;
        let originX_viewbox = 0;
        let originY_viewbox = 0;
        let zoom = 9;
        let factor = 1;
    }
}

export default Editor;