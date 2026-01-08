import { Marmotta } from './marmotta.js';
import { Piattaforma } from './piattaforma.js';
import { Traguardo } from './traguardo.js';
import { Cartello } from './cartello.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const worldWidth = 5000;
const worldHeight = 5000;
const keys = {};
let camera = { x: 0, y: 0 };

// --- TIMER E SCORE ---
let startTime = 0;
let bestTime = localStorage.getItem("marmottaBestTime");

// --- LIMITATORE FPS ---
let lastTime = 0;
const fps = 60;
const interval = 1000 / fps;

const player = new Marmotta(50, worldHeight - 70);

let platforms = [
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


let cartelli = [
  new Cartello(200, worldHeight - 8, "Usa le frecce o WASD per muoverti"),
  new Cartello(650, worldHeight - 8, "Il tuo obbiettivo è raggiungere la nocciola"),
  new Cartello(1050, worldHeight - 13, "Premi SPAZIO o W per saltare"),
  new Cartello(1725, worldHeight - 43, "Puoi passare attraverso il legno")
];

const traguardo = new Traguardo(4855, worldHeight - 4900);

window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

function start() {
  startTime = Date.now();
  requestAnimationFrame(gameLoop);
}

// Avvio corretto controllando spriteRun
if (player.spriteRun.complete) {
  start();
} else {
  player.spriteRun.onload = start;
}

// --- CICLO DI GIOCO ---
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;

  if (deltaTime > interval) {
    lastTime = timestamp - (deltaTime % interval);

    // [CORREZIONE 1] Passiamo worldHeight come limite del pavimento
    player.update(keys, platforms, worldWidth, worldHeight, worldHeight);

    if (traguardo.update(player)) {
      handleWin();
      return;
    }

    // --- AGGIORNAMENTO TELECAMERA ---
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    // [CORREZIONE 2] Logica di blocco telecamera (Clamping) corretta per Y positiva
    // Orizzontale
    if (camera.x < 0) camera.x = 0;
    if (camera.x > worldWidth - canvas.width) camera.x = worldWidth - canvas.width;

    // Verticale (0 è il cielo, worldHeight è il fondo)
    if (camera.y < 0) camera.y = 0; // Non andare sopra il cielo
    if (camera.y > worldHeight - canvas.height) camera.y = worldHeight - canvas.height; // Non andare sotto terra

    draw();
  }
  requestAnimationFrame(gameLoop);
}

function handleWin() {
  let endTime = Date.now();
  let runTime = ((endTime - startTime) / 1000).toFixed(2);
  let message = `LIVELLO COMPLETATO!\nHai impiegato: ${runTime} secondi.`;

  if (!bestTime || parseFloat(runTime) < parseFloat(bestTime)) {
    bestTime = runTime;
    localStorage.setItem("marmottaBestTime", bestTime);
    message += "\n\n🏆 NUOVO RECORD! 🏆";
  } else {
    message += `\nIl tuo record è: ${bestTime} secondi.`;
  }

  alert(message);
  document.location.reload();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- DISEGNO MONDO ---
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  platforms.forEach(p => p.draw(ctx));
  cartelli.forEach(c => c.draw(ctx));
  traguardo.draw(ctx);
  player.draw(ctx);

  ctx.restore();

  // --- HUD ---
  // [CORREZIONE 3] Calcolo altezza basato su worldHeight
  let valoreCalcolato = Math.max(0, (worldHeight - (player.y + player.height)) / 10);
  let altezzaStringa = valoreCalcolato.toFixed(1);

  ctx.fillStyle = "black";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "right";

  ctx.fillText(`Altezza: ${altezzaStringa}m`, canvas.width - 20, 40);

  let currentTime = ((Date.now() - startTime) / 1000).toFixed(2);
  ctx.fillText(`Tempo: ${currentTime}s`, canvas.width - 20, 70);

  if (bestTime) {
    ctx.fillStyle = "#D35400";
    ctx.fillText(`Best: ${bestTime}s`, canvas.width - 20, 100);
  }
}