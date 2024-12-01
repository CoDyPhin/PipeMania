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
    this.gridModel.grid.forEach(row => {
      row.forEach(cell => {
        cell.getView().drawCell();
      });
    });
  }
}