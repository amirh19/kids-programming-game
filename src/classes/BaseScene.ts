import Dino from "./Dino";
import { BLOCK_SIZE, DINO_H, DINO_W } from "../constants";

export default abstract class BaseScene extends Phaser.Scene {
  instructions: string[] = [];
  player: Dino;
  posX: number;
  posY: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  map: Phaser.Tilemaps.TilemapLayer;
  pathToMap: string;
  goal: Phaser.Tilemaps.TilemapLayer;
  hasWon: boolean;
  constructor(sceneName: string, mapURI: string) {
    super(sceneName);
    this.pathToMap = mapURI;
  }
  preload() {
    this.preloadPlayerAssets();
    this.preloadMapAssets();
    this.preloadControlAssets();
  }
  preloadPlayerAssets() {
    Dino.preloadAssets(this, "red");
  }
  preloadMapAssets() {
    if (!this.textures.exists("tiles")) {
      this.load.image("tiles", "assets/maps/forest_tiles.png");
    }
    this.load.tilemapTiledJSON(this.scene.key + "map", this.pathToMap);
  }
  preloadControlAssets() {
    if (!this.textures.exists("arrow_up")) {
      this.load.image("arrow_up", "assets/KeyboardButtonsDir_up.png");
    }
    if (!this.textures.exists("arrow_down")) {
      this.load.image("arrow_down", "assets/KeyboardButtonsDir_down.png");
    }
    if (!this.textures.exists("arrow_left")) {
      this.load.image("arrow_left", "assets/KeyboardButtonsDir_left.png");
    }
    if (!this.textures.exists("arrow_right")) {
      this.load.image("arrow_right", "assets/KeyboardButtonsDir_right.png");
    }
  }

  create() {
    this.initValues();
    this.createMapAndPlayer(3, 15);
    this.addCollition();
    this.createControls();
  }
  initValues() {
    this.hasWon = false;
    this.instructions = [];
    this.posX = 25;
    this.posY = 665;
  }

  createControls() {
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
    start.on(
      "pointerdown",
      function () {
        start.destroy();
        const count = this.instructions.length;
        this.time.addEvent({
          callback: () => {
            const step = this.instructions.shift();
            switch (step) {
              case "arrow_up":
                this.player.runUp();
                break;
              case "arrow_down":
                this.player.runDown();
                break;
              case "arrow_left":
                this.player.runLeft();
                break;
              case "arrow_right":
                this.player.runRight();
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

  addCollition() {
    this.physics.add.collider(this.player, this.map, () => {
      this.playerDies();
    });
    this.player.body.setCollideWorldBounds(true);
  }
  playerDies() {
    this.nextScene();
  }
  addNewArrow(type: string) {
    this.add.image(this.posX, this.posY, type);
    this.posX += 50;
    if (840 - this.posX < 50) {
      this.posX = 25;
      this.posY += 50;
    }
  }
  createMapAndPlayer(x: number, y: number) {
    const map = this.make.tilemap({
      key: this.scene.key + "map",
      tileWidth: BLOCK_SIZE,
      tileHeight: BLOCK_SIZE,
    });
    const tileset = map.addTilesetImage("forest_tiles", "tiles");
    map.createLayer("background", tileset);
    this.map = map.createLayer("world", tileset);
    map.createLayer("path", tileset);
    this.goal = map.createLayer("goal", tileset);
    this.map.setCollisionByProperty({ collide: true }, true);
    this.player = new Dino(
      this,
      BLOCK_SIZE * x + DINO_W / 2,
      BLOCK_SIZE * y + DINO_H / 2,
      "red"
    );
    this.physics.add.existing(this.player);
    this.player.body.setSize(5, 5, true);
  }
  playerWon() {
    this.add
      .text(320, 320, "Ganaste", {
        fontSize: "32",
      })
      .setScale(2);
  }
  update(time: number, delta: number): void {
    try {
      if (!this.hasWon) {
        const tile = this.goal.getTileAtWorldXY(this.player.x, this.player.y);
        if (tile) {
          this.hasWon = true;
          this.playerWon();
          this.nextScene();
        }
      }
    } catch (error) {}
  }
  nextScene() {
    this.scene.transition({ target: this.scene.key, duration: 0 });
  }
}
