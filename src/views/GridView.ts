// Project imports
import { GameConstants } from "../helpers/GameConstants";
import { GridObject } from "../models/GridObject";
import { GridCellView } from "./GridCellView";

export class GridView {
  private gridModel: GridObject;
  private gridView: Array<Array<GridCellView>> = new Array();
  constructor(gridModel: GridObject) {
    this.gridModel = gridModel;
    const squareFrac = gridModel.getViewSize() / Math.max(this.gridModel.getGrid().length, this.gridModel.getGrid()[0].length);
    this.gridModel.getGrid().forEach((row, rowID) => {
      this.gridView.push(new Array());
      row.forEach(cell => {
        const view = new GridCellView(cell, squareFrac, squareFrac, GameConstants.GRID_CELL_BORDER);
        this.gridView[rowID].push(view);
      });
    });
  }

  public drawGrid(): void {
    this.gridView.forEach(row => {
      row.forEach(cell => {
        cell.drawCell();
      });
    });
  }
}