// Project imports
import { ObjectType } from "../helpers/Enums";
import { GameObject } from "../models/GameObject";
import { BasicObject } from "../models/BasicObject";

export class ObjectFactory {
  private static objectIDMap: Map<ObjectType, number> = new Map();
  public static createObject(objectType: ObjectType): GameObject {
    switch (objectType) {
      case ObjectType.BASIC:
        let currentID = ObjectFactory.objectIDMap.has(ObjectType.BASIC) ? ObjectFactory.objectIDMap.get(ObjectType.BASIC)! : 1;
        const object = new BasicObject(currentID++);
        ObjectFactory.objectIDMap.set(ObjectType.BASIC, currentID);
        return object;
      default:
        throw new Error(`Object not found: ${objectType}`);
    }
  }
}