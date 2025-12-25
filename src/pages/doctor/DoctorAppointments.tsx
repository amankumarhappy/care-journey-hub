import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, CheckCircle, XCircle, FileText, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments, AppointmentStatus } from '@/contexts/AppointmentContext';

const statusStyles: Record<AppointmentStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }> = {
  pending: { variant: 'secondary', label: 'Pending' },
  confirmed: { variant: 'default', label: 'Confirmed' },
  completed: { variant: 'outline', label: 'Completed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
};

export default function DoctorAppointments() {
  const { user } = useAuth();
  const { getDoctorAppointments, updateAppointment } = useAppointments();
  const [activeTab, setActiveTab] = useState('pending');
  
  const appointments = user ? getDoctorAppointments(user.id) : [];

  const handleAccept = (id: string) => {
    updateAppointment(id, { status: 'confirmed' });
  };

  const handleReject = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  const filterByStatus = (status: AppointmentStatus | 'all') => {
    if (status === 'all') return appointments;
    return appointments.filter(apt => apt.status === status);
  };

  const AppointmentCard = ({ apt }: { apt: typeof appointments[0] }) => {
    const style = statusStyles[apt.status];
    
    return (
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold shrink-0">
              {apt.patientName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold">{apt.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                </div>
                <Badge variant={style.variant}>{style.label}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {apt.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {apt.time}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {apt.status === 'pending' && (
                  <>
                    <Button size="sm" className="gradient-primary border-0" onClick={() => handleAccept(apt.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleReject(apt.id)}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </>
                )}
                {apt.status === 'confirmed' && (
                  <>
                    <Button size="sm" className="gradient-primary border-0" asChild>
                      <Link to={`/doctor/appointments/${apt.id}/video`}>
                        <Video className="h-4 w-4 mr-1" />
                        Start Video Call
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/doctor/patients/${apt.patientId}`}>
                        <User className="h-4 w-4 mr-1" />
                        View Patient
                      </Link>
                    </Button>
                  </>
                )}
                {apt.status === 'completed' && (
                  <>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/doctor/appointments/${apt.id}/details`}>
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/doctor/patients/${apt.patientId}`}>
                        <User className="h-4 w-4 mr-1" />
                        Patient History
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Appointments</h1>
        <p className="text-muted-foreground">Manage your patient appointments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {filterByStatus('pending').length > 0 && (
              <Badge variant="secondary" className="ml-1">{filterByStatus('pending').length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filterByStatus('pending').length > 0 ? (
            filterByStatus('pending').map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No pending appointment requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {filterByStatus('confirmed').length > 0 ? (
            filterByStatus('confirmed').map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Confirmed Appointments</h3>
                <p className="text-muted-foreground">Accept pending requests to see them here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterByStatus('completed').length > 0 ? (
            filterByStatus('completed').map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Completed Appointments</h3>
                <p className="text-muted-foreground">Completed consultations will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map(apt => <AppointmentCard key={apt.id} apt={apt} />)
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Appointments Yet</h3>
                <p className="text-muted-foreground">Patient appointments will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}