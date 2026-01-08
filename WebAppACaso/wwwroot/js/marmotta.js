import { checkCollision } from './utility.js';

export class Marmotta {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // --- PARAMETRI FISICI ---
    this.width = 70;
    this.height = 70;
    this.hitboxWidth = 30;
    this.hitboxHeight = 57;
    this.hitboxOffsetX = 22;

    this.onGrass = false;
    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.jumpStrength = -11.5;
    this.grounded = false;
    this.facingLeft = false;

    // --- SPRITES ---
    this.spriteRun = new Image();
    this.spriteRun.src = "/images/SpriteMarmotta.png";

    this.spriteJump = new Image();
    this.spriteJump.src = "/images/SpriteMarmottaSalto.png";

    this.spriteLand = new Image();
    this.spriteLand.src = "/images/SpriteMarmottaAtterraggio.png";

    this.currentSprite = this.spriteRun;

    // --- VARIABILI DI STATO ---
    this.apexY = y;
    this.isLanding = false;
    this.landingTimer = 0;
    this.airTimer = 0;

    // --- ANIMAZIONE ---
    this.frameX = 0;
    this.gameFrame = 0;
    this.staggerFrames = 5;
    this.maxFramesRun = 4;
  }

  update(keys, platforms, worldWidth, worldHeight, canvasHeight) {
    let wasOnGrass = this.onGrass;
    this.onGrass = false;

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

    // MOVIMENTO
    if (this.isLanding) {
      this.velX = 0;
    } else {
      if (keys["KeyA"] || keys["ArrowLeft"]) {
        this.velX = -this.speed;
        this.facingLeft = true;
      } else if (keys["KeyD"] || keys["ArrowRight"]) {
        this.velX = this.speed;
        this.facingLeft = false;
      } else {
        this.velX = 0;
      }
    }

    // ANIMAZIONE
    if (this.currentSprite === this.spriteRun) {
      if (this.velX !== 0) {
        this.gameFrame++;
        if (this.gameFrame % this.staggerFrames === 0) {
          if (this.frameX < this.maxFramesRun - 1) {
            this.frameX++;
          } else {
            this.frameX = 0;
          }
        }
      } else {
        this.frameX = 0;
      }
    } else {
      this.frameX = 0;
    }

    // FISICA
    if ((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) && this.grounded && !this.isLanding) {
      this.velY = this.jumpStrength;
      this.grounded = false;
    }

    if (!this.grounded) {
      if (this.y < this.apexY) this.apexY = this.y;
    }

    this.velY += 0.4;
    this.x += this.velX;
    this.y += this.velY;
    this.grounded = false;

    for (let plat of platforms) {
      this.resolveCollision(plat);
    }

    // Aggiornato a 13px per coerenza con l'offset base
    if (wasOnGrass && !this.onGrass && !this.grounded) {
      this.y += 13;
    }

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > worldWidth) this.x = worldWidth - this.width;

    if (this.y + this.height > worldHeight) {
      this.y = worldHeight - this.height;
      this.checkLanding(this.y);
      this.velY = 0;
      this.grounded = true;
    }

    // SELEZIONE SPRITE
    if (this.isLanding) {
      this.currentSprite = this.spriteLand;
    } else if (!this.grounded) {
      if (this.velY < -1 || this.airTimer > 5) {
        this.currentSprite = this.spriteJump;
      } else {
        this.currentSprite = this.spriteRun;
      }
    } else {
      this.currentSprite = this.spriteRun;
    }
  }

  checkLanding(landingY) {
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
    // --- MODIFICA QUI ---
    // Se è su erba, usiamo il tuo offset perfetto (22).
    // Se NON è su erba (roccia/legno), usiamo 13 per spingerlo giù quanto basta a toccare terra.
    let currentOffset = this.onGrass ? 22 : 13;

    let visualY = this.y + currentOffset;

    let drawWidth = this.width;
    let drawHeight = this.height;

    let srcX, srcY, srcW, srcH;

    if (!this.currentSprite.complete || this.currentSprite.naturalWidth === 0) return;

    if (this.currentSprite === this.spriteRun) {
      srcW = 170;
      srcH = 170;
      srcX = this.frameX * srcW;
      srcY = 0;
    }
    else if (this.currentSprite === this.spriteLand) {
      srcW = this.currentSprite.naturalWidth;
      srcH = this.currentSprite.naturalHeight;
      srcX = 0;
      srcY = 0;
      drawHeight = 55;
      visualY += (this.height - drawHeight);
    }
    else {
      srcW = this.currentSprite.naturalWidth;
      srcH = this.currentSprite.naturalHeight;
      srcX = 0;
      srcY = 0;
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

    // DEBUG HITBOX
    //let hb = this.getHitbox();
    //ctx.strokeStyle = "red";
    //ctx.lineWidth = 1;
    //ctx.strokeRect(hb.x, hb.y, hb.width, hb.height);
  }

  getHitbox() {
    let currentOffsetX;

    if (this.facingLeft) {
      currentOffsetX = this.width - this.hitboxWidth - this.hitboxOffsetX;
    } else {
      currentOffsetX = this.hitboxOffsetX;
    }

    return {
      x: this.x + currentOffsetX,
      y: (this.y + this.height) - this.hitboxHeight,
      width: this.hitboxWidth,
      height: this.hitboxHeight
    };
  }
}