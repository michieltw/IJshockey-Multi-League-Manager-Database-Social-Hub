import React from 'react';

// === Types based on Firebase NoSQL Schemas ===

export interface TeamStanding {
  id: string;
  season_id: string;
  league_id: string;
  team_id: string; // Used for lookup or could be pre-populated
  team_name?: string; // Optional if we pass a pre-populated name, otherwise use lookup
  current_rank?: number;
  gp?: number;
  w?: number;
  l?: number;
  ot?: number;
  pts?: number;
  rw?: number;
  row?: number;
  gf?: number;
  ga?: number;
  diff?: number;
  last_10?: string;
  streak?: string;
}

export interface PlayerStat {
  id: string;
  person_id: string;
  player_name?: string;
  team_id_primary?: string;
  team_name?: string;
  is_goalie: boolean;
  gp?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plus_minus?: number;
  pim?: number;
  ppg?: number;
  shg?: number;
  gwg?: number;
  wins?: number;
  losses?: number;
  ot_losses?: number;
  gaa?: number;
  sv_pct?: number;
  shutouts?: number;
}

export interface GameBoxscorePlayerStat {
  person_id?: string;
  player_name?: string;
  jersey_number?: string | number;
  goals?: number;
  assists?: number;
  pim?: number;
}

export interface GameBoxscore {
  id: string;
  status?: string;
  home_team_id?: string;
  home_team_name?: string;
  away_team_id?: string;
  away_team_name?: string;
  home_team_score?: number;
  away_team_score?: number;
  home_team_player_stats?: GameBoxscorePlayerStat[];
  away_team_player_stats?: GameBoxscorePlayerStat[];
}

export interface PlayerCareerStat extends PlayerStat {
  // Essentially the same fields, just representing all-time totals
}

// Helper to display fallback for missing data
const displayStat = (value: number | string | undefined | null): React.ReactNode => {
  if (value === undefined || value === null) {
    return '-';
  }
  return value;
};

// === 1. League Standings Widget ===
interface LeagueStandingsWidgetProps {
  standings: TeamStanding[];
  teamsMap?: Record<string, string>; // Optional lookup map for team names: { 'TEAM_1': 'Tigers' }
}

export const LeagueStandingsWidget: React.FC<LeagueStandingsWidgetProps> = ({ standings, teamsMap }) => {
  // Logic: Sort by current_rank
  const sortedStandings = [...standings].sort((a, b) => {
    const rankA = a.current_rank ?? 999;
    const rankB = b.current_rank ?? 999;
    return rankA - rankB;
  });

  return (
    <div className="overflow-x-auto my-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold p-4 bg-gray-800 text-white rounded-t-lg">League Standings</h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3" title="Games Played">GP</th>
            <th className="px-4 py-3" title="Wins">W</th>
            <th className="px-4 py-3" title="Losses">L</th>
            <th className="px-4 py-3" title="Overtime Losses">OT</th>
            <th className="px-4 py-3 font-bold" title="Points">PTS</th>
            <th className="px-4 py-3" title="Regulation Wins">RW</th>
            <th className="px-4 py-3" title="Regulation + Overtime Wins">ROW</th>
            <th className="px-4 py-3" title="Goals For">GF</th>
            <th className="px-4 py-3" title="Goals Against">GA</th>
            <th className="px-4 py-3" title="Goal Differential">DIFF</th>
            <th className="px-4 py-3" title="Last 10 Games">L10</th>
            <th className="px-4 py-3" title="Streak">STRK</th>
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

// === 2. Skater Stats Widget ===
interface SkaterStatsWidgetProps {
  stats: PlayerStat[];
  playersMap?: Record<string, string>;
  teamsMap?: Record<string, string>;
}

export const SkaterStatsWidget: React.FC<SkaterStatsWidgetProps> = ({ stats, playersMap, teamsMap }) => {
  // Logic: Filter ONLY is_goalie === false
  const skaterStats = stats.filter(stat => stat.is_goalie === false);

  // Sort by points descending as default for a topscorer list
  const sortedStats = [...skaterStats].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

  return (
    <div className="overflow-x-auto my-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold p-4 bg-gray-800 text-white rounded-t-lg">Skater Stats (Top Scorers)</h2>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3">GP</th>
            <th className="px-4 py-3">G</th>
            <th className="px-4 py-3">A</th>
            <th className="px-4 py-3 font-bold">PTS</th>
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

// === 3. Goalie Stats Widget ===
interface GoalieStatsWidgetProps {
  stats: PlayerStat[];
  playersMap?: Record<string, string>;
  teamsMap?: Record<string, string>;
}

export const GoalieStatsWidget: React.FC<GoalieStatsWidgetProps> = ({ stats, playersMap, teamsMap }) => {
  // Logic: Filter ONLY is_goalie === true
  const goalieStats = stats.filter(stat => stat.is_goalie === true);

  // Sort by Wins descending as a basic default
  const sortedStats = [...goalieStats].sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0));

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

// === 4. Game Boxscore Widget ===
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


// === 5. Player Profile Header ===
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
