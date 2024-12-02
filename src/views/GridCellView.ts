// PixiJS imports
import { Graphics as PIXIGraphics } from "pixi.js";

// Project imports
import { Color, GameConstants } from "../helpers/GameConstants";
import { GridCellObject } from "../models/GridCellObject";
import { Pipe } from "../models/Pipe";
import { GameView } from "./GameView";
import { PieceType } from "../helpers/Enums";
import { PipeConnections } from "../helpers/Enums";

export class GridCellView {
  private cell:        PIXIGraphics;
    
  private xSize:       number;
  private ySize:       number;
  private finalX:      number = 0;
  private finalY:      number = 0;
  private border:      number;

  private fillColor:   number = Color.CYAN;
  private borderColor: number = Color.BLACK;
  private objModel:    GridCellObject;
    
  constructor(obj: GridCellObject, xSize: number, ySize: number, border: number) {
    this.xSize       = xSize;
    this.ySize       = ySize;
    this.border      = border;
    this.objModel    = obj;
    this.cell        = new PIXIGraphics();
    this.objModel.addChild(this.cell);
  }

  public drawCell(): void {
    this.cell.clear();
  
    const canvasWidth  = GameView.getInstance().getApp().renderer.width;
    const canvasHeight = GameView.getInstance().getApp().renderer.height;
    this.objModel.x    = this.objModel.getCol() * this.xSize * GameView.getInstance().getApp().renderer.width;
    this.objModel.y    = this.objModel.getRow() * this.ySize * GameView.getInstance().getApp().renderer.height;
    
    this.finalX        = this.xSize * canvasWidth;
    this.finalY        = this.ySize * canvasHeight;
    const xBorder      = this.finalX * this.border; 
    const yBorder      = this.finalY * this.border;
  
    this.cell.rect(0, 0, this.finalX, this.finalY);
    this.cell.fill(this.borderColor);
    this.cell.rect(0 + xBorder, 0 + yBorder, this.finalX - 2 * xBorder, this.finalY - 2 * yBorder);
    this.cell.fill(this.fillColor);
    this.drawPiece();
  }

  private drawPiece(): void {
    const piece = this.objModel.getPiece();
    switch (piece.getPieceType()) {
      case PieceType.NONE:
        return;
      case PieceType.BLOCK:
        break;
      case PieceType.PUMP:
        break;
      case PieceType.PIPE:
        this.drawPipe(piece as Pipe);
        break;
    }
  }

  private drawPipe(pipe: Pipe): void {
    if (pipe.getPipeType() < 2) return;
    if (pipe.getPipeType() & PipeConnections.LEFT) {
      const pipeHeight = GameConstants.PIPE_SIZE * this.finalY;
      const startY     = (this.finalY - pipeHeight) / 2;
      this.cell.rect(0, startY, this.finalX / 2, pipeHeight);
      this.cell.fill(Color.BLUE);
    }
    if (pipe.getPipeType() & PipeConnections.RIGHT) {
      const pipeHeight = GameConstants.PIPE_SIZE * this.finalY;
      const startY     = (this.finalY - pipeHeight) / 2;
      this.cell.rect(this.finalX / 2, startY, this.finalX / 2, pipeHeight);
      this.cell.fill(Color.BLUE);
    }
    if (pipe.getPipeType() & PipeConnections.UP) {
      const pipeWidth = GameConstants.PIPE_SIZE * this.finalX;
      const startX    = (this.finalX - pipeWidth) / 2;
      this.cell.rect(startX, 0, pipeWidth, this.finalY / 2);
      this.cell.fill(Color.BLUE);
    }
    if (pipe.getPipeType() & PipeConnections.DOWN) {
      const pipeWidth = GameConstants.PIPE_SIZE * this.finalX;
      const startX    = (this.finalX - pipeWidth) / 2;
      this.cell.rect(startX, this.finalY / 2, pipeWidth, this.finalY / 2);
      this.cell.fill(Color.BLUE);
    }
  }
}