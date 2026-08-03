export interface TeamStanding {
  id: string;
  team_id: string;
  season_id: string;
  team_name?: string;
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
  current_rank?: number; // Pre-calculated tie-breaker rank
}

export interface PlayerStat {
  id: string;
  person_id: string;
  season_id: string;
  team_id_primary?: string;
  player_name?: string;
  team_name?: string;
  is_goalie?: boolean;
  gp?: number;
  // Skater fields
  goals?: number;
  assists?: number;
  points?: number;
  plus_minus?: number;
  pim?: number;
  ppg?: number;
  shg?: number;
  gwg?: number;
  // Goalie fields
  wins?: number;
  losses?: number;
  ot_losses?: number;
  gaa?: number;
  sv_pct?: number;
  shutouts?: number;
}

export interface PlayerCareerStat extends PlayerStat {
  career_years?: number;
}

export interface GameBoxscorePlayerStat {
  person_id?: string;
  player_name?: string;
  jersey_number?: string;
  goals?: number;
  assists?: number;
  pim?: number;
}

export interface GameBoxscore {
  id: string;
  game_id: string;
  status: 'Scheduled' | 'InProgress' | 'Final';
  home_team_id?: string;
  away_team_id?: string;
  home_team_name?: string;
  away_team_name?: string;
  home_team_score?: number;
  away_team_score?: number;
  home_team_player_stats?: GameBoxscorePlayerStat[];
  away_team_player_stats?: GameBoxscorePlayerStat[];
}
