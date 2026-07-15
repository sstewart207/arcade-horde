import { PlayerTuning } from "./Constants.js";

export function getMuzzlePosition(player, facingRadians = player.facingRadians) {
  const distance = PlayerTuning.radius + 33;
  return {
    x: player.position.x + Math.cos(facingRadians) * distance,
    y: player.position.y + Math.sin(facingRadians) * distance,
  };
}
