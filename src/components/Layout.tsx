import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Users, BarChart2, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearToken } from '../lib/token';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/users', label: 'Users', icon: Users },
  { to: '/stats', label: 'Stats', icon: BarChart2 },
  { to: '/push', label: 'Push', icon: Bell },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-56 border-r flex flex-col p-4 gap-1">
        <div className="text-lg font-bold mb-6 px-2">KidZone Admin</div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-accent transition-colors',
              location.pathname.startsWith(to) && 'bg-accent font-medium'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
