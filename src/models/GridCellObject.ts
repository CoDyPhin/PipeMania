// PixiJS imports
import { 
    Ticker   as PIXITicker
  } from "pixi.js";
  
  // Project imports
  import { GameObject } from "./GameObject";
  import { ObjectType, PieceType } from "../helpers/Enums";
  import { Piece } from "./Piece";
  
  export class GridCellObject extends GameObject {
    private piece:    Piece  = new Piece(PieceType.NONE);
    private col:      number;
    private row:      number;

    constructor(id: number, col: number, row: number) {
      super(ObjectType.GRID_CELL, id);
      this.col      = col;
      this.row      = row;
    }

    public getCol(): number {
      return this.col;
    }

    public getRow(): number {
      return this.row;
    }

    public setPiece(piece: Piece): void {
      this.piece = piece;
      if (piece.getPieceType() === PieceType.BLOCK) {
        this.interactive = false;
      }
      else if (piece.getPieceType() === PieceType.PUMP) this.interactive = false;
      else this.interactive = true;
    }

    public getPiece(): Piece {
      return this.piece;
    }
  }