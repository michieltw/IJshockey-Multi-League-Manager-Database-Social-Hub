import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface GlobalTopbarProps {
  toggleSidebar: () => void;
}

export default function GlobalTopbar({ toggleSidebar }: GlobalTopbarProps) {
  const [mainLogoUrl, setMainLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().main_logo_url) {
          setMainLogoUrl(docSnap.data().main_logo_url);
        }
      } catch (error) {
        console.error("Error fetching main logo:", error);
      }
    }
    fetchLogo();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center h-full">
        {mainLogoUrl ? (
          <img src={mainLogoUrl} alt="Main Logo" className="h-10 object-contain" />
        ) : (
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        )}
      </div>

      <div className="w-10">
        {/* Empty div for right side spacing to keep logo centered */}
      </div>
    </div>
  );
}
