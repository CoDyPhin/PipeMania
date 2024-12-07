# PipeMania

Simplistic version of PipeMania.

- The game runs endlessly, by generating random levels. 
- The starting pipe (the pump) starts as yellow and it is only connected to one other cell. The water starts flowing from the center of that cell.
- There can be blocks, that are uninteractable by the user, represented in red.
- The user clicks on cells to place pipes, drawn from the queue on the left.
- After a short delay, water starts to flow.
- If the water is able to flow through a randomly generated number of "nodes", you win the game, and a new level is generated.
- If the water flows to a dead end, you lose the game, and a new level is generated.
- After the water starts flowing through a cell, you cannot change the pipe you placed on it.
- If there is still no water in the pipe, you can replace the one currently on the cell by re-clicking it.
- Be careful with how you connect cells! The water will prioritize the first connection that was made on the pipe where it flows! Plan accordingly!
- If there are no connections to that cell by the time the water flows through the middle of the pipe, it will choose its direction on the following priority: right, down, left, up.
- The timer represents the time remaining for the current cell's flow to end. Make sure to have a connection before the timer runs out!

There is a build dist of the game available on the branch /dist. This branch is hosted on my GitHub Page @ https://codyphin.github.io/PipeMania/ 
