// Project imports
import './style/style.css';
import { GameController } from './controllers/GameController';
import { GameView } from './views/GameView';

// Wait for the GameView to initialize
await GameView.getInstance().getInitPromise().then(() => {
    new GameController();
});