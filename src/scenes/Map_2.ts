import BaseScene from "../classes/BaseScene";

export default class Map_2 extends BaseScene {
  constructor() {
    super("Map_2", "assets/maps/map_2.json");
  }
  create() {
    this.initValues();
    this.createMapAndPlayer(3, 14);
    this.addCollition();
    this.createControls();
  }
  nextScene(): void {
    this.scene.transition({ target: "Map_3", duration: 0 });
  }
}
