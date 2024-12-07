export enum ObjectType {
  GRID      = "Grid",
  GRID_CELL = "GridCell",
  PIPEQUEUE = "PipeQueue",
  UI        = "UI"
}

export enum PieceType {
  NONE,
  BLOCK,
  PIPE
}

export enum PipeConnections {
  NONE  = 0,
  RIGHT = 1 << 0, // 1
  DOWN  = 1 << 1, // 2
  LEFT  = 1 << 2, // 4
  UP    = 1 << 3, // 8
}