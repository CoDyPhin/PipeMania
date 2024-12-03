// PixiJS imports
import {
  Ticker as PIXITicker,
} from 'pixi.js';

// Project imports
import { GameView }   from '../views/GameView';
import { GameObject } from '../models/GameObject';

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

  public addObject(object: GameObject): void {
    if (this.objectMap.has(object.getUId())){
      console.log(`Object already exists, updating it: ${object.getUId()}`);
      this.deleteObject(object.getUId());
    }
    this.objectMap.set(object.getUId(), object);
    this.activateObject(object.getUId(), true);
  }

  public activateObject(objectID: string, isNewObj = false): void {
    let object = this.objectMap.get(objectID);
    if (!object || object.isActive()) {
      if (!isNewObj) return;
      GameView.getInstance().getApp().stage.addChild(object!);
      object!.onActivate();
    }
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