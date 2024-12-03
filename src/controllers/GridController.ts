// PixiJS imports

// Project imports
import { GameConstants }              from "../helpers/GameConstants";
import { PieceType, PipeConnections } from "../helpers/Enums";
import { ObjectFactory }              from "../factories/ObjectFactory";
import { ObjectManager }              from "./ObjectManager";

import { GridObject }                 from "../models/GridObject";
import { GridCellObject }             from "../models/GridCellObject";
import { Pipe }                       from "../models/Pipe";
import { Piece }                      from "../models/Piece";

import { GridView }                   from "../views/GridView";

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
    this.gridModel.onResize();
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
        const obj = ObjectFactory.createGridCell(colID, rowID, this.gridModel);
        ObjectManager.getInstance().addObject(obj);
        obj.addEventListener("pointertap", this.onCellClick.bind(this, obj as GridCellObject));
        grid[rowID].push(obj as GridCellObject);
        (obj as GridCellObject).setPiece(new Piece(PieceType.NONE));
      }
    }
    this.gridModel.setGrid(grid);
    this.generateLevel();
  }

  private generateStartPiece(): {col: number, row: number} {
    const startCol      = Math.floor(Math.random() * (GameConstants.GRID_COLS - 2)) + 1;
    const startRow      = Math.floor(Math.random() * (GameConstants.GRID_ROWS - 2)) + 1;
    const pipeDirection = Math.floor(Math.random() * GameConstants.N_DIRECTIONS);
    const startCell     = this.gridModel.getGrid()[startRow][startCol];
    const directionMask = (1 << pipeDirection);
    startCell.setPiece(new Pipe(directionMask));
    startCell.interactive = false;
    return { col: startCol, row: startRow };
  }

  private generateBlocks(availablePositions: Array<{ col: number; row:number }>): void {
    const nBlocks = Math.floor(Math.random() * (GameConstants.MAX_BLOCKS));
    if (nBlocks >= availablePositions.length) throw new Error("Too many blocks for the grid size");
    for (let i = 0; i < nBlocks; ++i) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const {col, row} = availablePositions[randomIndex];
      availablePositions[randomIndex] = availablePositions[availablePositions.length - 1];
      availablePositions.pop();
      const cell = this.gridModel.getGrid()[row][col];
      cell.setPiece(new Piece(PieceType.BLOCK));
      cell.interactive = false;
    }
  }

  private generateLevel(): void {
    // Generate start piece
    const {col: startCol, row: startRow} = this.generateStartPiece();
    const startPipe                      = this.gridModel.getCell(startCol, startRow).getPiece() as Pipe;
    const conDiff                        = this.getConnectionCoords(startPipe.getPipeConnections());
    const adjacentCol                    = startCol + conDiff.colDiff;
    const adjacentRow                    = startRow + conDiff.rowDiff;

    let availablePositions = new Array<{col: number, row: number}>();
    for (let row = 0; row < GameConstants.GRID_ROWS; ++row) {
      for (let col = 0; col < GameConstants.GRID_COLS; ++col) {
        if ((row === startRow && col === startCol) || (row === adjacentRow && col === adjacentCol)) continue;
        availablePositions.push({col, row});
      }
    }

    // Generate blocks
    this.generateBlocks(availablePositions);
  }

  private getConnectionCoords(connection: PipeConnections): {colDiff: number, rowDiff: number} {
    // This assumes that the direction only has one connection
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

  private checkIfInBounds(col: number, row: number): boolean {
    return col >= 0 && col < GameConstants.GRID_COLS && row >= 0 && row < GameConstants.GRID_ROWS;
  }

  private updateConnections(cell: GridCellObject): void {
    const connections = (cell.getPiece() as Pipe).getPipeConnections();
    for (let mainDir = 0; mainDir < GameConstants.N_DIRECTIONS; ++mainDir) {
      const direction = 1 << mainDir;
      if (!(connections & direction)) continue;

      const {colDiff, rowDiff} = this.getConnectionCoords(direction);
      if (this.checkIfInBounds(cell.getCol() + colDiff, cell.getRow() + rowDiff)) continue;
      
      const neighbor = this.gridModel.getCell(cell.getCol() + colDiff, cell.getRow() + rowDiff);
      if (neighbor.getPiece().getPieceType() === PieceType.PIPE) {
        const oppositeDir  = this.getOppositeDirection(direction);
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