import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  PiggyBank,
  ArrowLeftRight,
  Receipt,
  BarChart3,
  Settings,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/app/lib/auth-context';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Overview of key metrics, charts, and recent activity',
    features: ['Quick stats', 'Charts', 'Recent activity', 'Quick actions'],
  },
  {
    icon: Users,
    title: 'Members',
    description: 'Manage SACCO members and their information',
    features: ['Member list', 'Search & filter', 'Add/Edit members', 'View details'],
  },
  {
    icon: CreditCard,
    title: 'Loans',
    description: 'Track loan applications, approvals, and repayments',
    features: ['Loan tracking', 'Approval workflow', 'Repayment schedule', 'Default monitoring'],
  },
  {
    icon: PiggyBank,
    title: 'Savings',
    description: 'Monitor member savings and deposits',
    features: ['Savings overview', 'Deposit tracking', 'Withdrawal management', 'Top savers'],
  },
  {
    icon: ArrowLeftRight,
    title: 'Transactions',
    description: 'Complete transaction history and management',
    features: ['All transactions', 'Search & filter', 'Import/Export', 'Transaction details'],
  },
  {
    icon: Receipt,
    title: 'Expenses',
    description: 'Track operational expenses and budget',
    features: ['Expense tracking', 'Category breakdown', 'Budget monitoring', 'Vendor management'],
  },
  {
    icon: BarChart3,
    title: 'Reports',
    description: 'Generate financial reports and analytics',
    features: ['Pre-built reports', 'Custom reports', 'Analytics', 'Export options'],
  },
  {
    icon: Settings,
    title: 'Settings',
    description: 'Configure system settings and preferences',
    features: ['Organization details', 'Financial settings', 'User permissions', 'Security'],
  },
];

export function UserGuide() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Guide</h1>
        <p className="text-muted-foreground">
          Learn how to use the SACCO Management System effectively
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">Getting Started</h2>
          <p className="mb-4">
            Welcome to the {user?.company || "Unity SACCO"} Management System. This comprehensive platform helps you manage
            members, loans, savings, and all financial operations efficiently.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Navigate using the sidebar menu on the left
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Use the search bar in the header for quick access
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Toggle dark mode using the theme button
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Check notifications via the bell icon
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Key Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((feat) => (
                      <Badge key={feat} variant="secondary">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Search</span>
              <Badge variant="outline" className="font-mono">Ctrl + K</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Toggle Theme</span>
              <Badge variant="outline" className="font-mono">Ctrl + T</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Toggle Sidebar</span>
              <Badge variant="outline" className="font-mono">Ctrl + B</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Go to Dashboard</span>
              <Badge variant="outline" className="font-mono">Ctrl + H</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips & Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Regular Backups</p>
                <p className="text-sm text-muted-foreground">
                  Enable automated backups in Settings → Security & Backup
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Monitor Default Rates</p>
                <p className="text-sm text-muted-foreground">
                  Keep an eye on the default rate metric to identify at-risk loans early
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Use Filters Effectively</p>
                <p className="text-sm text-muted-foreground">
                  Take advantage of search and filter options to find information quickly
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Export Reports</p>
                <p className="text-sm text-muted-foreground">
                  Regularly export financial reports for record-keeping and audits
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Set Up Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Configure SMS/Email notifications for important events like loan approvals and payment reminders
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
