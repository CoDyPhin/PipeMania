// PixiJS imports
  
// Project imports
import { GameObject } from "./GameObject";
import { ObjectType } from "../helpers/Enums";
import { GridCellObject } from "./GridCellObject";
  
export class GridObject extends GameObject {
  private grid: Array<Array<GridCellObject>> = new Array();
  private size: number;

  constructor(id: number, size: number) {
    super(ObjectType.GRID, id);
    this.size = size;
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
}