import React from 'react';
import type { GameBoxscore, GameBoxscorePlayerStat } from '../../types/widgets';
import { displayStat } from './utils';

interface GameBoxscoreWidgetProps {
  game: GameBoxscore;
  teamsMap?: Record<string, string>;
}

export const GameBoxscoreWidget: React.FC<GameBoxscoreWidgetProps> = ({ game, teamsMap }) => {
  const homeName = game.home_team_name || (teamsMap && game.home_team_id && teamsMap[game.home_team_id]) || game.home_team_id || 'Home';
  const awayName = game.away_team_name || (teamsMap && game.away_team_id && teamsMap[game.away_team_id]) || game.away_team_id || 'Away';

  const renderPlayerTable = (players?: GameBoxscorePlayerStat[], teamName?: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold p-2 bg-gray-100">{teamName} Players</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Player Name</th>
            <th className="px-4 py-2">G</th>
            <th className="px-4 py-2">A</th>
            <th className="px-4 py-2">PTS</th>
            <th className="px-4 py-2">PIM</th>
          </tr>
        </thead>
        <tbody>
          {(players || []).map((p, idx) => (
            <tr key={p.person_id || idx} className="border-b">
              <td className="px-4 py-2">{displayStat(p.jersey_number)}</td>
              <td className="px-4 py-2 font-semibold">{p.player_name || p.person_id || 'Unknown'}</td>
              <td className="px-4 py-2">{displayStat(p.goals)}</td>
              <td className="px-4 py-2">{displayStat(p.assists)}</td>
              <td className="px-4 py-2 font-bold">{displayStat((p.goals || 0) + (p.assists || 0))}</td>
              <td className="px-4 py-2">{displayStat(p.pim)}</td>
            </tr>
          ))}
          {(!players || players.length === 0) && (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">No player stats available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="my-4 bg-white shadow-md rounded-lg p-6 border border-gray-200">
      {/* Meta Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div className="flex flex-col items-center w-1/3">
          <span className="text-xl font-bold">{homeName}</span>
          <span className="text-sm text-gray-500">Home</span>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <span className="text-3xl font-black">{displayStat(game.home_team_score)} - {displayStat(game.away_team_score)}</span>
          <span className="text-xs uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 font-bold">{game.status || 'Final'}</span>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <span className="text-xl font-bold">{awayName}</span>
          <span className="text-sm text-gray-500">Away</span>
        </div>
      </div>

      {/* Roster Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {renderPlayerTable(game.home_team_player_stats, homeName)}
        </div>
        <div>
          {renderPlayerTable(game.away_team_player_stats, awayName)}
        </div>
      </div>
    </div>
  );
};
