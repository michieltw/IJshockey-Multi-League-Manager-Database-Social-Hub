import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface TopbarProps {
  title: string;
  subtitle: string;
  navItems: { label: string; to: string }[];
  children?: ReactNode;
}

export default function Topbar({ title, subtitle, navItems, children }: TopbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 pt-6 pb-4">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <div>
          {children}
        </div>
      </div>

      <div className="flex space-x-6 border-b border-gray-200">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) => `
              pb-3 text-sm font-medium transition-colors border-b-2
              ${isActive
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}
            `}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
