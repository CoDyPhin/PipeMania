export enum ObjectType {
  BASIC     = "Basic",
  GRID      = "Grid",
  GRID_CELL = "GridCell",
  PIPEQUEUE = "PipeQueue",
}

export enum PieceType {
  NONE,
  BLOCK,
  PIPE
}

export enum PipeConnections {
  NONE  = 0,
  RIGHT = 1 << 0,
  DOWN  = 1 << 1,
  LEFT  = 1 << 2,
  UP    = 1 << 3,
}