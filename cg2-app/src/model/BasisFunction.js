import { Vector3 } from "three";

export class BasisFunction {
  constructor(degree) {
    this._degree = degree;
  }

  // TODO: check order of x,y,z,x^2, x*y etc coefficients and if they line up with the canonical order
  getBasisFunctionArray(x, y, z) {
    switch (this._degree) {
      case 0:
        return [1];
      case 1:
        return [1, x, y, z];
      case 2:
        return [1, x, y, z, x * y, x * z, y * z, x ** 2, y ** 2, z ** 2];
      default:
        throw new Error("Degree not supported");
    }
  }

  evaluate(x, y, z, coefficients) {
    switch (this._degree) {
      case 0:
        return coefficients[0];
      case 1:
        return coefficients[0] + coefficients[1] * x + coefficients[2] * y + coefficients[3] * z;
      case 2:
        return coefficients[0] + coefficients[1] * x + coefficients[2] * y + coefficients[3] * z + coefficients[4] * x * y + coefficients[5] * x * z + coefficients[6] * y * z + coefficients[7] * x ** 2 + coefficients[8] * y ** 2 + coefficients[9] * z ** 2;
      default:
        throw new Error("Degree not supported");
    }
  }

  evaluateGradient(x, y, z, coefficients) {
    switch (this._degree) {
      case 0:
        return new Vector3(0, 0, 0);
      case 1:
        return new Vector3(coefficients[1], coefficients[2], coefficients[3]);
      case 2:
        return new Vector3(coefficients[1] + coefficients[4] * y + coefficients[5] * z + 2 * coefficients[7] * x, coefficients[2] + coefficients[4] * x + coefficients[6] * z + 2 * coefficients[8] * y, coefficients[3] + coefficients[5] * x + coefficients[6] * y + 2 * coefficients[9] * z);
      default:
        throw new Error("Degree not supported");
    }
  }
}
