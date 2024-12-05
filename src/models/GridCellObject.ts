// Project imports
import { GameObject }            from "./GameObject";
import { ObjectType, PieceType, PipeConnections } from "../helpers/Enums";
import { Piece }                 from "./Piece";
import { Pipe }                  from "./Pipe";
import { GridObject } from "./GridObject";
  
  export class GridCellObject extends GameObject {
    private piece:     Piece  = new Piece(PieceType.NONE);
    private coords:    {col: number; row: number};
    private neighbors: Map<string, {col: number, row: number}> = new Map();
    private mainGrid:  GridObject;

    constructor(id: number, col: number, row: number, mainGrid: GridObject) {
      super(ObjectType.GRID_CELL, id);
      this.coords = {col, row};
      this.interactive = true;
      this.mainGrid = mainGrid;
    }

    public getCol(): number {
      return this.coords.col;
    }

    public getRow(): number {
      return this.coords.row;
    }

    public getMainGrid(): GridObject {
      return this.mainGrid;
    }

    public getNeighbors(): Map<string, {col: number, row: number}> {
      return this.neighbors;
    }

    public clearNeighbors(): void {
      this.neighbors.clear();
    }

    public setFlowPercentage(direction: PipeConnections, percentage: number): void {
      if (this.piece.getPieceType() !== PieceType.PIPE) return;
      const pipe = this.piece as Pipe;
      pipe.setFlowPercentage(direction, percentage);
    }

    public connect(cell: GridCellObject): void {
      if (this.neighbors.has(JSON.stringify(cell.coords))) return;
      this.neighbors.set(JSON.stringify(cell.coords), cell.coords);
      cell.connect(this);
    }

    public disconnect(cell: GridCellObject): void {
      if (!this.neighbors.has(JSON.stringify(cell.coords))) return;
      this.neighbors.delete(JSON.stringify(cell.coords));
      cell.disconnect(this);
    }

    public setPiece(piece: Piece): void {
      this.piece = piece;
    }

    public getPiece(): Piece {
      return this.piece;
    }
  }