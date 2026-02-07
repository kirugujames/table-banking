import { useState } from 'react';
import {
  Home,
  Users,
  CreditCard,
  PiggyBank,
  ArrowLeftRight,
  Receipt,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  Shield,
  UserCog,
  HeartHandshake,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { cn } from '@/app/components/ui/utils';
import { Badge } from '@/app/components/ui/badge';
import { User as UserType } from '@/app/lib/roles';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate?: (page: string) => void;
  user: UserType | null;
  onLogout: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: Home, path: 'dashboard' },
  { name: 'Members', icon: Users, path: 'members' },
  {
    name: 'Loans',
    icon: CreditCard,
    path: 'loans',
    children: [
      { name: 'Loan Applications', path: 'loans' },
      { name: 'Loan Products', path: 'loan-products' },
    ],
  },
  { name: 'Savings', icon: PiggyBank, path: 'savings' },
  { name: 'Transactions', icon: ArrowLeftRight, path: 'transactions' },
  { name: 'Expenses', icon: Receipt, path: 'expenses' },
  { name: 'Reports', icon: BarChart3, path: 'reports' },
  { name: 'Welfare', icon: HeartHandshake, path: 'welfare' },
  {
    name: 'User Management',
    icon: UserCog,
    path: 'user-management',
    children: [
      { name: 'Roles', path: 'roles' },
      { name: 'Users', path: 'users' },
    ],
  },
  { name: 'Settings', icon: Settings, path: 'settings' },
];

interface NavItemProps {
  item: any;
  currentPage: string;
  onNavigate: (path: string) => void;
}

function NavItem({ item, currentPage, onNavigate }: NavItemProps) {
  const isActive = currentPage === item.path || (item.children?.some((child: any) => currentPage === child.path));
  const [isOpen, setIsOpen] = useState(isActive);

  if (item.children) {
    return (
      <li className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            {item.name}
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <ul className="ml-9 space-y-1 mt-1">
            {item.children.map((child: any) => (
              <li key={child.name}>
                <button
                  onClick={() => onNavigate(child.path)}
                  className={cn(
                    'flex w-full items-center rounded-md px-3 py-2 text-xs font-medium transition-colors',
                    currentPage === child.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {child.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => onNavigate(item.path)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </button>
    </li>
  );
}

export function DashboardLayout({ children, currentPage, onNavigate, user, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <PiggyBank className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">{user?.company || 'Sacco'}</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                <Badge variant="outline" className="text-xs mt-1 capitalize">{user?.role || 'Guest'}</Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  currentPage={currentPage}
                  onNavigate={handleNavigation}
                />
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members, loans, transactions..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}