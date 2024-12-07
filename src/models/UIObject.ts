// Project imports
import { GameObject } from "./GameObject";
import { ObjectType } from "../helpers/Enums";

export class UIObject extends GameObject {
  private timer:        number = 0;
  private nodesLeft:    number = 0;
  private endGameStr:   string = "";

  constructor(id: number) {
    super(ObjectType.UI, id);
  }

  public getTimer(): number {
    return this.timer;
  }

  public setTimer(timer: number): void {
    this.timer = timer;
  }

  public getNodesLeft(): number {
    return this.nodesLeft;
  }

  public setNodesLeft(nodesLeft: number): void {
    this.nodesLeft = nodesLeft;
  }

  public getEndGameStr(): string {
    return this.endGameStr;
  }

  public setEndGameStr(endGameStr: string): void {
    this.endGameStr = endGameStr;
  }
}