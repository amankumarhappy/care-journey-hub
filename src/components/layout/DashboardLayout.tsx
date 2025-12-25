import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Gamepad2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Users,
  Truck,
  FileText,
  Bell,
  Stethoscope,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  patient: [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/dashboard/appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
    { href: '/dashboard/orders', label: 'Orders', icon: <ShoppingCart className="h-5 w-5" /> },
    { href: '/dashboard/care-journey', label: 'Care Journey', icon: <Gamepad2 className="h-5 w-5" /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ],
  doctor: [
    { href: '/doctor', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/doctor/appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
    { href: '/doctor/patients', label: 'Patients', icon: <Users className="h-5 w-5" /> },
    { href: '/doctor/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ],
  admin: [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/admin/doctors', label: 'Doctors', icon: <Stethoscope className="h-5 w-5" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5" /> },
    { href: '/admin/appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
    { href: '/admin/orders', label: 'Orders', icon: <Package className="h-5 w-5" /> },
    { href: '/admin/transcripts', label: 'Transcripts', icon: <FileText className="h-5 w-5" /> },
  ],
  delivery: [
    { href: '/delivery', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/delivery/orders', label: 'Deliveries', icon: <Truck className="h-5 w-5" /> },
    { href: '/delivery/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ],
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user ? navItemsByRole[user.role] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between h-full px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Logo size="sm" />
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sidebar-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-screen pt-16 lg:pt-0">
          <div className="p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
