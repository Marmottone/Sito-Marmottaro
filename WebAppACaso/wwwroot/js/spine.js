export class Spina {
  // Aggiunto il parametro 'direction' (default è 'up')
  constructor(x, y, width, height, direction = "up") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction; // "up", "down", "left", "right"

    this.image = new Image();
    this.image.src = '/images/spine.png';

    // Calcoliamo le hitbox in base alla direzione
    this.hitboxes = this.calculateHitboxes();
  }

  calculateHitboxes() {
    const boxes = [];

    // Logica originale per "up" (Punte verso l'alto)
    // Larghezza e Altezza sono usate normalmente
    if (this.direction === "up") {
      boxes.push(
        { offsetX: this.width * 0.1, offsetY: this.height * 0.3, w: this.width * 0.25, h: this.height * 0.4 }, // Sinistra
        { offsetX: this.width * 0.375, offsetY: this.height * 0.1, w: this.width * 0.25, h: this.height * 0.5 }, // Centro (punta)
        { offsetX: this.width * 0.65, offsetY: this.height * 0.3, w: this.width * 0.25, h: this.height * 0.4 }  // Destra
      );
    }
    // Logica per "down" (Punte verso il basso - Soffitto)
    else if (this.direction === "down") {
      boxes.push(
        // offsetY parte dall'alto (0) invece che dal basso
        { offsetX: this.width * 0.1, offsetY: 0, w: this.width * 0.25, h: this.height * 0.7 },
        { offsetX: this.width * 0.375, offsetY: 0, w: this.width * 0.25, h: this.height * 0.9 }, // Punta lunga
        { offsetX: this.width * 0.65, offsetY: 0, w: this.width * 0.25, h: this.height * 0.7 }
      );
    }
    // Logica per "left" (Punte verso sinistra - Muro destro)
    // Qui invertiamo larghezza e altezza concettualmente
    else if (this.direction === "left") {
      boxes.push(
        // Le hitbox si sviluppano in larghezza (verso sinistra)
        { offsetX: this.width * 0.3, offsetY: this.height * 0.1, w: this.width * 0.7, h: this.height * 0.25 },
        { offsetX: this.width * 0.1, offsetY: this.height * 0.375, w: this.width * 0.9, h: this.height * 0.25 }, // Punta centrale
        { offsetX: this.width * 0.3, offsetY: this.height * 0.65, w: this.width * 0.7, h: this.height * 0.25 }
      );
    }
    // Logica per "right" (Punte verso destra - Muro sinistro)
    else if (this.direction === "right") {
      boxes.push(
        // Le hitbox partono da sinistra (0) e vanno verso destra
        { offsetX: 0, offsetY: this.height * 0.1, w: this.width * 0.7, h: this.height * 0.25 },
        { offsetX: 0, offsetY: this.height * 0.375, w: this.width * 0.9, h: this.height * 0.25 }, // Punta centrale
        { offsetX: 0, offsetY: this.height * 0.65, w: this.width * 0.7, h: this.height * 0.25 }
      );
    }

    return boxes;
  }

  draw(ctx) {
    if (!this.image.complete) return;

    ctx.save(); // Salva lo stato attuale del canvas

    // 1. Sposta il punto di origine al CENTRO della spina (per ruotare correttamente)
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    ctx.translate(centerX, centerY);

    // 2. Ruota il canvas in base alla direzione
    let angle = 0;
    if (this.direction === "right") angle = 90 * Math.PI / 180;
    if (this.direction === "down") angle = 180 * Math.PI / 180;
    if (this.direction === "left") angle = -90 * Math.PI / 180;
    ctx.rotate(angle);

    // 3. Disegna l'immagine
    // Nota: Quando ruotiamo di 90 gradi (muri), dobbiamo scambiare larghezza e altezza nel disegno
    // perché l'immagine originale è larga orizzontalmente.
    if (this.direction === "left" || this.direction === "right") {
      // Disegna scambiando w/h per adattare l'immagine al rettangolo verticale
      ctx.drawImage(this.image, -this.height / 2, -this.width / 2, this.height, this.width);
    } else {
      // Normale per su/giù
      ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    }

    ctx.restore(); // Ripristina lo stato (così non ruota tutto il resto del gioco)

    // --- DEBUG HITBOX ---
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (const hb of this.hitboxes) {
        ctx.strokeRect(this.x + hb.offsetX, this.y + hb.offsetY, hb.w, hb.h);
    }
  }

  // Controlla la collisione
  collidesWith(player) {
    // Recuperiamo la hitbox precisa (quella blu) invece di usare player.x/y generici
    const playerHb = player.getHitbox();

    for (const hb of this.hitboxes) {
      const hbX = this.x + hb.offsetX;
      const hbY = this.y + hb.offsetY;

      // Ora confrontiamo la hitbox della spina con la hitbox blu del player
      if (
        playerHb.x < hbX + hb.w &&
        playerHb.x + playerHb.width > hbX &&
        playerHb.y < hbY + hb.h &&
        playerHb.y + playerHb.height > hbY
      ) {
        return true;
      }
    }
    return false;
  }
}