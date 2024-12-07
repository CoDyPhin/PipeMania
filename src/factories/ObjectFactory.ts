// Project imports
import { ObjectType }     from "../helpers/Enums";
import { GameObject }     from "../models/GameObject";
import { GridObject }     from "../models/GridObject";
import { GridCellObject } from "../models/GridCellObject";
import { PipeQueue }      from "../models/PipeQueue";
import { UIObject }       from "../models/UIObject";

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

  public static createPipeQueue(): GameObject {
    let currentID = ObjectFactory.objectIDMap.has(ObjectType.PIPEQUEUE) ? ObjectFactory.objectIDMap.get(ObjectType.PIPEQUEUE)! : 1;
    const object  = new PipeQueue(currentID);
    ObjectFactory.objectIDMap.set(ObjectType.PIPEQUEUE, ++currentID);

    return object;
  }

  public static createUI(): GameObject {
    let currentID = ObjectFactory.objectIDMap.has(ObjectType.UI) ? ObjectFactory.objectIDMap.get(ObjectType.UI)! : 1;
    const object  = new UIObject(currentID);
    ObjectFactory.objectIDMap.set(ObjectType.UI, ++currentID);

    return object;
  }
}