// PixiJS imports
import { 
    Ticker as PIXITicker
} from 'pixi.js';

// Project imports
import { GameView }       from '../views/GameView';
import { ObjectManager }  from './ObjectManager';
import { GridController } from './GridController';
import { GameConstants }  from '../helpers/GameConstants';
import { ObjectFactory }  from '../factories/ObjectFactory';
import { UIObject }       from '../models/UIObject';
import { UIView }         from '../views/UIView';


export class GameController {
  private gridController: GridController;
  private uiModel:        UIObject;
  private uiView:         UIView;
  private startedFlow:    boolean = false;
  private elapsedTime:    number  = 0;
  private goalNodesN:     number  = 0;
  private timeLeft:       number  = 0;

  constructor() {
    const ticker  = GameView.getInstance().getApp().ticker;
    ticker.maxFPS = GameConstants.MAX_FPS;
    ticker.add(this.update.bind(this));

    this.gridController = new GridController();

    const uiObj         = ObjectFactory.createUI();
    this.uiModel        = uiObj as UIObject;
    ObjectManager.getInstance().addObject(uiObj);
    this.uiView         = new UIView(this.uiModel);
    this.startGame();
  }

  private update(ticker: PIXITicker): void {
    ObjectManager.getInstance().update(ticker);
    // Since there are no animations, we can use lastTime to determine elapsed time
    this.elapsedTime += ticker.deltaMS/1000;
    let timeLeft      = this.timeLeft - this.elapsedTime;

    if (!this.startedFlow && this.elapsedTime > GameConstants.WATER_FLOW_START_SECONDS) {
      this.startedFlow = true;
    }

    const elapsedFlowTime = this.elapsedTime - GameConstants.WATER_FLOW_START_SECONDS;
    if (this.startedFlow) {
      const currentNodesN = this.gridController.flowWater(elapsedFlowTime);
      if (this.uiModel.getNodesLeft() !== this.goalNodesN - currentNodesN) {
        this.timeLeft += GameConstants.WATER_FLOW_INTERVAL;
        this.uiModel.setNodesLeft(this.goalNodesN - currentNodesN);
      }
      const gameWon = currentNodesN === this.goalNodesN;
      if (gameWon || currentNodesN == -1) {
        this.handleGameEnd(gameWon);
      }
    }
    
    this.uiModel.setTimer(Math.ceil(timeLeft));
    this.uiView.drawUI();
  }

  private startGame(): void {
    this.startedFlow    = false;
    this.elapsedTime    = 0;
    this.timeLeft       = GameConstants.WATER_FLOW_INTERVAL / 2 + GameConstants.WATER_FLOW_START_SECONDS; + 1
    this.goalNodesN     = Math.floor(Math.random() * (GameConstants.MAXIMUM_PATH_LENGTH - GameConstants.MINIMUM_PATH_LENGTH));
    this.goalNodesN     += GameConstants.MINIMUM_PATH_LENGTH;

    this.uiModel.setNodesLeft(this.goalNodesN);
    this.uiModel.setTimer(GameConstants.WATER_FLOW_START_SECONDS);
    this.gridController.onGameStart();
    this.uiView.drawUI();
  }

  private handleGameEnd(gameWon: boolean): void {
    if (gameWon) this.uiModel.setEndGameStr("You Won!");
    else         this.uiModel.setEndGameStr("You Lost!");

    this.startGame();
  }
}