// PixiJS imports
  
// Project imports
import { GameObject }     from "./GameObject";
import { ObjectType }     from "../helpers/Enums";
import { GridCellObject } from "./GridCellObject";
import { GameView }       from "../views/GameView";
  
export class GridObject extends GameObject {
  private grid: Array<Array<GridCellObject>> = new Array();
  private size: number;

  constructor(id: number, size: number) {
    super(ObjectType.GRID, id);
    this.size = size;
    this.x = (1 - this.size) * GameView.getInstance().getApp().renderer.width;
  }

  public onResize(): void {
    this.x = (1 - this.size) * GameView.getInstance().getApp().renderer.width;
  }

  public getViewSize(): number {
    return this.size;
  }

  public getGrid(): Array<Array<GridCellObject>> {
    return this.grid;
  }

  public setGrid(grid: Array<Array<GridCellObject>>): void {
    this.grid = grid;
  }

  public getCell(col: number, row: number): GridCellObject {
    return this.grid[row][col];
  }

  public addConnection(col1: number, row1: number, col2: number, row2: number): void {
    this.grid[row1][col1].connect(this.grid[row2][col2]);
  }

  public removeConnection(col1: number, row1: number, col2: number, row2: number): void {
    this.grid[row1][col1].disconnect(this.grid[row2][col2]);
  }
}