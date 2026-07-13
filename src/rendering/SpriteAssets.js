export class SpriteAssets {
  player = loadSprite("./assets/sprites/player.png");
  zombie = loadSprite("./assets/sprites/zombie.png");
}

function loadSprite(path) {
  const image = new Image();
  image.src = path;
  return image;
}

