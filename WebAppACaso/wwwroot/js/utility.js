export function checkCollision(p, plat) {
  return p.x < plat.x + plat.width &&
    p.x + p.width > plat.x &&
    p.y < plat.y + plat.height &&
    p.y + p.height > plat.y;
}