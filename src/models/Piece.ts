// Project imports
import { PieceType } from "../helpers/Enums";

export class Piece {
  private pieceType: PieceType = PieceType.NONE;
  constructor(pieceType: PieceType) {
    this.pieceType = pieceType;
  }

  public getPieceType(): PieceType {
    return this.pieceType;
  }

}