export class Projectile {
  constructor(position, direction, speed, radius) {
    this.position = { ...position };
    this.velocity = {
      x: direction.x * speed,
      y: direction.y * speed,
    };
    this.radius = radius;
  }

  move(deltaSeconds) {
    this.position.x += this.velocity.x * deltaSeconds;
    this.position.y += this.velocity.y * deltaSeconds;
  }
}

