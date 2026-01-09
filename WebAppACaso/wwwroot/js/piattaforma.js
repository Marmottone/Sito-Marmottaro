// --- CARICAMENTO IMMAGINI ---
const imgErba = new Image();
imgErba.src = "/images/erba.png";

const imgRoccia = new Image();
imgRoccia.src = "/images/roccia.png";

const imgLegno = new Image();
imgLegno.src = "/images/legno.png";

const imgTerra = new Image();
imgTerra.src = "/images/terra.png";

const imgAcqua = new Image();
imgAcqua.src = "/images/acqua.png";

// Cache per salvare le texture rimpicciolite
let patternErba = null;
let patternRoccia = null;
let patternLegno = null;
let patternTerra = null;
let patternAcqua = null;

export class Piattaforma {
  constructor(x, y, width, height, type, isSolid) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;     // "erba", "roccia", "legno", "terra", "acqua"
    this.isSolid = isSolid; // true = muro, false = attraversabile
  }

  draw(ctx) {
    let pattern = null;

    // 1. ERBA
    if (this.type === "erba" && imgErba.complete) {
      if (!patternErba) patternErba = this.createPixelPattern(ctx, imgErba, 24);
      pattern = patternErba;
    }
    // 2. ROCCIA
    else if (this.type === "roccia" && imgRoccia.complete) {
      if (!patternRoccia) patternRoccia = this.createPixelPattern(ctx, imgRoccia, 50);
      pattern = patternRoccia;
    }
    // 3. LEGNO 
    else if (this.type === "legno" && imgLegno.complete) {
      if (!patternLegno) patternLegno = this.createPixelPattern(ctx, imgLegno, 30);
      pattern = patternLegno;
    }
    // 4. TERRA 
    else if (this.type === "terra" && imgTerra.complete) {
      if (!patternTerra) patternTerra = this.createPixelPattern(ctx, imgTerra, 40);
      pattern = patternTerra;
    }
    // 5. ACQUA 
    else if (this.type === "acqua" && imgAcqua.complete) {
      // Dimensione 40px per il pattern dell'acqua
      if (!patternAcqua) patternAcqua = this.createPixelPattern(ctx, imgAcqua, 40);
      pattern = patternAcqua;
    }

    // --- DISEGNO ---
    if (pattern) {
      ctx.save();

      // Imposta il pattern come riempimento
      ctx.fillStyle = pattern;

      // Gestione Trasparenza
      if (this.type === "legno") {
        ctx.globalAlpha = 0.9; // 90% visibile, 10% trasparente
      }
      else if (this.type === "acqua") {
        ctx.globalAlpha = 0.6; // 60% visibile, 40% trasparente
      }

      // Allinea la texture alla posizione della piattaforma
      ctx.translate(this.x, this.y);
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.restore();
    } else {
      // Fallback colore solido se l'immagine non è pronta
      if (this.type === "acqua") ctx.fillStyle = "rgba(0, 100, 255, 0.5)"; // Blu semitrasparente
      else if (this.type.startsWith("#")) ctx.fillStyle = this.type;
      else ctx.fillStyle = "#8B4513";

      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  // Funzione per scalare mantenendo i pixel croccanti
  createPixelPattern(ctx, img, size) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = size;
    offCanvas.height = size;
    const offCtx = offCanvas.getContext('2d');

    offCtx.imageSmoothingEnabled = false;
    offCtx.drawImage(img, 0, 0, size, size);

    return ctx.createPattern(offCanvas, "repeat");
  }
}