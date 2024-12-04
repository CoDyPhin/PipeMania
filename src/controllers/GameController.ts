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
  private gridController: GridController;
  private startedFlow:    boolean = false;
  private elapsedTime:    number  = 0;
  private goalNodesN:     number  = 0;

  constructor() {
    const ticker = GameView.getInstance().getApp().ticker;
    ticker.add(this.update.bind(this));
    ticker.maxFPS = GameConstants.MAX_FPS;
    this.gridController = new GridController();
    this.startGame();
  }

  private update(ticker: PIXITicker): void {
    ObjectManager.getInstance().update(ticker);
    // Since there are no animations, we can use lastTime to determine elapsed time
    this.elapsedTime += ticker.deltaMS/1000;
    if (!this.startedFlow && this.elapsedTime > GameConstants.WATER_FLOW_START_SECONDS) {
      this.startedFlow = true;
    }
    const elapsedFlowTime = this.elapsedTime - GameConstants.WATER_FLOW_START_SECONDS;
    if (this.startedFlow) {
      const currentNodesN = this.gridController.flowWater(elapsedFlowTime);
      const gameWon = currentNodesN === this.goalNodesN;
      if (gameWon || currentNodesN == -1) {
        this.handleGameEnd(gameWon);
      }
    }
  }

  private startGame(): void {
    this.startedFlow    = false;
    this.elapsedTime    = 0;
    this.goalNodesN     = Math.floor(Math.random() * (GameConstants.MAXIMUM_PATH_LENGTH - GameConstants.MINIMUM_PATH_LENGTH));
    this.goalNodesN     += GameConstants.MINIMUM_PATH_LENGTH;
    this.gridController.onGameStart();
    console.log("Game Started!");
    console.log("Goal Nodes: " + this.goalNodesN);
  }

  private handleGameEnd(gameWon: boolean): void {
    if(gameWon) console.log("You Win!");
    else console.log("You Lose!");
    this.startGame();
  }
}