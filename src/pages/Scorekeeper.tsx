import { useState } from 'react';
import Overview from '../features/scorekeeper/components/Overview';
import LiveScorekeeper from '../features/scorekeeper/components/LiveScorekeeper';

export default function ScorekeeperRoute() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  if (activeGameId) {
    return <LiveScorekeeper gameId={activeGameId} onExit={() => setActiveGameId(null)} />;
  }

  return <Overview onStartGame={setActiveGameId} />;
}
