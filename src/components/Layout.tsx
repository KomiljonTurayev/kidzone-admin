import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart2, Bell, Image, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogout } from '../hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/stats', label: 'Stats', icon: BarChart2 },
  { to: '/push', label: 'Push', icon: Bell },
  { to: '/banners', label: 'Banners', icon: Image },
];

export default function Layout() {
  const location = useLocation();
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const navLinks = navItems.map(({ to, label, icon: Icon }) => (
    <Link
      key={to}
      to={to}
      onClick={closeSidebar}
      className={cn(
        'flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-accent transition-colors',
        location.pathname.startsWith(to) && 'bg-accent font-medium'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  ));

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — desktop: static; mobile: fixed overlay */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-56 border-r flex flex-col p-4 gap-1 bg-background transition-transform duration-200 md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="text-lg font-bold mb-6 px-2">KidZone Admin</div>
        {navLinks}
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => { logout(); closeSidebar(); }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top header bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b md:hidden">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-lg font-bold">KidZone Admin</span>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}