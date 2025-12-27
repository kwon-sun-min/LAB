import { useState, useEffect, useCallback } from 'react';
import { generateSudoku, type Board, type Difficulty, checkCompletion } from './lib/sudoku';
import { SudokuBoard } from './components/SudokuBoard';
import { Controls } from './components/Controls';
import { Header } from './components/Header';
import './index.css';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [board, setBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]); // To track fixed cells effectively or restart
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedPos, setSelectedPos] = useState<{ row: number; col: number } | null>(null);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [history, setHistory] = useState<Board[]>([]); // For undo
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark for premium feel
  const [isWon, setIsWon] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Initialize Game
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    const { puzzle, solution } = generateSudoku(diff);
    // Deep copy for initial state to key off 'fixed'
    setBoard(JSON.parse(JSON.stringify(puzzle)));
    setInitialBoard(JSON.parse(JSON.stringify(puzzle)));
    setSolution(solution);
    setHistory([]);
    setTimer(0);
    setIsActive(true);
    setIsWon(false);
    setSelectedPos(null);
    setHintsRemaining(3);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: any;
    if (isActive && !isWon) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon]);

  // Handle cell click
  const onCellClick = (row: number, col: number) => {
    setSelectedPos({ row, col });
  };

  // Helper to check validity (duplicate check)
  const isMoveValid = (board: Board, row: number, col: number, num: number) => {
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c].value === num) return false;
    }
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col].value === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if ((startRow + r !== row || startCol + c !== col) &&
          board[startRow + r][startCol + c].value === num) return false;
      }
    }
    return true;
  };

  const onClear = () => {
    // Clear all user inputs
    if (isWon) return;

    const newHistory = [...history, JSON.parse(JSON.stringify(board))];
    setHistory(newHistory);

    const newBoard = board.map(row =>
      row.map(cell => {
        if (!cell.fixed) {
          return { ...cell, value: 0, notes: [] };
        }
        return cell;
      })
    );
    setBoard(newBoard);
  };

  // Handle Number Input
  const onNumberClick = (num: number) => {
    if (!selectedPos || isWon) return;
    const { row, col } = selectedPos;
    if (board[row][col].fixed) return;

    // Save history
    // We need deep copy of board
    const newHistory = [...history, JSON.parse(JSON.stringify(board))];
    if (newHistory.length > 20) newHistory.shift(); // Limit history
    setHistory(newHistory);

    const newBoard = [...board];
    const cell = newBoard[row][col];

    if (isNoteMode) {
      if (cell.notes.includes(num)) {
        cell.notes = cell.notes.filter(n => n !== num);
      } else {
        cell.notes = [...cell.notes, num].sort();
      }
    } else {
      // Check for duplicate
      if (!isMoveValid(newBoard, row, col, num)) {
        alert("duplicate number");
        return;
      }

      cell.value = num;
      cell.notes = [];

      // Check for completion
      if (checkCompletion(newBoard)) {
        setIsWon(true);
        setIsActive(false);
      }
    }
    setBoard(newBoard);
  };

  const onErase = () => {
    if (!selectedPos || isWon) return;
    const { row, col } = selectedPos;
    if (board[row][col].fixed) return;

    const newHistory = [...history, JSON.parse(JSON.stringify(board))];
    setHistory(newHistory);

    const newBoard = [...board];
    newBoard[row][col].value = 0;
    setBoard(newBoard);
  };

  const onUndo = () => {
    if (history.length === 0 || isWon) return;
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory(history.slice(0, -1));
  };

  const onHint = () => {
    if (isWon || !isActive || hintsRemaining <= 0) return;

    // Find all empty cells
    const emptyPos: { r: number, c: number }[] = [];
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.value === 0) {
          emptyPos.push({ r, c });
        }
      });
    });

    if (emptyPos.length === 0) return;

    // Pick random
    const idx = Math.floor(Math.random() * emptyPos.length);
    const { r, c } = emptyPos[idx];
    const val = solution[r][c];

    // Update
    const newHistory = [...history, JSON.parse(JSON.stringify(board))];
    setHistory(newHistory);
    const newBoard = [...board];
    newBoard[r][c].value = val;
    newBoard[r][c].notes = [];

    setBoard(newBoard);
    setHintsRemaining(prev => prev - 1);

    // Select it
    setSelectedPos({ row: r, col: c });

    // Check completion
    if (checkCompletion(newBoard)) {
      setIsWon(true);
      setIsActive(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || isWon) return;

      if (e.key >= '1' && e.key <= '9') {
        onNumberClick(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        onErase();
      } else if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        onUndo();
      } else if (e.key === 'n') {
        setIsNoteMode(prev => !prev);
      } else if (e.key === 'h') { // Shortcut for hint
        onHint();
      } else if (e.key.startsWith('Arrow')) {
        // Handle navigation
        setSelectedPos(prev => {
          if (!prev) return { row: 0, col: 0 };
          let { row, col } = prev;
          if (e.key === 'ArrowUp') row = Math.max(0, row - 1);
          if (e.key === 'ArrowDown') row = Math.min(8, row + 1);
          if (e.key === 'ArrowLeft') col = Math.max(0, col - 1);
          if (e.key === 'ArrowRight') col = Math.min(8, col + 1);
          return { row, col };
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isWon, selectedPos, isNoteMode, board, history, solution, hintsRemaining]); // Dep dependencies need care

  return (
    <div className={`app-container ${isWon ? 'won' : ''}`}>
      <Header
        difficulty={difficulty}
        onChangeDifficulty={(d) => { setDifficulty(d); startNewGame(d); }}
        theme={theme}
        toggleTheme={toggleTheme}
        timer={timer}
      />

      <main className="main-content">
        <SudokuBoard
          board={board}
          selectedPos={selectedPos}
          onCellClick={onCellClick}
          initialBoard={initialBoard}
        />
        <Controls
          onNumberClick={onNumberClick}
          onErase={onErase}
          onNoteModeToggle={() => setIsNoteMode(!isNoteMode)}
          isNoteMode={isNoteMode}
          onUndo={onUndo}
          onNewGame={() => startNewGame()}
          onHint={onHint}
          hintsRemaining={hintsRemaining}
          onClear={onClear}
        />
      </main>

      {isWon && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Complete!</h2>
            <p>Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
            <button onClick={() => startNewGame()}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
