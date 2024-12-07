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
  private nextCell:          GridCellObject | undefined;
  private lastFlowFloor:     number = 0;
  private nodeCount:         number = 0;

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
    this.nodeCount = 0;
    this.generateLevel();
    this.pipeQueue.startQueue();
    this.pipeQueueView.drawPipeQueue();
    this.gridView.drawGrid();

  }

  private moveToNextCell(): boolean {
    if (!this.nextCell) throw new Error("Next cell is not set");

    if (this.nextCell.getPiece().getPieceType() !== PieceType.PIPE) return false;

    const coordsKey = JSON.stringify({col: this.nextCell.getCol(), row: this.nextCell.getRow()});
    if (!(this.currentCell!.getNeighbors().has(coordsKey))) return false;

    this.currentCell!.setFlowPercentage(this.selectedDirection, 1);
    this.selectedDirection = this.getOppositeDirection(this.selectedDirection);
    this.currentCell       = this.nextCell;
    this.nextCell          = undefined;
    return true;
  }

  private selectNextCell(): boolean {
    const cell = this.currentCell;
    if (!cell) throw new Error("Current cell is not set");

    const neighborSet   = cell.getNeighbors().values();
    let possibleCells   = new Map<string, {col: number, row: number}>();

    const pipe = cell.getPiece() as Pipe;
    let mask   = pipe.getPipeConnections();
    mask       &= ~this.selectedDirection;

    for (let i = 0; i < GameConstants.N_DIRECTIONS; ++i) {
      const direction = 1 << i;

      if (mask & direction) {
        const {colDiff, rowDiff} = this.getConnectionCoords(direction);
        const col = cell.getCol() + colDiff;
        const row = cell.getRow() + rowDiff;

        if (this.isInBounds(col, row)) {
          if (this.gridModel.getCell(col, row).getPiece().getPieceType() === PieceType.BLOCK) continue;
          possibleCells.set(JSON.stringify({col, row}), {col, row});
        }
      }
    }

    for (const neighbor of neighborSet) {
      const neighborCell = this.gridModel.getCell(neighbor.col, neighbor.row);
      const selDirection = this.getDirectionFromCoords(neighbor.col - cell.getCol(), neighbor.row - cell.getRow());
      const oppDirection = this.getOppositeDirection(selDirection);

      if (neighborCell.getPiece().getPieceType() === PieceType.PIPE) {
        const neighborPipe = neighborCell.getPiece() as Pipe;
        if (neighborPipe.getFlowPercentages().get(oppDirection) === 0){
          cell.setFlowPercentage(this.selectedDirection, 1);
          this.selectedDirection = selDirection;
          this.nextCell          = neighborCell;
          return true;
        }
        else possibleCells.delete(JSON.stringify(neighbor));
      }
      else possibleCells.delete(JSON.stringify(neighbor));
    }
    
    const neighbor = possibleCells.values().next().value;
    if (neighbor === undefined) return false;

    const neighborCell     = this.gridModel.getCell(neighbor.col, neighbor.row);
    
    this.selectedDirection = this.getDirectionFromCoords(neighbor.col - cell.getCol(), neighbor.row - cell.getRow());
    this.nextCell          = neighborCell;
    return true;
  }

  public flowWater(elapsedFlowTime: number): number {
    if (!this.currentCell) throw new Error("Current flow cell is not set");

    let cell         = this.currentCell;
    cell.interactive = false;

    if (cell.getPiece().getPieceType() !== PieceType.PIPE) return -1;

    const pipe = cell.getPiece() as Pipe;
    const isStartCell = pipe.getNumberOfConnections() === 1;

    if (isStartCell) elapsedFlowTime += GameConstants.WATER_FLOW_INTERVAL / 2;
    else elapsedFlowTime -= GameConstants.WATER_FLOW_INTERVAL / 2;

    const intervalPercentage = elapsedFlowTime % GameConstants.WATER_FLOW_INTERVAL;
    let flowPercentage = intervalPercentage * 2 / GameConstants.WATER_FLOW_INTERVAL; 

    if (Math.floor(flowPercentage) !== this.lastFlowFloor) {
      if (flowPercentage >= 1 && !this.nextCell) {
        if (!this.selectNextCell()) return -1;
      } 
      else if (flowPercentage < 1 || flowPercentage >= 2) {
        if (!this.moveToNextCell()) return -1;
        ++this.nodeCount;
        cell = this.currentCell!;
      }
    }

    this.lastFlowFloor = Math.floor(flowPercentage);

    cell.setFlowPercentage(this.selectedDirection, flowPercentage);
    this.gridView.drawGrid();

    return this.nodeCount;
  }

  private setupGrid(cols: number, rows: number): void {
    let grid = new Array<Array<GridCellObject>>();

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
    const startCol         = Math.floor(Math.random() * (GameConstants.GRID_COLS - 2)) + 1;
    const startRow         = Math.floor(Math.random() * (GameConstants.GRID_ROWS - 2)) + 1;
    const pipeDirection    = Math.floor(Math.random() * GameConstants.N_DIRECTIONS);
    const directionMask    = (1 << pipeDirection);
    this.selectedDirection = directionMask;
    return { col: startCol, row: startRow, direction: directionMask };
  }

  private generateBlocks(availablePositions: Array<{ col: number; row:number }>): void {
    const nBlocks = Math.floor(Math.random() * (GameConstants.MAX_BLOCKS));
    if (nBlocks >= availablePositions.length) throw new Error("Too many blocks for the grid size");

    for (let i = 0; i < nBlocks; ++i) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const {col, row}  = availablePositions[randomIndex];
      let cell          = this.gridModel.getCell(col, row);

      cell.setPiece(new Piece(PieceType.BLOCK));
      cell.interactive = false;

      availablePositions[randomIndex] = availablePositions[availablePositions.length - 1];
      availablePositions.pop();
    }
  }

  private generateLevel(): void {
    // Generate start piece
    const {col: startCol, row: startRow, direction: startDir } = this.generateStartPiece();
    this.lastFlowFloor = 1;

    const conDiff                        = this.getConnectionCoords(startDir);
    const adjacentCol                    = startCol + conDiff.colDiff;
    const adjacentRow                    = startRow + conDiff.rowDiff;

    let availablePositions = [];
    for (let row = 0; row < GameConstants.GRID_ROWS; ++row) {
      for (let col = 0; col < GameConstants.GRID_COLS; ++col) {
        let cell = this.gridModel.getCell(col, row);
        cell.clearNeighbors();

        if (row === startRow && col === startCol) {
          cell.setPiece(new Pipe(startDir));
          cell.interactive = false;
          this.currentCell = cell;
          continue;
        }
        else if ((row === adjacentRow && col === adjacentCol)){
          this.nextCell = cell;
          continue;
        }
        else availablePositions.push({col, row});
        
        cell.setPiece(new Piece(PieceType.NONE));
        cell.interactive = true;
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
      const {colDiff, rowDiff} = this.getConnectionCoords(direction);
      
      if (!this.isInBounds(cell.getCol() + colDiff, cell.getRow() + rowDiff)) continue;
      
      const neighbor = this.gridModel.getCell(cell.getCol() + colDiff, cell.getRow() + rowDiff);
      
      if (!(connections & direction)) {
        cell.disconnect(neighbor);
        continue;  
      }
      
      if (neighbor.getPiece().getPieceType() === PieceType.PIPE) {
        const oppositeDir = this.getOppositeDirection(direction);
        if ((neighbor.getPiece() as Pipe).getPipeConnections() & oppositeDir) {
          cell.connect(neighbor);
        }
        else cell.disconnect(neighbor);
      }
    }
  }
}