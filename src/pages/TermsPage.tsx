import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <h1 className="text-4xl font-bold mb-8 text-gradient">Terms & Conditions</h1>
            
            <p className="text-muted-foreground">Last updated: January 2024</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using MedioKart, you accept and agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              MedioKart provides a platform connecting patients with healthcare providers for 
              consultations, medicine delivery coordination, and health management tools.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account.
            </p>

            <h2>4. Medical Disclaimer</h2>
            <p>
              MedioKart is a platform that connects you with licensed healthcare providers. 
              The platform itself does not provide medical advice. Always consult with a qualified 
              healthcare professional for medical decisions.
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              Consultation fees and medicine costs are displayed before confirmation. 
              Payment is processed securely through our payment partners.
            </p>

            <h2>6. Cancellation Policy</h2>
            <p>
              Appointments can be cancelled up to 2 hours before the scheduled time for a full refund. 
              Late cancellations may be subject to a cancellation fee.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              MedioKart is not liable for any indirect, incidental, or consequential damages 
              arising from your use of our services.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the 
              service constitutes acceptance of modified terms.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              For questions about these terms, contact us at:
              <br />
              Email: legal@mediokart.com
              <br />
              Address: Patna, Bihar, India
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
