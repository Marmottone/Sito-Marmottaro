import { checkCollision } from './utility.js';

export class Traguardo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50; // Dimensione sprite

    // Sprite
    this.image = new Image();
    this.image.src = "/images/Nocciola.svg";

    // Variabili per animazione fluttuante (Floating)
    this.initialY = y;
    this.floatTimer = 0;
    this.floatSpeed = 0.05;
    this.floatRange = 10; // Quanti pixel va su e giù

    this.collected = false;
  }

  update(player) {
    if (this.collected) return false;

    this.floatTimer += this.floatSpeed;
    this.y = this.initialY + Math.sin(this.floatTimer) * this.floatRange;

    // Controllo collisione con il giocatore
    // Usiamo una hitbox leggermente più piccola per essere gentili
    let hitbox = {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 20
    };

    // Nota: checkCollision si aspetta {x,y,width,height} per entrambi
    // Player ha il metodo getHitbox(), usiamo quello per precisione
    if (checkCollision(player.getHitbox(), hitbox)) {
      this.collected = true;
      return true; // HA VINTO!
    }
    return false;
  }

  draw(ctx) {
    if (this.image.complete) {
      ctx.save();
      ctx.shadowColor = "gold";
      ctx.shadowBlur = 15;
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.restore();
    } else {
      ctx.fillStyle = "gold";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}