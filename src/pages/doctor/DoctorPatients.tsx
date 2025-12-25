import { Link } from 'react-router-dom';
import { User, Calendar, FileText, Pill, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useState, useMemo } from 'react';

export default function DoctorPatients() {
  const { user } = useAuth();
  const { getDoctorAppointments } = useAppointments();
  const [searchQuery, setSearchQuery] = useState('');
  
  const appointments = user ? getDoctorAppointments(user.id) : [];

  // Group appointments by patient
  const patients = useMemo(() => {
    const patientMap = new Map<string, {
      id: string;
      name: string;
      appointments: typeof appointments;
      lastVisit: string;
      totalVisits: number;
    }>();

    appointments.forEach(apt => {
      if (!patientMap.has(apt.patientId)) {
        patientMap.set(apt.patientId, {
          id: apt.patientId,
          name: apt.patientName,
          appointments: [],
          lastVisit: apt.date,
          totalVisits: 0,
        });
      }
      const patient = patientMap.get(apt.patientId)!;
      patient.appointments.push(apt);
      patient.totalVisits++;
      if (apt.date > patient.lastVisit) {
        patient.lastVisit = apt.date;
      }
    });

    return Array.from(patientMap.values());
  }, [appointments]);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Patient History</h1>
        <p className="text-muted-foreground">View and manage your patients' records</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search patients by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => {
            const completedAppointments = patient.appointments.filter(a => a.status === 'completed');
            const hasPrescription = patient.appointments.some(a => a.prescription);
            
            return (
              <Card key={patient.id} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-semibold shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
                        </div>
                        <div className="flex gap-2">
                          {hasPrescription && (
                            <Badge variant="outline" className="gap-1">
                              <Pill className="h-3 w-3" />
                              Has Prescriptions
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Last visit: {patient.lastVisit}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {patient.totalVisits} total visits
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {completedAppointments.length} completed
                        </span>
                      </div>
                      
                      {/* Recent appointments preview */}
                      {completedAppointments.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">Recent Consultations:</p>
                          <div className="flex flex-wrap gap-2">
                            {completedAppointments.slice(0, 3).map(apt => (
                              <Badge key={apt.id} variant="secondary" className="text-xs">
                                {apt.date}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/doctor/patients/${patient.id}`}>
                          View Full History
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {searchQuery ? 'No Patients Found' : 'No Patients Yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Patients will appear here after consultations'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}