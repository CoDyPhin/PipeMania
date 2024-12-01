// PixiJS imports
import { 
    Ticker   as PIXITicker
  } from "pixi.js";
  
  // Project imports
  import { GameObject } from "./GameObject";
  import { ObjectType, PieceType } from "../helpers/Enums";
  import { GridCellView } from "../views/GridCellView";
  import { Piece } from "./Piece";
  
  export class GridCellObject extends GameObject {
    private cellView: GridCellView;
    private piece:    Piece  = new Piece(PieceType.NONE);
    public row:       number;
    public col:       number;

    constructor(id: number, xSize: number, ySize: number, border: number, col: number, row: number) {
      super(ObjectType.GRID_CELL, id);
      this.cellView = new GridCellView(this, xSize, ySize, border);
      this.col      = col;
      this.row      = row;
    }

    public setPiece(piece: Piece): void {
      this.piece = piece;
      if (piece.getPieceType() === PieceType.BLOCK) {
        this.interactive = false;
      }
      else if (piece.getPieceType() === PieceType.PUMP) this.interactive = false;
      else this.interactive = true;
      this.on('pointertap', () => {
        console.log(`Cell clicked: ${this.col}, ${this.row}`);
      });
    }

    public getView(): GridCellView {
      return this.cellView;
    }

    public getPiece(): Piece {
      return this.piece;
    }
  
    public update(ticker: PIXITicker): void {
      super.update(ticker);
    }
  }