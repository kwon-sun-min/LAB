import { CellValue } from '../types';
import { TETROMINOES } from '../constants';

interface CellProps {
  value: CellValue;
  isGhost?: boolean;
}

// Helper function to convert hex to rgba for glow effect
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const Cell = ({ value, isGhost = false }: CellProps) => {
  const color = value ? TETROMINOES[value].color : null;
  
  // Retro Ghost Piece: Wireframe/Hologram Style
  if (isGhost && color) {
    const glowColor = hexToRgba(color, 0.8);
    return (
      <div
        className="w-6 h-6 bg-transparent border-[3px]"
        style={{
          borderColor: color,
          boxShadow: `0 0 6px ${glowColor}, inset 0 0 3px ${glowColor}`,
        }}
      />
    );
  }
  
  // Empty cell: Faint dark border on pitch-black background
  if (!value) {
    return (
      <div className="w-6 h-6 border border-gray-800 bg-black" />
    );
  }
  
  // Retro Placed Block: Solid 8-bit pixel style with beveled edge
  return (
    <div
      className="w-6 h-6 border-2 relative"
      style={{
        backgroundColor: color,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset -1px -1px 0 rgba(0, 0, 0, 0.5)',
      }}
    />
  );
};


