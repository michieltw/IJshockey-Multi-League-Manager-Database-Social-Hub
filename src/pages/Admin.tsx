import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PageHeader from '../components/PageHeader';

export default function Admin() {
  const [settings, setSettings] = useState({
    pointsForWin: 2,
    pointsForLoss: 0,
    pointsForOTLoss: 1,
    pointsForTie: 1,
    trackShots: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const compRef = doc(db, 'competitions', 'COMP_001');
        const snap = await getDoc(compRef);
        if (snap.exists() && snap.data().settings) {
          setSettings(snap.data().settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const compRef = doc(db, 'competitions', 'COMP_001');
      await setDoc(compRef, { settings }, { merge: true });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Admin Settings"
        subtitle="Competitie instellingen en rekenregels"
        navItems={[{ label: 'Algemeen', to: '/admin' }]}
      />
      <div className="p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-6">Puntentelling (Rekenregels)</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Punten voor Reguliere Winst</label>
              <input
                type="number"
                value={settings.pointsForWin}
                onChange={e => setSettings({...settings, pointsForWin: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Punten voor Regulier Verlies</label>
              <input
                type="number"
                value={settings.pointsForLoss}
                onChange={e => setSettings({...settings, pointsForLoss: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Punten voor OT/Shootout Verlies</label>
              <input
                type="number"
                value={settings.pointsForOTLoss}
                onChange={e => setSettings({...settings, pointsForOTLoss: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
               <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
               >
                  {saving ? 'Opslaan...' : 'Opslaan'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
