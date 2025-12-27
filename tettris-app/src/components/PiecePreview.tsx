import { TetrominoType } from '../types';
import { TETROMINOES } from '../constants';
import { Cell } from './Cell';

interface PiecePreviewProps {
  type: TetrominoType | null;
  label: string;
  disabled?: boolean;
}

export const PiecePreview = ({ type, label, disabled = false }: PiecePreviewProps) => {
  if (!type) {
    return (
      <div className={`bg-gray-900 rounded-lg p-4 border border-gray-700 ${disabled ? 'opacity-50' : ''}`}>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">{label}</h3>
        <div className="flex items-center justify-center h-20 text-gray-600">
          <span className="text-xs">Empty</span>
        </div>
      </div>
    );
  }

  const tetromino = TETROMINOES[type];
  const size = tetromino.shape.length;

  return (
    <div className={`bg-gray-900 rounded-lg p-4 border border-gray-700 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">{label}</h3>
      <div className="flex items-center justify-center">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
          }}
        >
          {tetromino.shape.map((row, y) =>
            row.map((cell, x) => (
              <Cell
                key={`${y}-${x}`}
                value={cell ? type : null}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};


