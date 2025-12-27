import React from 'react';

interface Props {
    onNumberClick: (num: number) => void;
    onErase: () => void;
    onNoteModeToggle: () => void;
    isNoteMode: boolean;
    onUndo: () => void;
    onNewGame: () => void;
    onHint: () => void;
    hintsRemaining: number;
    onClear: () => void;
}

export const Controls: React.FC<Props> = ({
    onNumberClick,
    onErase,
    onNoteModeToggle,
    isNoteMode,
    onUndo,
    onNewGame,
    onHint,
    hintsRemaining,
    onClear
}) => {
    return (
        <div className="controls">
            <div className="numpad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button key={num} onClick={() => onNumberClick(num)} className="num-btn">
                        {num}
                    </button>
                ))}
            </div>
            <div className="actions">
                <button onClick={onUndo} className="action-btn">Undo</button>
                <button onClick={onErase} className="action-btn">Erase</button>
                <button
                    onClick={onNoteModeToggle}
                    className={`action-btn ${isNoteMode ? 'active' : ''}`}
                >
                    Note {isNoteMode ? 'On' : 'Off'}
                </button>
                <button
                    onClick={onHint}
                    className="action-btn"
                    disabled={hintsRemaining <= 0}
                    style={{ opacity: hintsRemaining <= 0 ? 0.5 : 1 }}
                >
                    Hint ({hintsRemaining}/3)
                </button>
                <button onClick={onClear} className="action-btn" style={{ color: 'var(--accent)' }}>Clear</button>
                <button onClick={onNewGame} className="action-btn primary">New Game</button>
            </div>
        </div>
    );
};
