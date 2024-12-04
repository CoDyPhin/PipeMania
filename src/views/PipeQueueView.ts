// PixiJS imports
import { Graphics as PIXIGraphics,
         Text as PIXIText
} from 'pixi.js';

// Project imports
import { GameConstants }    from '../helpers/GameConstants';
import { PipeConnections }  from '../helpers/Enums';
import { PipeQueue }        from '../models/PipeQueue';
import { GameView }         from './GameView';

export class PipeQueueView {
  private pipeQueue: PipeQueue;
  private queueView: PIXIGraphics;
  private upNextMsg: PIXIText;

  constructor(pipeQueue: PipeQueue) {
    this.pipeQueue = pipeQueue;
    this.queueView = new PIXIGraphics();
    this.pipeQueue.addChild(this.queueView);
    this.upNextMsg = new PIXIText();
  }

  public drawPipeQueue(): void {
    this.queueView.clear();
    this.upNextMsg.destroy();

    const app             = GameView.getInstance().getApp();
    const canvasWidth     = app.renderer.width;
    const canvasHeight    = app.renderer.height;
    
    const pipeQueueWidth  = canvasWidth  * GameConstants.PIPE_QUEUE_SIZE;
    const pipeQueueHeight = canvasHeight * GameConstants.PIPE_QUEUE_SIZE;
    const pipeCellWidth   = pipeQueueWidth / GameConstants.N_PIPES_IN_QUEUE;
    const pipeCellHeight  = pipeQueueHeight / GameConstants.N_PIPES_IN_QUEUE;
    
    const xBorder         = pipeCellWidth  * GameConstants.PIPE_QUEUE_BORDER_SIZE;
    const yBorder         = pipeCellHeight * GameConstants.PIPE_QUEUE_BORDER_SIZE;
    
    const fontSize   = pipeCellHeight * 0.5;
    this.upNextMsg   = new PIXIText({text: "<- Up next", style: {fontSize: fontSize}});
    this.upNextMsg.x = pipeCellWidth;
    this.pipeQueue.addChild(this.upNextMsg);

    this.pipeQueue.getQueue().forEach((pipe, index) => {
      const cellY   = index * pipeCellHeight;
      const centerX = pipeCellWidth  / 2;
      const centerY = pipeCellHeight / 2;
      this.queueView.rect(0, cellY, pipeCellWidth, pipeCellHeight);
      this.queueView.fill(GameConstants.PIPE_QUEUE_BORDER_COLOR);

      this.queueView.rect(0 + xBorder, cellY + yBorder, pipeCellWidth - 2 * xBorder, pipeCellHeight - 2 * yBorder);
      this.queueView.fill(GameConstants.PIPE_QUEUE_BG_COLOR);

      if (pipe.getPipeConnections() & PipeConnections.LEFT) {
        const pipeHeight = GameConstants.PIPE_SIZE * pipeCellHeight;
        const startY     = (pipeCellHeight - pipeHeight) / 2;
        this.queueView.rect(0, cellY + startY, centerX, pipeHeight);
        this.queueView.fill(GameConstants.PIPE_COLOR);
      }
      if (pipe.getPipeConnections() & PipeConnections.RIGHT) {
        const pipeHeight = GameConstants.PIPE_SIZE * pipeCellHeight;
        const startY     = (pipeCellHeight - pipeHeight) / 2;
        this.queueView.rect(centerX, cellY + startY, centerX, pipeHeight);
        this.queueView.fill(GameConstants.PIPE_COLOR);
      }
      if (pipe.getPipeConnections() & PipeConnections.UP) {
        const pipeWidth = GameConstants.PIPE_SIZE * pipeCellWidth;
        const startX    = (pipeCellWidth - pipeWidth) / 2;
        this.queueView.rect(startX, cellY, pipeWidth, centerY);
        this.queueView.fill(GameConstants.PIPE_COLOR);
      }
      if (pipe.getPipeConnections() & PipeConnections.DOWN) {
        const pipeWidth = GameConstants.PIPE_SIZE * pipeCellWidth;
        const startX    = (pipeCellWidth - pipeWidth) / 2;
        this.queueView.rect(startX, centerY + cellY, pipeWidth, centerY);
        this.queueView.fill(GameConstants.PIPE_COLOR);
      }
    });
  }
}