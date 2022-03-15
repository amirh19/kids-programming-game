import Dino from "./Dino";
import {
  BLOCK_SIZE,
  DINO_H,
  DINO_W,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../constants";

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
  currentTextBox: Phaser.GameObjects.Text;
  constructor(sceneName: string, mapURI: string) {
    super(sceneName);
    this.pathToMap = mapURI;
  }

  preloadMuisc() {
    if (!this.cache.audio.exists("forest-theme")) {
      this.load.audio("forest-theme", "assets/music/forest.mp3");
    }
  }

  preload() {
    this.preloadPlayerAssets();
    this.preloadMapAssets();
    this.preloadControlAssets();
    this.preloadMuisc();
  }
  addMusic() {
    const themeWasLoaded = this.sound.get("forest-theme");
    if (!themeWasLoaded) {
      const theme = this.sound.add("forest-theme", { volume: 1, loop: true });
      if (!theme.isPlaying) {
        theme.play();
      }
    }
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
    if (!this.textures.exists("start")) {
      this.load.image("start", "assets/start.png");
    }
    if (!this.textures.exists("fullscreen")) {
      this.load.image("fullscreen", "assets/fullscreen.png");
    }
    if (!this.textures.exists("restart")) {
      this.load.image("restart", "assets/restart.png");
    }
  }

  create() {
    this.initValues();
    this.createMapAndPlayer(3, 15);
    this.addCollition();
    this.createControls();
    this.addMusic();
  }
  initValues() {
    this.currentTextBox = undefined;
    this.hasWon = false;
    this.instructions = [];
    this.posX = 25;
    this.posY = 665;
  }

  createControls() {
    // draw controls
    const arrow_up = this.add
      .image(GAME_WIDTH - 75, GAME_HEIGHT - 200, "arrow_up")
      .setAlpha(0.5)
      .setInteractive();
    const arrow_down = this.add
      .image(GAME_WIDTH - 75, GAME_HEIGHT - 150, "arrow_down")
      .setAlpha(0.5)
      .setInteractive();
    const arrow_left = this.add
      .image(GAME_WIDTH - 125, GAME_HEIGHT - 150, "arrow_left")
      .setAlpha(0.5)
      .setInteractive();
    const arrow_right = this.add
      .image(GAME_WIDTH - 25, GAME_HEIGHT - 150, "arrow_right")
      .setAlpha(0.5)
      .setInteractive();
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
    const start = this.add
      .image(GAME_WIDTH / 2 - 125, GAME_HEIGHT - 36, "start")
      .setDisplaySize(125, 50)
      .setInteractive();
    start.on("pointerdown", () => {
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
            case undefined:
              this.playerDies();
          }
        },
        callbackScope: this,
        delay: 1000,
        repeat: count,
      });
    });
    const resetLevel = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT - 36, "restart")
      .setDisplaySize(125, 50)
      .setInteractive();
    resetLevel.on("pointerdown", () => this.scene.restart());
    const fullScreen = this.add
      .image(GAME_WIDTH / 2 + 125, GAME_HEIGHT - 36, "fullscreen")
      .setDisplaySize(125, 50)
      .setInteractive();
    fullScreen.on("pointerdown", () => {
      if (this.scale.isFullscreen) {
        return this.scale.stopFullscreen();
      }
      return this.scale.startFullscreen();
    });
  }

  addCollition() {
    this.physics.add.collider(this.player, this.map, () => {
      this.playerDies();
    });
    this.player.body.setCollideWorldBounds(true);
  }
  playerDies() {
    this.player.died();
    this.time.addEvent({
      callback: () => {
        this.scene.restart();
      },
      callbackScope: this,
      repeat: 0,
      delay: 1000,
    });
  }
  addNewArrow(type: string) {
    if (this.instructions[this.instructions.length - 2] === type) {
      this.currentTextBox.setText(
        (Number.parseInt(this.currentTextBox.text) + 1).toString()
      );
    } else {
      this.add.image(this.posX, this.posY, type);
      this.currentTextBox = this.add.text(this.posX + 35, this.posY - 25, "1", {
        fontSize: "50px",
      });
      this.posX += 125;
      if (GAME_WIDTH - this.posX < 55) {
        this.posX = 25;
        this.posY += 55;
      }
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
    this.hasWon = true;
    this.scene.stop();
    this.nextScene();
  }
  update(time: number, delta: number): void {
    if (!this.hasWon) {
      const tile = this.goal.getTileAtWorldXY(this.player.x, this.player.y);
      if (tile) {
        this.playerWon();
      }
    }
  }
  nextScene() {
    this.scene.transition({ target: this.scene.key, duration: 0 });
  }
}
