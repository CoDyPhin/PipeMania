// PixiJS imports
import { 
    Ticker as PIXITicker
} from 'pixi.js';

// Project imports
import { GameView } from '../views/GameView';
import { GameConstants } from '../helpers/GameConstants';

export class GameController {

  constructor() {
    const ticker = GameView.getInstance().getTicker();
    ticker.add(this.update.bind(this));
    ticker.maxFPS = GameConstants.DEFAULT_MAX_FPS; 
  }

  private update(ticker: PIXITicker): void {
    console.log("Game is updating. DeltaTime (ms):", ticker.deltaTime);
  }
}