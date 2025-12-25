import { Link } from 'react-router-dom';
import { Calendar, Users, Video, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { getDoctorAppointments, updateAppointment } = useAppointments();
  
  const appointments = user ? getDoctorAppointments(user.id) : [];
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const todayAppointments = confirmedAppointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const handleAccept = (id: string) => {
    updateAppointment(id, { status: 'confirmed' });
  };

  const handleReject = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Manage your appointments and patients.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingAppointments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-primary">{todayAppointments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-secondary">{confirmedAppointments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-secondary/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{completedAppointments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button className="h-auto py-4 gradient-primary border-0 flex-col gap-2" asChild>
          <Link to="/doctor/appointments">
            <Calendar className="h-6 w-6" />
            <span>View All Appointments</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/doctor/patients">
            <Users className="h-6 w-6" />
            <span>Patient History</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/doctor/settings">
            <Clock className="h-6 w-6" />
            <span>Manage Availability</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointments - Need Action */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Requests
            </CardTitle>
            <CardDescription>Appointments awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length > 0 ? (
              <div className="space-y-4">
                {pendingAppointments.slice(0, 3).map(apt => (
                  <div key={apt.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 gradient-primary border-0"
                        onClick={() => handleAccept(apt.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(apt.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="text-muted-foreground">No pending requests</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your confirmed appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {confirmedAppointments.length > 0 ? (
              <div className="space-y-4">
                {confirmedAppointments.slice(0, 4).map(apt => (
                  <div key={apt.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{apt.patientName}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {apt.date} at {apt.time}
                      </p>
                    </div>
                    <Button size="sm" className="gradient-primary border-0" asChild>
                      <Link to={`/doctor/appointments/${apt.id}/video`}>
                        <Video className="h-4 w-4 mr-1" />
                        Start
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No appointments scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}