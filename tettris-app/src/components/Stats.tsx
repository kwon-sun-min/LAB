import { GameStats } from '../types';

interface StatsProps {
  stats: GameStats;
}

export const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 space-y-3">
      <div>
        <h3 className="text-xs text-gray-500 uppercase mb-1">Score</h3>
        <p className="text-2xl font-bold text-white">{stats.score.toLocaleString()}</p>
      </div>
      <div>
        <h3 className="text-xs text-gray-500 uppercase mb-1">Level</h3>
        <p className="text-2xl font-bold text-white">{stats.level}</p>
      </div>
      <div>
        <h3 className="text-xs text-gray-500 uppercase mb-1">Lines</h3>
        <p className="text-2xl font-bold text-white">{stats.lines}</p>
      </div>
    </div>
  );
};


