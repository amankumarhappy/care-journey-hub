import { useState } from 'react';
import { User, Clock, Bell, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorSettings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
    registrationNumber: user?.registrationNumber || '',
    bio: '',
    consultationFee: '500',
  });

  const [availability, setAvailability] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({
    Monday: { enabled: true, start: '09:00', end: '17:00' },
    Tuesday: { enabled: true, start: '09:00', end: '17:00' },
    Wednesday: { enabled: true, start: '09:00', end: '17:00' },
    Thursday: { enabled: true, start: '09:00', end: '17:00' },
    Friday: { enabled: true, start: '09:00', end: '17:00' },
    Saturday: { enabled: false, start: '09:00', end: '13:00' },
    Sunday: { enabled: false, start: '09:00', end: '13:00' },
  });

  const [notifications, setNotifications] = useState({
    newAppointments: true,
    appointmentReminders: true,
    patientMessages: true,
    emailNotifications: true,
  });

  const handleSaveProfile = () => {
    updateUser({
      name: formData.name,
      phone: formData.phone,
    });
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveAvailability = () => {
    toast({
      title: "Availability Updated",
      description: "Your schedule has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label>Specialization</Label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
              <div>
                <Label>Registration Number</Label>
                <Input
                  value={formData.registrationNumber}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label>Consultation Fee (₹)</Label>
                <Input
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell patients about yourself, your experience, and areas of expertise..."
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleSaveProfile} className="gradient-primary border-0">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Availability Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Availability Schedule
            </CardTitle>
            <CardDescription>Set your working hours for each day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map(day => (
              <div key={day} className="flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 min-w-[140px]">
                  <Switch
                    checked={availability[day].enabled}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <span className={availability[day].enabled ? 'font-medium' : 'text-muted-foreground'}>
                    {day}
                  </span>
                </div>
                {availability[day].enabled && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={availability[day].start}
                      onValueChange={(value) => setAvailability(prev => ({
                        ...prev,
                        [day]: { ...prev[day], start: value }
                      }))}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">to</span>
                    <Select
                      value={availability[day].end}
                      onValueChange={(value) => setAvailability(prev => ({
                        ...prev,
                        [day]: { ...prev[day], end: value }
                      }))}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {!availability[day].enabled && (
                  <span className="text-sm text-muted-foreground">Not available</span>
                )}
              </div>
            ))}
            <Button onClick={handleSaveAvailability} className="gradient-primary border-0">
              <Save className="h-4 w-4 mr-2" />
              Save Availability
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Appointment Requests</p>
                <p className="text-sm text-muted-foreground">Get notified when patients book appointments</p>
              </div>
              <Switch
                checked={notifications.newAppointments}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newAppointments: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Appointment Reminders</p>
                <p className="text-sm text-muted-foreground">Reminder 15 minutes before scheduled appointments</p>
              </div>
              <Switch
                checked={notifications.appointmentReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Patient Messages</p>
                <p className="text-sm text-muted-foreground">Notifications for patient inquiries</p>
              </div>
              <Switch
                checked={notifications.patientMessages}
                onCheckedChange={(checked) => setNotifications({ ...notifications, patientMessages: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              />
            </div>
            <Button onClick={handleSaveNotifications} className="gradient-primary border-0">
              <Save className="h-4 w-4 mr-2" />
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-medium text-success">Verified Doctor</p>
                <p className="text-sm text-muted-foreground">Your account has been verified and approved by MedioKart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}