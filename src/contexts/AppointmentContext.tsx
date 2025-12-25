import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  prescription?: Prescription;
  transcript?: string;
  careSummary?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  medicines: Medicine[];
  instructions: string;
  deliveryStatus: 'pending' | 'accepted' | 'out_for_delivery' | 'delivered';
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  createAppointment: (data: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  getPatientAppointments: (patientId: string) => Appointment[];
  getDoctorAppointments: (doctorId: string) => Appointment[];
  getAllAppointments: () => Appointment[];
  getPendingPrescriptions: () => Prescription[];
  updatePrescriptionDelivery: (prescriptionId: string, data: Partial<Prescription>) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Initial mock appointments
const initialAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '3',
    patientName: 'Rahul Kumar',
    doctorId: '2',
    doctorName: 'Dr. Sharma',
    specialty: 'General Medicine',
    date: '2024-01-20',
    time: '10:00',
    status: 'pending',
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Rahul Kumar',
    doctorId: '2',
    doctorName: 'Dr. Sharma',
    specialty: 'General Medicine',
    date: '2024-01-15',
    time: '14:00',
    status: 'completed',
    notes: 'Patient has mild fever and cold symptoms.',
    transcript: 'Doctor: How are you feeling today?\nPatient: I have had fever for 2 days and runny nose.\nDoctor: Let me check your temperature... It\'s 99.5°F. This seems like a viral infection.\nDoctor: I\'ll prescribe some medicines. Take rest and drink plenty of fluids.',
    careSummary: '• Viral fever diagnosed\n• Take Paracetamol 500mg twice daily\n• Drink 8 glasses of water daily\n• Rest for 3 days\n• Follow up if fever persists',
    prescription: {
      id: 'rx1',
      appointmentId: '2',
      medicines: [
        { name: 'Paracetamol 500mg', dosage: '1 tablet', timing: 'Morning & Night', duration: '5 days' },
        { name: 'Cetirizine 10mg', dosage: '1 tablet', timing: 'Night', duration: '3 days' },
        { name: 'Vitamin C 500mg', dosage: '1 tablet', timing: 'Morning', duration: '7 days' },
      ],
      instructions: 'Take medicines after food. Rest well and stay hydrated.',
      deliveryStatus: 'pending',
    },
  },
];

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const createAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: Date.now().toString(),
      status: 'pending',
    };
    setAppointments(prev => [...prev, newAppointment]);
    
    // Notification: New appointment booked
    toast.success('Appointment Booked!', {
      description: `Your appointment with ${data.doctorName} on ${data.date} at ${data.time} is pending confirmation.`,
    });
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    const currentAppointment = appointments.find(apt => apt.id === id);
    
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, ...data } : apt))
    );

    // Trigger notifications based on status changes
    if (currentAppointment) {
      if (data.status === 'confirmed' && currentAppointment.status !== 'confirmed') {
        toast.success('Appointment Confirmed!', {
          description: `Your appointment with ${currentAppointment.doctorName} on ${currentAppointment.date} has been confirmed.`,
        });
      }
      
      if (data.status === 'cancelled' && currentAppointment.status !== 'cancelled') {
        toast.error('Appointment Declined', {
          description: `The appointment on ${currentAppointment.date} was not accepted.`,
        });
      }
      
      if (data.status === 'completed' && currentAppointment.status !== 'completed') {
        toast.success('Consultation Completed!', {
          description: `Your consultation with ${currentAppointment.doctorName} is complete.`,
        });
      }
      
      if (data.prescription && !currentAppointment.prescription) {
        toast.success('Prescription Created!', {
          description: `${data.prescription.medicines.length} medicine(s) prescribed. Delivery team notified.`,
        });
      }
    }
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(apt => apt.patientId === patientId);
  };

  const getDoctorAppointments = (doctorId: string) => {
    return appointments.filter(apt => apt.doctorId === doctorId);
  };

  const getAllAppointments = () => appointments;

  const getPendingPrescriptions = () => {
    return appointments
      .filter(apt => apt.prescription && apt.prescription.deliveryStatus !== 'delivered')
      .map(apt => apt.prescription!);
  };

  const updatePrescriptionDelivery = (prescriptionId: string, data: Partial<Prescription>) => {
    const currentAppointment = appointments.find(apt => apt.prescription?.id === prescriptionId);
    
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.prescription?.id === prescriptionId) {
          return {
            ...apt,
            prescription: { ...apt.prescription, ...data },
          };
        }
        return apt;
      })
    );

    // Trigger notifications for delivery status changes
    if (currentAppointment?.prescription) {
      const oldStatus = currentAppointment.prescription.deliveryStatus;
      
      if (data.deliveryStatus === 'accepted' && oldStatus !== 'accepted') {
        toast.info('Delivery Accepted', {
          description: `A delivery partner has accepted your medicine order.`,
        });
      }
      
      if (data.deliveryStatus === 'out_for_delivery' && oldStatus !== 'out_for_delivery') {
        toast.info('Out for Delivery', {
          description: `Your medicines are on the way!`,
        });
      }
      
      if (data.deliveryStatus === 'delivered' && oldStatus !== 'delivered') {
        toast.success('Delivered!', {
          description: `Your medicines have been delivered successfully.`,
        });
      }
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        createAppointment,
        updateAppointment,
        getPatientAppointments,
        getDoctorAppointments,
        getAllAppointments,
        getPendingPrescriptions,
        updatePrescriptionDelivery,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
