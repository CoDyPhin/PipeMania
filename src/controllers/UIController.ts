// Project imports
import { ObjectFactory } from '../factories/ObjectFactory';
import { ObjectManager } from './ObjectManager';
import { GameConstants } from '../helpers/GameConstants';
import { UIObject }      from '../models/UIObject';
import { UIView }        from '../views/UIView';


export class UIController {
  private uiModel: UIObject;
  private uiView:  UIView;
  
  constructor() {
    const uiObj  = ObjectFactory.createGrid(GameConstants.GRID_SIZE);
    this.uiModel = uiObj as UIObject;
    ObjectManager.getInstance().addObject(uiObj);
    this.uiView = new UIView(this.uiModel);
  }
}