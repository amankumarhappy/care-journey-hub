import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import JoinPage from "./pages/JoinPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DisclaimerPage from "./pages/DisclaimerPage";

// Patient Dashboard
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import PatientAppointments from "./pages/dashboard/PatientAppointments";
import BookAppointment from "./pages/dashboard/BookAppointment";
import PatientOrders from "./pages/dashboard/PatientOrders";
import CareJourney from "./pages/dashboard/CareJourney";
import PatientSettings from "./pages/dashboard/PatientSettings";

// Doctor Dashboard
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import PatientDetails from "./pages/doctor/PatientDetails";
import VideoCall from "./pages/doctor/VideoCall";
import CreatePrescription from "./pages/doctor/CreatePrescription";
import DoctorSettings from "./pages/doctor/DoctorSettings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <AppointmentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />

                {/* Patient Dashboard */}
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/dashboard/appointments" element={<PatientAppointments />} />
                <Route path="/dashboard/appointments/book" element={<BookAppointment />} />
                <Route path="/dashboard/orders" element={<PatientOrders />} />
                <Route path="/dashboard/care-journey" element={<CareJourney />} />
                <Route path="/dashboard/settings" element={<PatientSettings />} />

                {/* Doctor Dashboard */}
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/appointments/:appointmentId/video" element={<VideoCall />} />
                <Route path="/doctor/appointments/:appointmentId/prescription" element={<CreatePrescription />} />
                <Route path="/doctor/patients" element={<DoctorPatients />} />
                <Route path="/doctor/patients/:patientId" element={<PatientDetails />} />
                <Route path="/doctor/settings" element={<DoctorSettings />} />

                {/* Placeholders for other dashboards */}
                <Route path="/admin" element={<PatientDashboard />} />
                <Route path="/admin/*" element={<PatientDashboard />} />
                <Route path="/delivery" element={<PatientDashboard />} />
                <Route path="/delivery/*" element={<PatientDashboard />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppointmentProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
