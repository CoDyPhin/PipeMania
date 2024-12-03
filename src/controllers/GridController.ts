// PixiJS imports

// Project imports
import { GameConstants } from "../helpers/GameConstants";
import { ObjectFactory } from "../factories/ObjectFactory";
import { ObjectManager } from "./ObjectManager";
import { GridView } from "../views/GridView";
import { GridObject } from "../models/GridObject";
import { GridCellObject } from "../models/GridCellObject";
import { Pipe } from "../models/Pipe";
import { PieceType, PipeConnections } from "../helpers/Enums";
import { Piece } from "../models/Piece";

export class GridController {
  private gridModel: GridObject;
  private gridView:  GridView;

  constructor() {
    const gridObj  = ObjectFactory.createGrid(GameConstants.GRID_SIZE);
    this.gridModel = gridObj as GridObject;
    ObjectManager.getInstance().addObject(gridObj);
    this.setupGrid(GameConstants.GRID_COLS, GameConstants.GRID_ROWS);
    this.gridView = new GridView(this.gridModel);
    this.gridView.drawGrid();
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize(): void {
    this.gridView.drawGrid();
  }

  private onCellClick(cell: GridCellObject): void {
    cell.setPiece(this.generateRandomPipe());
    this.updateConnections(cell);
    this.gridView.drawGrid();
  }

  private setupGrid(cols: number, rows: number): void {
    const grid = new Array<Array<GridCellObject>>();
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
    this.generateLevel();
  }

  private generateLevel(): void {
    // TODO: Avoid generating start piece with a block connected to it
    // Generate start piece
    const startCol      = Math.floor(Math.random() * (GameConstants.GRID_COLS - 2)) + 1;
    const startRow      = Math.floor(Math.random() * (GameConstants.GRID_ROWS - 2)) + 1;
    const pipeDirection = Math.floor(Math.random() * GameConstants.N_DIRECTIONS);
    const startCell     = this.gridModel.getGrid()[startRow][startCol];
    const directionMask = (1 << pipeDirection);
    startCell.setPiece(new Pipe(directionMask));
    startCell.interactive = false;

    // Generate blocks
    const nBlocks = Math.floor(Math.random() * (GameConstants.MAX_BLOCKS));
    for (let i = 0; i < nBlocks; ++i) {
      const col = Math.floor(Math.random() * GameConstants.GRID_COLS);
      const row = Math.floor(Math.random() * GameConstants.GRID_ROWS);
      const cell = this.gridModel.getGrid()[row][col];
      if (cell.getPiece().getPieceType() ===  PieceType.PIPE) continue;
      cell.setPiece(new Piece(PieceType.BLOCK));
      cell.interactive = false;
    }
  }

  private getConnectionCoords(connection: PipeConnections): {colDiff: number, rowDiff: number} {
    // This assumes that the start cell only has one connection
    let colDiff = 0;
    let rowDiff = 0;
    if (connection & PipeConnections.LEFT)       colDiff = -1;
    else if (connection & PipeConnections.RIGHT) colDiff =  1;
    else if (connection & PipeConnections.UP)    rowDiff = -1;
    else if (connection & PipeConnections.DOWN)  rowDiff =  1;
    return {colDiff, rowDiff};
  }

  private getOppositeDirection(direction: PipeConnections): PipeConnections {
    if (direction === PipeConnections.LEFT)  return PipeConnections.RIGHT;
    if (direction === PipeConnections.RIGHT) return PipeConnections.LEFT;
    if (direction === PipeConnections.UP)    return PipeConnections.DOWN;
    if (direction === PipeConnections.DOWN)  return PipeConnections.UP;
    return PipeConnections.NONE;
  }

  private updateConnections(cell: GridCellObject): void {
    const connections = (cell.getPiece() as Pipe).getPipeConnections();
    for (let mainDir = 0; mainDir < GameConstants.N_DIRECTIONS; ++mainDir) {
      if (!(connections & (1 << mainDir))) continue;
      const {colDiff, rowDiff} = this.getConnectionCoords(1 << mainDir);
      if (cell.getCol() + colDiff < 0 || cell.getCol() + colDiff >= GameConstants.GRID_COLS) continue;
      if (cell.getRow() + rowDiff < 0 || cell.getRow() + rowDiff >= GameConstants.GRID_ROWS) continue;
      const neighbor = this.gridModel.getCell(cell.getCol() + colDiff, cell.getRow() + rowDiff);
      if (neighbor.getPiece().getPieceType() === PieceType.PIPE) {
        const oppositeDir  = this.getOppositeDirection(1 << mainDir);
        if ((neighbor.getPiece() as Pipe).getPipeConnections() & oppositeDir) cell.connect(neighbor);
      }
    }
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