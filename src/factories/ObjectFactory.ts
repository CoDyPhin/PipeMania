// Project imports
import { ObjectType }     from "../helpers/Enums";
import { GameObject }     from "../models/GameObject";
import { GridObject }     from "../models/GridObject";
import { GridCellObject } from "../models/GridCellObject";

export class ObjectFactory {
  private static objectIDMap: Map<ObjectType, number> = new Map();

  public static createGrid(screenFraction: number): GameObject {
    let currentID = ObjectFactory.objectIDMap.has(ObjectType.GRID) ? ObjectFactory.objectIDMap.get(ObjectType.GRID)! : 1;
    const object  = new GridObject(currentID, screenFraction);
    ObjectFactory.objectIDMap.set(ObjectType.GRID, ++currentID);
    return object;
  }

  public static createGridCell(col: number, row: number, mainGrid: GridObject): GameObject {
    let currentID = ObjectFactory.objectIDMap.has(ObjectType.GRID_CELL) ? ObjectFactory.objectIDMap.get(ObjectType.GRID_CELL)! : 1;
    const object  = new GridCellObject(currentID, col, row, mainGrid);
    ObjectFactory.objectIDMap.set(ObjectType.GRID_CELL, ++currentID);
    return object;
  }
}