import BaseScene from "../classes/BaseScene";

export default class Map_5 extends BaseScene {
  constructor() {
    super("Map_5", "assets/maps/map_5.json");
  }
  create() {
    this.initValues();
    this.createMapAndPlayer(12, 14);
    this.addCollition();
    this.createControls();
  }
  nextScene(): void {
    this.scene.transition({ target: "Map_1", duration: 0 });
  }
}
