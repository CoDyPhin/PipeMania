export class Color {
    public static readonly WHITE:      number   = 0xFFFFFF;
    public static readonly BLACK:      number   = 0x000000;
    public static readonly RED:        number   = 0xFF0000;
    public static readonly GREEN:      number   = 0x00FF00;
    public static readonly BLUE:       number   = 0x0000FF;
    public static readonly YELLOW:     number   = 0xFFFF00;
    public static readonly ORANGE:     number   = 0xFFA500;
    public static readonly PURPLE:     number   = 0x800080;
    public static readonly PINK:       number   = 0xFFC0CB;
    public static readonly BROWN:      number   = 0xA52A2A;
    public static readonly GRAY:       number   = 0x808080;
    public static readonly LIGHT_GRAY: number   = 0xD3D3D3;
    public static readonly DARK_GRAY:  number   = 0xA9A9A9;
    public static readonly CYAN:       number   = 0x00FFFF;
    public static readonly MAGENTA:    number   = 0xFF00FF;
}

export class GameConstants {
  public static readonly GAME_WIDTH:       number  = window.innerWidth;
  public static readonly GAME_HEIGHT:      number  = window.innerHeight;
  public static readonly BACKGROUND_COLOR: number  = Color.LIGHT_GRAY;
  public static readonly RESIZE_TO_WINDOW: boolean = true;
  public static readonly MAX_FPS:          number  = 60;
  public static readonly GRID_COLS:        number  = 9;
  public static readonly GRID_ROWS:        number  = 7;
  public static readonly GRID_CELL_BORDER: number  = 0.1;
  public static readonly GRID_SIZE:        number  = 0.6;
  public static readonly PIPE_SIZE:        number  = 0.25;
  
}
