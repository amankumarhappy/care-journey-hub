import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Pill, FileText, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAppointments, Medicine, Prescription } from '@/contexts/AppointmentContext';
import { useToast } from '@/hooks/use-toast';

const timingOptions = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
  'Morning & Night',
  'Morning, Afternoon & Night',
  'After meals',
  'Before meals',
  'As needed',
];

const durationOptions = [
  '3 days',
  '5 days',
  '7 days',
  '10 days',
  '14 days',
  '1 month',
  'Ongoing',
];

export default function CreatePrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { appointments, updateAppointment } = useAppointments();
  
  const appointment = appointments.find(a => a.id === appointmentId);
  
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: '', dosage: '', timing: '', duration: '' }
  ]);
  const [instructions, setInstructions] = useState('');
  const [careSummary, setCareSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', timing: '', duration: '' }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleSubmit = () => {
    // Validate
    const validMedicines = medicines.filter(m => m.name && m.dosage && m.timing && m.duration);
    if (validMedicines.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one complete medicine entry.",
        variant: "destructive",
      });
      return;
    }

    if (!instructions.trim()) {
      toast({
        title: "Error",
        description: "Please add general instructions.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const prescription: Prescription = {
      id: `rx-${Date.now()}`,
      appointmentId: appointmentId!,
      medicines: validMedicines,
      instructions,
      deliveryStatus: 'pending',
    };

    // Update appointment with prescription and mark as completed
    updateAppointment(appointmentId!, {
      prescription,
      careSummary: careSummary || generateCareSummary(validMedicines, instructions),
      status: 'completed',
    });

    toast({
      title: "Prescription Created",
      description: "The prescription has been sent to the patient and delivery team.",
    });

    setTimeout(() => {
      navigate('/doctor/appointments');
    }, 1500);
  };

  const generateCareSummary = (meds: Medicine[], instr: string): string => {
    let summary = "Care Instructions:\n\n";
    summary += "Medicines:\n";
    meds.forEach(med => {
      summary += `• ${med.name} - ${med.dosage}, ${med.timing} for ${med.duration}\n`;
    });
    summary += `\n${instr}`;
    return summary;
  };

  if (!appointment) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Appointment not found</p>
            <Button className="mt-4" asChild>
              <Link to="/doctor/appointments">Back to Appointments</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/doctor/appointments">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Prescription</h1>
        <p className="text-muted-foreground">
          For {appointment.patientName} • {appointment.date}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Consultation Notes */}
        {appointment.notes && (
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consultation Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{appointment.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Medicines */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Prescribed Medicines
            </CardTitle>
            <CardDescription>Add medicines for the patient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {medicines.map((medicine, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medicine {index + 1}</span>
                  {medicines.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeMedicine(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Medicine Name</Label>
                    <Input
                      placeholder="e.g., Paracetamol 500mg"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      placeholder="e.g., 1 tablet"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Timing</Label>
                    <Select
                      value={medicine.timing}
                      onValueChange={(value) => updateMedicine(index, 'timing', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        {timingOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Select
                      value={medicine.duration}
                      onValueChange={(value) => updateMedicine(index, 'duration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full" onClick={addMedicine}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Medicine
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">General Instructions</CardTitle>
            <CardDescription>Additional care instructions for the patient</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Take medicines after food. Drink plenty of water. Rest for 3 days..."
              className="min-h-[150px]"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Care Summary */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Care Summary (AI Assisted)</CardTitle>
            <CardDescription>Summary for patient's Care Journey (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Leave blank to auto-generate, or write a custom care summary..."
              className="min-h-[150px]"
              value={careSummary}
              onChange={(e) => setCareSummary(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <Card className="border-border/50 lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <p>This will:</p>
                <ul className="list-disc list-inside">
                  <li>Send prescription to patient</li>
                  <li>Notify delivery team</li>
                  <li>Mark appointment as completed</li>
                </ul>
              </div>
              <Button 
                size="lg" 
                className="gradient-primary border-0 min-w-[200px]"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 animate-pulse" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Create Prescription
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}