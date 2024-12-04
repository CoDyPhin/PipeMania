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
import { PipeQueue }                  from "../models/PipeQueue";

import { GridView }                   from "../views/GridView";
import { PipeQueueView }              from "../views/PipeQueueView";

export class GridController {
  private gridModel:         GridObject;
  private gridView:          GridView;
  private pipeQueue:         PipeQueue;
  private pipeQueueView:     PipeQueueView;
  private currentCell:       GridCellObject | undefined;
  private selectedDirection: PipeConnections = PipeConnections.NONE;

  constructor() {
    const gridObj  = ObjectFactory.createGrid(GameConstants.GRID_SIZE);
    this.gridModel = gridObj as GridObject;
    ObjectManager.getInstance().addObject(gridObj);
    this.setupGrid(GameConstants.GRID_COLS, GameConstants.GRID_ROWS);
    this.gridView = new GridView(this.gridModel);

    const pipeQueue = ObjectFactory.createPipeQueue();
    this.pipeQueue  = pipeQueue as PipeQueue;
    ObjectManager.getInstance().addObject(pipeQueue);
    this.pipeQueueView = new PipeQueueView(this.pipeQueue);

    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize(): void {
    this.gridModel.onResize();
    this.gridView.drawGrid();
    this.pipeQueueView.drawPipeQueue();
  }

  private onCellClick(cell: GridCellObject): void {
    cell.setPiece(this.pipeQueue.getNextPipe());
    this.updateConnections(cell);
    this.pipeQueueView.drawPipeQueue();
    this.gridView.drawGrid();
  }

  public onGameStart(): void {
    this.generateLevel();
    this.pipeQueue.startQueue();
    this.gridView.drawGrid();
    this.pipeQueueView.drawPipeQueue();

  }

  public flowWater(elapsedFlowTime: number): number {
    const flowPercentage = elapsedFlowTime % GameConstants.WATER_FLOW_INTERVAL;
    console.log("Flow Percentage: " + flowPercentage);
    if (!this.currentCell) throw new Error("Current flow cell is not set");
    const cell = this.currentCell;
    const pipe = cell.getPiece() as Pipe;
    if (pipe.getNumberOfConnections() === 1) {
      // Start cell
      cell.setFlowPercentage(this.selectedDirection, flowPercentage % 2);
      this.gridView.drawGrid();
    }
    
    return 1;
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
      }
    }
    this.gridModel.setGrid(grid);
  }

  private generateStartPiece(): {col: number, row: number, direction: PipeConnections} {
    const startCol      = Math.floor(Math.random() * (GameConstants.GRID_COLS - 2)) + 1;
    const startRow      = Math.floor(Math.random() * (GameConstants.GRID_ROWS - 2)) + 1;
    const pipeDirection = Math.floor(Math.random() * GameConstants.N_DIRECTIONS);
    const directionMask = (1 << pipeDirection);
    this.selectedDirection = directionMask;
    return { col: startCol, row: startRow, direction: directionMask };
  }

  private generateBlocks(availablePositions: Array<{ col: number; row:number }>): void {
    const nBlocks = Math.floor(Math.random() * (GameConstants.MAX_BLOCKS));
    if (nBlocks >= availablePositions.length) throw new Error("Too many blocks for the grid size");

    for (let i = 0; i < nBlocks; ++i) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const {col, row}  = availablePositions[randomIndex];
      const cell = this.gridModel.getGrid()[row][col];
      cell.setPiece(new Piece(PieceType.BLOCK));
      cell.interactive = false;

      availablePositions[randomIndex] = availablePositions[availablePositions.length - 1];
      availablePositions.pop();
    }
  }

  private generateLevel(): void {
    // Generate start piece
    const {col: startCol, row: startRow, direction: startDir } = this.generateStartPiece();

    const conDiff                        = this.getConnectionCoords(startDir);
    const adjacentCol                    = startCol + conDiff.colDiff;
    const adjacentRow                    = startRow + conDiff.rowDiff;

    let availablePositions = new Array<{col: number, row: number}>();
    for (let row = 0; row < GameConstants.GRID_ROWS; ++row) {
      for (let col = 0; col < GameConstants.GRID_COLS; ++col) {
        const cell = this.gridModel.getCell(col, row) as GridCellObject;
        cell.clearNeighbors();
        if (row === startRow && col === startCol) {
          cell.setPiece(new Pipe(startDir));
          cell.interactive = false;
          this.currentCell = cell;
          continue;
        }
        else if ((row === adjacentRow && col === adjacentCol)) continue;
        cell.setPiece(new Piece(PieceType.NONE));
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

  private getDirectionFromCoords(colDiff: number, rowDiff: number): PipeConnections {
    if (colDiff === -1) return PipeConnections.LEFT;
    if (colDiff ===  1) return PipeConnections.RIGHT;
    if (rowDiff === -1) return PipeConnections.UP;
    if (rowDiff ===  1) return PipeConnections.DOWN;
    return PipeConnections.NONE;
  }

  private getOppositeDirection(direction: PipeConnections): PipeConnections {
    if (direction === PipeConnections.LEFT)  return PipeConnections.RIGHT;
    if (direction === PipeConnections.RIGHT) return PipeConnections.LEFT;
    if (direction === PipeConnections.UP)    return PipeConnections.DOWN;
    if (direction === PipeConnections.DOWN)  return PipeConnections.UP;
    return PipeConnections.NONE;
  }

  private isInBounds(col: number, row: number): boolean {
    return col >= 0 && col < GameConstants.GRID_COLS && row >= 0 && row < GameConstants.GRID_ROWS;
  }

  private updateConnections(cell: GridCellObject): void {
    const connections = (cell.getPiece() as Pipe).getPipeConnections();
    for (let mainDir = 0; mainDir < GameConstants.N_DIRECTIONS; ++mainDir) {
      const direction = 1 << mainDir;
      if (!(connections & direction)) continue;

      const {colDiff, rowDiff} = this.getConnectionCoords(direction);
      if (!this.isInBounds(cell.getCol() + colDiff, cell.getRow() + rowDiff)) continue;
      
      const neighbor = this.gridModel.getCell(cell.getCol() + colDiff, cell.getRow() + rowDiff);
      if (neighbor.getPiece().getPieceType() === PieceType.PIPE) {
        const oppositeDir  = this.getOppositeDirection(direction);
        if ((neighbor.getPiece() as Pipe).getPipeConnections() & oppositeDir) cell.connect(neighbor);
        else cell.disconnect(neighbor);
      }
    }
  }
}