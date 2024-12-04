// PixiJS imports
import { Graphics as PIXIGraphics } from "pixi.js";

// Project imports
import { Color, GameConstants } from "../helpers/GameConstants";
import { GridCellObject }       from "../models/GridCellObject";
import { Pipe }                 from "../models/Pipe";
import { GameView }             from "./GameView";
import { PieceType }            from "../helpers/Enums";
import { PipeConnections }      from "../helpers/Enums";

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
  
    const app          = GameView.getInstance().getApp();
    const canvasWidth  = app.renderer.width;
    const canvasHeight = app.renderer.height;
    this.objModel.x    = this.objModel.getMainGrid().x + this.objModel.getCol() * this.xSize * canvasWidth;
    this.objModel.y    = this.objModel.getMainGrid().y + this.objModel.getRow() * this.ySize * canvasHeight;
    
    this.finalX        = this.xSize * canvasWidth;
    this.finalY        = this.ySize * canvasHeight;
    const xBorder      = this.finalX * this.border; 
    const yBorder      = this.finalY * this.border;
  
    this.cell.rect(0, 0, this.finalX, this.finalY);
    this.cell.fill(this.borderColor);
    this.cell.rect(0 + xBorder, 0 + yBorder, this.finalX - 2 * xBorder, this.finalY - 2 * yBorder);
    const piece = this.objModel.getPiece();
    const color = piece.getPieceType() === PieceType.BLOCK ? GameConstants.BLOCK_COLOR : this.fillColor;
    this.cell.fill(color);
    
    if (piece.getPieceType() === PieceType.PIPE) this.drawPipe(piece as Pipe);
  }

  private drawPipe(pipe: Pipe): void {
    const pipeConnections = pipe.getPipeConnections();
    const colorMap        = pipe.getFlowPercentages();
    let pipeColor         = GameConstants.PIPE_COLOR;
    if (pipe.getNumberOfConnections() === 1) pipeColor = GameConstants.START_PIPE_COLOR;
    if (pipeConnections & PipeConnections.LEFT) {
      const startX     = 0;
      const pipeWidth  = this.finalX / 2;
      const pipeHeight = GameConstants.PIPE_SIZE * this.finalY;
      const startY     = (this.finalY - pipeHeight) / 2;
      
      // Draw pipe part
      this.cell.rect(startX, startY, pipeWidth, pipeHeight);
      this.cell.fill(pipeColor);
      
      // Draw water part
      const ratio      = colorMap.get(PipeConnections.LEFT) || 0;
      const splitWidth = pipeWidth * (ratio % 1);
      const waterX     = ratio <= 1 ? pipeWidth - splitWidth : startX;
      this.cell.rect(waterX, startY, splitWidth, pipeHeight);
      this.cell.fill(GameConstants.WATER_COLOR);
    }
    
    if (pipe.getPipeConnections() & PipeConnections.RIGHT) {
      const startX     = this.finalX / 2;
      const pipeWidth  = this.finalX / 2;
      const pipeHeight = GameConstants.PIPE_SIZE * this.finalY;
      const startY     = (this.finalY - pipeHeight) / 2;

      // Draw pipe part
      this.cell.rect(startX, startY, pipeWidth, pipeHeight);
      this.cell.fill(pipeColor);

      // Draw water part
      const ratio      = colorMap.get(PipeConnections.RIGHT) || 0;
      const splitWidth = pipeWidth * (ratio % 1);
      const waterX     = ratio <= 1 ? startX : startX + (pipeWidth - splitWidth);
      this.cell.rect(waterX, startY, splitWidth, pipeHeight);
      this.cell.fill(GameConstants.WATER_COLOR);
    }
    
    if (pipe.getPipeConnections() & PipeConnections.UP) {
      const startY     = 0;
      const pipeHeight = this.finalY / 2;
      const pipeWidth  = GameConstants.PIPE_SIZE * this.finalX;
      const startX     = (this.finalX - pipeWidth) / 2;

      // Draw the pipe part
      this.cell.rect(startX, startY, pipeWidth, pipeHeight);
      this.cell.fill(pipeColor);

      // Draw the water part
      const ratio       = colorMap.get(PipeConnections.UP) || 0;
      const splitHeight = pipeHeight * (ratio % 1);
      const waterY      = ratio <= 1 ? pipeHeight - splitHeight : startY;
      this.cell.rect(startX, waterY, pipeWidth, splitHeight);
      this.cell.fill(GameConstants.WATER_COLOR);
    }
    
    if (pipe.getPipeConnections() & PipeConnections.DOWN) {
      const startY     = this.finalY / 2;
      const pipeHeight = this.finalY / 2;
      const pipeWidth  = GameConstants.PIPE_SIZE * this.finalX;
      const startX     = (this.finalX - pipeWidth) / 2;

      // Draw the pipe part
      this.cell.rect(startX, startY, pipeWidth, pipeHeight);
      this.cell.fill(pipeColor);

      // Draw the water part
      const ratio       = colorMap.get(PipeConnections.DOWN) || 0;
      const splitHeight = pipeHeight * (ratio % 1);
      const waterY      = ratio <= 1 ? startY : startY + (pipeHeight - splitHeight);
      this.cell.rect(startX, waterY, pipeWidth, splitHeight);
      this.cell.fill(GameConstants.WATER_COLOR);
    }
  }
}