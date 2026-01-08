export class Cartello {
  constructor(x, y, text) {
    this.x = x; // Posizione X della base del palo
    this.y = y; // Posizione Y della base del palo (a terra)
    this.text = text;

    // Configurazione Stile
    this.poleHeight = 40;     // Altezza del palo
    this.poleWidth = 6;       // Spessore del palo
    this.fontSize = 14;       // Grandezza testo
    this.lineHeight = 18;     // Spazio tra una riga e l'altra
    this.maxWidth = 160;      // Larghezza massima prima di andare a capo
    this.padding = 10;        // Spazio interno (margine) della tavola
  }

  draw(ctx) {
    ctx.font = `bold ${this.fontSize}px Arial`;

    // --- 1. CALCOLO DELLE RIGHE (Word Wrapping) ---
    const words = this.text.split(' ');
    let lines = [];
    let currentLine = words[0];

    // Ciclo su tutte le parole per creare le righe
    for (let i = 1; i < words.length; i++) {
      let word = words[i];
      let width = ctx.measureText(currentLine + " " + word).width;

      if (width < this.maxWidth) {
        // Se c'è spazio, aggiungiamo la parola alla riga corrente
        currentLine += " " + word;
      } else {
        // Altrimenti salviamo la riga e ne iniziamo una nuova
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine); // Aggiungiamo l'ultima riga rimasta

    // --- 2. CALCOLO DIMENSIONI TAVOLA ---
    // La larghezza della tavola sarà quella della riga più lunga (o maxWidth)
    let maxLineWidth = 0;
    lines.forEach(line => {
      let w = ctx.measureText(line).width;
      if (w > maxLineWidth) maxLineWidth = w;
    });

    const boardWidth = maxLineWidth + (this.padding * 2);
    const boardHeight = (lines.length * this.lineHeight) + (this.padding);

    // Coordinate dell'angolo in alto a sinistra della tavola
    // La tavola deve stare SOPRA il palo
    const boardX = this.x - (boardWidth / 2);
    const boardY = this.y - this.poleHeight - boardHeight;

    // --- 3. DISEGNO IL PALO ---
    ctx.fillStyle = "#5D4037"; // Marrone scuro
    // Il palo parte da sotto la tavola e arriva a this.y (terra)
    ctx.fillRect(
      this.x - (this.poleWidth / 2),
      boardY + boardHeight - 5, // -5 per farlo "entrare" un po' nella tavola
      this.poleWidth,
      this.poleHeight + 5
    );

    // --- 4. DISEGNO LA TAVOLA ---
    ctx.fillStyle = "#DEB887"; // Legno chiaro
    ctx.fillRect(boardX, boardY, boardWidth, boardHeight);

    // Bordo della tavola
    ctx.strokeStyle = "#5D4037";
    ctx.lineWidth = 2;
    ctx.strokeRect(boardX, boardY, boardWidth, boardHeight);

    // Chiodini (Dettaglio estetico)
    ctx.fillStyle = "#3E2723";
    ctx.fillRect(boardX + 2, boardY + 2, 2, 2);
    ctx.fillRect(boardX + boardWidth - 4, boardY + 2, 2, 2);
    ctx.fillRect(boardX + 2, boardY + boardHeight - 4, 2, 2);
    ctx.fillRect(boardX + boardWidth - 4, boardY + boardHeight - 4, 2, 2);

    // --- 5. DISEGNO IL TESTO (RIGA PER RIGA) ---
    ctx.fillStyle = "#3E2723"; // Testo scuro
    ctx.textAlign = "center";
    ctx.textBaseline = "top"; // Importante: allineiamo al top per gestire le righe

    // Disegno ogni riga
    for (let i = 0; i < lines.length; i++) {
      // Calcolo Y: posizione tavola + padding + (numero riga * altezza riga)
      let lineY = boardY + this.padding + (i * this.lineHeight) - 2; // -2 per piccolo aggiustamento ottico
      ctx.fillText(lines[i], this.x, lineY);
    }
  }
}