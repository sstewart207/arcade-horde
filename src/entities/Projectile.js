export class Projectile {
  constructor(position, direction, speed, radius, damage = 1) {
    this.position = { ...position };
    this.velocity = {
      x: direction.x * speed,
      y: direction.y * speed,
    };
    this.radius = radius;
    this.damage = damage;
  }

  move(deltaSeconds) {
    this.position.x += this.velocity.x * deltaSeconds;
    this.position.y += this.velocity.y * deltaSeconds;
  }
}
