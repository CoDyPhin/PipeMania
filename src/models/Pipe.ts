// PixiJS imports

// Project imports
import { PieceType, PipeConnections } from "../helpers/Enums";
import { Piece } from "./Piece";

export class Pipe extends Piece {
  private pipeType: PipeConnections = PipeConnections.NONE;
  constructor(pipeType: PipeConnections) {
    super(PieceType.PIPE);
    this.pipeType = pipeType;
  }

  public getPipeType(): PipeConnections {
    return this.pipeType;
  }
}