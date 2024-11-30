// Project imports
import { ObjectManager } from "../../controllers/ObjectManager";
import { ObjectType } from "../../helpers/Enums";

export class GameScene {
  constructor() {
    for (let i = 1; i < 10; ++i) {
      const obj = ObjectManager.getInstance().createObject(ObjectType.BASIC);
      obj.x = i * 200;
    }
  }
}