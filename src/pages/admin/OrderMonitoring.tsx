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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Package, 
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  User,
  MapPin,
  Calendar,
  Pill
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Order {
  id: string;
  patientName: string;
  patientPhone: string;
  deliveryAddress: string;
  medicines: { name: string; quantity: string; dosage: string }[];
  status: 'pending' | 'accepted' | 'out_for_delivery' | 'delivered' | 'cancelled';
  assignedTo?: string;
  createdAt: string;
  totalAmount: string;
  prescriptionId: string;
}

const deliveryAgents = [
  { id: 'd1', name: 'Raju Singh' },
  { id: 'd2', name: 'Mohan Prasad' },
  { id: 'd3', name: 'Vikram Kumar' },
];

const OrderMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      patientName: 'Rahul Kumar',
      patientPhone: '+91 98765 43210',
      deliveryAddress: '123, Main Road, Patna, Bihar - 800001',
      medicines: [
        { name: 'Metformin 500mg', quantity: '30 tablets', dosage: 'Twice daily' },
        { name: 'Vitamin D3', quantity: '15 capsules', dosage: 'Once daily' },
      ],
      status: 'pending',
      createdAt: '2024-01-18',
      totalAmount: '₹450',
      prescriptionId: 'RX-2024-001',
    },
    {
      id: 'ORD002',
      patientName: 'Meena Devi',
      patientPhone: '+91 87654 32109',
      deliveryAddress: '45, Gandhi Nagar, Muzaffarpur, Bihar - 842001',
      medicines: [
        { name: 'Amoxicillin 500mg', quantity: '21 capsules', dosage: 'Thrice daily' },
      ],
      status: 'accepted',
      assignedTo: 'Raju Singh',
      createdAt: '2024-01-18',
      totalAmount: '₹320',
      prescriptionId: 'RX-2024-002',
    },
    {
      id: 'ORD003',
      patientName: 'Suresh Yadav',
      patientPhone: '+91 76543 21098',
      deliveryAddress: '78, Station Road, Gaya, Bihar - 823001',
      medicines: [
        { name: 'Amlodipine 5mg', quantity: '30 tablets', dosage: 'Once daily' },
        { name: 'Aspirin 75mg', quantity: '30 tablets', dosage: 'Once daily' },
      ],
      status: 'out_for_delivery',
      assignedTo: 'Mohan Prasad',
      createdAt: '2024-01-17',
      totalAmount: '₹580',
      prescriptionId: 'RX-2024-003',
    },
    {
      id: 'ORD004',
      patientName: 'Anita Kumari',
      patientPhone: '+91 65432 10987',
      deliveryAddress: '12, College Road, Bhagalpur, Bihar - 812001',
      medicines: [
        { name: 'Paracetamol 650mg', quantity: '10 tablets', dosage: 'As needed' },
      ],
      status: 'delivered',
      assignedTo: 'Vikram Kumar',
      createdAt: '2024-01-16',
      totalAmount: '₹120',
      prescriptionId: 'RX-2024-004',
    },
    {
      id: 'ORD005',
      patientName: 'Ramesh Sharma',
      patientPhone: '+91 54321 09876',
      deliveryAddress: '90, Market Area, Darbhanga, Bihar - 846001',
      medicines: [
        { name: 'Omeprazole 20mg', quantity: '14 capsules', dosage: 'Before breakfast' },
      ],
      status: 'cancelled',
      createdAt: '2024-01-15',
      totalAmount: '₹210',
      prescriptionId: 'RX-2024-005',
    },
  ]);

  const handleAssignAgent = () => {
    if (!selectedOrder || !selectedAgent) return;
    
    const agent = deliveryAgents.find(a => a.id === selectedAgent);
    setOrders(prev => prev.map(o => 
      o.id === selectedOrder.id ? { ...o, status: 'accepted' as const, assignedTo: agent?.name } : o
    ));
    toast.success('Delivery Agent Assigned', {
      description: `${agent?.name} has been assigned to order ${selectedOrder.id}.`,
    });
    setShowAssignDialog(false);
    setSelectedAgent('');
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
  const activeOrders = filteredOrders.filter(o => ['accepted', 'out_for_delivery'].includes(o.status));
  const completedOrders = filteredOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'out_for_delivery':
        return <Badge variant="outline" className="text-purple-600 border-purple-600"><Truck className="h-3 w-3 mr-1" />In Transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const OrderTable = ({ orderList }: { orderList: Order[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Medicines</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orderList.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.patientName}</p>
                  <p className="text-xs text-muted-foreground">{order.patientPhone}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Pill className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{order.medicines.length} item(s)</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{order.totalAmount}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>
                {order.assignedTo || (
                  <span className="text-muted-foreground text-sm">Not assigned</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetailsDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowAssignDialog(true);
                      }}
                    >
                      Assign
                    </Button>
                  )}
                </div>
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
          <h1 className="text-3xl font-bold text-foreground">Order Monitoring</h1>
          <p className="text-muted-foreground mt-1">Track and manage all medicine delivery orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Orders ({filteredOrders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="active">In Progress ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <OrderTable orderList={filteredOrders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <OrderTable orderList={pendingOrders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <OrderTable orderList={activeOrders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <OrderTable orderList={completedOrders} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Complete order information</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedOrder.id}</h3>
                    <p className="text-sm text-muted-foreground">Created: {selectedOrder.createdAt}</p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" /> Patient
                    </p>
                    <p className="font-medium">{selectedOrder.patientName}</p>
                    <p className="text-sm">{selectedOrder.patientPhone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Delivery Address
                    </p>
                    <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <Pill className="h-3 w-3" /> Medicines
                  </p>
                  <div className="space-y-2">
                    {selectedOrder.medicines.map((med, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        </div>
                        <Badge variant="secondary">{med.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{selectedOrder.assignedTo || 'Not assigned'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold">{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Agent Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Delivery Agent</DialogTitle>
              <DialogDescription>
                Select a delivery agent for order {selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery agent" />
              </SelectTrigger>
              <SelectContent>
                {deliveryAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
              <Button onClick={handleAssignAgent} disabled={!selectedAgent}>
                Assign Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default OrderMonitoring;
