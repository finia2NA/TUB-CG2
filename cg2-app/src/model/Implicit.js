import { KDTreePointDataStructure as PointDataStructure } from './pointDataStructures';
import { Vector3 } from "three";
import PointRep from './PointRep';
import * as math from "mathjs";
import { BasisFunction } from './BasisFunction';
import { flattenArray } from '../components/3D/ValueBasedPoints';
import { edgeTable, triangulationTable } from './lookup.js';

const useWendland = true;
class Implicit {
  constructor(basePoints, degree, wendlandRadius, baseAlpha) {
    this._basePoints = basePoints;
    this._3NPoints = null;
    this.pointGrid = null;
    this._degree = degree;
    this._wendlandRadius = wendlandRadius;
    this._baseAlpha = baseAlpha;
    this.xStep = null
    this.yStep = null
    this.zStep = null
  }

  computeInitialAlpha() {
    const bb = this._basePoints.getBoundingBox();
    const bbDiagonal = bb.max.distanceTo(bb.min)
    return bbDiagonal * this._baseAlpha;
  }

  calculateOffsetPoints() {

    const baseAlpha = this.computeInitialAlpha();
    const posOffsetPoints = []
    const negOffsetPoints = []

    for (const sign of [-1, 1]) {
      // do this whole thing twice, once for positive and once for negative offset
      const offsetList = sign === 1 ? posOffsetPoints : negOffsetPoints;

      for (const point of this._basePoints.points) {
        let currentAlpha = baseAlpha

        while (true) {
          // compute points
          const offsetVector = point.normal.clone().multiplyScalar(sign * currentAlpha);
          const offsetPoint = new PointRep(point.position.clone().add(offsetVector), point.normal.clone());
          offsetPoint.functionValue = sign * currentAlpha;
          // check that the original point is the closest point to the offset point
          const closestPoint = this._basePoints.findNearest(offsetPoint);
          if (closestPoint === point) {
            // if check was positive, add point to list and break
            offsetList.push(offsetPoint);
            break;
          } else {
            // if check was negative, halve currentAlpha and try again
            currentAlpha = currentAlpha / 2;
          }
        }
      }
    }


    this._3NPoints = new PointDataStructure()
    this._3NPoints.points = [...this._basePoints.points, ...posOffsetPoints, ...negOffsetPoints];
    this._3NPoints.buildTree();
  }

  _wls(x, y, z, degree = 0, computeNormals = false) {
    // adapted from surface.js with help from my dear friend, Chad G. Peté
    // https://chat.openai.com/share/7e6aeaf8-d5a6-43a7-85e5-8ac1271c1151

    // get relevant values
    const pointArray = this._3NPoints.points;
    const positions = pointArray.map(point => point.position.toArray());
    const X = positions.map(row => row[0]);
    const Y = positions.map(row => row[1]);
    const Z = positions.map(row => row[2]);
    const F = pointArray.map(point => point.functionValue); // interpolated function value


    // choose and compute polybase
    const basisFunction = new BasisFunction(degree);
    let polyBases = [];
    for (let i = 0; i < X.length; i++) {
      polyBases.push(basisFunction.getBasisFunctionArray(X[i], Y[i], Z[i]))
    }

    const D = pointArray.map(point => point.distanceToPosition(new Vector3(x, y, z)));


    const bb = this._basePoints.getBoundingBox();
    const bbDiagonal = bb.max.distanceTo(bb.min)
    const diagWL = bbDiagonal * this._wendlandRadius;
    const wf_wendland = (d) => {
      return ((1 - d / diagWL) ** 4) * (4 * d / (diagWL + 1));
    }
    const wf_epsilon = (d, epsilon = 0.1) => {
      return 1 / (d ** 2 + epsilon ** 2)
    }
    const wf = useWendland ? wf_wendland : wf_epsilon;

    let weightVector = []; // weight value
    for (let i = 0; i < D.length; i++) {
      const weight = wf(D[i]);
      weightVector[i] = weight;
    }

    // apply the weights to the polybases
    const weightedPolyBases = math.multiply(math.diag(weightVector), polyBases)

    // leftSide and rightSide refer to the equation in the paper.
    const leftSide = math.multiply(math.transpose(polyBases), weightedPolyBases);
    const rightSide = math.multiply(math.transpose(weightedPolyBases), F);
    const coefficients = math.multiply(math.inv(leftSide), rightSide);

    // compute the result
    const result = basisFunction.evaluate(x, y, z, coefficients);

    // RETURN CASE: NO NORMALS
    if (!computeNormals) {
      const re = new PointRep(new Vector3(x, y, z));
      re.functionValue = result;
      return re;
    }

    // ------------------
    // NORMAL COMPUTATION
    const normal = basisFunction.evaluateGradient(x, y, z, coefficients);
    // RETURN
    const re = new PointRep(new Vector3(x, y, z, normal));
    re.functionValue = result;
    return re;
  }

  _asyncWLS(x, y, z, degree = this._degree, computeNormals = false) {
    return Promise.resolve(this._wls(x, y, z, degree, computeNormals));
  }



  async calculateGridValues(nx, ny, nz) {
    // TODO: use worker threads to speed this up
    // https://chat.openai.com/share/bf388ef3-a0d6-42ed-a483-496290c7a406

    this.calculateOffsetPoints();
    const bb = this._3NPoints.getBoundingBox();

    // set up from where to where and in what steps to iterate
    const xRange = bb.max.x - bb.min.x;
    const yRange = bb.max.y - bb.min.y;
    const zRange = bb.max.z - bb.min.z;
    this.xStep = xRange / (nx - 1);
    this.yStep = yRange / (ny - 1);
    this.zStep = zRange / (nz - 1);

    // create grid 3d array
    const grid = new Array(nx).fill().map(() => new Array(ny).fill().map(() => new Array(nz)));

    // fill grid with points
    console.log("computing grid values...")
    const promises = [];
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        for (let k = 0; k < nz; k++) {
          const x = bb.min.x + i * this.xStep;
          const y = bb.min.y + j * this.yStep;
          const z = bb.min.z + k * this.zStep;

          // Push the promises into the promises array
          promises.push(
            this._asyncWLS(x, y, z).then(wlsPoint => {
              grid[i][j][k] = wlsPoint

            })
          );
        }
      }
    }

    // Wait for all promises to be resolved
    await Promise.all(promises);
    console.log("done computing grid values")

    this.pointGrid = grid;
    return grid
  }


  marchingCubes(isolevel = 0) {

    // init
    var surfacePointsMC = [];

    // iterate over pointGrid
    for (var x = 0; x < this.pointGrid.length - 1; x++) {
      for (var y = 0; y < this.pointGrid[0].length - 1; y++) {
        for (var z = 0; z < this.pointGrid[0][0].length - 1; z++) {

          // define all 8 cube vertices 
          var cube = [
            this.pointGrid[x][y][z],
            this.pointGrid[x + 1][y][z],
            this.pointGrid[x + 1][y + 1][z],
            this.pointGrid[x][y + 1][z],
            this.pointGrid[x][y][z + 1],
            this.pointGrid[x + 1][y][z + 1],
            this.pointGrid[x + 1][y + 1][z + 1],
            this.pointGrid[x][y + 1][z + 1]
          ];

          // Determine the index into the edge table which
          // tells us which vertices are inside of the surface
          var cubeindex = 0;
          if (cube[0].functionValue < isolevel) cubeindex |= 1; // bitwise or operator
          if (cube[1].functionValue < isolevel) cubeindex |= 2;
          if (cube[2].functionValue < isolevel) cubeindex |= 4;
          if (cube[3].functionValue < isolevel) cubeindex |= 8;
          if (cube[4].functionValue < isolevel) cubeindex |= 16;
          if (cube[5].functionValue < isolevel) cubeindex |= 32;
          if (cube[6].functionValue < isolevel) cubeindex |= 64;
          if (cube[7].functionValue < isolevel) cubeindex |= 128;


          // Find the vertices where the surface intersects the cube 
          let vertlist = []
          if (edgeTable[cubeindex] & 1)
            vertlist[0] = this.VertexInterp(isolevel, cube[0].position, cube[1].position, cube[0].functionValue, cube[1].functionValue);
          if (edgeTable[cubeindex] & 2)
            vertlist[1] = this.VertexInterp(isolevel, cube[1].position, cube[2].position, cube[1].functionValue, cube[2].functionValue);
          if (edgeTable[cubeindex] & 4)
            vertlist[2] = this.VertexInterp(isolevel, cube[2].position, cube[3].position, cube[2].functionValue, cube[3].functionValue);
          if (edgeTable[cubeindex] & 8)
            vertlist[3] = this.VertexInterp(isolevel, cube[3].position, cube[0].position, cube[3].functionValue, cube[0].functionValue);
          if (edgeTable[cubeindex] & 16)
            vertlist[4] = this.VertexInterp(isolevel, cube[4].position, cube[5].position, cube[4].functionValue, cube[5].functionValue);
          if (edgeTable[cubeindex] & 32)
            vertlist[5] = this.VertexInterp(isolevel, cube[5].position, cube[6].position, cube[5].functionValue, cube[6].functionValue);
          if (edgeTable[cubeindex] & 64)
            vertlist[6] = this.VertexInterp(isolevel, cube[6].position, cube[7].position, cube[6].functionValue, cube[7].functionValue);
          if (edgeTable[cubeindex] & 128)
            vertlist[7] = this.VertexInterp(isolevel, cube[7].position, cube[4].position, cube[7].functionValue, cube[4].functionValue);
          if (edgeTable[cubeindex] & 256)
            vertlist[8] = this.VertexInterp(isolevel, cube[0].position, cube[4].position, cube[0].functionValue, cube[4].functionValue);
          if (edgeTable[cubeindex] & 512)
            vertlist[9] = this.VertexInterp(isolevel, cube[1].position, cube[5].position, cube[1].functionValue, cube[5].functionValue);
          if (edgeTable[cubeindex] & 1024)
            vertlist[10] = this.VertexInterp(isolevel, cube[2].position, cube[6].position, cube[2].functionValue, cube[6].functionValue);
          if (edgeTable[cubeindex] & 2048)
            vertlist[11] = this.VertexInterp(isolevel, cube[3].position, cube[7].position, cube[3].functionValue, cube[7].functionValue);


          // get normal + surfacePoints 
          for (let i = 0; triangulationTable[cubeindex][i] != -1; i++) {
            const p = vertlist[triangulationTable[cubeindex][i]];

            // gradient = normal (according to paper)
            // not working on border due to need of neighbors 
            if (x > 0 && y > 0 && z > 0 &&
              x < this.pointGrid.length - 1 &&
              y < this.pointGrid[0].length - 1 &&
              z < this.pointGrid[0][0].length - 1) {
              // finite differences
              const px = (this.pointGrid[x + 1][y][z].functionValue - this.pointGrid[x - 1][y][z].functionValue) / this.xStep
              const py = (this.pointGrid[x][y + 1][z].functionValue - this.pointGrid[x][y - 1][z].functionValue) / this.yStep
              const pz = (this.pointGrid[x][y][z + 1].functionValue - this.pointGrid[x][y][z - 1].functionValue) / this.zStep
              const gradient = new PointRep((new Vector3(px, py, pz)).normalize())

              // interpolation of gradient 
              p.normal = this.VertexInterp(isolevel, p.position, gradient.position, p.functionValue, gradient.functionValue);

            }
            surfacePointsMC.push(p)
          }
        }
      }
    }
    return surfacePointsMC;
  }

  /*
   Linearly interpolate the position where an isosurface cuts
   an edge between two vertices, each with their own scalar value
  */
  VertexInterp(isolevel, p1, p2, valp1, valp2) {
    if (Math.abs(isolevel - valp1) < 0.00001)
      return (p1);
    if (Math.abs(isolevel - valp2) < 0.00001)
      return (p2);
    if (Math.abs(valp1 - valp2) < 0.00001)
      return (p1);
    const mu = (isolevel - valp1) / (valp2 - valp1);
    const x = p1.x + mu * (p2.x - p1.x);
    const y = p1.y + mu * (p2.y - p1.y);
    const z = p1.z + mu * (p2.z - p1.z);
    return new PointRep(new Vector3(x, y, z))
  }
}


export default Implicit