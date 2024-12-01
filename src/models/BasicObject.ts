// PixiJS imports
import { 
  Ticker as PIXITicker
} from "pixi.js";

// Project imports
import { GameObject } from "./GameObject";
import { ObjectType } from "../helpers/Enums";

export class BasicObject extends GameObject {
  constructor(id: number) {
    super(ObjectType.BASIC, id);
  }

  public update(ticker: PIXITicker): void {
    super.update(ticker);
  }
}