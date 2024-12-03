// PixiJS imports
import { 
    Container as PIXIContainer,
    Ticker    as PIXITicker 
} from 'pixi.js';

// Project imports
import { ObjectType } from '../helpers/Enums';

export class GameObject extends PIXIContainer {
  private readonly typeId: ObjectType;
  private readonly id:     number;
  private active:          boolean;

  constructor(pType: ObjectType, pID : number) {
    super();
    this.typeId = pType;
    this.id     = pID;
    this.active = true;
  }

  public onActivate(): void {
    this.active = true;
  }

  public onDeactivate(): void {
    this.active = false;
  }

  public isActive(): boolean {
    return this.active;
  }

  public getType(): ObjectType {
    return this.typeId;
  }

  public getUId(): string {
    return `${this.typeId}-${this.id}`;
  }

  public destroy(): void {
    this.removeChildren();
  }

  public update(_: PIXITicker): void {
    if (!this.isActive()) return;
  }
}