import PageHeader from '../components/layout/PageHeader';

export default function Statistieken() {
  return (
    <div className="flex flex-col h-full bg-[#F7F9FC]">
      <PageHeader
        title="Statistieken"
        subtitle="Leaderboards en speler statistieken"
        navItems={[
          { label: 'Overzicht', to: '/competitie/statistieken' },
          { label: 'Spelers', to: '/competitie/statistieken/spelers' },
          { label: 'Goalies', to: '/competitie/statistieken/goalies' }
        ]}
      />

      <div className="p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Scorers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-center">
                 {/* Placeholder for player_headshot_url */}
                 <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-gray-500 font-medium">
                    Foto
                 </div>
              </div>
              <div className="p-4 text-center">
                <div className="font-bold text-lg text-gray-900">Speler Naam {i}</div>
                <div className="text-sm text-gray-500 mb-4">Team Naam</div>

                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-100 border-t border-gray-100 pt-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Goals</div>
                    <div className="font-bold text-gray-900">12</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Assists</div>
                    <div className="font-bold text-gray-900">8</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Punten</div>
                    <div className="font-bold text-blue-600">20</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
