import { Marmotta } from './marmotta.js';
import { Piattaforma } from './piattaforma.js';
import { Traguardo } from './traguardo.js';
import { Cartello } from './cartello.js';
import { Spina } from './spine.js';

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

const worldWidth = 5000;
const worldHeight = 5000;

let gameRunning = false;
let animationId;
let lastTime = 0;
const fps = 60;
const interval = 1000 / fps;

const keys = {};
let camera = { x: 0, y: 0 };
let player, platforms = [], cartelli = [], spines = [], traguardo, startTime = 0;
let levelBestTimes = JSON.parse(localStorage.getItem("marmottaBestTimesMap") || "{}");
let currentLevel = 1;

window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

window.startGame = function (level) {
  currentLevel = level;
  gameRunning = false;
  if (animationId) cancelAnimationFrame(animationId);

  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('victory-screen').style.display = 'none';
  document.getElementById('gameover-screen').style.display = 'none';
  canvas.style.display = 'block';

  initGame(level);
  gameRunning = true;
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

function initGame(level) {
  startTime = Date.now();
  platforms = []; cartelli = []; spines = [];

  if (level === 1) {
    player = new Marmotta(50, worldHeight - 70);

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
  } else if (level === 2) {
    //player = new Marmotta(100, worldHeight - 4900);
    player = new Marmotta(1170, worldHeight - 2600);

    platforms = [
      // --- Acqua ---
      new Piattaforma(0, worldHeight - 4700, 5000, 4700, "acqua", false),

      // --- Terra ed Erba ---
      new Piattaforma(0, worldHeight - 4795, 500, 20, "erba", true),
      new Piattaforma(0, worldHeight - 4775, 500, 20, "terra", true),
      new Piattaforma(500, worldHeight - 4800, 350, 20, "erba", true),
      new Piattaforma(500, worldHeight - 4780, 350, 20, "terra", true),

      // --- Legno ---
      new Piattaforma(1049, worldHeight - 3022, 278, 20, "legno", false),

      // --- Roccia ---
      new Piattaforma(1220, worldHeight - 5000, 150, 140, "roccia", true),
      new Piattaforma(1370, worldHeight - 5000, 150, 285, "roccia", true),
      new Piattaforma(1520, worldHeight - 5000, 3480, 340, "roccia", true),
      new Piattaforma(0, worldHeight - 4750, 500, 250, "roccia", true),
      new Piattaforma(500, worldHeight - 4755, 390, 250, "roccia", true),
      new Piattaforma(570, worldHeight - 4505, 390, 250, "roccia", true),
      new Piattaforma(960, worldHeight - 4409, 110, 250, "roccia", true),
      new Piattaforma(1070, worldHeight - 4340, 390, 250, "roccia", true),
      new Piattaforma(1460, worldHeight - 4280, 390, 250, "roccia", true),
      new Piattaforma(1850, worldHeight - 4520, 150, 490, "roccia", true),
      new Piattaforma(2000, worldHeight - 4081, 390, 80, "roccia", true),
      new Piattaforma(2200, worldHeight - 4660, 150, 390, "roccia", true),
      new Piattaforma(2390, worldHeight - 4135, 330, 105, "roccia", true),
      new Piattaforma(2615, worldHeight - 4265, 260, 135, "roccia", true),
      new Piattaforma(2730, worldHeight - 4370, 280, 105, "roccia", true),
      new Piattaforma(2835, worldHeight - 4470, 1620, 105, "roccia", true),
      new Piattaforma(4255, worldHeight - 4365, 280, 105, "roccia", true),
      new Piattaforma(4370, worldHeight - 4260, 220, 480, "roccia", true),
      new Piattaforma(4885, worldHeight - 4660, 115, 1020, "roccia", true),
      new Piattaforma(4700, worldHeight - 3640, 300, 190, "roccia", true),
      new Piattaforma(4485, worldHeight - 3590, 215, 135, "roccia", true),
      new Piattaforma(4270, worldHeight - 3520, 215, 125, "roccia", true),
      new Piattaforma(2930, worldHeight - 3435, 1340, 105, "roccia", true),
      new Piattaforma(2670, worldHeight - 3560, 260, 170, "roccia", true),
      new Piattaforma(2410, worldHeight - 3670, 260, 170, "roccia", true),
      new Piattaforma(1770, worldHeight - 3725, 640, 120, "roccia", true),
      new Piattaforma(2670, worldHeight - 3560, 260, 170, "roccia", true),
      new Piattaforma(1275, worldHeight - 3780, 495, 398, "roccia", true),
      new Piattaforma(985, worldHeight - 3840, 290, 350, "roccia", true),
      new Piattaforma(780, worldHeight - 3905, 210, 400, "roccia", true),
      new Piattaforma(630, worldHeight - 3875, 250, 500, "roccia", true),
      new Piattaforma(2670, worldHeight - 3560, 260, 170, "roccia", true),
      new Piattaforma(851, worldHeight - 3516, 665, 135, "roccia", true),
      new Piattaforma(480, worldHeight - 3465, 350, 490, "roccia", true),
      new Piattaforma(395, worldHeight - 2980, 600, 335, "roccia", true),
      new Piattaforma(539, worldHeight - 2724, 480, 140, "roccia", true),
      new Piattaforma(917, worldHeight - 3054, 150, 335, "roccia", true),
      new Piattaforma(1413, worldHeight - 3390, 150, 340, "roccia", true),
      new Piattaforma(1310, worldHeight - 3054, 150, 335, "roccia", true),
      new Piattaforma(0, worldHeight - 4500, 50, 1975, "roccia", true),
      new Piattaforma(0, worldHeight - 2525, 150, 300, "roccia", true),
      new Piattaforma(150, worldHeight - 2360, 260, 150, "roccia", true),
      new Piattaforma(410, worldHeight - 2324, 740, 135, "roccia", true),
      new Piattaforma(1147, worldHeight - 2344, 615, 135, "roccia", true),
      new Piattaforma(1349, worldHeight - 2720, 665, 135, "roccia", true),
      new Piattaforma(1761, worldHeight - 2364, 1215, 135, "roccia", true),
      new Piattaforma(2010, worldHeight - 2680, 960, 135, "roccia", true),
      new Piattaforma(185, worldHeight - 4210, 50, 270, "roccia", true),
      new Piattaforma(135, worldHeight - 3580, 50, 270, "roccia", true),
      new Piattaforma(270, worldHeight - 3045, 50, 270, "roccia", true),
      new Piattaforma(435, worldHeight - 3905, 50, 270, "roccia", true),
      new Piattaforma(2735, worldHeight - 2810, 480, 135, "roccia", true),
      new Piattaforma(2976, worldHeight - 2318, 480, 135, "roccia", true),
      new Piattaforma(3215, worldHeight - 2890, 480, 135, "roccia", true),
      new Piattaforma(3455, worldHeight - 2280, 480, 135, "roccia", true),
      new Piattaforma(3930, worldHeight - 2235, 550, 135, "roccia", true),
      new Piattaforma(3695, worldHeight - 2935, 935, 135, "roccia", true),
      new Piattaforma(4145, worldHeight - 2585, 340, 115, "roccia", true),
      new Piattaforma(4630, worldHeight - 2880, 370, 140, "roccia", true),
      new Piattaforma(4910, worldHeight - 2740, 90, 1275, "roccia", true),
      new Piattaforma(4480, worldHeight - 2175, 90, 335, "roccia", true),
      new Piattaforma(4525, worldHeight - 1840, 90, 710, "roccia", true),
      new Piattaforma(4850, worldHeight - 1465, 150, 720, "roccia", true),
      new Piattaforma(4520, worldHeight - 750, 480, 750, "roccia", true),
      new Piattaforma(4045, worldHeight - 685, 480, 685, "roccia", true),
      new Piattaforma(4050, worldHeight - 1200, 480, 135, "roccia", true),
      new Piattaforma(3795, worldHeight - 627, 255, 627, "roccia", true),
      new Piattaforma(3820, worldHeight - 1255, 240, 135, "roccia", true),
      new Piattaforma(3620, worldHeight - 1515, 205, 305, "roccia", true),
      new Piattaforma(3620, worldHeight - 525, 175, 525, "roccia", true),
      new Piattaforma(3270, worldHeight - 320, 350, 320, "roccia", true),
      new Piattaforma(2925, worldHeight - 255, 345, 255, "roccia", true),
      new Piattaforma(950, worldHeight - 190, 1985, 190, "roccia", true),
      new Piattaforma(620, worldHeight - 280, 335, 280, "roccia", true),
      new Piattaforma(370, worldHeight - 525, 250, 525, "roccia", true),
      new Piattaforma(0, worldHeight - 755, 370, 755, "roccia", true),
      new Piattaforma(3280, worldHeight - 1650, 345, 190, "roccia", true),
      new Piattaforma(2940, worldHeight - 1719, 345, 190, "roccia", true),
      new Piattaforma(990, worldHeight - 1810, 1950, 195, "roccia", true),
      new Piattaforma(650, worldHeight - 1760, 345, 190, "roccia", true),
      new Piattaforma(390, worldHeight - 1650, 260, 300, "roccia", true),
      new Piattaforma(0, worldHeight - 1505, 400, 300, "roccia", true),
      new Piattaforma(1660, worldHeight - 1615, 175, 305, "roccia", true),
      new Piattaforma(2090, worldHeight - 495, 175, 305, "roccia", true),
      new Piattaforma(1125, worldHeight - 400, 270, 215, "roccia", true),
      new Piattaforma(1130, worldHeight - 1615, 270, 800, "roccia", true),
      new Piattaforma(3300, worldHeight - 1180, 80, 305, "roccia", true),
      new Piattaforma(2910, worldHeight - 755, 80, 305, "roccia", true),
      new Piattaforma(2440, worldHeight - 1410, 80, 305, "roccia", true),
      new Piattaforma(1865, worldHeight - 905, 80, 305, "roccia", true),
      new Piattaforma(710, worldHeight - 1040, 80, 305, "roccia", true),
      new Piattaforma(800, worldHeight - 3385, 150, 410, "roccia", true),
    ];

    traguardo = new Traguardo(130, worldHeight - 980);
  }
}

function gameLoop(timestamp) {
  if (!gameRunning) return;
  const deltaTime = timestamp - lastTime;

  if (deltaTime > interval) {
    lastTime = timestamp - (deltaTime % interval);

    if (player) {
      player.update(keys, platforms, worldWidth, worldHeight);
      spines.forEach(s => { if (s.collidesWith(player)) handleDeath(); });
    }

    if (traguardo && player && traguardo.update(player)) handleWin();

    if (player) {
      camera.x = Math.max(0, Math.min(player.x - canvas.width / 2, worldWidth - canvas.width));
      camera.y = Math.max(0, Math.min(player.y - canvas.height / 2, worldHeight - canvas.height));
    }
    draw();
  }
  animationId = requestAnimationFrame(gameLoop);
}

function draw() {
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  platforms.forEach(p => p.draw(ctx));
  cartelli.forEach(c => c.draw(ctx));
  spines.forEach(s => s.draw(ctx));
  if (traguardo) traguardo.draw(ctx);
  if (player) player.draw(ctx);
  ctx.restore();
  drawHUD();
}

function drawHUD() {
  if (!player) return;
  ctx.fillStyle = "black";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "right";
  let altezza = ((worldHeight - (player.y + player.height)) / 10).toFixed(1);
  ctx.fillText(`Altezza: ${altezza}m`, canvas.width - 20, 40);
  let tempo = ((Date.now() - startTime) / 1000).toFixed(2);
  ctx.fillText(`Tempo: ${tempo}s`, canvas.width - 20, 70);
}

function handleWin() {
  gameRunning = false;
  let runTime = ((Date.now() - startTime) / 1000).toFixed(2);
  levelBestTimes[currentLevel] = Math.min(parseFloat(runTime), parseFloat(levelBestTimes[currentLevel] || 999));
  localStorage.setItem("marmottaBestTimesMap", JSON.stringify(levelBestTimes));
  document.getElementById('victory-message').innerText = `Tempo: ${runTime}s`;
  document.getElementById('victory-screen').style.display = 'flex';
}

function handleDeath() {
  gameRunning = false;
  document.getElementById('gameover-screen').style.display = 'flex';
}

window.restartLevel = () => window.startGame(currentLevel);
window.backToMenu = () => {
  gameRunning = false;
  document.getElementById('victory-screen').style.display = 'none';
  document.getElementById('gameover-screen').style.display = 'none';
  canvas.style.display = 'none';
  document.getElementById('menu-screen').style.display = 'flex';
};