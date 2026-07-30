import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Topbar from '../components/Topbar';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import SeedButton from '../components/SeedButton';

type Team = { id: string; name: string; division: string; color: string };
type Game = { homeTeamId: string; awayTeamId: string; homeScore: number; awayScore: number; isOvertime: boolean };
type Settings = { pointsForWin: number; pointsForLoss: number; pointsForOTLoss: number };

type TeamStats = {
  team: Team;
  gp: number; w: number; l: number; ot: number; pts: number;
  gf: number; ga: number; diff: number;
};

export default function Standings() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [settings, setSettings] = useState<Settings>({ pointsForWin: 2, pointsForLoss: 0, pointsForOTLoss: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const compSnap = await getDoc(doc(db, 'competitions', 'COMP_001'));
        if (compSnap.exists() && compSnap.data().settings) {
          setSettings(compSnap.data().settings);
        }

        const teamsSnap = await getDocs(collection(db, 'teams'));
        setTeams(teamsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Team)));

        const gamesSnap = await getDocs(collection(db, 'games'));
        setGames(gamesSnap.docs.map(d => d.data() as Game));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const topNav = [
    { label: 'Standings', to: '/competitie/standen' },
    { label: 'Playoffs', to: '/competitie/playoffs' },
    { label: 'Playoff Format', to: '/competitie/playoff-format' },
    { label: 'Playoff Tie-Breaking Procedure', to: '/competitie/playoff-tie-breaking' },
  ];

  const calculateStandings = (division: string): TeamStats[] => {
    const divTeams = teams.filter(t => t.division === division && t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const statsMap: Record<string, TeamStats> = {};

    divTeams.forEach(t => {
      statsMap[t.id] = { team: t, gp: 0, w: 0, l: 0, ot: 0, pts: 0, gf: 0, ga: 0, diff: 0 };
    });

    games.forEach(g => {
      const homeStats = statsMap[g.homeTeamId];
      const awayStats = statsMap[g.awayTeamId];

      if (homeStats || awayStats) { // Process if at least one team is in the division
        if (homeStats) {
          homeStats.gp++;
          homeStats.gf += g.homeScore;
          homeStats.ga += g.awayScore;
        }
        if (awayStats) {
          awayStats.gp++;
          awayStats.gf += g.awayScore;
          awayStats.ga += g.homeScore;
        }

        if (g.homeScore > g.awayScore) {
          if (homeStats) {
            homeStats.w++;
            homeStats.pts += settings.pointsForWin;
          }
          if (awayStats) {
            if (g.isOvertime) {
              awayStats.ot++;
              awayStats.pts += settings.pointsForOTLoss;
            } else {
              awayStats.l++;
              awayStats.pts += settings.pointsForLoss;
            }
          }
        } else if (g.awayScore > g.homeScore) {
          if (awayStats) {
            awayStats.w++;
            awayStats.pts += settings.pointsForWin;
          }
          if (homeStats) {
            if (g.isOvertime) {
              homeStats.ot++;
              homeStats.pts += settings.pointsForOTLoss;
            } else {
              homeStats.l++;
              homeStats.pts += settings.pointsForLoss;
            }
          }
        } else {
          // Tie
          if (homeStats) homeStats.pts += 1;
          if (awayStats) awayStats.pts += 1;
        }      }
    });

    return Object.values(statsMap).map(s => {
      s.diff = s.gf - s.ga;
      return s;
    }).sort((a, b) => b.pts - a.pts || b.w - a.w || b.diff - a.diff);
  };

  const divA = calculateStandings('A');
  const divB = calculateStandings('B');

  const renderTable = (divisionName: string, subtitle: string, stats: TeamStats[]) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Divisie {divisionName}</h2>
           <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold w-16 text-center">RANK</th>
              <th className="px-6 py-4 font-semibold">TEAM</th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400">GP <span className="text-gray-300 ml-1">↑↓</span></th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400">W <span className="text-gray-300 ml-1">↑↓</span></th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400">L <span className="text-gray-300 ml-1">↑↓</span></th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400">OT <span className="text-gray-300 ml-1">↑↓</span></th>
              <th className="px-4 py-4 font-semibold text-center text-blue-600 bg-blue-50/30">PTS <span className="text-blue-600 ml-1">▼</span></th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400 hidden lg:table-cell">P% <span className="text-gray-300 ml-1">↑↓</span></th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400 hidden lg:table-cell">GF <span className="text-gray-300 ml-1">↑↓</span></th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400 hidden lg:table-cell">GA <span className="text-gray-300 ml-1">↑↓</span></th>
              <th className="px-4 py-4 font-semibold text-center text-gray-400 hidden lg:table-cell">DIFF <span className="text-gray-300 ml-1">↑↓</span></th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, idx) => (
              <tr key={s.team.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 text-gray-500 text-center">{idx + 1}</td>
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center">
                  <div className={`w-6 h-6 rounded-full ${s.team.color || 'bg-gray-500'} mr-3 border-2 border-white shadow-sm flex items-center justify-center`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  {s.team.name}
                </td>
                <td className="px-4 py-4 text-center">{s.gp}</td>
                <td className="px-4 py-4 text-center">{s.w}</td>
                <td className="px-4 py-4 text-center">{s.l}</td>
                <td className="px-4 py-4 text-center">{s.ot}</td>
                <td className="px-4 py-4 text-center font-bold bg-blue-50/30 text-gray-900">{s.pts}</td>
                <td className="px-4 py-4 text-center text-gray-500 hidden lg:table-cell">{(s.pts / (s.gp * settings.pointsForWin || 1)).toFixed(3).replace('0.', '.')}</td>
                <td className="px-4 py-4 text-center text-gray-500 hidden lg:table-cell">{s.gf}</td>
                <td className="px-4 py-4 text-center text-gray-500 hidden lg:table-cell">{s.ga}</td>
                <td className="px-4 py-4 text-center font-semibold text-gray-900 hidden lg:table-cell">{s.diff > 0 ? `+${s.diff}` : s.diff}</td>
              </tr>
            ))}
            {stats.length === 0 && (
               <tr><td colSpan={11} className="px-6 py-8 text-center text-gray-400">Geen teams in deze divisie gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <Topbar
        title="Standings"
        subtitle="Groningen House League • Officieel overzicht & Playoff resultaten"
        navItems={topNav}
      >
        <div className="flex items-center space-x-2">
          <div className="mr-4"><SeedButton /></div>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2026/2027</option>
              <option>2025/2026</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
            <button className="px-3 py-2 text-gray-500 hover:bg-gray-50 border-r border-gray-300">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 text-sm font-bold text-gray-900 bg-white">
              Jul 17
            </div>
            <button className="px-3 py-2 text-gray-500 hover:bg-gray-50 border-l border-gray-300">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Topbar>

      <div className="p-8">
         <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-6">
               <button className="text-gray-500 font-medium text-sm hover:text-gray-900">Wild Card</button>
               <button className="text-gray-500 font-medium text-sm hover:text-gray-900">Conference</button>
               <button className="text-gray-900 font-bold text-sm border-b-2 border-gray-900 pb-1">Division</button>
               <button className="text-gray-500 font-medium text-sm hover:text-gray-900">League</button>
            </div>
            <div className="relative w-64">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
               <input
                  type="text"
                  placeholder="Zoek een team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
         </div>

         {loading ? (
            <div className="text-center p-12 text-gray-500">Laden van standen...</div>
         ) : (
            <>
               {renderTable('A', 'Gevorderden / Advanced Division', divA)}
               {renderTable('B', 'Recreanten / Recreational Division', divB)}
            </>
         )}

         <div className="mt-8 flex justify-between items-center text-xs text-gray-500">
            <div className="flex space-x-4">
               <span className="flex items-center"><span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded mr-1">X</span> Clinched Playoff Berth</span>
               <span className="flex items-center"><span className="bg-yellow-100 text-yellow-800 font-bold px-1.5 py-0.5 rounded mr-1">Y</span> Clinched Division Title</span>
               <span className="flex items-center"><span className="bg-gray-100 text-gray-800 font-bold px-1.5 py-0.5 rounded mr-1">E</span> Eliminated from Playoff Contention</span>
            </div>
            <div>
               Punten model: Reguliere winst = {settings.pointsForWin} pts • Overtime/SO verlies = {settings.pointsForOTLoss} pt • Regulier verlies = {settings.pointsForLoss} pts
            </div>
         </div>

      </div>
    </div>
  );
}
