// PixiJS imports
import { Graphics as PIXIGraphics } from "pixi.js";

// Project imports
import { GameObject } from "./GameObject";
import { ObjectType } from "../helpers/Enums";

export class BasicObject extends GameObject {
  constructor(id: number) {
    super(ObjectType.BASIC, id);
    this.position.set(200, 200);
    const rect = new PIXIGraphics();
    rect.rect(0, 0, 100, 100);
    rect.fill(0x000000);
    this.addChild(rect);
  }
}