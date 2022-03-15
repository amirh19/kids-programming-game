import BaseScene from "../classes/BaseScene";

export default class Map_4 extends BaseScene {
  constructor() {
    super("Map_4", "assets/maps/map_4.json");
  }
  create() {
    this.initValues();
    this.createMapAndPlayer(3, 5);
    this.addCollition();
    this.createControls();
  }
  nextScene(): void {
    this.scene.transition({ target: "Map_5", duration: 0 });
  }
}
