// PixiJS imports

// Project imports
import { GameConstants } from "../helpers/GameConstants";
import { ObjectFactory } from "../factories/ObjectFactory";
import { ObjectManager } from "./ObjectManager";
import { GridView } from "../views/GridView";
import { GridObject } from "../models/GridObject";
import { GridCellObject } from "../models/GridCellObject";
import { Pipe } from "../models/Pipe";
import { PieceType } from "../helpers/Enums";
import { Piece } from "../models/Piece";

export class GridController {
  private gridModel: GridObject;
  private gridView:  GridView;

  constructor() {
    const cols       = GameConstants.GRID_COLS;
    const rows       = GameConstants.GRID_ROWS;
    const size       = GameConstants.GRID_SIZE;
    const grid       = new Array<Array<GridCellObject>>();
    const gridObj    = ObjectFactory.createGrid(size);
    this.gridModel   = gridObj as GridObject;
    ObjectManager.getInstance().addObject(gridObj);

    for (let rowID = 0; rowID < rows; ++rowID) {
      grid.push(new Array());
      for (let colID = 0; colID < cols; ++colID) {
        const obj = ObjectFactory.createGridCell(colID, rowID);
        ObjectManager.getInstance().addObject(obj);
        obj.addEventListener("pointertap", this.onCellClick.bind(this, obj as GridCellObject));
        grid[rowID].push(obj as GridCellObject);
        (obj as GridCellObject).setPiece(new Piece(PieceType.NONE));
      }
    }
    this.gridModel.setGrid(grid);
    this.gridView = new GridView(this.gridModel);
    this.gridView.drawGrid();
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize(): void {
    this.gridView.drawGrid();
  }

  private onCellClick(cell: GridCellObject): void {

    cell.setPiece(this.generateRandomPipe());
    this.gridView.drawGrid();
  }

  private generateRandomPipe(): Pipe {
    let bitmask = (1 << GameConstants.N_DIRECTIONS) - 1;
    const bitsToFlip = Math.floor(Math.random() * (GameConstants.N_DIRECTIONS - 1));
    for (let i = 0; i < bitsToFlip; i++) {
      const randomBit = Math.floor(Math.random() * GameConstants.N_DIRECTIONS);
      bitmask &= ~(1 << randomBit);
    }
    return new Pipe(bitmask);
  }

}