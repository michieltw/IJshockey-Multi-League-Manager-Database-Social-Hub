import React from 'react';
import type { PlayerStat } from '../../types/widgets';
import { displayStat } from './utils';

interface SkaterStatsWidgetProps {
  stats: PlayerStat[];
  playersMap?: Record<string, string>;
  teamsMap?: Record<string, string>;
}

export const SkaterStatsWidget: React.FC<SkaterStatsWidgetProps> = ({ stats, playersMap, teamsMap }) => {
  // Filter for non-goalies and sort by points descending
  const sortedStats = [...stats]
    .filter(s => !s.is_goalie)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div className="overflow-x-auto my-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold p-4 bg-gray-800 text-white rounded-t-lg">Skater Stats</h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3">GP</th>
            <th className="px-4 py-3">G</th>
            <th className="px-4 py-3">A</th>
            <th className="px-4 py-3">PTS</th>
            <th className="px-4 py-3">+/-</th>
            <th className="px-4 py-3">PIM</th>
            <th className="px-4 py-3">PPG</th>
            <th className="px-4 py-3">SHG</th>
            <th className="px-4 py-3">GWG</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((stat) => {
             const playerName = stat.player_name || (playersMap && playersMap[stat.person_id]) || stat.person_id;
             const teamName = stat.team_name || (teamsMap && stat.team_id_primary && teamsMap[stat.team_id_primary]) || stat.team_id_primary || '-';

            return (
              <tr key={stat.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{playerName}</td>
                <td className="px-4 py-3 text-gray-500">{teamName}</td>
                <td className="px-4 py-3">{displayStat(stat.gp)}</td>
                <td className="px-4 py-3">{displayStat(stat.goals)}</td>
                <td className="px-4 py-3">{displayStat(stat.assists)}</td>
                <td className="px-4 py-3 font-bold text-blue-600">{displayStat(stat.points)}</td>
                <td className="px-4 py-3">{displayStat(stat.plus_minus)}</td>
                <td className="px-4 py-3">{displayStat(stat.pim)}</td>
                <td className="px-4 py-3">{displayStat(stat.ppg)}</td>
                <td className="px-4 py-3">{displayStat(stat.shg)}</td>
                <td className="px-4 py-3">{displayStat(stat.gwg)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
