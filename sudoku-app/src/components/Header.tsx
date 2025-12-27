import React from 'react';
import type { Difficulty } from '../lib/sudoku';

interface Props {
    difficulty: Difficulty;
    onChangeDifficulty: (d: Difficulty) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    timer: number;
}

export const Header: React.FC<Props> = ({ difficulty, onChangeDifficulty, theme, toggleTheme, timer }) => {
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <header className="header">
            <div className="top-bar">
                <h1>Sudoku</h1>
                <div className="header-actions">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? (
                            // Minimal Moon Icon
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        ) : (
                            // Minimal Sun Icon
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <div className="info-bar">
                <select
                    value={difficulty}
                    onChange={(e) => onChangeDifficulty(e.target.value as Difficulty)}
                    className="difficulty-select"
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <div className="timer">{formatTime(timer)}</div>
            </div>
        </header>
    );
};
