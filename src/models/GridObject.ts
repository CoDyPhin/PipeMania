// PixiJS imports
import { 
  Ticker as PIXITicker
} from "pixi.js";
  
// Project imports
import { GameObject } from "./GameObject";
import { ObjectType, PipeConnections } from "../helpers/Enums";
import { ObjectFactory } from "../factories/ObjectFactory";
import { ObjectManager } from "../controllers/ObjectManager";
import { GridCellObject } from "./GridCellObject";
import { Pipe } from "./Pipe";
import { GameConstants } from "../helpers/GameConstants";
  
export class GridObject extends GameObject {
  public grid: Array<Array<GridCellObject>> = new Array();
  constructor(id: number, screenFraction: number, cols: number, rows: number) {
    super(ObjectType.GRID, id);
    const squareFrac  = screenFraction / Math.max(cols, rows);
    for (let rowID = 0; rowID < rows; ++rowID) {
      this.grid.push(new Array());
      for (let colID = 0; colID < cols; ++colID) {
        const obj = ObjectFactory.createGridCell(squareFrac, squareFrac, GameConstants.GRID_CELL_BORDER, colID, rowID);
        ObjectManager.getInstance().addObject(obj);
        this.grid[rowID].push(obj as GridCellObject);
        (obj as GridCellObject).setPiece(new Pipe(PipeConnections.LEFT | PipeConnections.RIGHT | PipeConnections.UP | PipeConnections.DOWN));
      }
    }
  }
  
  public update(ticker: PIXITicker): void {
    super.update(ticker);
  }
}