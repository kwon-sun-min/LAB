import { useEffect } from 'react';
import { useTetris } from '../hooks/useTetris';
import { Board } from './Board';
import { PiecePreview } from './PiecePreview';
import { Stats } from './Stats';

export const Game = () => {
  const {
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
  } = useTetris();

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'start' || gameState === 'gameOver') {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      if (gameState === 'paused') {
        if (e.key === 'p' || e.key === ' ') {
          togglePause();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece(0, 1); // Soft Drop
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece(true); // Clockwise
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'q':
        case 'Q':
          e.preventDefault();
          holdPiece();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, movePiece, rotatePiece, hardDrop, holdPiece, startGame, togglePause]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {gameState === 'start' && (
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold mb-8">TETRIS</h1>
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Controls</h2>
              <div className="text-left space-y-2 text-sm">
                <p><kbd className="bg-gray-800 px-2 py-1 rounded">←</kbd> Move Left</p>
                <p><kbd className="bg-gray-800 px-2 py-1 rounded">→</kbd> Move Right</p>
                <p><kbd className="bg-gray-800 px-2 py-1 rounded">↑</kbd> Rotate Clockwise</p>
                <p><kbd className="bg-gray-800 px-2 py-1 rounded">↓</kbd> Soft Drop</p>
                <p><kbd className="bg-gray-800 px-2 py-1 rounded">Space</kbd> Hard Drop</p>
                <p><kbd className="bg-gray-800 px-2 py-1 rounded">Q</kbd> Hold Piece</p>
                <p><kbd className="bg-gray-800 px-2 py-1 rounded">P</kbd> Pause</p>
              </div>
              <button
                onClick={startGame}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold mb-4">Game Over</h1>
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 max-w-md mx-auto">
              <Stats stats={finalStats} />
              <button
                onClick={startGame}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
            {/* Left Sidebar */}
            <div className="w-full md:w-48 space-y-4 order-2 md:order-1">
              <PiecePreview type={heldTetromino} label="Hold" disabled={!canHold} />
              <Stats stats={stats} />
            </div>

            {/* Game Board */}
            <div className="flex-1 order-1 md:order-2 relative">
              <div className="relative">
                <Board
                  board={board}
                  currentTetromino={currentTetromino}
                  currentShape={currentShape}
                  currentPosition={currentPosition}
                  ghostPosition={ghostPosition}
                  ghostTetrominoType={currentTetromino?.type || null}
                />
              </div>
              {gameState === 'paused' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10 rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">PAUSED</h2>
                    <p className="text-gray-400">Press P or Space to resume</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-full md:w-48 space-y-4 order-3">
              <PiecePreview type={nextTetromino} label="Next" />
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <button
                  onClick={togglePause}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  {gameState === 'paused' ? 'Resume' : 'Pause'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

