import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  registrationNumber: string;
  experience: string;
  qualification: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

const DoctorApprovals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      specialty: 'Cardiology',
      registrationNumber: 'MCI-2020-12345',
      experience: '8 years',
      qualification: 'MBBS, MD (Cardiology)',
      appliedDate: '2024-01-18',
      status: 'pending',
      documents: ['Medical License', 'Degree Certificate', 'ID Proof'],
    },
    {
      id: '2',
      name: 'Dr. Amit Verma',
      email: 'amit.verma@email.com',
      phone: '+91 87654 32109',
      specialty: 'Pediatrics',
      registrationNumber: 'MCI-2019-54321',
      experience: '10 years',
      qualification: 'MBBS, DCH',
      appliedDate: '2024-01-17',
      status: 'pending',
      documents: ['Medical License', 'Degree Certificate'],
    },
    {
      id: '3',
      name: 'Dr. Sunita Devi',
      email: 'sunita.devi@email.com',
      phone: '+91 76543 21098',
      specialty: 'General Medicine',
      registrationNumber: 'MCI-2018-67890',
      experience: '12 years',
      qualification: 'MBBS, MD',
      appliedDate: '2024-01-16',
      status: 'pending',
      documents: ['Medical License', 'Degree Certificate', 'ID Proof'],
    },
    {
      id: '4',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 65432 10987',
      specialty: 'Orthopedics',
      registrationNumber: 'MCI-2017-11111',
      experience: '15 years',
      qualification: 'MBBS, MS (Ortho)',
      appliedDate: '2024-01-15',
      status: 'approved',
      documents: ['Medical License', 'Degree Certificate', 'ID Proof'],
    },
    {
      id: '5',
      name: 'Dr. Kavita Singh',
      email: 'kavita.singh@email.com',
      phone: '+91 54321 09876',
      specialty: 'Dermatology',
      registrationNumber: 'MCI-2021-22222',
      experience: '5 years',
      qualification: 'MBBS, MD (Dermatology)',
      appliedDate: '2024-01-14',
      status: 'rejected',
      documents: ['Medical License'],
    },
  ]);

  const handleApprove = (doctor: Doctor) => {
    setDoctors(prev => prev.map(d => 
      d.id === doctor.id ? { ...d, status: 'approved' as const } : d
    ));
    toast.success('Doctor Approved!', {
      description: `${doctor.name} has been approved and can now access the platform.`,
    });
    setShowDetailsDialog(false);
  };

  const handleReject = () => {
    if (!selectedDoctor) return;
    
    setDoctors(prev => prev.map(d => 
      d.id === selectedDoctor.id ? { ...d, status: 'rejected' as const } : d
    ));
    toast.error('Doctor Application Rejected', {
      description: `${selectedDoctor.name}'s application has been rejected.`,
    });
    setShowRejectDialog(false);
    setShowDetailsDialog(false);
    setRejectionReason('');
  };

  const openRejectDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectDialog(true);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingDoctors = filteredDoctors.filter(d => d.status === 'pending');
  const approvedDoctors = filteredDoctors.filter(d => d.status === 'approved');
  const rejectedDoctors = filteredDoctors.filter(d => d.status === 'rejected');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{doctor.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{doctor.registrationNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{doctor.phone}</span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            {getStatusBadge(doctor.status)}
            <p className="text-xs text-muted-foreground">Applied: {doctor.appliedDate}</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              setSelectedDoctor(doctor);
              setShowDetailsDialog(true);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {doctor.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleApprove(doctor)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => openRejectDialog(doctor)}
              >
                <UserX className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve doctor applications</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or registration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingDoctors.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved ({approvedDoctors.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({rejectedDoctors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-4">
              {pendingDoctors.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold">All Caught Up!</h3>
                    <p className="text-muted-foreground">No pending doctor approvals</p>
                  </CardContent>
                </Card>
              ) : (
                pendingDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <div className="grid gap-4">
              {approvedDoctors.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Approved Doctors</h3>
                    <p className="text-muted-foreground">Approved doctors will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                approvedDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <div className="grid gap-4">
              {rejectedDoctors.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Rejected Applications</h3>
                    <p className="text-muted-foreground">Rejected applications will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                rejectedDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Doctor Application Details</DialogTitle>
              <DialogDescription>Review the complete application</DialogDescription>
            </DialogHeader>
            {selectedDoctor && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{selectedDoctor.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedDoctor.name}</h3>
                    <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
                    {getStatusBadge(selectedDoctor.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedDoctor.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedDoctor.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Registration Number</p>
                    <p className="font-medium">{selectedDoctor.registrationNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{selectedDoctor.experience}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-muted-foreground">Qualification</p>
                    <p className="font-medium">{selectedDoctor.qualification}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Uploaded Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.documents.map((doc, index) => (
                      <Badge key={index} variant="secondary">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedDoctor?.status === 'pending' && (
                <>
                  <Button variant="outline" onClick={() => openRejectDialog(selectedDoctor)}>
                    <UserX className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={() => handleApprove(selectedDoctor)}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Approve Doctor
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this application
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}>
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DoctorApprovals;
