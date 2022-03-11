import Dino from "../classes/Dino";
import { BLOCK_SIZE, DINO_H, DINO_W } from "../constants";

export default class Main extends Phaser.Scene {
  instructions: string[] = [];
  dino: Dino;
  posX: number = 25;
  posY: number = 665;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super("Main");
  }
  preload() {
    Dino.preloadAssets(this, "green");
    Dino.preloadAssets(this, "red");
    this.load.image("tiles", "assets/maps/forest_tiles.png");
    this.load.tilemapTiledJSON("forest", "assets/maps/map.json");
    this.load.image("arrow_up", "assets/KeyboardButtonsDir_up.png");
    this.load.image("arrow_down", "assets/KeyboardButtonsDir_down.png");
    this.load.image("arrow_left", "assets/KeyboardButtonsDir_left.png");
    this.load.image("arrow_right", "assets/KeyboardButtonsDir_right.png");
  }

  create() {
    const map = this.make.tilemap({
      key: "forest",
      tileWidth: BLOCK_SIZE,
      tileHeight: BLOCK_SIZE,
    });
    const tileset = map.addTilesetImage("forest_tiles", "tiles");
    const background = map.createLayer("background", tileset);
    const world = map.createLayer("world", tileset);
    const path = map.createLayer("path", tileset);
    const goal = map.createLayer("goal", tileset);
    world.setCollisionByProperty({ collide: true }, true);
    this.dino = new Dino(
      this,
      BLOCK_SIZE * 3 + DINO_W / 2,
      BLOCK_SIZE * 15 + DINO_H / 2,
      "red"
    );
    this.physics.add.existing(this.dino);
    this.physics.add.collider(this.dino, world);
    this.dino.body.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    // draw controls
    const arrow_up = this.add.image(640 + 75, 100, "arrow_up");
    const arrow_down = this.add.image(640 + 75, 150, "arrow_down");
    const arrow_left = this.add.image(640 + 25, 150, "arrow_left");
    const arrow_right = this.add.image(640 + 125, 150, "arrow_right");
    arrow_up.setInteractive();
    arrow_down.setInteractive();
    arrow_left.setInteractive();
    arrow_right.setInteractive();
    arrow_up.on("pointerdown", () => {
      this.instructions.push("arrow_up");
      this.addNewArrow("arrow_up");
    });
    arrow_down.on("pointerdown", () => {
      this.instructions.push("arrow_down");
      this.addNewArrow("arrow_down");
    });
    arrow_left.on("pointerdown", () => {
      this.instructions.push("arrow_left");
      this.addNewArrow("arrow_left");
    });
    arrow_right.on("pointerdown", () => {
      this.instructions.push("arrow_right");
      this.addNewArrow("arrow_right");
    });
    const start = this.add.text(640 + 20, 300, "start");
    start.setInteractive();
    start.setText("Iniciar");
    start.setScale(2);
    start.on(
      "pointerdown",
      function () {
        const count = this.instructions.length;
        this.time.addEvent({
          callback: () => {
            const step = this.instructions.shift();
            switch (step) {
              case "arrow_up":
                this.dino.runUp();
                break;
              case "arrow_down":
                this.dino.runDown();
                break;
              case "arrow_left":
                this.dino.runLeft();
                break;
              case "arrow_right":
                this.dino.runRight();
                break;
              case undefined:
                this.scene.restart();
                break;
            }
          },
          callbackScope: this,
          delay: 1000,
          repeat: count,
        });
      }.bind(this)
    );
  }
  update(time: number, delta: number): void {}
  addNewArrow(type: string) {
    this.add.image(this.posX, this.posY, type);
    this.posX += 50;
    if (this.posX > 840) {
      this.posX = 25;
      this.posY += 50;
    }
  }
}
