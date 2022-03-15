import "phaser";
import * as Scenes from "./scenes";
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "app",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 740,
  },
  backgroundColor: "#232528",

  scene: [Scenes.Map_1, Scenes.Map_2, Scenes.Map_3, Scenes.Map_4, Scenes.Map_5],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
function resizeApp() {
  // Width-height-ratio of game resolution
  // Replace 360 with your game width, and replace 640 with your game height
  let game_ratio = 640 / 740;

  // Make div full height of browser and keep the ratio of game resolution
  let div = document.getElementById("app");
  div.style.width = window.innerHeight * game_ratio + "px";
  div.style.height = window.innerHeight + "px";

  // Check if device DPI messes up the width-height-ratio
  let canvas = document.getElementsByTagName("canvas")[0];

  let dpi_w = parseInt(div.style.width) / canvas.width;
  let dpi_h = parseInt(div.style.height) / canvas.height;

  let height = window.innerHeight * (dpi_w / dpi_h);
  let width = height * game_ratio;

  // Scale canvas
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
}

window.addEventListener("resize", resizeApp);
