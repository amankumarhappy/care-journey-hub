import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments, AppointmentStatus } from '@/contexts/AppointmentContext';

const statusColors: Record<AppointmentStatus, string> = {
  pending: 'bg-warning/10 text-warning border-warning/30',
  confirmed: 'bg-primary/10 text-primary border-primary/30',
  completed: 'bg-success/10 text-success border-success/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
};

export default function PatientAppointments() {
  const { user } = useAuth();
  const { getPatientAppointments } = useAppointments();
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  
  const appointments = user ? getPatientAppointments(user.id) : [];
  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Appointments</h1>
          <p className="text-muted-foreground">Manage your consultations</p>
        </div>
        <Button className="gradient-primary border-0" asChild>
          <Link to="/dashboard/appointments/book">
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-0">
          {filteredAppointments.length > 0 ? (
            <div className="grid gap-4">
              {filteredAppointments.map(apt => (
                <Card key={apt.id} className="border-border/50 hover:shadow-soft transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-semibold flex-shrink-0">
                        {apt.doctorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{apt.doctorName}</h3>
                        <p className="text-muted-foreground">{apt.specialty}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {apt.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusColors[apt.status]} variant="outline">
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>
                        {apt.status === 'confirmed' && (
                          <Button size="sm" className="gradient-primary border-0">
                            <Video className="mr-2 h-4 w-4" />
                            Join Call
                          </Button>
                        )}
                        {apt.status === 'completed' && (
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/dashboard/appointments/${apt.id}`}>View Details</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border/50">
              <CardContent className="pt-12 pb-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No appointments found</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? "You haven't booked any appointments yet." 
                    : `No ${filter} appointments.`}
                </p>
                <Button className="gradient-primary border-0" asChild>
                  <Link to="/dashboard/appointments/book">Book Your First Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
