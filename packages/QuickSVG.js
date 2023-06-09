/* eslint-disable no-unused-vars */
import { isObjectsEquals } from "./utils.js";

export const create = (id, shape, attrs) => {
    const _shape = document.createElementNS("http://www.w3.org/2000/svg", shape);
    for (let k in attrs) {
        _shape.attr(k, attrs[k]);
        }
    if (id != 'none') {
        document.querySelector("#" + id).append(_shape);
    }
    return _shape;
};

export const angleDeg = (cx, cy, ex, ey) => {
    const dy = ey - cy;
    const dx = ex - cx;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
};

export const angle = (x1, y1, x2, y2, x3, y3) => {
    const _x1 = parseInt(x1);
    const _y1 = parseInt(y1);
    const _x2 = parseInt(x2);
    const _y2 = parseInt(y2);
    let rotate;
    let anglerad;
    if (!x3) {
        if (_x1 - _x2 == 0) anglerad = Math.PI / 2;
        else {
            anglerad = Math.atan((_y1 - _y2) / (_x1 - _x2));
        }
        rotate = anglerad * 180 / Math.PI;
    } else {
        const _x3 = parseInt(x3);
        const _y3 = parseInt(y3);
        const a = Math.sqrt(Math.pow(Math.abs(_x2 - _x1), 2) + Math.pow(Math.abs(_y2 - _y1), 2));
        const b = Math.sqrt(Math.pow(Math.abs(_x2 - _x3), 2) + Math.pow(Math.abs(_y2 - _y3), 2));
        const c = Math.sqrt(Math.pow(Math.abs(_x3 - _x1), 2) + Math.pow(Math.abs(_y3 - _y1), 2));
        if (a == 0 || b == 0) anglerad = Math.PI / 2;
        else {
            anglerad = Math.acos((Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b));
        }
        rotate = (360 * anglerad) / (2*Math.PI);
    }
    return ({
        rad: anglerad,
        deg: rotate
    });
};

export const getAngle = (el1, el2) => {
    return ({
    rad: Math.atan2(el2.y - el1.y, el2.x - el1.x),
    deg: Math.atan2(el2.y - el1.y, el2.x - el1.x)* 180 / Math.PI
    });

};

export const middle = (xo, yo, xd, yd) => {
    const x1 = parseInt(xo);
    const y1 = parseInt(yo);
    const x2 = parseInt(xd);
    const y2 = parseInt(yd);
    const middleX = Math.abs(x1 + x2) / 2;
    const middleY = Math.abs(y1 + y2) / 2;
    return ({
        x: middleX,
        y: middleY
    });
};

export const triangleArea = (fp, sp, tp) => {
    const A = measure(fp, sp);
    const B = measure(sp, tp);
    const C = measure(tp, fp);
    const p = (A + B + C) / 2;
    return (Math.sqrt(p*(p-A)*(p-B)*(p-C)));
};

export const measure = (po, pt) => {
    return Math.sqrt(Math.pow(po.x - pt.x, 2) + Math.pow(po.y - pt.y, 2));
};

export const gap = (po, pt) => {
    return Math.pow(po.x - pt.x, 2) + Math.pow(po.y - pt.y, 2);
};

export const pDistance = (point, pointA, pointB) => {
    const x = point.x;
    const y = point.y;
    const x1 = pointA.x;
    const y1 = pointA.y;
    const x2 = pointB.x;
    const y2 = pointB.y;
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
    let xx;
    let yy;
    if (param < 0) {
    xx = x1;
    yy = y1;
    }
    else if (param > 1) {
    xx = x2;
    yy = y2;
    }
    else {
    xx = x1 + param * C;
    yy = y1 + param * D;
    }
    const dx = x - xx;
    const dy = y - yy;
    return ({
    x:  xx,
    y:  yy,
    distance: Math.sqrt(dx * dx + dy * dy)
    });
};

export const nearPointOnEquation = (equation, point) => { // Y = Ax + B ---- equation {A:val, B:val}
    const pointA = {};
    const pointB = {};
    if (equation.A == 'h') {
        return ({
        x:  point.x,
        y:  equation.B,
        distance: Math.abs(equation.B - point.y)
        });
    }
    else if (equation.A == 'v') {
        return ({
        x:  equation.B,
        y:  point.y,
        distance: Math.abs(equation.B - point.x)
        });
    }
    else {
        pointA.x = point.x;
        pointA.y = (equation.A * point.x) + equation.B;
        pointB.x = (point.y - equation.B)/equation.A;
        pointB.y = point.y;
        return pDistance(point, pointA, pointB);
    }
};

export const circlePath = (cx, cy, r) => {
    return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
};

export const createEquation = (x0, y0, x1, y1) => {
    if (x1 - x0 == 0) {
    return ({
        A:  'v',
        B:  x0
    });}
    else if (y1 - y0 == 0) {
    return ({
        A:  'h',
        B:  y0
    });}
    else {
    return ({
        A:  (y1 - y0) / (x1 - x0),
        B:  y1 - (x1 * ((y1 - y0) / (x1 - x0)))
    });}
};

export const perpendicularEquation = (equation, x1, y1) => {
    if (typeof(equation.A) != "string") {
    return ({
        A:  (-1 / equation.A),
        B:  y1 - ((-1 / equation.A) * x1)
    });}
    if (equation.A == 'h') {
    return ({
        A:  'v',
        B:  x1
    });}
    if (equation.A == 'v') {
    return ({
        A:  'h',
        B:  y1
    });}
};

export const angleBetweenEquations = (m1, m2) => {
    if (m1 == 'h') m1 = 0;
    if (m2 == 'h') m2 = 0;
    if (m1 == 'v') m1 = 10000;
    if (m2 == 'v') m2 = 10000;
    const angleRad =  Math.atan(Math.abs((m2 - m1) / (1 + (m1 * m2))));
    return (360 * angleRad) / (2*Math.PI);
};

// type array return [x,y] ---- type object return {x:x, y:y}
export const intersectionOfEquations = (equation1, equation2, type = "array", message = false) => {
    let retArray;
    let retObj;
    if (equation1.A == equation2.A) {
    retArray = false;
    retObj = false;
    }
    if (equation1.A == 'v' && equation2.A == 'h') {
    retArray = [equation1.B, equation2.B];
    retObj = {x: equation1.B, y: equation2.B};
    }
    if (equation1.A == 'h' && equation2.A == 'v') {
    retArray =  [equation2.B, equation1.B];
    retObj = {x: equation2.B, y: equation1.B};
    }
    if (equation1.A == 'h' && equation2.A != 'v' && equation2.A != 'h') {
    retArray =  [(equation1.B - equation2.B)/equation2.A, equation1.B];
    retObj = {x: (equation1.B - equation2.B)/equation2.A, y: equation1.B};
    }
    if (equation1.A == 'v' && equation2.A != 'v' && equation2.A != 'h') {
    retArray =  [equation1.B, (equation2.A * equation1.B) + equation2.B];
    retObj = {x: equation1.B, y: (equation2.A * equation1.B) + equation2.B};
    }
    if (equation2.A == 'h' && equation1.A != 'v' && equation1.A != 'h') {
    retArray =  [(equation2.B - equation1.B)/equation1.A, equation2.B];
    retObj = {x: (equation2.B - equation1.B)/equation1.A, y: equation2.B};
    }
    if (equation2.A == 'v' && equation1.A != 'v' && equation1.A != 'h') {
    retArray =  [equation2.B, (equation1.A * equation2.B) + equation1.B];
    retObj = {x: equation2.B, y: (equation1.A * equation2.B) + equation1.B};
    }
    if (equation1.A != 'h' && equation1.A != 'v' && equation2.A != 'v' && equation2.A != 'h') {
    const xT = (equation2.B - equation1.B) / (equation1.A - equation2.A);
    const yT = (equation1.A * xT) + equation1.B;
    retArray =  [xT, yT];
    retObj = {x: xT, y: yT};
    }
    if (type == "array") return retArray;
    else return retObj;
};

export const vectorXY = (obj1, obj2) => {
    return ({
    x:  obj2.x - obj1.x,
    y:  obj2.y - obj1.y
    });
};

export const vectorAngle = (v1, v2) => {
    return (Math.atan2((v2.y-v1.y),(v2.x-v1.x))+Math.PI/2) * (180/Math.PI);
};

export const vectorDeter = (v1, v2) => {
    return (v1.x * v2.y)-(v1.y * v2.x);
};

export const btwn = (a, b1, b2, round = false) => {
    if (round) {
    a = Math.round(a);
    b1 = Math.round(b1);
    b2 = Math.round(b2);
    }
    if ((a >= b1) && (a <= b2)) { return true; }
    if ((a >= b2) && (a <= b1)) { return true; }
    return false;
};

export const nearPointFromPath = (Pathsvg, point, range = Infinity) => {
    const pathLength = Pathsvg.getTotalLength();
    if (pathLength>0) {
    let precision = 40;
    let best;
    let bestLength;
    let bestDistance = Infinity;
    for (let scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        scan = Pathsvg.getPointAtLength(scanLength);
        scanDistance = gap(scan, point);
        if (scanDistance < bestDistance) {
            best = scan, bestLength = scanLength, bestDistance = scanDistance;
        }
        }
        // binary search for precise estimate
        precision /= 2;
        while (precision > 1) {
        let before;
        let after;
        let beforeLength;
        let afterLength;
        let beforeDistance;
        let afterDistance;
        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = gap(before = Pathsvg.getPointAtLength(beforeLength), point)) < bestDistance) {
            best = before, bestLength = beforeLength, bestDistance = beforeDistance;
            } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = gap(after = Pathsvg.getPointAtLength(afterLength), point)) < bestDistance) {
            best = after, bestLength = afterLength, bestDistance = afterDistance;
            } else {
            precision /= 2;
            }
        }

        if (bestDistance <= (range*range)) {
        return ({
            x: best.x,
            y: best.y,
            length: bestLength,
            distance: bestDistance,
            seg: Pathsvg.getPathSegAtLength(bestLength)
            });
        } else {
        return false;
        }
    }else {
    return false;
    }
};

//  ON PATH RETURN FALSE IF 0 NODE ON PATHSVG WITH POINT coords
//  RETURN INDEX ARRAY OF NODEs onPoint
export const getNodeFromPath = (Pathsvg, point, except = ['']) => {
    const nodeList = Pathsvg.getPathData();
    let k = 0;
    const nodes = [];
    let countNode = 0;
    for (k = 0; k < nodeList.length; k++) {
        if (nodeList[k].values[0] == point.x && nodeList[k].values[1] == point.y && nodeList[k].type != 'Z') {
            if (except.indexOf(k) == -1) {
                countNode++;
                nodes.push(k);
            }
            }
    }
    if (countNode == 0) return false;
    else return nodes;
};

// RETURN ARRAY [{x,y};{x,y};...] OF REAL COORDS POLYGON INTO WALLS, THICKNESS PARAM
export const polygonIntoWalls = (vertex, surface, WALLS) => {
    const vertexArray = surface;
    const wall = [];
    const polygon = [];
    for (let rr = 0; rr < vertexArray.length; rr++) {
    polygon.push({x: vertex[vertexArray[rr]].x, y: vertex[vertexArray[rr]].y});
    }
    // FIND EDGE (WALLS HERE) OF THESE TWO VERTEX
    for (let i = 0 ; i < vertexArray.length-1; i++) {
    for (let segStart = 0; segStart < vertex[vertexArray[i+1]].segment.length; segStart++) {
        for (let segEnd = 0; segEnd < vertex[vertexArray[i]].segment.length; segEnd++) {
        if (vertex[vertexArray[i+1]].segment[segStart] == vertex[vertexArray[i]].segment[segEnd]) {
            wall.push({x1: vertex[vertexArray[i]].x, y1: vertex[vertexArray[i]].y, x2: vertex[vertexArray[i+1]].x, y2: vertex[vertexArray[i+1]].y, segment: vertex[vertexArray[i+1]].segment[segStart]});
        }
        }
    }
    }
    // CALC INTERSECS OF EQ PATHS OF THESE TWO WALLS.
    const inside = [];
    const outside = [];
    for (let i = 0; i < wall.length; i++) {
    const inter = [];
    const edge = wall[i];
    let nextEdge;
    i < wall.length - 1 ? nextEdge = wall[i+1] : nextEdge = wall[0];
    let angleEdge = Math.atan2(edge.y2 - edge.y1, edge.x2 - edge.x1);
    let angleNextEdge = Math.atan2(nextEdge.y2 - nextEdge.y1, nextEdge.x2 - nextEdge.x1);
    const edgeThicknessX = (WALLS[edge.segment].thick/2) * Math.sin(angleEdge);
    const edgeThicknessY = (WALLS[edge.segment].thick/2) * Math.cos(angleEdge);
    const nextEdgeThicknessX = (WALLS[nextEdge.segment].thick/2) * Math.sin(angleNextEdge);
    const nextEdgeThicknessY = (WALLS[nextEdge.segment].thick/2) * Math.cos(angleNextEdge);
    const eqEdgeUp = createEquation(edge.x1 + edgeThicknessX, edge.y1 - edgeThicknessY, edge.x2 + edgeThicknessX, edge.y2 - edgeThicknessY);
    const eqEdgeDw = createEquation(edge.x1 - edgeThicknessX, edge.y1 + edgeThicknessY, edge.x2 - edgeThicknessX, edge.y2 + edgeThicknessY);
    const eqNextEdgeUp = createEquation(nextEdge.x1 + nextEdgeThicknessX, nextEdge.y1 - nextEdgeThicknessY, nextEdge.x2 + nextEdgeThicknessX, nextEdge.y2 - nextEdgeThicknessY);
    const eqNextEdgeDw = createEquation(nextEdge.x1 - nextEdgeThicknessX, nextEdge.y1 + nextEdgeThicknessY, nextEdge.x2 - nextEdgeThicknessX, nextEdge.y2 + nextEdgeThicknessY);

    angleEdge = angleEdge * (180 / Math.PI);
    angleNextEdge = angleNextEdge * (180 / Math.PI);

        if (eqEdgeUp.A != eqNextEdgeUp.A) {
            inter.push(intersectionOfEquations(eqEdgeUp, eqNextEdgeUp, "object"));
            inter.push(intersectionOfEquations(eqEdgeDw, eqNextEdgeDw, "object"));
        }
        else {
        inter.push({x: edge.x2 + edgeThicknessX, y: edge.y2 - edgeThicknessY});
        inter.push({x: edge.x2 - edgeThicknessX, y: edge.y2 + edgeThicknessY});
        }

    for (let ii = 0;ii < inter.length; ii++) {
        if (rayCasting(inter[ii], polygon)) inside.push(inter[ii]);
        else outside.push(inter[ii]);
    }
    }
    inside.push(inside[0]);
    outside.push(outside[0]);
    return {inside: inside, outside: outside};
};

export const area = (coordss) => {
    if (coordss.length < 2) return false;
    let realArea = 0;
    let j = (coordss.length)-1;
    for (let i = 0; i < coordss.length; i++) {
    realArea = realArea + ((coordss[j].x + coordss[i].x) * (coordss[j].y - coordss[i].y));
    j = i;
    }
    realArea = realArea / 2;
    return Math.abs(realArea.toFixed(2));
};

export const areaRoom =  (vertex, coords, digit = 2) => {
    const vertexArray = coords;
    let roughArea = 0;
    let j = (vertexArray.length)-2;
    for (let i = 0; i < vertexArray.length-1; i++) {
    roughArea = roughArea + ((vertex[vertexArray[j]].x + vertex[vertexArray[i]].x) * (vertex[vertexArray[j]].y - vertex[vertexArray[i]].y));
    j = i;
    }
    roughArea = roughArea / 2;
    return Math.abs(roughArea.toFixed(digit));
};

export const perimeterRoom =  (vertex, coords, digit = 2) => {
    const vertexArray = coords;
    let roughRoom = 0;
    for (let i = 0; i < vertexArray.length-1; i++) {
    const added = measure(vertex[vertexArray[i]], vertex[vertexArray[i+1]]);
    roughRoom = roughRoom + added;
    }
    return roughRoom.toFixed(digit);
};

// H && V PROBLEM WHEN TWO SEGMENT ARE v/-> == I/->
export const junctionList = (WALLS) => {
    const junction = [];
    const segmentJunction = [];
    const junctionChild = [];
    // JUNCTION ARRAY LIST ALL SEGMENT INTERSECTIONS
    for (let i = 0; i < WALLS.length; i++) {
    const equation1 = createEquation(WALLS[i].start.x, WALLS[i].start.y, WALLS[i].end.x, WALLS[i].end.y);
    for (let v = 0; v < WALLS.length; v++) {
        if (v != i) {
        const equation2 = createEquation(WALLS[v].start.x, WALLS[v].start.y, WALLS[v].end.x, WALLS[v].end.y);
        let intersec = intersectionOfEquations(equation1, equation2);
        if (intersec) {

            if (WALLS[i].end.x == WALLS[v].start.x && WALLS[i].end.y == WALLS[v].start.y || WALLS[i].start.x == WALLS[v].end.x && WALLS[i].start.y == WALLS[v].end.y) {
                if (WALLS[i].end.x == WALLS[v].start.x && WALLS[i].end.y == WALLS[v].start.y) {
                junction.push({segment:i, child: v, values: [WALLS[v].start.x, WALLS[v].start.y], type: "natural"});
                }
                if (WALLS[i].start.x == WALLS[v].end.x && WALLS[i].start.y == WALLS[v].end.y) {
                junction.push({segment:i, child: v, values: [WALLS[i].start.x, WALLS[i].start.y], type: "natural"});
                }
            }
            else {
                if (btwn(intersec[0], WALLS[i].start.x, WALLS[i].end.x, 'round') && btwn(intersec[1], WALLS[i].start.y, WALLS[i].end.y, 'round') && btwn(intersec[0], WALLS[v].start.x, WALLS[v].end.x, 'round') && btwn(intersec[1], WALLS[v].start.y, WALLS[v].end.y, 'round')) {
                // intersec[0] = intersec[0];
                // intersec[1] = intersec[1];
                junction.push({segment:i, child: v, values: [intersec[0], intersec[1]], type: "intersection"});
                }
            }
        }
        // IF EQ1 == EQ 2 FIND IF START OF SECOND SEG == END OF FIRST seg (eq.A maybe values H ou V)
        if ((Math.abs(equation1.A) == Math.abs(equation2.A) || equation1.A == equation2.A) && equation1.B == equation2.B) {

        if (WALLS[i].end.x == WALLS[v].start.x && WALLS[i].end.y == WALLS[v].start.y) {
            junction.push({segment:i, child: v, values: [WALLS[v].start.x, WALLS[v].start.y], type: "natural"});
        }
        if (WALLS[i].start.x == WALLS[v].end.x && WALLS[i].start.y == WALLS[v].end.y) {
            junction.push({segment:i, child: v, values: [WALLS[i].start.x, WALLS[i].start.y], type: "natural"});
        }
        }
        }
    }
    }
    return junction;
};

export const vertexList = (junction, segment) => {
    const vertex = [];
    const vertextest = [];
    for (let jj = 0; jj < junction.length; jj++) {
    let found = true;
    for (let vv = 0; vv < vertex.length; vv++) {
        if ((Math.round(junction[jj].values[0]) == Math.round(vertex[vv].x)) && (Math.round(junction[jj].values[1]) == Math.round(vertex[vv].y))) {
        found = false;
        vertex[vv].segment.push(junction[jj].segment);
        break;
        }
        else {
        found = true;
        }
    }
    if (found) {
        vertex.push({x: Math.round(junction[jj].values[0]), y: Math.round(junction[jj].values[1]), segment: [junction[jj].segment], bypass:0, type: junction[jj].type});
    }
    }

    let toClean = [];
    for (let ss = 0; ss < vertex.length; ss++) {
    vertex[ss].child = [];
    vertex[ss].removed = [];
    for (let sg = 0; sg < vertex[ss].segment.length; sg++) {
        for (let sc = 0; sc < vertex.length; sc++) {
        if (sc != ss) {
            for (let scg = 0; scg < vertex[sc].segment.length; scg++) {
            if (vertex[sc].segment[scg] == vertex[ss].segment[sg]) {
                vertex[ss].child.push({id: sc, angle: Math.floor(getAngle(vertex[ss], vertex[sc]).deg)});
            }
            }
        }
        }
    }
    toClean = [];
    for (let fr = 0; fr < vertex[ss].child.length-1; fr++) {
        for (let ft = fr+1; ft < vertex[ss].child.length; ft++) {
        if (fr != ft && typeof(vertex[ss].child[fr])!='undefined') {

            let found = true;

            if (btwn(vertex[ss].child[ft].angle, vertex[ss].child[fr].angle+3, vertex[ss].child[fr].angle-3, 'round') && found)
            {
            const dOne = gap(vertex[ss], vertex[vertex[ss].child[ft].id]);
            const dTwo = gap(vertex[ss], vertex[vertex[ss].child[fr].id]);
            if (dOne > dTwo) {
                toClean.push(ft);
            }
            else {
                toClean.push(fr);
                }
            }
        }
        }
    }
    toClean.sort(function(a, b) {
        return b-a;
        });
    toClean.push(-1);
    for (let cc = 0; cc < toClean.length-1; cc++) {
        if (toClean[cc] > toClean[(cc+1)]) {
        vertex[ss].removed.push(vertex[ss].child[toClean[cc]].id);
        vertex[ss].child.splice(toClean[cc], 1);
        }
    }
    }
    return vertex;
};

//*******************************************************
//* @arr1, arr2 = Array to compare                      *
//* @app = add function pop() or shift() to @arr1, arr2 *
//* False if arr1.length != arr2.length                 *
//* False if value into arr1[] != arr2[] - no order     *
//* *****************************************************
export const arrayCompare = (arr1, arr2, app) => {
    // if (arr1.length != arr2.length) return false;
    let minus = 0;
    let start = 0;
    if (app == 'pop') {
    minus = 1;
    }
    if (app == 'shift') {
    start = 1;
    }
    let coordCounter = arr1.length - minus - start;
    for (let iFirst = start; iFirst < arr1.length-minus; iFirst++) {
    for (let iSecond = start; iSecond < arr2.length-minus; iSecond++) {
        if (arr1[iFirst] == arr2[iSecond]) {
        coordCounter--;
        }
    }
    }
    if (coordCounter == 0) return true;
    else return false;
};

export const vectorVertex = (vex1, vex2, vex3) => {
    const vCurr = vectorXY(vex1, vex2);
    const vNext = vectorXY(vex2, vex3);
    const Na = Math.sqrt((vCurr.x * vCurr.x) + (vCurr.y * vCurr.y));
    const Nb = Math.sqrt((vNext.x * vNext.x) + (vNext.y * vNext.y));
    const C = ((vCurr.x * vNext.x) + (vCurr.y * vNext.y)) / (Na * Nb);
    const S = ((vCurr.x * vNext.y) - (vCurr.y * vNext.x));
    const BAC = Math.sign(S) * Math.acos(C);
    return BAC*(180 / Math.PI );
};

export const segmentTree = (VERTEX_NUMBER, vertex) => {
    const TREELIST = [VERTEX_NUMBER];
    const WAY = [];
    const COUNT = vertex.length;
    const ORIGIN = VERTEX_NUMBER;
    tree(TREELIST, ORIGIN, COUNT);
    return WAY;

    function tree(TREELIST, ORIGIN, COUNT) {
    if (TREELIST.length == 0) return;
    const TREETEMP = [];
    COUNT--;
    for (let k = 0;k < TREELIST.length; k++) {
        let found = true;
        const WRO = TREELIST[k];
        const WRO_ARRAY = WRO.toString().split('-');
        const WR = WRO_ARRAY[WRO_ARRAY.length - 1];

        for (let v = 0; v < vertex[WR].child.length; v++) {
        if (vertex[WR].child[v].id == ORIGIN && COUNT < (vertex.length - 1) && WRO_ARRAY.length > 2) { // WAYS HYPER
            WAY.push(WRO+"-"+ORIGIN); // WAYS
            found = false;
            break;
        }
        }
        if (found) {
            let bestToAdd;
            const bestDet = 0;
            let nextVertex = -1;
            // const nextVertexValue = 360;
            let nextDeterValue = Infinity;
            let nextDeterVal = 0;
            let nextFlag = 0;
            if (vertex[WR].child.length == 1) {
            if (WR == ORIGIN && COUNT == (vertex.length - 1)) {
                TREETEMP.push(WRO+'-'+vertex[WR].child[0].id);
            }
            if (WR != ORIGIN  && COUNT < (vertex.length - 1)) {
                TREETEMP.push(WRO+'-'+vertex[WR].child[0].id);
            }
            }
            else {
            for (let v = 0; v < vertex[WR].child.length && vertex[WR].child.length > 0; v++) {
                    if (WR == ORIGIN && COUNT == (vertex.length - 1)) { // TO INIT FUNCTION -> // CLOCKWISE Research
                    const vDet = vectorVertex({x: 0, y: -1}, vertex[WR], vertex[vertex[WR].child[v].id]);
                    if (vDet >= nextDeterVal ) {
                        nextFlag = 1;
                        nextDeterVal = vDet;
                        nextVertex = vertex[WR].child[v].id;
                    }
                    if (Math.sign(vDet) == -1  && nextFlag == 0) {
                        if (vDet < nextDeterValue && Math.sign(nextDeterValue) > -1) {
                        nextDeterValue = vDet;
                        nextVertex = vertex[WR].child[v].id;
                        }
                        if (vDet > nextDeterValue && Math.sign(nextDeterValue) == -1) {
                        nextDeterValue = vDet;
                        nextVertex = vertex[WR].child[v].id;
                        }
                    }
                    }
                    if (WR != ORIGIN  && WRO_ARRAY[WRO_ARRAY.length-2] != vertex[WR].child[v].id && COUNT < (vertex.length - 1)) { // COUNTERCLOCKWISE Research
                    const vDet = vectorVertex(vertex[WRO_ARRAY[WRO_ARRAY.length-2]], vertex[WR], vertex[vertex[WR].child[v].id]);
                    if (vDet < nextDeterValue  && nextFlag == 0) {
                        nextDeterValue = vDet;
                        nextVertex = vertex[WR].child[v].id;
                    }
                    if (Math.sign(vDet) == -1) {
                        nextFlag = 1;
                        if (vDet <= nextDeterValue) {
                        nextDeterValue = vDet;
                        nextVertex = vertex[WR].child[v].id;
                        }
                    }
                    }
            }
            if (nextVertex != -1) TREETEMP.push(WRO+'-'+nextVertex);
            }
        }
    }
    if (COUNT > 0) tree(TREETEMP, ORIGIN, COUNT);
    }
};

export const polygonize = (segment) => {
    const junction = junctionList(segment);
    const vertex = vertexList(junction, segment);
    const vertexCopy = vertexList(junction, segment);

    const edgesChild = [];
    for (let j = 0; j < vertex.length; j++) {
    for (let vv = 0; vv < vertex[j].child.length; vv++) {
        edgesChild.push([j, vertex[j].child[vv].id]);
    }
    }
    const polygons = [];
    let WAYS;
    for (let jc = 0; jc < edgesChild.length; jc++) {
        let bestVertex = 0;
        let bestVertexValue = Infinity;
        for (let j = 0; j < vertex.length; j++) {
        if (vertex[j].x < bestVertexValue && vertex[j].child.length > 1 && vertex[j].bypass == 0) {
            bestVertexValue = vertex[j].x;
            bestVertex = j;
        }
        if (vertex[j].x == bestVertexValue && vertex[j].child.length > 1 && vertex[j].bypass == 0) {
            if (vertex[j].y > vertex[bestVertex].y) {
            bestVertexValue = vertex[j].x;
            bestVertex = j;
            }
        }
        }

        // console.log("%c%s", "background: yellow; font-size: 14px;","RESEARCH WAY FOR STARTING VERTEX "+bestVertex);
        WAYS = segmentTree(bestVertex, vertex);
        if (WAYS.length == 0) {
        vertex[bestVertex].bypass = 1;
        }
        if (WAYS.length > 0) {
        const tempSurface = WAYS[0].split('-');
        const lengthRoom = areaRoom(vertex, tempSurface);
        const bestArea = parseInt(lengthRoom);
            let found = true;
            for (let sss = 0; sss < polygons.length; sss++) {
            if (arrayCompare(polygons[sss].way, tempSurface, 'pop') ) {
                found = false;
                vertex[bestVertex].bypass = 1;
                break;
            }
            }

            if (bestArea < 360) {
            vertex[bestVertex].bypass = 1;
            }
            if (vertex[bestVertex].bypass == 0)  { // <-------- TO REVISE IMPORTANT !!!!!!!! bestArea Control ???
            const realCoords = polygonIntoWalls(vertex, tempSurface);
            const realArea = area(realCoords.inside);
            const outsideArea = area(realCoords.outside);
            const coords = [];
            for (let rr = 0; rr < tempSurface.length; rr++) {
                coords.push({x: vertex[tempSurface[rr]].x, y: vertex[tempSurface[rr]].y});
            }
            // WARNING -> FAKE
            if (realCoords.inside.length != realCoords.outside) {
                polygons.push({way: tempSurface, coords: coords, coordsOutside: realCoords.outside, coordsInside: realCoords.inside, area: realArea, outsideArea: outsideArea, realArea: bestArea});
            }
            else { // REAL INSIDE POLYGONE -> ROOM
                polygons.push({way: tempSurface, coords: realCoords.inside, coordsOutside: realCoords.outside, area: realArea, outsideArea: outsideArea, realArea: bestArea});
            }

            // REMOVE FIRST POINT OF WAY ON CHILDS FIRST VERTEX
            for (let aa = 0; aa < vertex[bestVertex].child.length; aa++) {
                if (vertex[bestVertex].child[aa].id == tempSurface[1]) {
                vertex[bestVertex].child.splice(aa, 1);
                }
            }

            // REMOVE FIRST VERTEX OF WAY ON CHILDS SECOND VERTEX
            for (let aa = 0; aa < vertex[tempSurface[1]].child.length; aa++) {
                if (vertex[tempSurface[1]].child[aa].id == bestVertex) {
                vertex[tempSurface[1]].child.splice(aa, 1);
                }
            }
            //REMOVE FILAMENTS ?????
            
            let looping = 0;
            do {
                for (let aa = 0; aa < vertex.length; aa++) {
                if (vertex[aa].child.length == 1) {
                    looping = 1;
                    vertex[aa].child = [];
                    for (let ab = 0; ab < vertex.length; ab++) { // OR MAKE ONLY ON THE WAY tempSurface ?? BETTER ??
                    for (let ac = 0; ac < vertex[ab].child.length; ac++) {
                        if (vertex[ab].child[ac].id == aa) {
                        vertex[ab].child.splice(ac, 1);
                        }
                    }
                    }
                }
                }
            }
            while (looping == 1);
            }
        }
    }
    //SUB AREA(s) ON POLYGON CONTAINS OTHERS FREE POLYGONS (polygon without commonSideEdge)
    for (let pp = 0; pp < polygons.length; pp++) {
        const inside = [];
        for (let free = 0; free < polygons.length; free++) {
        if (pp != free) {
            const polygonFree = polygons[free].coords;
            const countCoords = polygonFree.length;
            let found = true;
            for (let pf = 0; pf < countCoords; pf++) {
            found = rayCasting(polygonFree[pf], polygons[pp].coords);
            if (!found) {
                break;
            }
            }
            if (found) {
            inside.push(free);
            polygons[pp].area = polygons[pp].area - polygons[free].outsideArea;
            }
        }
        }
        polygons[pp].inside = inside;
    }
    return {polygons : polygons, vertex : vertex};
};

export const diffArray  = (arr1, arr2) => {
    return arr1.concat(arr2).filter(function (val) {
    if (!(arr1.includes(val) && arr2.includes(val)))
        return val;
        });
};

export const diffObjIntoArray  = (arr1, arr2) => {
    let count = 0;
    for (let k =0; k <arr1.length-1;k++) {
    for (let n=0; n<arr2.length-1;n++) {
        if (isObjectsEquals(arr1[k], arr2[n])) {
        count++;
        }
    }
    }
    let waiting = arr1.length-1;
    if (waiting < arr2.length-1) waiting = arr2.length;
    return waiting-count;
};

export const rayCasting = (point, polygon) => {
const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        const intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
return inside;
};

//polygon = [{x1,y1}, {x2,y2}, ...]
export const polygonVisualCenter = (room, ROOM) => {
    const polygon = room.coords;
    const insideArray = room.inside;
    const sample = 80;
    const grid = [];
    //BOUNDING BOX OF POLYGON
    let minX;
    let minY;
    let maxX;
    let maxY;
    for (let i = 0; i < polygon.length; i++) {
        const p = polygon[i];
        if (!i || p.x < minX) minX = p.x;
        if (!i || p.y < minY) minY = p.y;
        if (!i || p.x > maxX) maxX = p.x;
        if (!i || p.y > maxY) maxY = p.y;
    }
    const width = maxX - minX;
    const height = maxY - minY;
    //INIT GRID
    const sampleWidth = Math.floor(width / sample);
    const sampleHeight = Math.floor(height / sample);
    for (let hh = 0; hh < sample; hh++) {
        for (let ww = 0; ww < sample; ww++) {
        const posX = minX + (ww * sampleWidth);
        const posY = minY + (hh * sampleHeight);
        if (rayCasting({x: posX, y: posY}, polygon)) {
            let found = true;
            for (let ii = 0; ii < insideArray.length; ii++) {
            if (rayCasting({x: posX, y: posY}, ROOM[insideArray[ii]].coordsOutside)) {
                found = false;
                break;
            }
            }
            if (found) {
            grid.push({x: posX, y: posY});
            }
        }
        }
    }
    let bestRange = 0;
    let bestMatrix;

    for (let matrix = 0; matrix < grid.length; matrix++) {
        let minDistance = Infinity;
        for (let pp = 0; pp < polygon.length-1; pp++) {
        const scanDistance = pDistance(grid[matrix], polygon[pp], polygon[pp+1]);
        if (scanDistance.distance < minDistance) {
            minDistance = scanDistance.distance;
        }
        }
        if (minDistance > bestRange) {
        bestMatrix = matrix;
        bestRange = minDistance;
        }
    }
    return grid[bestMatrix];
};

export const textOnDiv = (label, pos, styled, div) => {
    if (typeof(pos) != 'undefined') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttributeNS(null, 'x', pos.x);
        text.setAttributeNS(null, 'y', pos.y);
        text.setAttribute("style","fill:"+styled.color+";font-weight:"+styled.fontWeight+";font-size:"+styled.fontSize);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.textContent = label;
        document.getElementById(div).appendChild(text);

    }
};