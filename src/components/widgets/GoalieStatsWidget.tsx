import React from 'react';
import type { PlayerStat } from '../../types/widgets';
import { displayStat } from './utils';

interface GoalieStatsWidgetProps {
  stats: PlayerStat[];
  playersMap?: Record<string, string>;
  teamsMap?: Record<string, string>;
}

export const GoalieStatsWidget: React.FC<GoalieStatsWidgetProps> = ({ stats, playersMap, teamsMap }) => {
  // Filter for goalies and sort by wins descending
  const sortedStats = [...stats]
    .filter(s => s.is_goalie)
    .sort((a, b) => (b.wins || 0) - (a.wins || 0));

  return (
    <div className="overflow-x-auto my-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold p-4 bg-gray-800 text-white rounded-t-lg">Goalie Stats</h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3">GP</th>
            <th className="px-4 py-3">W</th>
            <th className="px-4 py-3">L</th>
            <th className="px-4 py-3">OT</th>
            <th className="px-4 py-3">GAA</th>
            <th className="px-4 py-3">SV%</th>
            <th className="px-4 py-3">SO</th>
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
                <td className="px-4 py-3 font-bold text-green-600">{displayStat(stat.wins)}</td>
                <td className="px-4 py-3">{displayStat(stat.losses)}</td>
                <td className="px-4 py-3">{displayStat(stat.ot_losses)}</td>
                <td className="px-4 py-3">{stat.gaa !== undefined && stat.gaa !== null ? stat.gaa.toFixed(2) : '-'}</td>
                <td className="px-4 py-3">{stat.sv_pct !== undefined && stat.sv_pct !== null ? stat.sv_pct.toFixed(3) : '-'}</td>
                <td className="px-4 py-3">{displayStat(stat.shutouts)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
