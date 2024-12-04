// Project imports
import { PieceType, PipeConnections } from "../helpers/Enums";
import { GameConstants }              from "../helpers/GameConstants";
import { Piece }                      from "./Piece";

export class Pipe extends Piece {
  private pipeConnections: PipeConnections = PipeConnections.NONE;
  private flowPercentages: Map<PipeConnections, number> = new Map();
  constructor(pipeType: PipeConnections) {
    super(PieceType.PIPE);
    this.pipeConnections = pipeType;
    for (let i = 0; i < GameConstants.N_DIRECTIONS; ++i) {
      this.flowPercentages.set(1 << i, 0);
    }
  }

  public getPipeConnections(): PipeConnections {
    return this.pipeConnections;
  }

  public setFlowPercentage(direction: PipeConnections, percentage: number): void {
    this.flowPercentages.set(direction, percentage);
  }

  public getFlowPercentages(): Map<PipeConnections, number> {
    return this.flowPercentages;
  }

  public getNumberOfConnections(): number {
    let count = 0;
    for (let i = 0; i < GameConstants.N_DIRECTIONS; ++i) {
      count += (this.pipeConnections >> i) & 1;
    }
    return count;
  }
}