// PixiJS imports
import {
    Application as PIXIApplication,
    Ticker      as PIXITicker
} from 'pixi.js';

// Project imports
import { 
    GameConstants 
} from '../helpers/GameConstants';

export class GameView {
  private static instance: GameView;
  
  private app:             PIXIApplication;
  private initPromise:     Promise<void>;

  private constructor() {
    this.app         = new PIXIApplication();
    this.initPromise = this.app.init({ 
        width:            GameConstants.DEFAULT_GAME_WIDTH, 
        height:           GameConstants.DEFAULT_GAME_HEIGHT, 
        backgroundColor:  GameConstants.DEFAULT_BACKGROUND_COLOR,
        // By using resizeTo: window we're not maintaining aspect ratio. This may reduce the visual quality of the game
        resizeTo:         window
      }).then(() => {
          document.body.appendChild(this.app.canvas);
          console.log("Canvas initialized!");
        }).catch((error) => {
          console.error("Failed to initialize Canvas:", error);
        });
  }

  public static getInstance(): GameView {
    if (!GameView.instance) GameView.instance = new GameView();
    return GameView.instance;
  }

  public getTicker(): PIXITicker {
    return this.app.ticker;
  }

  public getInitPromise(): Promise<void> {
    return this.initPromise;
  }
}