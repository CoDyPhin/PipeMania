// PixiJS imports
import { Graphics as PIXIGraphics } from "pixi.js";

// Project imports
import { Color } from "../helpers/GameConstants";
import { GridCellObject } from "../models/GridCellObject";
import { GameView } from "./GameView";

export class GridCellView {
  private cell:        PIXIGraphics;
    
  private xSize:       number;
  private ySize:       number;
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
    this.objModel.x    = this.objModel.col * this.xSize * GameView.getInstance().getApp().renderer.width;
    this.objModel.y    = this.objModel.row * this.ySize * GameView.getInstance().getApp().renderer.height;
    
    const finalX       = this.xSize * canvasWidth;
    const finalY       = this.ySize * canvasHeight;
    const xBorder      = finalX * this.border; 
    const yBorder      = finalY * this.border;
  
    this.cell.rect(0, 0, finalX, finalY);
    this.cell.fill(this.borderColor);
    this.cell.rect(0 + xBorder, 0 + yBorder, finalX - 2 * xBorder, finalY - 2 * yBorder);
    this.cell.fill(this.fillColor);
    this.objModel.getPiece().drawPiece(this.cell, finalX, finalY);
  }
}