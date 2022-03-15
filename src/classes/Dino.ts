import { DINO_H, DINO_W } from "../constants";

export default class Dino extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  dieEffect: Phaser.Sound.BaseSound;
  static preloadAssets(
    scene: Phaser.Scene,
    color: "red" | "yellow" | "green" | "blue"
  ) {
    if (!scene.textures.exists(`Dino-${color}`)) {
      scene.load.spritesheet(
        `Dino-${color}`,
        `assets/sprites/Dino-${color}.png`,
        {
          frameWidth: 24,
          frameHeight: 24,
        }
      );
    }
    if (!scene.cache.audio.exists("die-effect")) {
      scene.load.audio("die-effect", "assets/music/vgdeathsound.ogg");
    }
  }
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: "red" | "yellow" | "green" | "blue"
  ) {
    super(scene, x, y, "");
    this.setTexture(`Dino-${color}`);
    if (!scene.anims.exists(`${this.texture.key}-idle`)) {
      scene.anims.create({
        key: `${this.texture.key}-idle`,
        frames: scene.anims.generateFrameNumbers(this.texture.key, {
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!scene.anims.exists(`${this.texture.key}-run`)) {
      scene.anims.create({
        key: `${this.texture.key}-run`,
        frames: scene.anims.generateFrameNumbers(this.texture.key, {
          start: 4,
          end: 9,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!scene.anims.exists(`${this.texture.key}-die`)) {
      scene.anims.create({
        key: `${this.texture.key}-die`,
        frames: scene.anims.generateFrameNumbers(this.texture.key, {
          start: 11,
          end: 14,
        }),
        frameRate: 8,
        repeat: 1,
      });
    }
    scene.add.existing(this);
    this.setScale(1.5);
    if (!scene.sound.get("die-effect")) {
      scene.sound.add("die-effect", {
        loop: false,
        volume: 1,
      });
    }
    return this;
  }
  playIdle(): void {
    this.play(`${this.texture.key}-idle`, true);
    this.body.setVelocity(0);
  }
  runUp() {
    this.body.setVelocityY(-32);
    this.body.setVelocityX(0);
    this.play(`${this.texture.key}-run`, true);
    if (this.flipX) {
      this.setRotation(1.5708);
    } else {
      this.setRotation(-1.5708);
    }
  }
  runRight() {
    this.setFlipX(false);
    this.setRotation(0);
    this.body.setVelocityX(32);
    this.body.setVelocityY(0);
    this.play(`${this.texture.key}-run`, true);
  }
  runLeft() {
    this.body.setVelocityY(0);
    this.body.setVelocityX(-32);
    this.setRotation(0);
    this.play(`${this.texture.key}-run`, true);
    this.setFlipX(true);
  }
  runDown() {
    this.body.setVelocityX(0);
    this.body.setVelocityY(32);
    this.play(`${this.texture.key}-run`, true);
    if (this.flipX) {
      this.setRotation(-1.5708);
    } else {
      this.setRotation(1.5708);
    }
  }
  died() {
    this.body.setVelocity(0);
    this.play(`${this.texture.key}-die`, true);
    this.scene.sound.get("die-effect").play();
  }
}
