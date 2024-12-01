// PixiJS imports
import { Graphics as PIXIGraphics } from "pixi.js";

// Project imports
import { GridView } from "../views/GridView";

export class GridController {
  private gridView: GridView;

  constructor() {
    this.gridView = new GridView();
    this.gridView.drawGrid();
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize(): void {
    this.gridView.drawGrid();
  }

}