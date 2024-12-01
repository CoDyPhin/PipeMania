// Project imports
import { ObjectManager } from "../controllers/ObjectManager";
import { ObjectFactory } from "../factories/ObjectFactory";
import { GameConstants } from "../helpers/GameConstants";
import { GridObject } from "../models/GridObject";
import { GridCellObject } from "../models/GridCellObject";

export class GridView {
  public gridModel: GridObject;
  constructor() {
    const obj = ObjectFactory.createGrid(GameConstants.GRID_SIZE, GameConstants.GRID_COLS, GameConstants.GRID_ROWS);
    ObjectManager.getInstance().addObject(obj);
    this.gridModel = obj as GridObject;
  }

  public drawGrid(): void {
    for (let rowID = 0; rowID < this.gridModel.grid.length; ++rowID) {
      for (let colID = 0; colID < this.gridModel.grid[rowID].length; ++colID) {
        const cell = this.gridModel.grid[rowID][colID] as GridCellObject;
        cell.getView().drawCell();
      }
    }
  }
}