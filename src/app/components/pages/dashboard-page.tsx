import { useEffect, useState } from 'react';
import { StatCard } from '@/app/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Users,
  CreditCard,
  PiggyBank,
  TrendingDown,
  DollarSign,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import {
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatusBadge } from '@/app/components/status-badge';
import {
  dashboardService,
  DashboardStats,
  LoanBreakdownItem,
  RecentActivityItem,
  PaymentRequestItem,
  SavingsGrowthItem
} from '@/app/lib/dashboard-service';


const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loanDistribution, setLoanDistribution] = useState<{ name: string; value: number; color: string }[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<PaymentRequestItem[]>([]);
  const [savingsGrowth, setSavingsGrowth] = useState<SavingsGrowthItem[]>([]);
  const [activitySearch, setActivitySearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');

  const ACTIVITY_PAGE_SIZE = 5;
  const PAYMENT_PAGE_SIZE = 5;
  const [activityOffset, setActivityOffset] = useState(0);
  const [paymentOffset, setPaymentOffset] = useState(0);

  // Fetch base stats and charts once
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [statsData, loanData, growthData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getLoanBreakdown(),
          dashboardService.getSavingsGrowth(),
        ]);
        setStats(statsData);
        setLoanDistribution(loanData.map((item, index) => ({
          name: item.loan_product,
          value: item.outstanding_amount,
          color: COLORS[index % COLORS.length],
        })));
        setSavingsGrowth(growthData);
      } catch (error) {
        console.error('Error fetching base dashboard data:', error);
      }
    };
    fetchBaseData();
  }, []);

  // Fetch activities when search or pagination changes
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await dashboardService.getRecentActivities(activityOffset, ACTIVITY_PAGE_SIZE, activitySearch);
        setRecentActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, [activityOffset, activitySearch]);

  // Fetch payments when search or pagination changes
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await dashboardService.getUpcomingPayments(paymentOffset, PAYMENT_PAGE_SIZE, paymentSearch);
        setUpcomingPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };
    fetchPayments();
  }, [paymentOffset, paymentSearch]);

  // Reset offset when searching
  useEffect(() => {
    setActivityOffset(0);
  }, [activitySearch]);

  useEffect(() => {
    setPaymentOffset(0);
  }, [paymentSearch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES', // Assuming KES based on context implies Kenya/Sacco, or default to USD if unsure. 
      // Wait, previous code used '$'. I'll stick to '$' or just 'KES' if generic.
      // The input data has large numbers (428600), likely KES. 
      // But the previous mock data had '$4.2M'.
      // I'll update to 'KES' or just use the number for now, or maybe KES is safer for SACCOs.
      // Let's use currency style but maybe USD or KES. I'll use default locale.
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="mt-1 text-primary-foreground/90">
          Here's what's happening with your SACCO today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats?.total_members.toString() || '0'}
          change={{ value: '+0%', trend: 'up' }}
          icon={Users}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Active Loans"
          value={stats?.active_loans.toString() || '0'}
          change={{ value: '+0%', trend: 'up' }}
          icon={CreditCard}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/10"
        />
        <StatCard
          title="Total Savings"
          value={stats ? formatCurrency(stats.total_savings) : '0'}
          change={{ value: '+0%', trend: 'up' }}
          icon={PiggyBank}
          iconColor="text-accent"
          iconBgColor="bg-accent/10"
        />
        <StatCard
          title="Default Rate"
          value={stats?.default_rate + '%' || '0%'}
          change={{ value: '0%', trend: 'down' }}
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBgColor="bg-red-100 dark:bg-red-900/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Savings Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Savings Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={savingsGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month_name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar
                  dataKey="total"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Loan Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}

                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Upcoming Repayments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Recent Activity</CardTitle>
            <div className="relative w-40 sm:w-60">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activity..."
                className="pl-8 h-9"
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`mt-1 rounded-full p-2 ${activity.type.includes('Deposit')
                      ? 'bg-blue-100 dark:bg-blue-900/20'
                      : 'bg-green-100 dark:bg-green-900/20'
                      }`}
                  >
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.member_name}</p>
                    <p className="text-sm text-muted-foreground">{activity.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(activity.amount)}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivityOffset(prev => Math.max(0, prev - ACTIVITY_PAGE_SIZE))}
                disabled={activityOffset === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                Page {Math.floor(activityOffset / ACTIVITY_PAGE_SIZE) + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivityOffset(prev => prev + ACTIVITY_PAGE_SIZE)}
                disabled={recentActivities.length < ACTIVITY_PAGE_SIZE}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Repayments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Upcoming Repayments</CardTitle>
            <div className="relative w-40 sm:w-60">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8 h-9"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {upcomingPayments.map((repayment, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{repayment.member_name}</p>
                      <StatusBadge status={repayment.status === 'Good Standing' ? 'active' : 'defaulted'} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="h-3 w-3" />
                      {repayment.product}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(repayment.amount)}</p>
                    <p className="text-xs text-muted-foreground">{repayment.loan}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaymentOffset(prev => Math.max(0, prev - PAYMENT_PAGE_SIZE))}
                disabled={paymentOffset === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                Page {Math.floor(paymentOffset / PAYMENT_PAGE_SIZE) + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaymentOffset(prev => prev + PAYMENT_PAGE_SIZE)}
                disabled={upcomingPayments.length < PAYMENT_PAGE_SIZE}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
