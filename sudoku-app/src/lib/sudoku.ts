export type Cell = {
    value: number;
    fixed: boolean;
    notes: number[];
};

export type Board = Cell[][];

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

const BLANK = 0;

export function generateSudoku(difficulty: Difficulty): { puzzle: Board; solution: number[][] } {
    const solution = generateFullBoard();
    // Deep copy solution for puzzle generation because removeNumbers mutates? 
    // actually removeNumbers creates new Board structure from number[][].
    const puzzle = removeNumbers(solution, difficulty);
    return { puzzle, solution };
}

// Deprecated or keep for compatibility if needed, but better to remove to force usage of new one
export function generateBoard(difficulty: Difficulty): Board {
    return generateSudoku(difficulty).puzzle;
}

function generateFullBoard(): number[][] {
    const board = Array.from({ length: 9 }, () => Array(9).fill(BLANK));
    fillBoard(board);
    return board;
}

function fillBoard(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === BLANK) {
                const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (const num of nums) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) return true;
                        board[row][col] = BLANK;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (board[row][c] === num) return false;
    }
    // Check col
    for (let r = 0; r < 9; r++) {
        if (board[r][col] === num) return false;
    }
    // Check 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[startRow + r][startCol + c] === num) return false;
        }
    }
    return true;
}

function removeNumbers(solvedBoard: number[][], difficulty: Difficulty): Board {
    const board: Board = solvedBoard.map(row =>
        row.map(val => ({ value: val, fixed: true, notes: [] }))
    );

    let attempts = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 45 : 55;
    while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        while (!board[row][col].fixed) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        board[row][col].fixed = false;
        board[row][col].value = BLANK;
        attempts--;
    }

    // Ensure unique solution? For simplicity in this version, we trust the count-based removal.
    // A robust implementation would check for uniqueness.

    return board;
}

function shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function checkCompletion(board: Board): boolean {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c].value === BLANK) return false;
        }
    }
    // Verify correctness
    // Re-verify the whole board to be sure
    const numBoard = board.map(r => r.map(c => c.value));
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = numBoard[r][c];
            numBoard[r][c] = BLANK;
            if (!isValid(numBoard, r, c, val)) return false;
            numBoard[r][c] = val;
        }
    }
    return true;
}

export function isMoveValid(board: Board, row: number, col: number, num: number): boolean {
    const numBoard = board.map(r => r.map(c => c.value));
    return isValid(numBoard, row, col, num);
}
