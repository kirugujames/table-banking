import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
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
  PenLine,
} from 'lucide-react';
import { useAuth } from '@/app/lib/auth-context';
import { settingsService, SaccoSettings, UpdateSaccoSettingsData, CompanyDetails } from '@/app/lib/settings-service';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SaccoSettings | null>(null);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateSaccoSettingsData>({
    registration_fee: 0,
    charge_registration_fee_on_onboarding: 0
  });

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const [settingsData, companyData] = await Promise.all([
        settingsService.getSettings(),
        settingsService.getCompanyDetails()
      ]);
      setSettings(settingsData);
      setCompanyDetails(companyData);
      setFormData({
        registration_fee: settingsData.registration_fee,
        charge_registration_fee_on_onboarding: settingsData.charge_registration_fee_on_onboarding
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load SACCO settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await settingsService.updateSettings(formData);
      toast.success('Settings updated successfully');
      setIsUpdateModalOpen(false);
      fetchSettings(); // Refresh data
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateSaccoSettingsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
                <p className="text-sm text-muted-foreground">View SACCO information</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              {companyDetails ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input value={companyDetails.company_name} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Abbreviation</Label>
                      <Input value={companyDetails.abbr} readOnly className="bg-muted" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input value={companyDetails.country} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Currency</Label>
                      <Input value={companyDetails.default_currency} readOnly className="bg-muted" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input value={companyDetails.phone_no || 'N/A'} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input value={companyDetails.email || 'N/A'} readOnly className="bg-muted" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {isLoading ? "Loading company details..." : "No company details available"}
                </div>
              )}
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
              {settings ? (
                <>
                  <div className="flex justify-end mb-4">
                    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <PenLine className="h-4 w-4" />
                          Update Settings
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Update Membership Settings</DialogTitle>
                          <DialogDescription className="text-pretty">
                            Configure the default fees and rules for new member registration.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="grid gap-3">
                            <Label htmlFor="reg-fee" className="font-semibold text-sm">
                              Registration Fee
                            </Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="reg-fee"
                                type="number"
                                value={formData.registration_fee}
                                onChange={(e) => handleInputChange('registration_fee', parseFloat(e.target.value))}
                                className="pl-9"
                                placeholder="0.00"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              The amount charged when a new member registers.
                            </p>
                          </div>
                          <Separator />
                          <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <Label className="text-base font-semibold">
                                Charge on Onboarding
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically charge the fee during sign-up?
                              </p>
                            </div>
                            <Switch
                              id="charge-on-onboarding"
                              checked={formData.charge_registration_fee_on_onboarding === 1}
                              onCheckedChange={(checked) => handleInputChange('charge_registration_fee_on_onboarding', checked ? 1 : 0)}
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" onClick={handleUpdate} disabled={isLoading} className="gap-2">
                            {isLoading ? "Saving..." : <><Save className="h-4 w-4" /> Save Changes</>}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Setting Name</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Registration Fee</TableCell>
                          <TableCell>{settings.registration_fee}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Charge Registration Fee On Onboarding</TableCell>
                          <TableCell>{settings.charge_registration_fee_on_onboarding === 1 ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {isLoading ? "Loading settings..." : "No settings available"}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>


      </Accordion>
    </div>
  );
}
