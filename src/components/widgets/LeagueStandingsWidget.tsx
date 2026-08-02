import React from 'react';
import type { TeamStanding } from '../../types/widgets';
import { displayStat } from './utils';

interface LeagueStandingsWidgetProps {
  standings: TeamStanding[];
  teamsMap?: Record<string, string>;
}

export const LeagueStandingsWidget: React.FC<LeagueStandingsWidgetProps> = ({ standings, teamsMap }) => {
  // Sort primarily by current_rank (if available), then fallback to pts, then goal difference
  const sortedStandings = [...standings].sort((a, b) => {
     if (a.current_rank !== undefined && b.current_rank !== undefined) {
         return a.current_rank - b.current_rank;
     }
     const ptsDiff = (b.pts || 0) - (a.pts || 0);
     if (ptsDiff !== 0) return ptsDiff;
     return (b.diff || 0) - (a.diff || 0);
  });

  return (
    <div className="overflow-x-auto my-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold p-4 bg-gray-800 text-white rounded-t-lg">League Standings</h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-4 py-3">RK</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3">GP</th>
            <th className="px-4 py-3">W</th>
            <th className="px-4 py-3">L</th>
            <th className="px-4 py-3">OT</th>
            <th className="px-4 py-3">PTS</th>
            <th className="px-4 py-3">RW</th>
            <th className="px-4 py-3">ROW</th>
            <th className="px-4 py-3">GF</th>
            <th className="px-4 py-3">GA</th>
            <th className="px-4 py-3">DIFF</th>
            <th className="px-4 py-3">L10</th>
            <th className="px-4 py-3">STRK</th>
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((team, index) => {
            const teamName = team.team_name || (teamsMap && teamsMap[team.team_id]) || team.team_id;
            return (
              <tr key={team.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{team.current_rank ?? index + 1}</td>
                <td className="px-4 py-3 font-semibold">{teamName}</td>
                <td className="px-4 py-3">{displayStat(team.gp)}</td>
                <td className="px-4 py-3">{displayStat(team.w)}</td>
                <td className="px-4 py-3">{displayStat(team.l)}</td>
                <td className="px-4 py-3">{displayStat(team.ot)}</td>
                <td className="px-4 py-3 font-bold text-blue-600">{displayStat(team.pts)}</td>
                <td className="px-4 py-3">{displayStat(team.rw)}</td>
                <td className="px-4 py-3">{displayStat(team.row)}</td>
                <td className="px-4 py-3">{displayStat(team.gf)}</td>
                <td className="px-4 py-3">{displayStat(team.ga)}</td>
                <td className="px-4 py-3">{displayStat(team.diff)}</td>
                <td className="px-4 py-3">{displayStat(team.last_10)}</td>
                <td className="px-4 py-3">{displayStat(team.streak)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
