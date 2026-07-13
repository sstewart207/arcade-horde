import { MedkitTuning } from "../core/Constants.js";

export class Medkit {
  age = 0;

  constructor(position) {
    this.position = { ...position };
  }

  get radius() {
    return MedkitTuning.radius;
  }

  tick(deltaSeconds) {
    this.age += deltaSeconds;
  }
}
