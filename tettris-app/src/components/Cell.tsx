import { CellValue } from '../types';
import { TETROMINOES } from '../constants';

interface CellProps {
  value: CellValue;
  isGhost?: boolean;
}

export const Cell = ({ value, isGhost = false }: CellProps) => {
  const color = value ? TETROMINOES[value].color : null;
  
  return (
    <div
      className={`w-6 h-6 border border-gray-800 ${
        isGhost
          ? 'opacity-40 border-dashed border-2'
          : value
          ? 'border-gray-600'
          : 'bg-gray-900'
      }`}
      style={{
        backgroundColor: value ? color : undefined,
        opacity: isGhost && color ? 0.4 : undefined,
      }}
    />
  );
};


