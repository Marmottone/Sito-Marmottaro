import { checkCollision } from './utility.js';

export class Marmotta {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;

    // Hitbox
    this.hitboxWidth = 30; this.hitboxHeight = 57; this.hitboxOffsetX = 22;
    this.swimHitboxWidth = 65; this.swimHitboxHeight = 35; this.swimHitboxOffsetX = 30;

    // Delay cambio sprites
    this.waterPersistenceTimer = 0;
    this.waterDelayFrames = 13;

    this.onGrass = false;
    this.inWater = false;
    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.jumpStrength = -11.5;
    this.swimStrength = -5;
    this.grounded = false;
    this.facingLeft = false;

    // Sprites
    this.spriteRun = new Image(); this.spriteRun.src = "/images/SpriteMarmotta.png";
    this.spriteJump = new Image(); this.spriteJump.src = "/images/SpriteMarmottaSalto.png";
    this.spriteLand = new Image(); this.spriteLand.src = "/images/SpriteMarmottaAtterraggio.png";
    this.spriteSwim = new Image(); this.spriteSwim.src = "/images/SpriteMarmottaNuoto.png";
    this.currentSprite = this.spriteRun;

    this.apexY = y;
    this.isLanding = false;
    this.landingTimer = 0;
    this.airTimer = 0;
    this.frameX = 0;
    this.gameFrame = 0;
    this.staggerFrames = 5;
    this.maxFramesRun = 4;
    this.maxFramesSwim = 4;
  }

  update(keys, platforms, worldWidth, worldHeight, canvasHeight) {
    let wasOnGrass = this.onGrass;
    this.onGrass = false;

    // --- 1. CONTROLLO PREVENTIVO ACQUA ---
    let currentHb = this.getHitbox();
    let touchingWaterNow = false;
    let nearWaterSurface = false;

    for (let plat of platforms) {
      if (plat.type === "acqua" && checkCollision(currentHb, plat)) {
        touchingWaterNow = true;

        // Se la testa della marmotta (hb.y) è vicina all'inizio della piattaforma acqua (plat.y)
        // o se la marmotta è sommersa per meno di 20 pixel, considerala in "superficie"
        if (currentHb.y <= plat.y + 10) {
          nearWaterSurface = true;
        }
        break;
      }
    }
    this.inWater = touchingWaterNow;

    // Gestione del Delay (Isteresi) per evitare scatti dello sprite
    if (touchingWaterNow) {
      this.waterPersistenceTimer = this.waterDelayFrames;
      this.inWater = true;
    } else {
      if (this.waterPersistenceTimer > 0) {
        this.waterPersistenceTimer--;
        this.inWater = true; // Resta "visivamente" in acqua finché il timer non scade
      } else {
        this.inWater = false;
      }
    }

    // --- STATO TERRA/ARIA ---
    if (this.grounded) {
      this.apexY = this.y;
      this.airTimer = 0;
    } else {
      this.airTimer++;
    }

    if (this.isLanding) {
      this.landingTimer--;
      if (this.landingTimer <= 0) this.isLanding = false;
    }

    // --- 2. MOVIMENTO ORIZZONTALE ---
    let currentSpeed = this.inWater ? this.speed * 0.7 : this.speed;
    if (this.isLanding) {
      this.velX = 0;
    } else {
      if (keys["KeyA"] || keys["ArrowLeft"]) {
        this.velX = -currentSpeed;
        this.facingLeft = true;
      } else if (keys["KeyD"] || keys["ArrowRight"]) {
        this.velX = currentSpeed;
        this.facingLeft = false;
      } else {
        this.velX = 0;
      }
    }

    // --- 3. ANIMAZIONE ---
    let isMoving = this.velX !== 0 || (this.inWater && Math.abs(this.velY) > 0.8);
    if (isMoving && (this.currentSprite === this.spriteRun || this.currentSprite === this.spriteSwim)) {
        this.gameFrame++;
        let stagger = this.inWater ? this.staggerFrames * 4 : this.staggerFrames;
        if (this.gameFrame % stagger === 0) {
          this.frameX = (this.frameX + 1) % this.maxFramesRun;
        }
    } else {
      this.frameX = 0;
    }

    // --- 4. INPUT VERTICALE (SALTO / NUOTO) ---
    if (keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) {
      if (this.inWater) {
        // SE è in acqua ma vicina alla superficie, permetti un salto "terrestre" 
        // per uscire con slancio, altrimenti applica il nuoto normale.
        if (nearWaterSurface) {
          this.velY = this.jumpStrength * 5.5; // 90% del salto normale per bilanciare l'attrito
        } else {
          this.velY = this.swimStrength;
        }
        this.grounded = false;
      } else if (this.grounded && !this.isLanding) {
        this.velY = this.jumpStrength;
        this.grounded = false;
      }
    }

    // --- 5. FISICA E GRAVITÀ ---
    if (this.inWater) {
      let diving = keys["KeyS"] || keys["ArrowDown"];
      if (diving) {
        this.velY += 1.2;
        if (this.velY > 6) this.velY = 6;
      } else {
        // Applica gravità ridotta in acqua
        this.velY += 0.6;
        if (this.velY > 1.5) this.velY = 1.5;
      }
    } else {
      // Gravità normale fuori
      this.velY += 0.4;
    }

    // Applica movimento
    this.x += this.velX;
    this.y += this.velY;
    this.grounded = false;

    // --- 6. COLLISIONI SOLIDE ---
    for (let plat of platforms) {
      if (plat.type !== "acqua") {
        this.resolveCollision(plat);
      }
    }

    // Caduta dall'erba (correzione grafica)
    if (wasOnGrass && !this.onGrass && !this.grounded && !this.inWater) {
      this.y += 13;
    }

    // Limiti Mondo
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > worldWidth) this.x = worldWidth - this.width;
    if (this.y + this.height > worldHeight) {
      this.y = worldHeight - this.height;
      this.checkLanding(this.y);
      this.velY = 0;
      this.grounded = true;
    }

    // Selezione Sprite
    this.updateSprite();
  }

  updateSprite() {
    if (this.isLanding) this.currentSprite = this.spriteLand;
    else if (this.inWater) this.currentSprite = this.spriteSwim;
    else if (!this.grounded) {
      this.currentSprite = (this.velY < -1 || this.airTimer > 5) ? this.spriteJump : this.spriteRun;
    } else {
      this.currentSprite = this.spriteRun;
    }
  }

  // ... (mantieni i tuoi metodi checkLanding, resolveCollision, draw e getHitbox invariati) ...
  checkLanding(landingY) {
    if (this.inWater) return;
    let fallDistance = landingY - this.apexY;
    if (fallDistance > 190) {
      this.isLanding = true;
      this.landingTimer = 12;
    }
    this.apexY = this.y;
  }

  resolveCollision(plat) {
    let hb = this.getHitbox();
    if (checkCollision(hb, plat)) {
      if (!plat.isSolid) {
        if (this.velY > 0 && (hb.y + hb.height - this.velY) <= plat.y) {
          this.y = plat.y - this.height;
          this.checkLanding(this.y);
          this.velY = 0;
          this.grounded = true;
          this.onGrass = (plat.type === "erba");
        }
      } else {
        let overlapX = (hb.x + hb.width / 2) - (plat.x + plat.width / 2);
        let overlapY = (hb.y + hb.height / 2) - (plat.y + plat.height / 2);
        let combinedWidths = (hb.width + plat.width) / 2;
        let combinedHeights = (hb.height + plat.height) / 2;
        let widthDiff = combinedWidths - Math.abs(overlapX);
        let heightDiff = combinedHeights - Math.abs(overlapY);

        if (widthDiff < heightDiff) {
          let stepUpOffset = (plat.y - (hb.y + hb.height));
          if (stepUpOffset < 0 && stepUpOffset >= -8 && this.velY >= 0) {
            this.y = plat.y - this.height;
            this.checkLanding(this.y);
            this.velY = 0;
            this.grounded = true;
            this.onGrass = (plat.type === "erba");
          } else {
            if (overlapX > 0) this.x += widthDiff;
            else this.x -= widthDiff;
            this.velX = 0;
          }
        } else {
          if (overlapY > 0) {
            this.y += heightDiff;
            this.velY = 0;
          } else {
            this.y -= heightDiff;
            this.checkLanding(this.y);
            this.velY = 0;
            this.grounded = true;
            this.onGrass = (plat.type === "erba");
          }
        }
      }
    }
  }

  draw(ctx) {
    let currentOffset = this.onGrass ? 22 : 13;
    if (this.inWater) currentOffset = 0;

    let visualY = this.y + currentOffset;
    let drawWidth = this.width;
    let drawHeight = this.height;
    let srcX, srcY, srcW, srcH;

    if (!this.currentSprite.complete || this.currentSprite.naturalWidth === 0) return;

    if (this.currentSprite === this.spriteRun) {
      srcW = 170; srcH = 170;
      srcX = this.frameX * srcW; srcY = 0;
    } else if (this.currentSprite === this.spriteSwim) {
      srcW = this.currentSprite.naturalWidth;
      srcH = this.currentSprite.naturalHeight / 4;
      srcX = 0; srcY = this.frameX * srcH;
      drawWidth = 125; drawHeight = 60; visualY = this.y + 10;
    } else if (this.currentSprite === this.spriteLand) {
      srcW = this.currentSprite.naturalWidth; srcH = this.currentSprite.naturalHeight;
      srcX = 0; srcY = 0;
      drawHeight = 55; visualY += (this.height - drawHeight);
    } else {
      srcW = this.currentSprite.naturalWidth; srcH = this.currentSprite.naturalHeight;
      srcX = 0; srcY = 0;
    }

    ctx.save();
    if (this.facingLeft) {
      ctx.translate(this.x + drawWidth, visualY);
      ctx.scale(-1, 1);
      ctx.drawImage(this.currentSprite, srcX, srcY, srcW, srcH, 0, 0, drawWidth, drawHeight);
    } else {
      ctx.drawImage(this.currentSprite, srcX, srcY, srcW, srcH, this.x, visualY, drawWidth, drawHeight);
    }
    ctx.restore();
  }

  getHitbox() {
    let w, h;
    if (this.inWater) {
      w = this.swimHitboxWidth; h = this.swimHitboxHeight;
      let visualWidth = 125;
      let offsetY = ((this.height - h) / 2) + 5;
      let currentOffsetX = this.facingLeft ? (visualWidth - w - this.swimHitboxOffsetX) : this.swimHitboxOffsetX;
      return { x: this.x + currentOffsetX, y: this.y + offsetY, width: w, height: h };
    } else {
      w = this.hitboxWidth; h = this.hitboxHeight;
      let currentOffsetX = this.facingLeft ? (this.width - w - this.hitboxOffsetX) : this.hitboxOffsetX;
      return { x: this.x + currentOffsetX, y: (this.y + this.height) - h, width: w, height: h };
    }
  }
}