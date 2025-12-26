import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  FileText, 
  Clock,
  CheckCircle,
  Eye,
  Send,
  User,
  Stethoscope,
  Calendar,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Transcript {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  appointmentDate: string;
  duration: string;
  rawTranscript: string;
  summary?: string;
  status: 'pending' | 'reviewed' | 'sent';
  createdAt: string;
}

const TranscriptReview = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [transcripts, setTranscripts] = useState<Transcript[]>([
    {
      id: 'TR001',
      patientName: 'Rahul Kumar',
      patientId: 'P001',
      doctorName: 'Dr. Priya Sharma',
      doctorId: 'D001',
      appointmentDate: '2024-01-18',
      duration: '15 min',
      rawTranscript: `Doctor: Good morning, Rahul. How are you feeling today?
Patient: Good morning, Doctor. I've been having some chest discomfort for the past week.
Doctor: I see. Can you describe the discomfort? Is it sharp or dull?
Patient: It's more of a dull ache, especially after meals.
Doctor: How often does this happen?
Patient: Almost every day, usually in the evening.
Doctor: Have you noticed any other symptoms like shortness of breath or sweating?
Patient: Sometimes I feel a bit short of breath, but no sweating.
Doctor: Based on your description, this could be related to acid reflux or GERD. I'd like to start you on some medication and recommend some lifestyle changes.
Patient: What kind of changes, Doctor?
Doctor: Avoid spicy and oily foods, don't lie down immediately after eating, and try to have dinner at least 3 hours before bedtime.
Doctor: I'm prescribing Omeprazole 20mg to be taken before breakfast for 14 days. Let's see how you respond.
Patient: Thank you, Doctor.
Doctor: If symptoms persist or worsen, come back immediately. Otherwise, we'll follow up in 2 weeks.`,
      status: 'pending',
      createdAt: '2024-01-18',
    },
    {
      id: 'TR002',
      patientName: 'Meena Devi',
      patientId: 'P002',
      doctorName: 'Dr. Amit Verma',
      doctorId: 'D002',
      appointmentDate: '2024-01-17',
      duration: '20 min',
      rawTranscript: `Doctor: Hello Meena ji. What brings you here today?
Patient: Namaste Doctor. My child has been having fever for 3 days.
Doctor: I see. What's the child's age and what temperature have you recorded?
Patient: She's 5 years old. Temperature was 101°F this morning.
Doctor: Any other symptoms? Cough, cold, body pain?
Patient: Yes, she has a runny nose and mild cough.
Doctor: Is she eating and drinking properly?
Patient: Not eating much, but drinking water and juice.
Doctor: This appears to be a viral infection, which is common in children. I'll prescribe some medication.
Doctor: Give Paracetamol syrup for fever, and a cough syrup. Make sure she stays hydrated.
Patient: How long will the fever last?
Doctor: Usually 3-5 days. If fever goes above 103°F or doesn't improve in 3 days, bring her back immediately.
Patient: Thank you, Doctor.`,
      status: 'pending',
      createdAt: '2024-01-17',
    },
    {
      id: 'TR003',
      patientName: 'Suresh Yadav',
      patientId: 'P003',
      doctorName: 'Dr. Sunita Devi',
      doctorId: 'D003',
      appointmentDate: '2024-01-16',
      duration: '25 min',
      rawTranscript: `Doctor: Good afternoon, Suresh ji. Please have a seat.
Patient: Thank you, Doctor. I came for my diabetes follow-up.
Doctor: Let me check your recent reports. Your fasting sugar is 145 and HbA1c is 7.2.
Patient: Is that good or bad, Doctor?
Doctor: It's slightly above the target. Fasting should be below 130 and HbA1c below 7.
Doctor: Are you taking your medicines regularly?
Patient: Yes, but sometimes I forget the evening dose.
Doctor: That's important. Missing doses can affect your sugar control.
Doctor: I'm going to add another medication. Take Metformin in the morning and Glimepiride in the evening.
Patient: What about my diet?
Doctor: Continue with the diet plan. Reduce rice portions and increase vegetables. Walk for 30 minutes daily.
Patient: When should I come for next check-up?
Doctor: Come back in 3 months with fresh blood tests. Keep monitoring your sugar at home.`,
      summary: `**Consultation Summary for Suresh Yadav**

**Diagnosis:** Type 2 Diabetes (Suboptimal Control)

**Key Findings:**
- Fasting sugar: 145 mg/dL (Target: <130)
- HbA1c: 7.2% (Target: <7%)
- Patient reports occasional missed evening doses

**Treatment Plan:**
1. Continue Metformin (morning)
2. Add Glimepiride (evening) - New medication
3. Dietary modifications: Reduce rice, increase vegetables
4. Daily exercise: 30 minutes walking

**Follow-up:** 3 months with fresh blood tests

**Care Instructions:**
- Do not miss any medication doses
- Monitor blood sugar at home regularly
- Maintain food diary if possible`,
      status: 'reviewed',
      createdAt: '2024-01-16',
    },
    {
      id: 'TR004',
      patientName: 'Anita Kumari',
      patientId: 'P004',
      doctorName: 'Dr. Rajesh Kumar',
      doctorId: 'D004',
      appointmentDate: '2024-01-15',
      duration: '18 min',
      rawTranscript: `Doctor: Welcome, Anita. What's troubling you today?
Patient: Doctor, I have severe back pain for the past month.
Doctor: Where exactly is the pain? Lower back or upper?
Patient: Lower back, and sometimes it goes down to my leg.
Doctor: Do you sit for long hours at work?
Patient: Yes, I work at a computer all day.
Doctor: This sounds like it could be related to your posture and muscle strain.
Doctor: I'm recommending physiotherapy sessions and some exercises.
Patient: Will I need any tests?
Doctor: Let's try physiotherapy first. If pain persists, we'll do an X-ray.
Doctor: Take these muscle relaxants and painkillers for a week. Apply warm compress twice daily.`,
      summary: `**Consultation Summary for Anita Kumari**

**Chief Complaint:** Chronic lower back pain with radiation to leg (1 month duration)

**Assessment:** Likely postural/occupational back strain

**Treatment Plan:**
1. Physiotherapy sessions recommended
2. Muscle relaxants and painkillers (1 week)
3. Warm compress application (twice daily)

**Lifestyle Advice:**
- Take regular breaks from sitting
- Maintain proper posture at work
- Ergonomic workstation setup recommended

**Follow-up:** If no improvement in 2 weeks, X-ray imaging to be considered`,
      status: 'sent',
      createdAt: '2024-01-15',
    },
  ]);

  const generateSummary = (transcript: Transcript) => {
    setIsGenerating(true);
    // Simulating AI summary generation
    setTimeout(() => {
      const generatedSummary = `**Consultation Summary for ${transcript.patientName}**

**Date:** ${transcript.appointmentDate}
**Doctor:** ${transcript.doctorName}
**Duration:** ${transcript.duration}

**Key Points from Consultation:**
- Patient presented with symptoms discussed during the consultation
- Doctor provided diagnosis and treatment recommendations
- Medications prescribed as per clinical assessment

**Care Instructions:**
- Follow medication schedule as prescribed
- Maintain healthy lifestyle habits
- Report any worsening symptoms immediately

**Follow-up:** As advised by the doctor

*This summary was AI-generated and reviewed by admin.*`;
      
      setEditedSummary(generatedSummary);
      setIsGenerating(false);
    }, 1500);
  };

  const handleReview = () => {
    if (!selectedTranscript || !editedSummary) return;
    
    setTranscripts(prev => prev.map(t => 
      t.id === selectedTranscript.id ? { ...t, summary: editedSummary, status: 'reviewed' as const } : t
    ));
    toast.success('Summary Saved', {
      description: 'The consultation summary has been saved.',
    });
    setShowReviewDialog(false);
  };

  const handleSendToPatient = (transcript: Transcript) => {
    setTranscripts(prev => prev.map(t => 
      t.id === transcript.id ? { ...t, status: 'sent' as const } : t
    ));
    toast.success('Summary Sent to Patient', {
      description: `${transcript.patientName} will receive the summary notification.`,
    });
  };

  const filteredTranscripts = transcripts.filter(t =>
    t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTranscripts = filteredTranscripts.filter(t => t.status === 'pending');
  const reviewedTranscripts = filteredTranscripts.filter(t => t.status === 'reviewed');
  const sentTranscripts = filteredTranscripts.filter(t => t.status === 'sent');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><CheckCircle className="h-3 w-3 mr-1" />Reviewed</Badge>;
      case 'sent':
        return <Badge variant="outline" className="text-green-600 border-green-600"><Send className="h-3 w-3 mr-1" />Sent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const TranscriptCard = ({ transcript }: { transcript: Transcript }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{transcript.id}</Badge>
              {getStatusBadge(transcript.status)}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {transcript.appointmentDate} • {transcript.duration}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="font-medium">{transcript.patientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Stethoscope className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Doctor</p>
              <p className="font-medium">{transcript.doctorName}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setSelectedTranscript(transcript);
              setEditedSummary(transcript.summary || '');
              setShowReviewDialog(true);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            {transcript.status === 'pending' ? 'Review' : 'View'}
          </Button>
          {transcript.status === 'reviewed' && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleSendToPatient(transcript)}
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Patient
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transcript Review</h1>
          <p className="text-muted-foreground mt-1">Review consultation transcripts and generate summaries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingTranscripts.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reviewedTranscripts.length}</p>
                <p className="text-sm text-muted-foreground">Reviewed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Send className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sentTranscripts.length}</p>
                <p className="text-sm text-muted-foreground">Sent to Patients</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, doctor, or transcript ID..."
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
              Pending ({pendingTranscripts.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Reviewed ({reviewedTranscripts.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <Send className="h-4 w-4" />
              Sent ({sentTranscripts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {pendingTranscripts.length === 0 ? (
                <Card className="col-span-2">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold">All Caught Up!</h3>
                    <p className="text-muted-foreground">No pending transcripts to review</p>
                  </CardContent>
                </Card>
              ) : (
                pendingTranscripts.map(t => <TranscriptCard key={t.id} transcript={t} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviewed" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {reviewedTranscripts.length === 0 ? (
                <Card className="col-span-2">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Reviewed Transcripts</h3>
                    <p className="text-muted-foreground">Reviewed transcripts will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                reviewedTranscripts.map(t => <TranscriptCard key={t.id} transcript={t} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {sentTranscripts.length === 0 ? (
                <Card className="col-span-2">
                  <CardContent className="p-12 text-center">
                    <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Sent Transcripts</h3>
                    <p className="text-muted-foreground">Sent transcripts will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                sentTranscripts.map(t => <TranscriptCard key={t.id} transcript={t} />)
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transcript Review - {selectedTranscript?.id}</DialogTitle>
              <DialogDescription>
                Review the consultation transcript and create/edit the summary
              </DialogDescription>
            </DialogHeader>
            {selectedTranscript && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Patient: <strong>{selectedTranscript.patientName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Doctor: <strong>{selectedTranscript.doctorName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Date: <strong>{selectedTranscript.appointmentDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Duration: <strong>{selectedTranscript.duration}</strong></span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <h4 className="font-semibold">Raw Transcript</h4>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 max-h-48 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {selectedTranscript.rawTranscript}
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <h4 className="font-semibold">Summary for Patient</h4>
                    </div>
                    {selectedTranscript.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateSummary(selectedTranscript)}
                        disabled={isGenerating}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isGenerating ? 'Generating...' : 'AI Generate'}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    placeholder="Write or generate the consultation summary that will be sent to the patient..."
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                    disabled={selectedTranscript.status === 'sent'}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Close
              </Button>
              {selectedTranscript?.status === 'pending' && (
                <Button onClick={handleReview} disabled={!editedSummary}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Summary
                </Button>
              )}
              {selectedTranscript?.status === 'reviewed' && (
                <Button onClick={() => {
                  handleSendToPatient(selectedTranscript);
                  setShowReviewDialog(false);
                }}>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Patient
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TranscriptReview;
