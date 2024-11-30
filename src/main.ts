// Project imports
import './style/style.css';
import { GameController } from './controllers/GameController';
import { GameView } from './views/GameView';
import { GameScene } from './views/scenes/GameScene';

// Wait for the GameView to initialize
await GameView.getInstance().getInitPromise().then(() => {
    new GameController();
    new GameScene();
});