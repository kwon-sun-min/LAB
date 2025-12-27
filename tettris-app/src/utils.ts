import { Position, Tetromino, CellValue } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

export const createEmptyBoard = (): CellValue[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

export const rotateMatrix = (matrix: number[][]): number[][] => {
  const N = matrix.length;
  const rotated: number[][] = Array(N).fill(null).map(() => Array(N).fill(0));
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[j][N - 1 - i] = matrix[i][j];
    }
  }
  
  return rotated;
};

export const rotateMatrixCounterClockwise = (matrix: number[][]): number[][] => {
  const N = matrix.length;
  const rotated: number[][] = Array(N).fill(null).map(() => Array(N).fill(0));
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[N - 1 - j][i] = matrix[i][j];
    }
  }
  
  return rotated;
};

export const checkCollision = (
  board: CellValue[][],
  tetromino: Tetromino,
  position: Position
): boolean => {
  const { shape } = tetromino;
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = position.x + x;
        const boardY = position.y + y;
        
        // Check boundaries
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return true;
        }
        
        // Check collision with existing blocks (only check if within board bounds)
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return true;
        }
      }
    }
  }
  
  return false;
};

export const placeTetromino = (
  board: CellValue[][],
  tetromino: Tetromino,
  position: Position
): CellValue[][] => {
  const newBoard = board.map(row => [...row]);
  const { shape, type } = tetromino;
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = position.x + x;
        const boardY = position.y + y;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = type;
        }
      }
    }
  }
  
  return newBoard;
};

export const clearLines = (board: CellValue[][]): { newBoard: CellValue[][]; linesCleared: number } => {
  const newBoard: CellValue[][] = [];
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    const isFullLine = board[y].every(cell => cell !== null);
    
    if (!isFullLine) {
      newBoard.unshift([...board[y]]);
    } else {
      linesCleared++;
    }
  }
  
  // Add empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared };
};

export const calculateGhostPosition = (
  board: CellValue[][],
  tetromino: Tetromino,
  position: Position
): Position => {
  let ghostY = position.y;
  
  while (!checkCollision(board, tetromino, { x: position.x, y: ghostY + 1 })) {
    ghostY++;
  }
  
  return { x: position.x, y: ghostY };
};

export const getRandomTetromino = (): TetrominoType => {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  return types[Math.floor(Math.random() * types.length)];
};


