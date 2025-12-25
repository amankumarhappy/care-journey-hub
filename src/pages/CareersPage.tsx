import { Mail, Send, Briefcase, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const values = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Patient First',
    description: 'Every decision we make is guided by what\'s best for patient outcomes.',
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: 'Innovation',
    description: 'We\'re building the future of healthcare for underserved communities.',
  },
];

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'Application received!',
      description: 'We will review your application and get back to you.',
    });
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Build Healthcare for <span className="text-gradient">Bihar</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us in our mission to make quality healthcare accessible to everyone. We're looking for passionate individuals who want to make a difference.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            {values.map((value, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Application Form */}
          <Card className="max-w-2xl mx-auto border-border/50">
            <CardHeader>
              <CardTitle>Apply to Join MedioKart</CardTitle>
              <CardDescription>Tell us about yourself and why you want to join our team.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+91 9876543210" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position Interested In</Label>
                  <Input id="position" placeholder="e.g., Software Developer, Marketing" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Tell us about yourself</Label>
                  <Textarea id="message" placeholder="Your experience, skills, and why you want to join..." rows={5} required />
                </div>
                <Button type="submit" className="w-full gradient-primary border-0" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      Submit Application
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
