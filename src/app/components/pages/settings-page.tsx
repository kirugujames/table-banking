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

        {/* Membership Settings */}
        <AccordionItem value="membership" className="border rounded-lg px-6">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Membership Settings</h3>
                <p className="text-sm text-muted-foreground">Configure membership fees and interest rates</p>
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
