import BaseScene from "../classes/BaseScene";

export default class Map_3 extends BaseScene {
  constructor() {
    super("Map_3", "assets/maps/map_3.json");
  }
  create() {
    this.initValues();
    this.createMapAndPlayer(12, 13);
    this.addCollition();
    this.createControls();
  }
  nextScene(): void {
    this.scene.transition({ target: "Map_4", duration: 0 });
  }
}
