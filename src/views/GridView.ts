// Project imports
import { GameConstants } from "../helpers/GameConstants";
import { GridObject }    from "../models/GridObject";
import { GridCellView }  from "./GridCellView";

export class GridView {
  private gridModel: GridObject;
  private gridView:  Array<Array<GridCellView>> = new Array();
  constructor(gridModel: GridObject) {
    this.gridModel = gridModel;
    const grid     = this.gridModel.getGrid();
    const maxDim   = Math.max(grid.length, grid[0].length);
    const cellFrac = gridModel.getViewSize() / maxDim;
    
    grid.forEach((row, rowID) => {
      this.gridView.push(new Array());

      row.forEach(cell => {
        const view = new GridCellView(cell, cellFrac, cellFrac, GameConstants.GRID_CELL_BORDER);
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