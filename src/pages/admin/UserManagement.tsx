import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  Users, 
  UserCheck,
  Truck,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'delivery';
  status: 'active' | 'suspended';
  joinedDate: string;
  location: string;
  totalAppointments?: number;
  totalDeliveries?: number;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Rahul Kumar', email: 'rahul@email.com', phone: '+91 98765 43210', role: 'patient', status: 'active', joinedDate: '2024-01-10', location: 'Patna', totalAppointments: 5 },
    { id: '2', name: 'Meena Devi', email: 'meena@email.com', phone: '+91 87654 32109', role: 'patient', status: 'active', joinedDate: '2024-01-08', location: 'Muzaffarpur', totalAppointments: 3 },
    { id: '3', name: 'Suresh Yadav', email: 'suresh@email.com', phone: '+91 76543 21098', role: 'patient', status: 'suspended', joinedDate: '2024-01-05', location: 'Gaya', totalAppointments: 1 },
    { id: '4', name: 'Dr. Priya Sharma', email: 'priya.doctor@email.com', phone: '+91 65432 10987', role: 'doctor', status: 'active', joinedDate: '2024-01-15', location: 'Patna', totalAppointments: 45 },
    { id: '5', name: 'Dr. Amit Verma', email: 'amit.doctor@email.com', phone: '+91 54321 09876', role: 'doctor', status: 'active', joinedDate: '2024-01-12', location: 'Bhagalpur', totalAppointments: 32 },
    { id: '6', name: 'Raju Singh', email: 'raju@email.com', phone: '+91 43210 98765', role: 'delivery', status: 'active', joinedDate: '2024-01-18', location: 'Patna', totalDeliveries: 28 },
    { id: '7', name: 'Mohan Prasad', email: 'mohan@email.com', phone: '+91 32109 87654', role: 'delivery', status: 'active', joinedDate: '2024-01-16', location: 'Darbhanga', totalDeliveries: 15 },
  ]);

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    toast.success(`User ${newStatus === 'active' ? 'Activated' : 'Suspended'}`, {
      description: `${user.name} has been ${newStatus === 'active' ? 'activated' : 'suspended'}.`,
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patients = filteredUsers.filter(u => u.role === 'patient');
  const doctors = filteredUsers.filter(u => u.role === 'doctor');
  const deliveryAgents = filteredUsers.filter(u => u.role === 'delivery');

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'patient':
        return <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />Patient</Badge>;
      case 'doctor':
        return <Badge variant="default"><UserCheck className="h-3 w-3 mr-1" />Doctor</Badge>;
      case 'delivery':
        return <Badge variant="outline"><Truck className="h-3 w-3 mr-1" />Delivery</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      : <Badge variant="outline" className="text-red-600 border-red-600"><Ban className="h-3 w-3 mr-1" />Suspended</Badge>;
  };

  const UserTable = ({ userList }: { userList: User[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {user.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {user.joinedDate}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedUser(user);
                      setShowDetailsDialog(true);
                    }}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                      {user.status === 'active' ? (
                        <>
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend User
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate User
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all platform users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctors.length}</p>
                <p className="text-sm text-muted-foreground">Doctors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{deliveryAgents.length}</p>
                <p className="text-sm text-muted-foreground">Delivery Agents</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Users ({filteredUsers.length})</TabsTrigger>
            <TabsTrigger value="patients">Patients ({patients.length})</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({doctors.length})</TabsTrigger>
            <TabsTrigger value="delivery">Delivery ({deliveryAgents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <UserTable userList={filteredUsers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <UserTable userList={patients} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <UserTable userList={doctors} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <UserTable userList={deliveryAgents} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>Complete user profile information</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{selectedUser.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleBadge(selectedUser.role)}
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedUser.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{selectedUser.joinedDate}</p>
                  </div>
                  {selectedUser.totalAppointments !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Total Appointments</p>
                      <p className="font-medium">{selectedUser.totalAppointments}</p>
                    </div>
                  )}
                  {selectedUser.totalDeliveries !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Total Deliveries</p>
                      <p className="font-medium">{selectedUser.totalDeliveries}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
              {selectedUser && (
                <Button 
                  variant={selectedUser.status === 'active' ? 'destructive' : 'default'}
                  onClick={() => {
                    handleToggleStatus(selectedUser);
                    setShowDetailsDialog(false);
                  }}
                >
                  {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
