import React from 'react';
import type { Board } from '../lib/sudoku';
import { SudokuCell } from './SudokuCell';

interface Props {
    board: Board;
    selectedPos: { row: number; col: number } | null;
    onCellClick: (row: number, col: number) => void;
    initialBoard: Board | null; // To check validity against solution if we had it, or just consistency
}

export const SudokuBoard: React.FC<Props> = ({ board, selectedPos, onCellClick }) => {

    // Helper to check if a cell is related (same row, col, block) to selected
    const isRelated = (r: number, c: number) => {
        if (!selectedPos) return false;
        if (selectedPos.row === r) return true;
        if (selectedPos.col === c) return true;

        const startRow = Math.floor(selectedPos.row / 3) * 3;
        const startCol = Math.floor(selectedPos.col / 3) * 3;
        if (r >= startRow && r < startRow + 3 && c >= startCol && c < startCol + 3) return true;

        return false;
    };

    return (
        <div className="sudoku-board">
            {board.map((row, r) => (
                <div key={r} className="row">
                    {row.map((cell, c) => (
                        <SudokuCell
                            key={`${r}-${c}`}
                            cell={cell}
                            row={r}
                            col={c}
                            isSelected={selectedPos?.row === r && selectedPos?.col === c}
                            isRelated={isRelated(r, c)}
                            onClick={onCellClick}
                            isError={false} // TODO: Add error checking logic
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};
