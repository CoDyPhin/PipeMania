// Project imports
import { GameConstants } from '../helpers/GameConstants';
import { Pipe } from './Pipe';
import { GameObject } from './GameObject';
import { ObjectType } from '../helpers/Enums';

export class PipeQueue extends GameObject{
  private pipeQ: Array<Pipe> = new Array<Pipe>();

  constructor(id: number) {
    super(ObjectType.PIPEQUEUE, id);
    this.initQueue();
  }

  private initQueue(): void {
    for (let i = 0; i < GameConstants.N_PIPES_IN_QUEUE; i++) {
      this.pipeQ.push(this.generateRandomPipe());
    }
  }

  private refillQueue(): void {
    this.pipeQ.push(this.generateRandomPipe());
  }

  public getNextPipe(): Pipe {
    const pipe = this.pipeQ.shift();
    if (!pipe) throw new Error('PipeQueue: PipeQueue is empty');
    this.refillQueue();
    return pipe;
  }

  public getQueue(): Array<Pipe> {
    return this.pipeQ;
  }

  private generateRandomPipe(): Pipe {
    let bitmask = (1 << GameConstants.N_DIRECTIONS) - 1;
    const bitsToFlip = Math.floor(Math.random() * (GameConstants.N_DIRECTIONS - 1));
    for (let i = 0; i < bitsToFlip; i++) {
      const randomBit = Math.floor(Math.random() * GameConstants.N_DIRECTIONS);
      bitmask &= ~(1 << randomBit);
    }
    return new Pipe(bitmask);
  }

}