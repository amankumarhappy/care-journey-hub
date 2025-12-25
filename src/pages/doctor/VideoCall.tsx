import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageSquare, 
  FileText,
  User,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useToast } from '@/hooks/use-toast';

export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { appointments, updateAppointment } = useAppointments();
  
  const appointment = appointments.find(a => a.id === appointmentId);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [showNotes, setShowNotes] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);

  // Simulated call timer
  useState(() => {
    const interval = setInterval(() => {
      if (isCallActive) {
        setCallDuration(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    updateAppointment(appointmentId!, { notes });
    toast({
      title: "Call Ended",
      description: "Redirecting to prescription form...",
    });
    navigate(`/doctor/appointments/${appointmentId}/prescription`);
  };

  const handleSaveNotes = () => {
    updateAppointment(appointmentId!, { notes });
    toast({
      title: "Notes Saved",
      description: "Consultation notes have been saved.",
    });
  };

  if (!appointment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Appointment not found</p>
            <Button className="mt-4" asChild>
              <Link to="/doctor/appointments">Back to Appointments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex flex-col lg:flex-row">
        {/* Video Area */}
        <div className="flex-1 relative bg-muted/20">
          {/* Main Video (Patient) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-4xl max-h-[70vh] bg-muted rounded-lg mx-4 flex items-center justify-center">
              <div className="text-center">
                <div className="h-32 w-32 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-5xl font-semibold mx-auto mb-4">
                  {appointment.patientName.charAt(0)}
                </div>
                <p className="text-xl font-medium">{appointment.patientName}</p>
                <p className="text-muted-foreground">Video call in progress...</p>
              </div>
            </div>
          </div>

          {/* Self Video (Doctor) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-muted/80 rounded-lg border border-border flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center">
                <User className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">You</p>
              </div>
            ) : (
              <VideoOff className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {/* Call Info Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-background/80 backdrop-blur">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(callDuration)}
              </Badge>
              <Badge variant="default" className="bg-success text-success-foreground">
                Live
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur"
              onClick={() => setShowNotes(!showNotes)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Notes
            </Button>
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 bg-background/80 backdrop-blur rounded-full border border-border">
            <Button
              variant={isMicOn ? "outline" : "destructive"}
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button
              variant={isVideoOn ? "outline" : "destructive"}
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-14 w-14"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Notes Sidebar */}
        {showNotes && (
          <div className="w-full lg:w-96 border-l border-border bg-background p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consultation Notes
              </h3>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Patient: <span className="font-medium text-foreground">{appointment.patientName}</span></p>
              <p className="text-sm text-muted-foreground">Date: <span className="font-medium text-foreground">{appointment.date}</span></p>
            </div>

            <Textarea
              placeholder="Write your consultation notes here..."
              className="flex-1 min-h-[200px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
            <Button className="mt-4 gradient-primary border-0" onClick={handleSaveNotes}>
              Save Notes
            </Button>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Notes will be auto-saved when you end the call
            </p>
          </div>
        )}
      </div>
    </div>
  );
}