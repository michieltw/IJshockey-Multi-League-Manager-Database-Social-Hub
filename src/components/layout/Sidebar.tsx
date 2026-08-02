import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  LayoutDashboard, Trophy, Settings, FileText, Lock,
  Archive, Users, Shield, LogOut, Bell, MessageSquare,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

type NavItemProps = {
  icon?: React.ReactNode;
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
  defaultExpanded?: boolean;
};

function NavItem({ icon, label, to, children, defaultExpanded = false }: NavItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const location = useLocation();

  const isChildActive = children?.some(child => location.pathname === child.to);
  const isActive = to ? location.pathname === to : isChildActive;

  if (children) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            isActive ? "text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <span className="mr-3">{icon}</span>
          <span className="flex-1 text-left">{label}</span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isExpanded && (
          <div className="mt-2 grid grid-cols-2 gap-1 px-2">
            {children.map((child, idx) => (
              <NavLink
                key={idx}
                to={child.to}
                className={({ isActive }) => cn(
                  "block px-2 py-1.5 text-xs rounded-lg transition-colors text-center border border-transparent",
                  isActive
                    ? "bg-gray-900 text-white font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to!}
      className={({ isActive }) => cn(
        "flex items-center px-4 py-2 mb-1 text-sm font-medium rounded-lg transition-colors",
        isActive ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
}

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [username, setUsername] = useState('Loading...');

  if (!isOpen) return null;

  useEffect(() => {
    async function loadUser() {
      try {
        // We try to fetch the first person as a mock for the logged in user
        const q = query(collection(db, 'persons'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const user = snap.docs[0].data();
          setUsername(user.name_first + ' ' + user.name_last);
        } else {
          setUsername('Onbekende Gebruiker');
        }
      } catch (e) {
        setUsername('Jan Jansen');
      }
    }

    // Set a timeout to prevent infinite loading if firebase fails
    const timer = setTimeout(() => setUsername('Jan Jansen'), 3000);
    loadUser().then(() => clearTimeout(timer));

    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4e/Ice_hockey_player.svg')] bg-no-repeat bg-bottom bg-cover" />

      <nav className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10 scrollbar-hide">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          to="/dashboard"
        />

        <div className="mt-4 mb-2">
          <NavItem
            icon={<Trophy size={20} />}
            label="Competitie"
            defaultExpanded={true}
            children={[
              { label: 'GIJS House League', to: '/competitie/house-league' },
              { label: 'Uitslagen', to: '/competitie/uitslagen' },
              { label: 'Speelschema', to: '/competitie/speelschema' },
              { label: 'Standen', to: '/competitie/standen' },
              { label: 'Evenementen', to: '/competitie/evenementen' },
              { label: 'Player Draft', to: '/competitie/player-draft' },
              { label: 'Statistieken', to: '/competitie/statistieken' },
              { label: 'Teams', to: '/competitie/teams' },
              { label: 'Spelers', to: '/competitie/spelers' },
              { label: 'Berichten', to: '/competitie/berichten' },
              { label: 'Reglementen', to: '/competitie/reglementen' },
            ]}
          />
        </div>

        <div className="mt-4 mb-2">
          <NavItem
            icon={<Settings size={20} />}
            label="Configurator"
            to="/configurator"
          />
        </div>

        <div className="mt-4 mb-2">
          <NavItem
            icon={<Shield size={20} />}
            label="Modules"
            defaultExpanded={true}
            children={[
              { label: 'Referee', to: '/modules/referee' },
              { label: 'Scorekeeper', to: '/modules/scorekeeper' },
              { label: 'Team Manager', to: '/modules/team-manager' },
              { label: 'General Manager', to: '/modules/general-manager' },
              { label: 'League Office', to: '/modules/league-office' },
              { label: 'Admin', to: '/admin' },
            ]}
          />
        </div>

        <div className="mt-4">
          <NavItem icon={<FileText size={20} />} label="Nieuws" to="/nieuws" />
          <NavItem icon={<Archive size={20} />} label="Archief" to="/archief" />
          <NavItem icon={<Lock size={20} />} label="Privacy" to="/privacy" />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 bg-white relative z-10">
        <div className="flex items-center mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white mr-3">
             <Users size={20} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{username}</div>
          </div>
        </div>
        <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Mijn Profiel
        </button>
        <div className="flex justify-between items-center text-gray-500 px-2">
          <button className="hover:text-gray-900"><LogOut size={20} /></button>
          <button className="hover:text-gray-900 relative">
             <Settings size={20} />
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
          </button>
          <button className="hover:text-gray-900"><MessageSquare size={20} /></button>
          <button className="hover:text-gray-900"><Bell size={20} /></button>
          <button className="hover:text-gray-900"><Shield size={20} /></button>
        </div>
      </div>
    </aside>
  );
}
