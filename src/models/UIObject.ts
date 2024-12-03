// PixiJS imports
  
// Project imports
import { GameObject } from "./GameObject";
import { ObjectType } from "../helpers/Enums";
  
export class UIObject extends GameObject {

  constructor(id: number) {
    super(ObjectType.UI, id);
  }
}