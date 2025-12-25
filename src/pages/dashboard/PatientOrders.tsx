import { Package, Truck, Clock, CheckCircle, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

const statusSteps = {
  pending: 0,
  accepted: 1,
  out_for_delivery: 2,
  delivered: 3,
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export default function PatientOrders() {
  const { user } = useAuth();
  const { getPatientAppointments } = useAppointments();
  
  const appointments = user ? getPatientAppointments(user.id) : [];
  const orders = appointments.filter(apt => apt.prescription).map(apt => ({
    id: apt.prescription!.id,
    appointmentId: apt.id,
    doctorName: apt.doctorName,
    date: apt.date,
    medicines: apt.prescription!.medicines,
    status: apt.prescription!.deliveryStatus,
    deliveryPartner: apt.prescription!.deliveryPartnerName,
  }));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track your medicine deliveries</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id} className="border-border/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      Prescribed by {order.doctorName} on {order.date}
                    </CardDescription>
                  </div>
                  <Badge className={order.status === 'delivered' ? 'bg-success' : 'bg-primary'}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Tracker */}
                <div className="flex items-center justify-between">
                  {(['pending', 'accepted', 'out_for_delivery', 'delivered'] as const).map((step, index) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                        statusSteps[order.status] >= index 
                          ? 'gradient-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index === 0 && <Package className="h-5 w-5" />}
                        {index === 1 && <CheckCircle className="h-5 w-5" />}
                        {index === 2 && <Truck className="h-5 w-5" />}
                        {index === 3 && <CheckCircle className="h-5 w-5" />}
                      </div>
                      <span className="text-xs text-center text-muted-foreground hidden sm:block">
                        {statusLabels[step]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Medicines List */}
                <div className="border rounded-lg divide-y divide-border">
                  {order.medicines.map((med, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.timing} • {med.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.deliveryPartner && (
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Delivery Partner</p>
                      <p className="text-sm text-muted-foreground">{order.deliveryPartner}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="pt-12 pb-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              Orders will appear here after your doctor prescribes medicines.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
