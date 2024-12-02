// Project imports
import { GameObject }            from "./GameObject";
import { ObjectType, PieceType } from "../helpers/Enums";
import { Piece }                 from "./Piece";
import { GridObject } from "./GridObject";
  
  export class GridCellObject extends GameObject {
    private piece:     Piece  = new Piece(PieceType.NONE);
    private coords:    {col: number; row: number};
    private neighbors: Set<{col: number, row: number}> = new Set();
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

    public getNeighbors(): Set<{col: number, row: number}> {
      return this.neighbors;
    }

    public connect(cell: GridCellObject): void {
      if (this.neighbors.has(cell.coords)) return;
      this.neighbors.add(cell.coords);
      cell.connect(this);
    }

    public disconnect(cell: GridCellObject): void {
      if (!this.neighbors.has(cell.coords)) return;
      this.neighbors.delete(cell.coords);
      cell.disconnect(this);
    }

    public setPiece(piece: Piece): void {
      this.piece = piece;
    }

    public getPiece(): Piece {
      return this.piece;
    }
  }