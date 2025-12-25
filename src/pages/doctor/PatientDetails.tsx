import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, FileText, Pill, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

export default function PatientDetails() {
  const { patientId } = useParams();
  const { user } = useAuth();
  const { getDoctorAppointments } = useAppointments();
  
  const appointments = user ? getDoctorAppointments(user.id) : [];
  const patientAppointments = appointments.filter(apt => apt.patientId === patientId);
  const patientName = patientAppointments[0]?.patientName || 'Unknown Patient';
  
  const completedAppointments = patientAppointments.filter(a => a.status === 'completed');

  return (
    <DashboardLayout>
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/doctor/patients">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Link>
      </Button>

      {/* Patient Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold">
          {patientName.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{patientName}</h1>
          <p className="text-muted-foreground">Patient ID: {patientId}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patientAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/30 flex items-center justify-center">
                <Pill className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patientAppointments.filter(a => a.prescription).length}</p>
                <p className="text-sm text-muted-foreground">Prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultation History */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Consultation History</CardTitle>
          <CardDescription>All past consultations with this patient</CardDescription>
        </CardHeader>
        <CardContent>
          {completedAppointments.length > 0 ? (
            <div className="space-y-6">
              {completedAppointments.map((apt, index) => (
                <div key={apt.id}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          {apt.date}
                          <Clock className="h-4 w-4 ml-2" />
                          {apt.time}
                        </div>
                        <p className="font-medium">{apt.specialty}</p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>

                    {apt.notes && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm font-medium mb-2">Consultation Notes:</p>
                        <p className="text-sm text-muted-foreground">{apt.notes}</p>
                      </div>
                    )}

                    {apt.careSummary && (
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm font-medium mb-2">Care Summary:</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{apt.careSummary}</p>
                      </div>
                    )}

                    {apt.prescription && (
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Pill className="h-4 w-4 text-secondary" />
                          <p className="text-sm font-medium">Prescription</p>
                        </div>
                        <div className="space-y-2">
                          {apt.prescription.medicines.map((med, i) => (
                            <div key={i} className="flex flex-wrap justify-between gap-2 text-sm">
                              <span className="font-medium">{med.name}</span>
                              <span className="text-muted-foreground">
                                {med.dosage} - {med.timing} ({med.duration})
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                          {apt.prescription.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                  {index < completedAppointments.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No completed consultations yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}