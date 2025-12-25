import { Link } from 'react-router-dom';
import { User, Stethoscope, Truck, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const roles = [
  {
    title: 'Join as Patient',
    description: 'Get access to trusted doctors, personalized care plans, medicine delivery, and gamified health tracking.',
    icon: <User className="h-10 w-10" />,
    href: '/auth?role=patient',
    benefits: [
      'Video consultations with verified doctors',
      'Care summaries in your language',
      'Medicine reminders & delivery',
      'Earn coins for following health advice',
    ],
  },
  {
    title: 'Join as Doctor',
    description: 'Connect with patients in Tier-3 cities, manage appointments, and provide post-consultation care.',
    icon: <Stethoscope className="h-10 w-10" />,
    href: '/auth?role=doctor',
    benefits: [
      'Reach patients across Bihar',
      'Flexible scheduling',
      'AI-powered consultation summaries',
      'Build your patient base',
    ],
  },
  {
    title: 'Become a Delivery Partner',
    description: 'Help deliver medicines to patients in your locality and earn on your own schedule.',
    icon: <Truck className="h-10 w-10" />,
    href: '/auth?role=delivery',
    benefits: [
      'Flexible work hours',
      'Earn per delivery',
      'Serve your community',
      'No investment required',
    ],
  },
];

export default function JoinPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join the <span className="text-gradient">MedioKart</span> Family
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a patient seeking care, a doctor wanting to help, or someone who can deliver - there's a place for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-soft transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground mb-4 group-hover:shadow-glow transition-shadow">
                    {role.icon}
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {role.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full gradient-primary border-0" asChild>
                    <Link to={role.href}>
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
