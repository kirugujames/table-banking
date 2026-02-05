import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { UserPlus, Loader2, Upload, X } from 'lucide-react';
import { memberService } from '@/app/lib/member-service';
import { locationService, County, Constituency, Ward } from '@/app/lib/location-service';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
}

export function AddMemberModal({ open, onOpenChange, initialData, onSuccess }: AddMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    national_id: '',
    county: '',
    sub_county: '',
    ward: '',
    village: '',
    national_id_image: '',
    passport_photo: '',
  });

  useEffect(() => {
    if (initialData && open) {
      // If we have initialData, we are in Edit mode
      // Fetch full member details to populate all fields
      const fetchMemberDetails = async () => {
        try {
          const details = await memberService.getMemberFullDetails(initialData.name);
          const reg = details.registration_details;

          setFormData({
            first_name: reg.first_name || '',
            last_name: reg.last_name || '',
            email: reg.email || '',
            phone: reg.phone || '',
            national_id: reg.national_id || '',
            county: reg.county || '',
            sub_county: reg.sub_county || '',
            ward: reg.ward || '',
            village: reg.village || '',
            national_id_image: reg.national_id_image || '',
            passport_photo: reg.passport_photo || '',
          });

          // Load sub-counties and wards if county and sub_county are present
          if (reg.county) {
            try {
              const subCountiesData = await locationService.getSubCounties(reg.county);
              setSubCounties(subCountiesData);

              if (reg.sub_county) {
                const wardsData = await locationService.getWards(reg.sub_county);
                setWards(wardsData);
              }
            } catch (error) {
              console.error('Error loading location data:', error);
            }
          }
        } catch (error) {
          console.error('Error fetching member details:', error);
          toast.error('Failed to load member details');
        }
      };

      fetchMemberDetails();
    } else if (open) {
      // Clear for new member
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        national_id: '',
        county: '',
        sub_county: '',
        ward: '',
        village: '',
        national_id_image: '',
        passport_photo: '',
      });
      setSubCounties([]);
      setWards([]);
    }
  }, [initialData, open]);

  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<Constituency[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchCounties = async () => {
        try {
          const data = await locationService.getCounties();
          setCounties(data);
        } catch (error) {
          console.error('Error fetching counties:', error);
        }
      };
      fetchCounties();
    }
  }, [open]);

  const handleCountyChange = async (countyName: string) => {
    handleChange('county', countyName);
    handleChange('sub_county', '');
    handleChange('ward', '');
    setSubCounties([]);
    setWards([]);

    setIsLoadingLocations(true);
    try {
      const data = await locationService.getSubCounties(countyName);
      setSubCounties(data);
    } catch (error) {
      console.error('Error fetching sub-counties:', error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleSubCountyChange = async (subCountyName: string) => {
    handleChange('sub_county', subCountyName);
    handleChange('ward', '');
    setWards([]);

    setIsLoadingLocations(true);
    try {
      const data = await locationService.getWards(subCountyName);
      setWards(data);
    } catch (error) {
      console.error('Error fetching wards:', error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData) {
        // Edit mode
        await memberService.editMember(initialData.name, formData);
        toast.success('Member details updated successfully!');
      } else {
        // Create mode
        await memberService.createMemberApplication(formData);
        toast.success('Member application created successfully!');
      }

      setIsSubmitting(false);
      onOpenChange(false);
      onSuccess?.();

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        national_id: '',
        county: '',
        sub_county: '',
        ward: '',
        village: '',
        national_id_image: '',
        passport_photo: '',
      });
    } catch (error: any) {
      console.error('Error submitting member data:', error);
      let errorMessage = initialData
        ? 'An error occurred while updating member details'
        : 'An error occurred while creating member application';

      const errorData = error.response?.data;
      if (errorData) {
        if (errorData._server_messages) {
          try {
            const messages = JSON.parse(errorData._server_messages);
            const parsedMessage = JSON.parse(messages[0]);
            errorMessage = parsedMessage.message;
          } catch (e) {
            console.error('Failed to parse _server_messages', e);
          }
        } else if (errorData.exception) {
          if (errorData.exception.includes('Duplicate entry')) {
            const match = errorData.exception.match(/Duplicate entry '(.+)' for key '(.+)'/);
            if (match) {
              errorMessage = `Value '${match[1]}' for field already exists.`;
            } else {
              errorMessage = "A unique field value already exists in the system.";
            }
          } else {
            errorMessage = errorData.exception.split(':').pop()?.trim() || errorMessage;
          }
        }
      }

      toast.error(errorMessage, { duration: 5000 });
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto [&>button:last-child]:top-6 [&>button:last-child]:right-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {initialData ? 'Edit Member Details' : 'Add New Member Application'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? `Update details for ${initialData.member_name}`
              : 'Provide the required details to create a new member application.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+254..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="national_id">National ID</Label>
                <Input
                  id="national_id"
                  value={formData.national_id}
                  onChange={(e) => handleChange('national_id', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">Location Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Select value={formData.county} onValueChange={handleCountyChange}>
                    <SelectTrigger id="county">
                      <SelectValue placeholder="Select County" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((c) => (
                        <SelectItem key={c.county_code} value={c.county_name}>
                          {c.county_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub_county">Sub-County</Label>
                  <Select
                    value={formData.sub_county}
                    onValueChange={handleSubCountyChange}
                    disabled={!formData.county || isLoadingLocations}
                  >
                    <SelectTrigger id="sub_county">
                      <SelectValue placeholder={isLoadingLocations ? "Loading..." : "Select Sub-County"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subCounties.map((sc) => (
                        <SelectItem key={sc.name} value={sc.name}>
                          {sc.constituency_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ward">Ward</Label>
                  <Select
                    value={formData.ward}
                    onValueChange={(value) => handleChange('ward', value)}
                    disabled={!formData.sub_county || isLoadingLocations}
                  >
                    <SelectTrigger id="ward">
                      <SelectValue placeholder={isLoadingLocations ? "Loading..." : "Select Ward"} />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((w) => (
                        <SelectItem key={w.name} value={w.ward_name}>
                          {w.ward_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">Village</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => handleChange('village', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">National ID Image</h3>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors relative">
                  {formData.national_id_image ? (
                    <div className="relative w-full aspect-video">
                      <img src={formData.national_id_image} alt="National ID" className="object-contain w-full h-full" />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleChange('national_id_image', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">Click to upload National ID</p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e, 'national_id_image')}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">Passport Photo</h3>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors relative">
                  {formData.passport_photo ? (
                    <div className="relative w-24 h-24">
                      <img src={formData.passport_photo} alt="Passport" className="object-cover w-full h-full rounded-md" />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleChange('passport_photo', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">Click to upload Passport Photo</p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e, 'passport_photo')}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting
                ? (initialData ? 'Updating...' : 'Submitting...')
                : (initialData ? 'Update Member' : 'Create Application')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
