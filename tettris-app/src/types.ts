export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type CellValue = TetrominoType | null;

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
}

export type GameState = 'start' | 'playing' | 'paused' | 'gameOver';

export interface GameStats {
  score: number;
  level: number;
  lines: number;
}


