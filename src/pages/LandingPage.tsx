import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Pill, 
  Bell, 
  Truck, 
  Gamepad2, 
  Heart,
  ChevronRight,
  Star,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    icon: <Stethoscope className="h-8 w-8" />,
    title: 'Doctor Consultation',
    description: 'Connect with trusted doctors through video calls from the comfort of your home.',
  },
  {
    icon: <Pill className="h-8 w-8" />,
    title: 'Post-Consultation Care',
    description: 'Receive personalized care summaries in your local language after every consultation.',
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: 'Medicine Reminders',
    description: 'Never miss a dose with smart reminders and health tracking.',
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Local Delivery',
    description: 'Get your prescribed medicines delivered to your doorstep by local partners.',
  },
  {
    icon: <Gamepad2 className="h-8 w-8" />,
    title: 'Gamified Health',
    description: 'Complete care challenges to earn coins and discounts on your next consultation.',
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Trusted Care',
    description: 'Verified doctors with transparent reviews and ratings from real patients.',
  },
];

const stats = [
  { value: '10,000+', label: 'Patients Served' },
  { value: '500+', label: 'Verified Doctors' },
  { value: '50+', label: 'Cities in Bihar' },
  { value: '4.8', label: 'Average Rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_hsl(185_85%_50%_/_0.1),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(175_65%_45%_/_0.08),_transparent_50%)]" />
        
        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Trusted by 10,000+ patients in Bihar</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Healthcare that{' '}
              <span className="text-gradient">continues</span>
              {' '}after the consultation
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with trusted doctors, receive personalized care in your language, and get medicines delivered to your doorstep.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary border-0 text-lg px-8 shadow-glow" asChild>
                <Link to="/join">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/auth?role=doctor">Join as Doctor</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Healthcare <span className="text-gradient">Ecosystem</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your health journey, from consultation to recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card hover:shadow-soft transition-all duration-300 border-border/50 hover:border-primary/30 group"
              >
                <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-4 group-hover:shadow-glow transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Care Journey Teaser */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <Gamepad2 className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Gamified Healthcare</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Turn Your Recovery into a <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Complete daily health challenges, earn coins, and get discounts on your next consultation. 
              Make following doctor's advice fun and rewarding!
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="text-2xl font-bold text-primary mb-1">🎯</div>
                <div className="text-sm text-muted-foreground">Daily Tasks</div>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="text-2xl font-bold text-primary mb-1">🪙</div>
                <div className="text-sm text-muted-foreground">Earn Coins</div>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="text-2xl font-bold text-primary mb-1">🎁</div>
                <div className="text-sm text-muted-foreground">Get Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-12 gradient-hero text-center border-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of patients who trust MedioKart for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link to="/join">
                  Join as Patient
                  <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/auth?role=doctor">
                  Join as Doctor
                  <Stethoscope className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
