import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, User, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useToast } from '@/hooks/use-toast';

const specialties = [
  'General Medicine',
  'Pediatrics',
  'Dermatology',
  'Cardiology',
  'Orthopedics',
  'ENT',
  'Ophthalmology',
];

const doctors = [
  { id: '2', name: 'Dr. Sharma', specialty: 'General Medicine', rating: 4.8, experience: '10 years' },
  { id: '5', name: 'Dr. Patel', specialty: 'Pediatrics', rating: 4.9, experience: '8 years' },
  { id: '6', name: 'Dr. Gupta', specialty: 'Dermatology', rating: 4.7, experience: '12 years' },
  { id: '7', name: 'Dr. Singh', specialty: 'Cardiology', rating: 4.9, experience: '15 years' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredDoctors = specialty 
    ? doctors.filter(d => d.specialty === specialty)
    : doctors;

  const doctor = doctors.find(d => d.id === selectedDoctor);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    };
  });

  const handleSubmit = async () => {
    if (!user || !doctor) return;
    
    setIsSubmitting(true);
    
    createAppointment({
      patientId: user.id,
      patientName: user.name,
      doctorId: selectedDoctor,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
    });

    toast({
      title: 'Appointment Requested!',
      description: `Your appointment with ${doctor.name} is pending confirmation.`,
    });

    setIsSubmitting(false);
    navigate('/dashboard/appointments');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
          <p className="text-muted-foreground">Schedule a consultation with a doctor</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`h-1 w-16 sm:w-24 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Specialty & Doctor */}
        {step === 1 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Select Doctor</CardTitle>
              <CardDescription>Choose a specialty and doctor for your consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Available Doctors</Label>
                {filteredDoctors.map(doc => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedDoctor === doc.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDoctor(doc.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {doc.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                        <p className="text-sm text-muted-foreground">⭐ {doc.rating} • {doc.experience}</p>
                      </div>
                      {selectedDoctor === doc.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full gradient-primary border-0" 
                disabled={!selectedDoctor}
                onClick={() => setStep(2)}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>Choose when you'd like to have your consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Select Date</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dates.map(date => (
                    <Button
                      key={date.value}
                      variant={selectedDate === date.value ? 'default' : 'outline'}
                      className={selectedDate === date.value ? 'gradient-primary border-0' : ''}
                      onClick={() => setSelectedDate(date.value)}
                    >
                      {date.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Select Time</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      className={selectedTime === time ? 'gradient-primary border-0' : ''}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  className="flex-1 gradient-primary border-0" 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && doctor && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Confirm Appointment</CardTitle>
              <CardDescription>Review your appointment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{doctor.name}</p>
                    <p className="text-muted-foreground">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{selectedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{selectedTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ⚡ Video call link will be shared once the doctor confirms your appointment.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  className="flex-1 gradient-primary border-0" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
