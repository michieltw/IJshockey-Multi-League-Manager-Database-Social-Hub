import React from 'react';
import type { PlayerStat, PlayerCareerStat } from '../../types/widgets';
import { displayStat } from './utils';

interface PlayerProfileHeaderWidgetProps {
  currentSeasonStats: PlayerStat;
  careerStats: PlayerCareerStat;
  playerName?: string;
}

export const PlayerProfileHeaderWidget: React.FC<PlayerProfileHeaderWidgetProps> = ({ currentSeasonStats, careerStats, playerName }) => {
  const isGoalie = currentSeasonStats.is_goalie;
  const name = playerName || currentSeasonStats.player_name || currentSeasonStats.person_id || 'Player';

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-4 border border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Left side: Avatar/Name */}
      <div className="flex flex-col items-center justify-center w-48 shrink-0">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold mb-4">
          {name.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-center">{name}</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1">
          {isGoalie ? 'Goalie' : 'Skater'}
        </span>
      </div>

      {/* Right side: Stats Comparison */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Season */}
        <div className="bg-blue-50 p-4 rounded border border-blue-100">
          <h3 className="text-sm font-bold uppercase text-blue-800 mb-2 border-b border-blue-200 pb-1">Current Season</h3>
          {isGoalie ? (
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">GP:</span> <span className="font-semibold">{displayStat(currentSeasonStats.gp)}</span></div>
                <div><span className="text-gray-500">W:</span> <span className="font-semibold">{displayStat(currentSeasonStats.wins)}</span></div>
                <div><span className="text-gray-500">GAA:</span> <span className="font-semibold">{currentSeasonStats.gaa !== undefined && currentSeasonStats.gaa !== null ? currentSeasonStats.gaa.toFixed(2) : '-'}</span></div>
                <div><span className="text-gray-500">SV%:</span> <span className="font-semibold">{currentSeasonStats.sv_pct !== undefined && currentSeasonStats.sv_pct !== null ? currentSeasonStats.sv_pct.toFixed(3) : '-'}</span></div>
             </div>
          ) : (
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">GP:</span> <span className="font-semibold">{displayStat(currentSeasonStats.gp)}</span></div>
                <div><span className="text-gray-500">G:</span> <span className="font-semibold">{displayStat(currentSeasonStats.goals)}</span></div>
                <div><span className="text-gray-500">A:</span> <span className="font-semibold">{displayStat(currentSeasonStats.assists)}</span></div>
                <div><span className="text-gray-500">PTS:</span> <span className="font-bold text-blue-700">{displayStat(currentSeasonStats.points)}</span></div>
             </div>
          )}
        </div>

        {/* Career Stats */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-sm font-bold uppercase text-gray-700 mb-2 border-b border-gray-300 pb-1">Career Totals</h3>
          {isGoalie ? (
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">GP:</span> <span className="font-semibold">{displayStat(careerStats.gp)}</span></div>
                <div><span className="text-gray-500">W:</span> <span className="font-semibold">{displayStat(careerStats.wins)}</span></div>
                <div><span className="text-gray-500">SO:</span> <span className="font-semibold">{displayStat(careerStats.shutouts)}</span></div>
             </div>
          ) : (
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">GP:</span> <span className="font-semibold">{displayStat(careerStats.gp)}</span></div>
                <div><span className="text-gray-500">G:</span> <span className="font-semibold">{displayStat(careerStats.goals)}</span></div>
                <div><span className="text-gray-500">A:</span> <span className="font-semibold">{displayStat(careerStats.assists)}</span></div>
                <div><span className="text-gray-500">PTS:</span> <span className="font-bold">{displayStat(careerStats.points)}</span></div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
