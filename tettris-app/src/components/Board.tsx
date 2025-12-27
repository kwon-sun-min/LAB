import { Cell } from './Cell';
import { CellValue, Tetromino, Position } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../constants';

interface BoardProps {
  board: CellValue[][];
  currentTetromino: Tetromino | null;
  currentShape: number[][] | null;
  currentPosition: Position;
  ghostPosition: Position | null;
  ghostTetrominoType: CellValue;
}

export const Board = ({
  board,
  currentTetromino,
  currentShape,
  currentPosition,
  ghostPosition,
  ghostTetrominoType,
}: BoardProps) => {
  const renderBoard = () => {
    const displayBoard: CellValue[][] = board.map(row => [...row]);
    const ghostCells: Map<string, CellValue> = new Map();
    
    // Place ghost piece first (so current piece renders on top)
    if (ghostPosition && currentTetromino && currentShape && ghostTetrominoType) {
      for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
          if (currentShape[y][x]) {
            const boardX = ghostPosition.x + x;
            const boardY = ghostPosition.y + y;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH &&
              displayBoard[boardY][boardX] === null
            ) {
              ghostCells.set(`${boardY}-${boardX}`, ghostTetrominoType);
            }
          }
        }
      }
    }
    
    // Place current piece
    if (currentTetromino && currentShape) {
      const { type } = currentTetromino;
      for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
          if (currentShape[y][x]) {
            const boardX = currentPosition.x + x;
            const boardY = currentPosition.y + y;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = type;
            }
          }
        }
      }
    }
    
    return { displayBoard, ghostCells };
  };

  const { displayBoard, ghostCells } = renderBoard();

  return (
    <div className="bg-black p-2 rounded-lg border-2 border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-10 gap-0">
        {displayBoard.map((row, y) =>
          row.map((cell, x) => {
            const cellKey = `${y}-${x}`;
            const isGhost = ghostCells.has(cellKey);
            const cellValue = isGhost ? ghostCells.get(cellKey)! : cell;
            return (
              <Cell
                key={cellKey}
                value={cellValue}
                isGhost={isGhost}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

