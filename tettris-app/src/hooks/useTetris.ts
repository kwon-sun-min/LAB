import { useState, useEffect, useCallback, useRef } from 'react';
import { Tetromino, Position, GameState, GameStats, TetrominoType } from '../types';
import { TETROMINOES, INITIAL_DROP_INTERVAL, DROP_INTERVAL_DECREASE, SCORE_PER_LEVEL } from '../constants';
import {
  createEmptyBoard,
  checkCollision,
  placeTetromino,
  clearLines,
  calculateGhostPosition,
  rotateMatrix,
  rotateMatrixCounterClockwise,
  getRandomTetromino,
} from '../utils';

export const useTetris = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 });
  const [nextTetromino, setNextTetromino] = useState<TetrominoType>(getRandomTetromino());
  const [heldTetromino, setHeldTetromino] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [gameState, setGameState] = useState<GameState>('start');
  const [stats, setStats] = useState<GameStats>({ score: 0, level: 1, lines: 0 });
  const [finalStats, setFinalStats] = useState<GameStats>({ score: 0, level: 1, lines: 0 });
  const [dropInterval, setDropInterval] = useState(INITIAL_DROP_INTERVAL);
  
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentShapeRef = useRef<number[][]>([]);
  const nextTetrominoRef = useRef<TetrominoType>(nextTetromino);

  // Update ref when nextTetromino changes
  useEffect(() => {
    nextTetrominoRef.current = nextTetromino;
  }, [nextTetromino]);

  // Initialize new piece
  const spawnNewPiece = useCallback((type?: TetrominoType) => {
    // Use provided type, or fall back to nextTetromino from ref
    const pieceType = type ?? nextTetrominoRef.current;
    const tetromino = TETROMINOES[pieceType];
    const startX = Math.floor((10 - tetromino.shape[0].length) / 2);
    const startY = 0;
    
    setCurrentTetromino(tetromino);
    setCurrentPosition({ x: startX, y: startY });
    currentShapeRef.current = tetromino.shape;
    
    // Only update nextTetromino if we're not using a held piece
    if (!type) {
      setNextTetromino(getRandomTetromino());
    }
    
    // Reset canHold when a new piece spawns (after lock)
    setCanHold(true);
    
    // Check game over
    if (checkCollision(board, tetromino, { x: startX, y: startY })) {
      // Preserve final stats before game over
      setFinalStats(stats);
      setGameState('gameOver');
      return false;
    }
    
    return true;
  }, [board, stats]);

  // Move piece
  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    if (!currentTetromino || gameState !== 'playing') return;
    
    const newPosition = {
      x: currentPosition.x + deltaX,
      y: currentPosition.y + deltaY,
    };
    
    const tetrominoWithCurrentShape: Tetromino = {
      ...currentTetromino,
      shape: currentShapeRef.current,
    };
    
    if (!checkCollision(board, tetrominoWithCurrentShape, newPosition)) {
      setCurrentPosition(newPosition);
      return true;
    }
    
    return false;
  }, [board, currentTetromino, currentPosition, gameState]);

  // Rotate piece
  const rotatePiece = useCallback((clockwise: boolean = true) => {
    if (!currentTetromino || gameState !== 'playing') return;
    
    const rotatedShape = clockwise
      ? rotateMatrix(currentShapeRef.current)
      : rotateMatrixCounterClockwise(currentShapeRef.current);
    
    const rotatedTetromino: Tetromino = {
      ...currentTetromino,
      shape: rotatedShape,
    };
    
    // Try to place rotated piece
    if (!checkCollision(board, rotatedTetromino, currentPosition)) {
      currentShapeRef.current = rotatedShape;
      setCurrentTetromino(rotatedTetromino);
      return true;
    }
    
    // Try wall kicks (shift left/right)
    const kicks = [-1, 1, -2, 2];
    for (const kick of kicks) {
      const kickPosition = { x: currentPosition.x + kick, y: currentPosition.y };
      if (!checkCollision(board, rotatedTetromino, kickPosition)) {
        currentShapeRef.current = rotatedShape;
        setCurrentTetromino(rotatedTetromino);
        setCurrentPosition(kickPosition);
        return true;
      }
    }
    
    return false;
  }, [board, currentTetromino, currentPosition, gameState]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentTetromino || gameState !== 'playing') return;
    
    const tetrominoWithCurrentShape: Tetromino = {
      ...currentTetromino,
      shape: currentShapeRef.current,
    };
    
    const ghostPos = calculateGhostPosition(board, tetrominoWithCurrentShape, currentPosition);
    const dropDistance = ghostPos.y - currentPosition.y;
    
    // Lock piece
    const newBoard = placeTetromino(board, tetrominoWithCurrentShape, ghostPos);
    setBoard(newBoard);
    
    // Clear lines and update score
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    
    if (linesCleared > 0) {
      setStats(prev => {
        const newLines = prev.lines + linesCleared;
        const points = [0, 100, 300, 500, 800][linesCleared] || 0;
        const dropBonus = dropDistance * 2;
        const newScore = prev.score + points + dropBonus;
        const newLevel = Math.floor(newScore / SCORE_PER_LEVEL) + 1;
        
        return {
          score: newScore,
          level: newLevel,
          lines: newLines,
        };
      });
    }
    
    // Spawn next piece
    spawnNewPiece();
  }, [board, currentTetromino, currentPosition, gameState, spawnNewPiece]);

  // Hold piece
  const holdPiece = useCallback(() => {
    // Check conditions: must have current piece, can hold, and game must be playing
    if (!currentTetromino || !canHold || gameState !== 'playing') {
      return;
    }
    
    const typeToHold = currentTetromino.type;
    
    if (heldTetromino === null) {
      // First hold: move current piece to hold, spawn next piece
      setHeldTetromino(typeToHold);
      spawnNewPiece(); // Will use nextTetromino from ref
    } else {
      // Swap: exchange current piece with held piece
      setHeldTetromino(typeToHold);
      spawnNewPiece(heldTetromino); // Spawn the held piece at top center
    }
    
    // Lock the hold ability for this turn
    setCanHold(false);
  }, [currentTetromino, canHold, heldTetromino, gameState, spawnNewPiece]);

  // Drop piece automatically
  useEffect(() => {
    if (gameState !== 'playing' || !currentTetromino) {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      return;
    }
    
    dropTimerRef.current = setInterval(() => {
      const moved = movePiece(0, 1);
      
      if (!moved) {
        // Lock piece
        const tetrominoWithCurrentShape: Tetromino = {
          ...currentTetromino,
          shape: currentShapeRef.current,
        };
        
        const newBoard = placeTetromino(board, tetrominoWithCurrentShape, currentPosition);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);
        
        if (linesCleared > 0) {
          setStats(prev => {
            const newLines = prev.lines + linesCleared;
            const points = [0, 100, 300, 500, 800][linesCleared] || 0;
            const newScore = prev.score + points;
            const newLevel = Math.floor(newScore / SCORE_PER_LEVEL) + 1;
            
            return {
              score: newScore,
              level: newLevel,
              lines: newLines,
            };
          });
        }
        
        spawnNewPiece();
      }
    }, dropInterval);
    
    return () => {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
      }
    };
  }, [gameState, currentTetromino, board, currentPosition, movePiece, spawnNewPiece, dropInterval]);

  // Update drop interval based on level
  useEffect(() => {
    const newInterval = Math.max(
      50,
      INITIAL_DROP_INTERVAL * Math.pow(1 - DROP_INTERVAL_DECREASE, stats.level - 1)
    );
    setDropInterval(newInterval);
  }, [stats.level]);

  // Start game
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setStats({ score: 0, level: 1, lines: 0 });
    setHeldTetromino(null);
    setCanHold(true);
    setGameState('playing');
    spawnNewPiece();
  }, [spawnNewPiece]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  // Get current shape (synced with ref)
  const currentShape = currentTetromino ? currentShapeRef.current : null;

  // Get ghost position
  const ghostPosition = currentTetromino && gameState === 'playing' && currentShape
    ? calculateGhostPosition(
        board,
        { ...currentTetromino, shape: currentShape },
        currentPosition
      )
    : null;

  return {
    board,
    currentTetromino,
    currentShape,
    currentPosition,
    nextTetromino,
    heldTetromino,
    canHold,
    gameState,
    stats,
    finalStats,
    ghostPosition,
    movePiece,
    rotatePiece,
    hardDrop,
    holdPiece,
    startGame,
    togglePause,
  };
};

