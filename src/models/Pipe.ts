// PixiJS imports
import { Graphics as PIXIGraphics } from "pixi.js";

// Project imports
import { PieceType, PipeConnections } from "../helpers/Enums";
import { Piece } from "./Piece";
import { Color, GameConstants } from "../helpers/GameConstants";

export class Pipe extends Piece {
  private pipeType: PipeConnections = PipeConnections.NONE;
  constructor(pipeType: PipeConnections) {
    super(PieceType.PIPE);
    this.pipeType = pipeType;
  }

  public getPipeType(): PipeConnections {
    return this.pipeType;
  }

  public drawPiece(cell: PIXIGraphics, width: number, height: number): void {
    if (this.pipeType < 2) return;
    if (this.pipeType & PipeConnections.LEFT) {
      const pipeHeight = GameConstants.PIPE_SIZE * height;
      const startY     = (height - pipeHeight) / 2;
      cell.rect(0, startY, width / 2, pipeHeight);
      cell.fill(Color.BLUE);
    }
    if (this.pipeType & PipeConnections.RIGHT) {
      const pipeHeight = GameConstants.PIPE_SIZE * height;
      const startY     = (height - pipeHeight) / 2;
      cell.rect(width / 2, startY, width / 2, pipeHeight);
      cell.fill(Color.BLUE);  
    }
    if (this.pipeType & PipeConnections.UP) {
      const pipeWidth = GameConstants.PIPE_SIZE * width;
      const startX    = (width - pipeWidth) / 2;
      cell.rect(startX, 0, pipeWidth, height / 2);
      cell.fill(Color.BLUE);
    }
    if (this.pipeType & PipeConnections.DOWN) {
      const pipeWidth = GameConstants.PIPE_SIZE * width;
      const startX    = (width - pipeWidth) / 2;
      cell.rect(startX, height / 2, pipeWidth, height / 2);
      cell.fill(Color.BLUE);
    }
  }
}