// PixiJS imports
import {
    Application as PIXIApplication,
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
        width:            GameConstants.GAME_WIDTH, 
        height:           GameConstants.GAME_HEIGHT, 
        backgroundColor:  GameConstants.BACKGROUND_COLOR,
        // By using resizeTo: window we're not maintaining aspect ratio. This may reduce the visual quality of the game
        resizeTo :        GameConstants.RESIZE_TO_WINDOW ? window : undefined
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

  public getApp(): PIXIApplication {
    return this.app;
  }

  public getInitPromise(): Promise<void> {
    return this.initPromise;
  }
}