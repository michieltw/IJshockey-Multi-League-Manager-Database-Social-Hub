import { useState } from 'react';
import { seedDatabase } from '../lib/seed';
import { Database } from 'lucide-react';

export default function SeedButton() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    await seedDatabase();
    setLoading(false);
    window.location.reload();
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
    >
      <Database size={16} className="mr-2" />
      {loading ? 'Seeding...' : 'Seed Data'}
    </button>
  );
}
