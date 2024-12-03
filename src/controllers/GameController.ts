// PixiJS imports
import { 
    Ticker as PIXITicker
} from 'pixi.js';

// Project imports
import { GameView }       from '../views/GameView';
import { ObjectManager }  from './ObjectManager';
import { GridController } from './GridController';
import { GameConstants }  from '../helpers/GameConstants';

export class GameController {

  constructor() {
    const ticker = GameView.getInstance().getApp().ticker;
    ticker.add(this.update.bind(this));
    ticker.maxFPS = GameConstants.MAX_FPS;
    new GridController();
  }

  private update(ticker: PIXITicker): void {
    ObjectManager.getInstance().update(ticker);
  }
}