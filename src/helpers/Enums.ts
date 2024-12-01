export enum ObjectType {
  BASIC    = "Basic",
  GRID    = "Grid",
  GRID_CELL = "GridCell"
}

export enum PieceType {
  NONE,
  BLOCK,
  PUMP, // Start Pipe
  PIPE
}

export enum PipeConnections {
  NONE  = 0,
  UP    = 1 << 0,
  RIGHT = 1 << 1,
  DOWN  = 1 << 2,
  LEFT  = 1 << 3,
}

export enum SceneID {
  MAIN_MENU,
  GAME,
  SETTINGS_MENU
}
