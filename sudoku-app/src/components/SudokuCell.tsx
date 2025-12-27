import React from 'react';
import type { Cell } from '../lib/sudoku';

interface Props {
    cell: Cell;
    row: number;
    col: number;
    isSelected: boolean;
    isRelated: boolean; // Same row, col, or block
    onClick: (row: number, col: number) => void;
    isError: boolean;
}

export const SudokuCell: React.FC<Props> = ({ cell, row, col, isSelected, isRelated, onClick, isError }) => {
    const handleClick = () => onClick(row, col);

    let className = "cell";
    if (cell.fixed) className += " fixed";
    if (isSelected) className += " selected";
    else if (isRelated) className += " related";
    if (isError) className += " error";

    // Highlighting same numbers could be a nice feature to add later

    return (
        <div className={className} onClick={handleClick}>
            {cell.value !== 0 ? (
                <span className="value">{cell.value}</span>
            ) : (
                <div className="notes">
                    {cell.notes.map(n => <span key={n} className={`note note-${n}`}>{n}</span>)}
                </div>
            )}
        </div>
    );
};
