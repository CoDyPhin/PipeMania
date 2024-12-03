// PixiJS imports

// Project imports
import { PieceType, PipeConnections } from "../helpers/Enums";
import { GameConstants }              from "../helpers/GameConstants";
import { Piece }                      from "./Piece";

export class Pipe extends Piece {
  private pipeConnections: PipeConnections = PipeConnections.NONE;
  constructor(pipeType: PipeConnections) {
    super(PieceType.PIPE);
    this.pipeConnections = pipeType;
  }

  public getPipeConnections(): PipeConnections {
    return this.pipeConnections;
  }

  public getNumberOfConnections(): number {
    let count = 0;
    for (let i = 0; i < GameConstants.N_DIRECTIONS; ++i) {
      count += (this.pipeConnections >> i) & 1;
    }
    return count;
  }
}