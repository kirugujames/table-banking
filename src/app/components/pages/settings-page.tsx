import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Building2,
  DollarSign,
  Shield,
  Bell,
  Database,
  Mail,
  Smartphone,
  CreditCard,
  Users,
  Save,
} from 'lucide-react';
import { useAuth } from '@/app/lib/auth-context';

export function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your SACCO system configuration</p>
      </div>

      {/* Settings Accordion */}
      <Accordion type="single" collapsible className="space-y-4">
        {/* Organization Details */}
        <AccordionItem value="organization" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Organization Details</h3>
                <p className="text-sm text-muted-foreground">Update SACCO information and branding</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>SACCO Name</Label>
                  <Input defaultValue={user?.company || "Unity SACCO"} />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input defaultValue="REG-2020-1234" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="123 Main Street, Nairobi, Kenya" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="+254 712 345 678" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={user?.email || "info@sacco.com"} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <Input type="file" />
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Financial Settings */}
        <AccordionItem value="financial" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Financial Settings</h3>
                <p className="text-sm text-muted-foreground">Configure interest rates and fees</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Base Savings Interest Rate (%)</Label>
                  <Input type="number" defaultValue="5.5" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Loan Processing Fee (%)</Label>
                  <Input type="number" defaultValue="2.0" step="0.1" />
                </div>
              </div>
              <Separator />
              <h4 className="font-medium">Loan Interest Rates</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Personal Loans (%)</Label>
                  <Input type="number" defaultValue="12.0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Business Loans (%)</Label>
                  <Input type="number" defaultValue="10.0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Loans (%)</Label>
                  <Input type="number" defaultValue="9.0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Education Loans (%)</Label>
                  <Input type="number" defaultValue="8.0" step="0.1" />
                </div>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Loan Configuration */}
        <AccordionItem value="loans" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Loan Configuration</h3>
                <p className="text-sm text-muted-foreground">Set loan limits and requirements</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum Loan Amount</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Loan Amount</Label>
                  <Input type="number" defaultValue="50000" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum Repayment Period (months)</Label>
                  <Input type="number" defaultValue="6" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Repayment Period (months)</Label>
                  <Input type="number" defaultValue="24" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Required Guarantors</Label>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guarantor</SelectItem>
                    <SelectItem value="2">2 Guarantors</SelectItem>
                    <SelectItem value="3">3 Guarantors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Require Committee Approval</Label>
                  <p className="text-sm text-muted-foreground">Loans need committee approval before disbursement</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Notifications */}
        <AccordionItem value="notifications" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/20 p-2">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Notification Settings</h3>
                <p className="text-sm text-muted-foreground">Configure email and SMS notifications</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications to members</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send SMS alerts for important events</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <h4 className="font-medium">Notification Events</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Loan Payment Reminders</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Loan Approval Notifications</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Payment Confirmations</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Monthly Statements</Label>
                  <Switch />
                </div>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* User Roles & Permissions */}
        <AccordionItem value="roles" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 dark:bg-cyan-900/20 p-2">
                <Users className="h-5 w-5 text-cyan-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">User Roles & Permissions</h3>
                <p className="text-sm text-muted-foreground">Manage user access and permissions</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Admin Role</CardTitle>
                  <CardDescription>Full system access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manage Members</span>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approve Loans</span>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Generate Reports</span>
                      <Switch defaultChecked disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Manager Role</CardTitle>
                  <CardDescription>Limited administrative access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manage Members</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approve Loans</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Generate Reports</span>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Security & Backup */}
        <AccordionItem value="security" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 dark:bg-red-900/20 p-2">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Security & Backup</h3>
                <p className="text-sm text-muted-foreground">Data protection and backup settings</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <Separator />
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled data backups</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
