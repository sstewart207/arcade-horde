export class ImpactBurst {
  age = 0;

  constructor(position, duration) {
    this.position = position;
    this.duration = duration;
  }

  get progress() {
    return Math.min(1, this.age / this.duration);
  }

  get isExpired() {
    return this.age >= this.duration;
  }

  tick(deltaSeconds) {
    this.age += deltaSeconds;
  }
}

