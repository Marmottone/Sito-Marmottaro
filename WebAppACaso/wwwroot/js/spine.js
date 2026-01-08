export class Spina {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    // Assicurati che il nome del file corrisponda a quello che hai salvato
    this.image.src = '/images/spine.png';

    // DEFINIZIONE DELLE HITBOX MULTIPLE
    // Creiamo 3 rettangoli più piccoli relativi alla posizione (x,y) della spina.
    // Le percentuali sono stimate per coprire le punte. Puoi aggiustarle se serve.
    this.hitboxes = [
      // Punta Sinistra
      {
        offsetX: this.width * 0.1, offsetY: this.height * 0.3,
        w: this.width * 0.25, h: this.height * 0.4
      },
      // Punta Centrale (più alta)
      {
        offsetX: this.width * 0.375, offsetY: this.height * 0.1,
        w: this.width * 0.25, h: this.height * 0.5
      },
      // Punta Destra
      {
        offsetX: this.width * 0.65, offsetY: this.height * 0.3,
        w: this.width * 0.25, h: this.height * 0.4
      }
    ];
  }

  draw(ctx) {
    // Disegna l'immagine se è caricata
    if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // --- DEBUG HITBOX ---
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (const hb of this.hitboxes) {
        ctx.strokeRect(this.x + hb.offsetX, this.y + hb.offsetY, hb.w, hb.h);
    }
  }

  // Controlla la collisione con il giocatore
  collidesWith(player) {
    // Controlla ogni singola hitbox delle punte
    for (const hb of this.hitboxes) {
      // Calcola la posizione assoluta della hitbox nel mondo
      const hbX = this.x + hb.offsetX;
      const hbY = this.y + hb.offsetY;

      // Standard AABB collision check (Rettangolo contro Rettangolo)
      if (
        player.x < hbX + hb.w &&
        player.x + player.width > hbX &&
        player.y < hbY + hb.h &&
        player.y + player.height > hbY
      ) {
        return true; // Toccata una delle punte!
      }
    }
    return false; // Nessuna punta toccata
  }
}