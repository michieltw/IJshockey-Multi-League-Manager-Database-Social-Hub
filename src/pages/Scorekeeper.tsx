import { useState } from 'react';
import Overview from './Scorekeeper/Overview';
import LiveScorekeeper from './Scorekeeper/LiveScorekeeper';

export default function ScorekeeperRoute() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  if (activeGameId) {
    return <LiveScorekeeper gameId={activeGameId} onExit={() => setActiveGameId(null)} />;
  }

  return <Overview onStartGame={setActiveGameId} />;
}
