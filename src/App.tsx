import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Standings from './pages/Standings';
import Scorekeeper from './pages/Scorekeeper';
import Admin from './pages/Admin';
import Statistieken from './pages/Statistieken';
import Placeholder from './pages/Placeholder';
import Configurator from './pages/Configurator';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/" element={<Navigate to="/competitie/standen" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Competitie */}
          {/* Updated dynamic routes to support multiple leagues and context */}
          <Route path="/competitie/:leagueId" element={<Placeholder title="League Home" />} />
          <Route path="/competitie/:leagueId/uitslagen" element={<Placeholder title="Uitslagen" />} />
          <Route path="/competitie/:leagueId/speelschema" element={<Placeholder title="Speelschema" />} />
          <Route path="/competitie/:leagueId/standen" element={<Standings />} />
          <Route path="/competitie/:leagueId/evenementen" element={<Placeholder title="Evenementen" />} />
          <Route path="/competitie/:leagueId/player-draft" element={<Placeholder title="Player Draft" />} />
          <Route path="/competitie/:leagueId/statistieken" element={<Statistieken />} />
          <Route path="/competitie/:leagueId/teams" element={<Placeholder title="Teams" />} />
          <Route path="/competitie/:leagueId/spelers" element={<Placeholder title="Spelers" />} />
          <Route path="/competitie/:leagueId/berichten" element={<Placeholder title="Berichten" />} />
          <Route path="/competitie/:leagueId/reglementen" element={<Placeholder title="Reglementen" />} />

          {/* Fallbacks for backward compatibility / defaults */}
          <Route path="/competitie/house-league" element={<Navigate to="/competitie/ghl/standen" replace />} />
          <Route path="/competitie/standen" element={<Navigate to="/competitie/ghl/standen" replace />} />
          <Route path="/competitie/statistieken" element={<Navigate to="/competitie/ghl/statistieken" replace />} />

          {/* Modules */}
          <Route path="/modules/referee" element={<Placeholder title="Referee" />} />
          <Route path="/modules/scorekeeper" element={<Scorekeeper />} />
          <Route path="/modules/team-manager" element={<Placeholder title="Team Manager" />} />
          <Route path="/modules/general-manager" element={<Placeholder title="General Manager" />} />
          <Route path="/modules/league-office" element={<Placeholder title="League Office" />} />
          <Route path="/admin" element={<Admin />} />

          {/* Overige */}
          <Route path="/nieuws" element={<Placeholder title="Nieuws" />} />
          <Route path="/archief" element={<Placeholder title="Archief" />} />
          <Route path="/privacy" element={<Placeholder title="Privacy" />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
