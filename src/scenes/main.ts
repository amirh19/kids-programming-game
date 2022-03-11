import Dino from "../classes/Dino";
import { BLOCK_SIZE, DINO_H, DINO_W } from "../constants";

export default class Main extends Phaser.Scene {
  dino: Dino;
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
    const arrow_up = this.add.image(700, 100, "arrow_up");
    const arrow_down = this.add.image(700, 150, "arrow_down");
    const arrow_left = this.add.image(650, 150, "arrow_left");
    const arrow_right = this.add.image(750, 150, "arrow_right");
  }
  update(time: number, delta: number): void {
    /* if (this.cursors.left.isDown) {
      this.dino.runLeft();
    } else if (this.cursors.right.isDown) {
      this.dino.runRight();
    } else if (this.cursors.down.isDown) {
      this.dino.runDown();
    } else if (this.cursors.up.isDown) {
      this.dino.up();
    } else {
      this.dino.playIdle();
    } */
  }
}
