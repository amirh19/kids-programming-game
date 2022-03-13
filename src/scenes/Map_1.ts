import BaseScene from "../classes/BaseScene";

export default class Map_1 extends BaseScene {
  constructor() {
    super("Map_1", "assets/maps/map_1.json");
  }
  nextScene(): void {
    this.scene.transition({ target: "Map_2", duration: 0 });
  }
}
