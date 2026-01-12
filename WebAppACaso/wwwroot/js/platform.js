import { Marmotta } from './marmotta.js';
import { Piattaforma } from './piattaforma.js';
import { Traguardo } from './traguardo.js';
import { Cartello } from './cartello.js';
import { Spina } from './spine.js';

// --- CONFIGURAZIONE CANVAS ---
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// --- DIMENSIONI FISSE DELLO SCHERMO DI GIOCO ---
// Impostiamo una risoluzione fissa così non si "spalma" su schermi grandi
canvas.width = 1024;
canvas.height = 576;

// Dimensioni Mondo (Livello intero)
const worldWidth = 5000;
const worldHeight = 5000;

// Variabili Globali di Stato
let gameRunning = false;
let animationId;
const keys = {};
let camera = { x: 0, y: 0 };

// --- TIMER E SCORE ---
let startTime = 0;
let levelBestTimes = {};

// Carichiamo subito i tempi salvati (se esistono)
try {
  const savedTimes = localStorage.getItem("marmottaBestTimesMap");
  if (savedTimes) {
    levelBestTimes = JSON.parse(savedTimes);
  }
} catch (e) {
  console.error("Errore caricamento salvataggi:", e);
  levelBestTimes = {};
}

// --- LIMITATORE FPS ---
let lastTime = 0;
const fps = 60;
const interval = 1000 / fps;

// --- OGGETTI DI GIOCO (Inizializzati vuoti) ---
let player;
let platforms = [];
let cartelli = [];
let spines = []
let traguardo;

// Gestione Input
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);


// --- FUNZIONE DI AVVIO (Chiamata dal bottone HTML) ---
// Variabile per tenere traccia del livello attuale
let currentLevel = 1;

// --- FUNZIONE DI AVVIO (Chiamata dal bottone HTML) ---
window.startGame = function (level) {
  currentLevel = level; // Salviamo il livello selezionato
  console.log("Avvio livello: " + level);

  // 1. Gestione Schermate
  const menu = document.getElementById('menu-screen');
  const victory = document.getElementById('victory-screen');
  const gameover = document.getElementById('gameover-screen');

  if (menu) menu.style.display = 'none';       // Nascondi Menu
  if (victory) victory.style.display = 'none'; // Nascondi Vittoria (se aperta)
  if (gameover) gameover.style.display = 'none';

  // 2. Mostra il canvas
  canvas.style.display = 'block';

  // 3. Inizializza il gioco
  initGame(level);

  // 4. Avvia il loop se non è già attivo
  if (!gameRunning) {
    gameRunning = true;
    lastTime = 0;
    gameLoop(0);
  }
};


// --- INIZIALIZZAZIONE DEL LIVELLO ---
function initGame(level) {
  startTime = Date.now();
  player = new Marmotta(50, worldHeight - 70);

  platforms = [];
  cartelli = [];
  spines = []

  // CARICAMENTO LIVELLO 1
  if (level === 1) {

    // --- PIATTAFORME ---
    platforms = [

      // Terreno
      new Piattaforma(0, worldHeight - 20, 900, 20, "erba", true),
      new Piattaforma(900, worldHeight - 5, 350, 25, "terra", true),
      new Piattaforma(900, worldHeight - 25, 350, 20, "erba", true),
      new Piattaforma(1250, worldHeight - 20, 350, 40, "terra", true),
      new Piattaforma(1250, worldHeight - 40, 350, 20, "erba", true),
      new Piattaforma(1600, worldHeight - 35, 250, 40, "terra", true),
      new Piattaforma(1600, worldHeight - 55, 250, 20, "erba", true),
      new Piattaforma(3665, worldHeight - 2560, 300, 55, "terra", true),
      new Piattaforma(3610, worldHeight - 2580, 410, 20, "terra", true),
      new Piattaforma(3610, worldHeight - 2600, 410, 25, "erba", true),
      new Piattaforma(2955, worldHeight - 2250, 300, 55, "terra", true),
      new Piattaforma(2900, worldHeight - 2270, 410, 20, "terra", true),
      new Piattaforma(2900, worldHeight - 2290, 410, 25, "erba", true),
      new Piattaforma(1520, worldHeight - 2110, 300, 55, "terra", true),
      new Piattaforma(1465, worldHeight - 2130, 410, 20, "terra", true),
      new Piattaforma(1465, worldHeight - 2150, 410, 25, "erba", true),
      new Piattaforma(400, worldHeight - 3765, 300, 55, "terra", true),
      new Piattaforma(345, worldHeight - 3785, 410, 20, "terra", true),
      new Piattaforma(345, worldHeight - 3805, 410, 25, "erba", true),
      new Piattaforma(0, worldHeight - 1575, 950, 55, "terra", true),
      new Piattaforma(0, worldHeight - 1630, 1110, 55, "terra", true),
      new Piattaforma(0, worldHeight - 1660, 1200, 50, "terra", true),
      new Piattaforma(0, worldHeight - 1680, 1200, 25, "erba", true),
      new Piattaforma(2165, worldHeight - 4421, 670, 55, "terra", true),
      new Piattaforma(2040, worldHeight - 4441, 920, 20, "terra", true),
      new Piattaforma(2040, worldHeight - 4461, 920, 25, "erba", true),
      new Piattaforma(4260, worldHeight - 3680, 740, 55, "terra", true),
      new Piattaforma(4095, worldHeight - 3735, 905, 55, "terra", true),
      new Piattaforma(3955, worldHeight - 3755, 1200, 20, "terra", true),
      new Piattaforma(3955, worldHeight - 3775, 1200, 25, "erba", true),
      new Piattaforma(4680, worldHeight - 4740, 320, 20, "terra", true),
      new Piattaforma(4680, worldHeight - 4760, 320, 25, "erba", true),

      // Legno
      new Piattaforma(1475, worldHeight - 190, 225, 20, "legno", false),
      new Piattaforma(2100, worldHeight - 660, 150, 20, "legno", false),
      new Piattaforma(3150, worldHeight - 650, 150, 20, "legno", false),
      new Piattaforma(3515, worldHeight - 720, 150, 20, "legno", false),
      new Piattaforma(3520, worldHeight - 910, 150, 20, "legno", false),
      new Piattaforma(3350, worldHeight - 1035, 150, 20, "legno", false),
      new Piattaforma(3510, worldHeight - 1170, 150, 20, "legno", false),
      new Piattaforma(3630, worldHeight - 1310, 150, 20, "legno", false),
      new Piattaforma(4025, worldHeight - 1400, 50, 20, "legno", false),
      new Piattaforma(4650, worldHeight - 1650, 150, 20, "legno", false),
      new Piattaforma(4350, worldHeight - 1770, 150, 20, "legno", false),
      new Piattaforma(4590, worldHeight - 1900, 150, 20, "legno", false),
      new Piattaforma(4750, worldHeight - 2050, 150, 20, "legno", false),
      new Piattaforma(4600, worldHeight - 2170, 150, 20, "legno", false),
      new Piattaforma(4560, worldHeight - 2675, 150, 20, "legno", false),
      new Piattaforma(4255, worldHeight - 2770, 150, 20, "legno", false),
      new Piattaforma(2600, worldHeight - 2425, 150, 20, "legno", false),
      new Piattaforma(2250, worldHeight - 2560, 150, 20, "legno", false),
      new Piattaforma(795, worldHeight - 2610, 150, 20, "legno", false),
      new Piattaforma(795, worldHeight - 2756, 150, 20, "legno", false),
      new Piattaforma(603, worldHeight - 2885, 150, 20, "legno", false),
      new Piattaforma(417, worldHeight - 3020, 150, 20, "legno", false),
      new Piattaforma(210, worldHeight - 3140, 150, 20, "legno", false),
      new Piattaforma(875, worldHeight - 3910, 150, 20, "legno", false),
      new Piattaforma(1155, worldHeight - 4010, 150, 20, "legno", false),
      new Piattaforma(1380, worldHeight - 4125, 150, 20, "legno", false),
      new Piattaforma(1575, worldHeight - 4280, 150, 20, "legno", false),
      new Piattaforma(1700, worldHeight - 4430, 150, 20, "legno", false),
      new Piattaforma(3106, worldHeight - 4332, 150, 20, "legno", false),
      new Piattaforma(3350, worldHeight - 4125, 150, 20, "legno", false),
      new Piattaforma(3690, worldHeight - 3960, 150, 20, "legno", false),
      new Piattaforma(4285, worldHeight - 4590, 150, 20, "legno", false),
      new Piattaforma(3985, worldHeight - 4740, 150, 20, "legno", false),
      new Piattaforma(4307, worldHeight - 4840, 150, 20, "legno", false),
      new Piattaforma(175, worldHeight - 1940, 150, 20, "legno", false),

      // Roccia
      new Piattaforma(1850, worldHeight - 70, 100, 70, "roccia", true),
      new Piattaforma(1950, worldHeight - 280, 75, 75, "roccia", true),
      new Piattaforma(2025, worldHeight - 410, 275, 210, "roccia", true),
      new Piattaforma(2300, worldHeight - 550, 150, 375, "roccia", true),
      new Piattaforma(2450, worldHeight - 700, 250, 550, "roccia", true),
      new Piattaforma(2375, worldHeight - 730, 325, 30, "roccia", true),
      new Piattaforma(2700, worldHeight - 735, 200, 600, "roccia", true),
      new Piattaforma(3500, worldHeight - 600, 200, 600, "roccia", true),
      new Piattaforma(2450, worldHeight - 40, 300, 40, "roccia", true),
      new Piattaforma(2750, worldHeight - 35, 750, 35, "roccia", true),
      new Piattaforma(2210, worldHeight - 45, 240, 45, "roccia", true),
      new Piattaforma(1950, worldHeight - 50, 260, 50, "roccia", true),
      new Piattaforma(3700, worldHeight - 800, 150, 800, "roccia", true),
      new Piattaforma(3850, worldHeight - 1200, 200, 1200, "roccia", true),
      new Piattaforma(4050, worldHeight - 1400, 250, 1400, "roccia", true),
      new Piattaforma(4300, worldHeight - 1450, 400, 1450, "roccia", true),
      new Piattaforma(4700, worldHeight - 1500, 300, 1500, "roccia", true),
      new Piattaforma(4900, worldHeight - 2230, 100, 15, "roccia", true),
      new Piattaforma(4875, worldHeight - 2260, 125, 30, "roccia", true),
      new Piattaforma(4850, worldHeight - 2280, 150, 20, "roccia", true),
      new Piattaforma(4950, worldHeight - 2410, 50, 130, "roccia", true),
      new Piattaforma(4850, worldHeight - 2430, 150, 20, "roccia", true),
      new Piattaforma(4950, worldHeight - 2560, 50, 130, "roccia", true),
      new Piattaforma(4850, worldHeight - 2580, 150, 20, "roccia", true),
      new Piattaforma(0, worldHeight - 1803, 540, 135, "roccia", true),
      new Piattaforma(540, worldHeight - 1753, 210, 85, "roccia", true),
      new Piattaforma(750, worldHeight - 1713, 100, 45, "roccia", true),
      new Piattaforma(0, worldHeight - 2040, 150, 20, "roccia", true),
      new Piattaforma(0, worldHeight - 2170, 50, 130, "roccia", true),
      new Piattaforma(0, worldHeight - 2190, 150, 20, "roccia", true),
      new Piattaforma(0, worldHeight - 2320, 50, 130, "roccia", true),
      new Piattaforma(0, worldHeight - 2340, 150, 20, "roccia", true),
      new Piattaforma(240, worldHeight - 2435, 250, 355, "roccia", true),
      new Piattaforma(490, worldHeight - 2490, 250, 355, "roccia", true),
      new Piattaforma(240, worldHeight - 2435, 250, 355, "roccia", true),
      new Piattaforma(0, worldHeight - 3250, 150, 20, "roccia", true),
      new Piattaforma(0, worldHeight - 3380, 50, 130, "roccia", true),
      new Piattaforma(0, worldHeight - 3400, 150, 20, "roccia", true),
      new Piattaforma(0, worldHeight - 3530, 50, 130, "roccia", true),
      new Piattaforma(0, worldHeight - 3550, 150, 20, "roccia", true),
      new Piattaforma(0, worldHeight - 3680, 50, 130, "roccia", true),
      new Piattaforma(0, worldHeight - 3700, 150, 20, "roccia", true),
      new Piattaforma(0, worldHeight - 3830, 50, 130, "roccia", true),
      new Piattaforma(0, worldHeight - 3850, 150, 20, "roccia", true),
      new Piattaforma(2270, worldHeight - 5000, 150, 375, "roccia", true),
      new Piattaforma(2690, worldHeight - 4899, 150, 450, "roccia", true),
      new Piattaforma(2610, worldHeight - 4595, 125, 20, "roccia", true),
      new Piattaforma(2610, worldHeight - 4840, 125, 20, "roccia", true),
      new Piattaforma(2390, worldHeight - 4730, 125, 20, "roccia", true),
      new Piattaforma(4200, worldHeight - 4139, 150, 375, "roccia", true),
      new Piattaforma(4530, worldHeight - 4440, 150, 465, "roccia", true),
      new Piattaforma(4110, worldHeight - 3860, 150, 20, "roccia", true),
      new Piattaforma(4110, worldHeight - 4020, 150, 20, "roccia", true),
      new Piattaforma(4875, worldHeight - 3910, 125, 20, "roccia", true),
      new Piattaforma(4875, worldHeight - 4320, 125, 20, "roccia", true),
      new Piattaforma(4680, worldHeight - 4060, 75, 20, "roccia", true),
      new Piattaforma(4680, worldHeight - 4213, 75, 20, "roccia", true),
      new Piattaforma(4850, worldHeight - 4656, 150, 20, "roccia", true),
      new Piattaforma(4810, worldHeight - 4686, 190, 35, "roccia", true),
      new Piattaforma(4735, worldHeight - 4721, 265, 55, "roccia", true),
      new Piattaforma(4930, worldHeight - 5000, 70, 180, "roccia", true),
      new Piattaforma(4850, worldHeight - 5000, 80, 75, "roccia", true),
      new Piattaforma(4730, worldHeight - 5000, 120, 40, "roccia", true),
    ];

    cartelli = [
      new Cartello(200, worldHeight - 8, "Usa le frecce o WASD per muoverti"),
      new Cartello(650, worldHeight - 8, "Il tuo obbiettivo è raggiungere la nocciola"),
      new Cartello(1050, worldHeight - 13, "Premi SPAZIO o W per saltare"),
      new Cartello(1725, worldHeight - 43, "Puoi passare attraverso il legno")
    ];

    traguardo = new Traguardo(4855, worldHeight - 4900);
  }
  // --- CARICAMENTO LIVELLO 2 (NUOVO) ---
  else if (level === 2) {
    console.log("Caricamento Livello 2: Il Lago delle Spine");

    platforms = [
      // Piattaforma di partenza
      new Piattaforma(0, worldHeight - 50, 400, 50, "erba", true),

      // --- PISCINA D'ACQUA ---
      // Bordo sinistro
      new Piattaforma(400, worldHeight - 200, 50, 200, "roccia", true),
      // ACQUA (Attraversabile)
      new Piattaforma(450, worldHeight - 250, 600, 250, "acqua", false),
      // Pavimento sotto l'acqua
      new Piattaforma(450, worldHeight - 20, 600, 20, "terra", true),
      // Bordo destro
      new Piattaforma(1050, worldHeight - 200, 50, 200, "roccia", true),

      // Piattaforme sospese post-acqua
      new Piattaforma(1200, worldHeight - 300, 200, 20, "legno", false),
      new Piattaforma(1500, worldHeight - 450, 200, 20, "legno", false),
    ];

    // --- AGGIUNTA SPINE ---
    spines = [
      // Spine sul fondo della piscina (sotto l'acqua!)
      new Spina(600, worldHeight - 60, 80, 40, "up"),
      new Spina(800, worldHeight - 60, 80, 40, "up"),

      // Spina sul soffitto dopo la piscina
      new Spina(1250, worldHeight - 600, 80, 40, "down"),
    ];

    cartelli = [
      new Cartello(200, worldHeight - 60, "Livello 2: Attento a non affogare!"),
      new Cartello(1100, worldHeight - 210, "Ottima nuotata!")
    ];

    // Traguardo più vicino per testare
    traguardo = new Traguardo(1600, worldHeight - 550);
  }
}

// --- CICLO DI GIOCO ---
function gameLoop(timestamp) {
  if (!gameRunning) return;

  const deltaTime = timestamp - lastTime;

  if (deltaTime > interval) {
    lastTime = timestamp - (deltaTime % interval);

    // Update Player
    if (player) {
      player.update(keys, platforms, worldWidth, worldHeight, worldHeight);

      for (const spina of spines) {
        if (spina.collidesWith(player)) {
          console.log("Morta! Toccata una spina.");

          handleDeath();
          return;
        }
      }
    }

    // Check Traguardo (VITTORIA)
    if (traguardo && player && traguardo.update(player)) {
      handleWin();
      return; // Interrompe il loop corrente
    }

    // Update Camera
    if (player) {
      camera.x = player.x - canvas.width / 2;
      camera.y = player.y - canvas.height / 2;

      // Limiti Camera (Clamping)
      if (camera.x < 0) camera.x = 0;
      if (camera.x > worldWidth - canvas.width) camera.x = worldWidth - canvas.width;
      if (camera.y < 0) camera.y = 0;
      if (camera.y > worldHeight - canvas.height) camera.y = worldHeight - canvas.height;
    }

    draw();
  }
  animationId = requestAnimationFrame(gameLoop);
}

// --- NUOVA GESTIONE VITTORIA (Niente più alert!) ---
function handleWin() {
  gameRunning = false; // Ferma il gioco

  let endTime = Date.now();
  let runTime = ((endTime - startTime) / 1000).toFixed(2);
  let runTimeFloat = parseFloat(runTime);

  // Recuperiamo il vecchio best time per QUESTO livello specifico
  let oldBest = levelBestTimes[currentLevel];
  let isNewRecord = false;

  // Se non c'è un vecchio tempo O se il nuovo è minore (migliore)
  if (!oldBest || runTimeFloat < parseFloat(oldBest)) {
    // Aggiorniamo l'oggetto in memoria
    levelBestTimes[currentLevel] = runTime;

    // Salviamo l'intero oggetto nel localStorage come stringa JSON
    localStorage.setItem("marmottaBestTimesMap", JSON.stringify(levelBestTimes));

    isNewRecord = true;
    oldBest = runTime; // Per visualizzarlo nel messaggio
  }

  // Prepara il messaggio
  let msg = `Livello ${currentLevel} Completato!\nTempo: ${runTime}s`;
  if (isNewRecord) msg += "\n(NUOVO RECORD!)";
  else msg += `\n(Best: ${oldBest}s)`;

  // Mostra l'overlay HTML
  const victoryScreen = document.getElementById('victory-screen');
  const victoryText = document.getElementById('victory-message');

  // Usiamo innerText o innerHTML per gestire i ritorni a capo (\n)
  if (victoryText) victoryText.innerText = msg;
  if (victoryScreen) victoryScreen.style.display = 'flex';
}

function handleDeath() {
  gameRunning = false; // Ferma il gioco
  const gameover = document.getElementById('gameover-screen');
  if (gameover) gameover.style.display = 'flex'; // Mostra la schermata rossa
}

// --- FUNZIONI BOTTONI VITTORIA ---
window.restartLevel = function () {
  // TRUCCO FONDAMENTALE:
  // Impostiamo gameRunning a false. In questo modo, quando chiamiamo startGame,
  // lui entrerà nell'IF e farà ripartire il gameLoop(0).
  gameRunning = false; 
  
  window.startGame(currentLevel);
};

window.backToMenu = function () {
  gameRunning = false;

  const victory = document.getElementById('victory-screen');
  const gameover = document.getElementById('gameover-screen'); // <--- NUOVO
  const canvasEl = document.getElementById('canvas1');
  const menu = document.getElementById('menu-screen');

  if (victory) victory.style.display = 'none';
  if (gameover) gameover.style.display = 'none'; // <--- NUOVO
  if (canvasEl) canvasEl.style.display = 'none';
  if (menu) menu.style.display = 'flex';
};

// --- DISEGNO ---
function draw() {
  // 1. SFONDO CIELO (Risolve il problema dello sfondo grigio)
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. MONDO DI GIOCO
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  platforms.forEach(p => p.draw(ctx));
  cartelli.forEach(c => c.draw(ctx));
  spines.forEach(s => s.draw(ctx));
  if (traguardo) traguardo.draw(ctx);
  if (player) player.draw(ctx);

  ctx.restore();

  // 3. HUD (Interfaccia)
  if (player) {
    let valoreCalcolato = Math.max(0, (worldHeight - (player.y + player.height)) / 10);
    let altezzaStringa = valoreCalcolato.toFixed(1);

    ctx.fillStyle = "black";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "right";

    ctx.fillText(`Altezza: ${altezzaStringa}m`, canvas.width - 20, 40);

    let currentTime = ((Date.now() - startTime) / 1000).toFixed(2);
    ctx.fillText(`Tempo: ${currentTime}s`, canvas.width - 20, 70);

    let currentLevelBest = levelBestTimes[currentLevel];
    if (currentLevelBest) {
      ctx.fillStyle = "#D35400";
      ctx.fillText(`Best Lv.${currentLevel}: ${currentLevelBest}s`, canvas.width - 20, 100);
    } else {
      // Opzionale: Se non c'è ancora un record
      ctx.fillStyle = "#888";
      ctx.fillText(`Best Lv.${currentLevel}: --`, canvas.width - 20, 100);
    }
  }
}