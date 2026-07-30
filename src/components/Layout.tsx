import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import GlobalTopbar from './GlobalTopbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <GlobalTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-16 h-full">
        {sidebarOpen && <Sidebar isOpen={sidebarOpen} />}
        <main className="flex-1 overflow-y-auto bg-[#F7F9FC]">
          {children}
        </main>
      </div>
    </div>
  );
}
