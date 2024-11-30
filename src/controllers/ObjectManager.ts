// PixiJS imports
import {
  Ticker as PIXITicker,
} from 'pixi.js';

// Project imports
import { GameView } from '../views/GameView';
import { GameObject } from '../models/GameObject';
import { ObjectType } from '../helpers/Enums';
import { ObjectFactory } from '../factories/ObjectFactory';


export class ObjectManager {
  private static instance: ObjectManager;
  private objectMap:       Map<string, GameObject>;

  private constructor() {
    this.objectMap = new Map();
  }

  public static getInstance(): ObjectManager {
    if (!ObjectManager.instance) ObjectManager.instance = new ObjectManager();
    return ObjectManager.instance;
  }

  public update(ticker: PIXITicker): void {
    this.objectMap.forEach(object => {
      if (object.isActive()) object.update(ticker);
    });
  }

  public createObject(objectType: ObjectType = ObjectType.BASIC, activate : boolean = true): GameObject {
    const object = ObjectFactory.createObject(objectType);
    if (this.objectMap.has(object.getUId())){
      console.log(`Object already exists, updating it: ${object.getUId()}`);
      this.deleteObject(object.getUId());
    }
    this.objectMap.set(object.getUId(), object);
    if (activate) this.activateObject(object.getUId());
    return object;
  }

  public activateObject(objectID: string): void {
    let object = this.objectMap.get(objectID);
    if (!object || object.isActive()) return;
    GameView.getInstance().getApp().stage.addChild(object!);
    object!.onActivate();
  }

  public deactivateObject(objectID: string): void {
    let object = this.objectMap.get(objectID);
    if (!object || !object.isActive()) return;
    object.onDeactivate();
    GameView.getInstance().getApp().stage.removeChild(object);
  }

  public deleteObject(objectID: string) : void {
    let object = this.objectMap.get(objectID);
    if (!object) return;
    this.objectMap.delete(objectID);
    object.destroy();
  }

  public deactivateAllObjects() : void {
    this.objectMap.forEach(object => this.deactivateObject(object.getUId()));
  }

  public deleteAllObjects() : void {
    this.objectMap.forEach(object => this.deleteObject(object.getUId()));
    this.objectMap.clear();
  }
}