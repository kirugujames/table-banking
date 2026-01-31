import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  FileText,
  Download,
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const revenueData = [
  { month: 'Jul', revenue: 45000, expenses: 28000, profit: 17000 },
  { month: 'Aug', revenue: 52000, expenses: 31000, profit: 21000 },
  { month: 'Sep', revenue: 48000, expenses: 29000, profit: 19000 },
  { month: 'Oct', revenue: 61000, expenses: 34000, profit: 27000 },
  { month: 'Nov', revenue: 58000, expenses: 32000, profit: 26000 },
  { month: 'Dec', revenue: 67000, expenses: 36000, profit: 31000 },
  { month: 'Jan', revenue: 71000, expenses: 38000, profit: 33000 },
];

const memberGrowthData = [
  { month: 'Jul', newMembers: 42, totalMembers: 1105 },
  { month: 'Aug', newMembers: 38, totalMembers: 1143 },
  { month: 'Sep', newMembers: 45, totalMembers: 1188 },
  { month: 'Oct', newMembers: 51, totalMembers: 1239 },
  { month: 'Nov', newMembers: 48, totalMembers: 1287 },
  { month: 'Dec', newMembers: 44, totalMembers: 1331 },
  { month: 'Jan', newMembers: 47, totalMembers: 1378 },
];

const loanPerformanceData = [
  { name: 'Performing', value: 89, color: '#10B981' },
  { name: 'Defaulted', value: 3, color: '#DC2626' },
  { name: 'Pending', value: 8, color: '#F59E0B' },
];

const reportTypes = [
  {
    id: 1,
    name: 'Member Statement',
    description: 'Individual member transaction history',
    icon: Users,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20',
  },
  {
    id: 2,
    name: 'Loan Portfolio Report',
    description: 'Complete loan portfolio analysis',
    icon: CreditCard,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/20',
  },
  {
    id: 3,
    name: 'Default Report',
    description: 'Loans at risk and defaulted',
    icon: TrendingUp,
    color: 'bg-red-100 text-red-600 dark:bg-red-900/20',
  },
  {
    id: 4,
    name: 'Financial Summary',
    description: 'Income, expenses, and profitability',
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20',
  },
  {
    id: 5,
    name: 'Welfare Fund Report',
    description: 'Welfare contributions and disbursements',
    icon: Activity,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/20',
  },
  {
    id: 6,
    name: 'Audit Trail',
    description: 'Complete system activity log',
    icon: FileText,
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20',
  },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate reports and analyze SACCO performance</p>
      </div>

      {/* Pre-built Reports */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pre-built Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${report.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="h-3 w-3" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
        
        {/* Financial Performance */}
        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Member Growth & Loan Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Member Acquisition</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newMembers" fill="#2563EB" name="New Members" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loan Portfolio Health</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={loanPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Build Custom Reports</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create customized reports with specific date ranges, filters, and data points tailored to your needs.
            </p>
            <Button className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Start Building Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
