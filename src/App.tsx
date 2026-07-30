import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Standings from './pages/Standings';
import Scorekeeper from './pages/Scorekeeper';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/competitie/standen" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/competitie/standen" element={<Standings />} />
          <Route path="/modules/scorekeeper" element={<Scorekeeper />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
