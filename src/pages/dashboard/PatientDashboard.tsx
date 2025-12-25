import { Link } from 'react-router-dom';
import { Calendar, ShoppingCart, Gamepad2, TrendingUp, Clock, Pill, ChevronRight, Video } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { getPatientAppointments } = useAppointments();
  
  const appointments = user ? getPatientAppointments(user.id) : [];
  const lastAppointment = appointments.find(a => a.status === 'completed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-muted-foreground">Here's your health overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coins Earned</p>
                <p className="text-2xl font-bold text-primary">{user?.coins || 0} 🪙</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{pendingAppointments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-secondary/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subscription</p>
                <Badge variant={user?.subscriptionStatus === 'paid' ? 'default' : 'secondary'} className="mt-1">
                  {user?.subscriptionStatus === 'paid' ? 'Premium' : 'Free'}
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Button className="h-auto py-4 gradient-primary border-0 flex-col gap-2" asChild>
          <Link to="/dashboard/appointments/book">
            <Video className="h-6 w-6" />
            <span>Book Appointment</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/dashboard/appointments">
            <Calendar className="h-6 w-6" />
            <span>View Appointments</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/dashboard/care-journey">
            <Gamepad2 className="h-6 w-6" />
            <span>Care Journey</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/dashboard/orders">
            <Pill className="h-6 w-6" />
            <span>My Orders</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last Consultation */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Last Consultation</CardTitle>
            <CardDescription>Your most recent doctor visit</CardDescription>
          </CardHeader>
          <CardContent>
            {lastAppointment ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {lastAppointment.doctorName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{lastAppointment.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{lastAppointment.specialty}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {lastAppointment.date} at {lastAppointment.time}
                    </p>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                {lastAppointment.careSummary && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Care Summary</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{lastAppointment.careSummary}</p>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/dashboard/appointments/${lastAppointment.id}`}>
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No consultations yet</p>
                <Button className="gradient-primary border-0" asChild>
                  <Link to="/dashboard/appointments/book">Book Your First Appointment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled consultations</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length > 0 ? (
              <div className="space-y-4">
                {pendingAppointments.slice(0, 3).map(apt => (
                  <div key={apt.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      {apt.doctorName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{apt.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
                    </div>
                    <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                      {apt.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/appointments">
                    View All
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button className="gradient-primary border-0" asChild>
                  <Link to="/dashboard/appointments/book">Book Appointment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
