// Project imports
import { UIObject } from "../models/UIObject";

export class UIView {
  private uiModel: UIObject;
  
  constructor(uiModel: UIObject) {
    this.uiModel = uiModel;
  }

  public drawUI(): void {
    // Draw UI
  }
}