// PixiJS imports
import { 
    Ticker as PIXITicker
} from 'pixi.js';

// Project imports
// View
import { GameView } from '../views/GameView';
// Controller
import { ObjectManager } from './ObjectManager';
import { GridController } from './GridController';
// Helpers
import { GameConstants } from '../helpers/GameConstants';

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