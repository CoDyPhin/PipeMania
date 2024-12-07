// PixiJS imports
import {
    Text as PIXIText
} from 'pixi.js';

// Project imports
import { GameView }         from './GameView';
import { UIObject }         from '../models/UIObject';
import { GameConstants }    from '../helpers/GameConstants';

export class UIView {
  private uiModel:       UIObject;
  private timerText:     PIXIText;
  private nodesLeftText: PIXIText;
  private endGameText:   PIXIText;

  constructor(uiModel: UIObject) {
    this.uiModel       = uiModel;
    this.timerText     = new PIXIText();
    this.nodesLeftText = new PIXIText();
    this.endGameText   = new PIXIText();
  }

  public drawUI(): void {
    this.timerText.destroy();
    this.nodesLeftText.destroy();
    this.endGameText.destroy();

    const app          = GameView.getInstance().getApp();
    const canvasHeight = app.renderer.height;
    const canvasWidth  = app.renderer.width;
    this.uiModel.x     = GameConstants.UI_SIZE * canvasWidth;
    this.uiModel.y     = GameConstants.UI_SIZE * canvasHeight;

    const fontSize  = GameConstants.UI_SIZE / 2 * Math.min(canvasHeight, canvasWidth) * 0.5;
    const timer     = this.uiModel.getTimer();
    const nodesLeft = this.uiModel.getNodesLeft();
    this.timerText  = new PIXIText({text: "Time Left: " + timer, style: {fontSize: fontSize}});
    this.uiModel.addChild(this.timerText);

    this.nodesLeftText   = new PIXIText({text: "Nodes left: " + nodesLeft, style: {fontSize: fontSize}});
    this.nodesLeftText.y = GameConstants.UI_SIZE * canvasHeight;
    this.uiModel.addChild(this.nodesLeftText);

    this.endGameText   = new PIXIText({text: this.uiModel.getEndGameStr(), style: {fontSize: fontSize}});
    this.endGameText.y = GameConstants.UI_SIZE * canvasHeight * 2;
    this.uiModel.addChild(this.endGameText);
  }

}