import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Package, 
  FileText, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,247', icon: Users, trend: '+12%', color: 'text-blue-500' },
    { label: 'Pending Approvals', value: '8', icon: UserCheck, trend: 'Action needed', color: 'text-amber-500' },
    { label: 'Active Orders', value: '34', icon: Package, trend: '+5%', color: 'text-green-500' },
    { label: 'Transcripts to Review', value: '12', icon: FileText, trend: 'Pending', color: 'text-purple-500' },
  ];

  const pendingDoctors = [
    { id: '1', name: 'Dr. Priya Sharma', specialty: 'Cardiology', appliedDate: '2024-01-18' },
    { id: '2', name: 'Dr. Amit Verma', specialty: 'Pediatrics', appliedDate: '2024-01-17' },
    { id: '3', name: 'Dr. Sunita Devi', specialty: 'General Medicine', appliedDate: '2024-01-16' },
  ];

  const recentOrders = [
    { id: 'ORD001', patient: 'Rahul Kumar', status: 'pending', amount: '₹450', date: '2024-01-18' },
    { id: 'ORD002', patient: 'Meena Devi', status: 'out_for_delivery', amount: '₹320', date: '2024-01-18' },
    { id: 'ORD003', patient: 'Suresh Yadav', status: 'delivered', amount: '₹580', date: '2024-01-17' },
  ];

  const recentActivity = [
    { action: 'Doctor approved', details: 'Dr. Rajesh Kumar - Orthopedics', time: '2 hours ago', icon: CheckCircle },
    { action: 'New user registered', details: 'Anita Kumari from Patna', time: '3 hours ago', icon: Users },
    { action: 'Order completed', details: 'ORD-2024-098 delivered', time: '5 hours ago', icon: Package },
    { action: 'Transcript reviewed', details: 'Consultation #45 summarized', time: '6 hours ago', icon: FileText },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'out_for_delivery':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Package className="h-3 w-3 mr-1" />In Transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.color}`}>{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Doctor Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Pending Doctor Approvals
                </CardTitle>
                <CardDescription>Doctors waiting for verification</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/approvals">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Applied: {doctor.appliedDate}</p>
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs">Review</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-500" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Latest medicine delivery orders</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.patient}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild className="h-auto py-4 flex-col gap-2">
            <Link to="/admin/approvals">
              <UserCheck className="h-5 w-5" />
              <span>Doctor Approvals</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
            <Link to="/admin/users">
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
            <Link to="/admin/orders">
              <Package className="h-5 w-5" />
              <span>Monitor Orders</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
            <Link to="/admin/transcripts">
              <FileText className="h-5 w-5" />
              <span>Review Transcripts</span>
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
