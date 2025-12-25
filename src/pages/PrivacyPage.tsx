import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <h1 className="text-4xl font-bold mb-8 text-gradient">Privacy Policy</h1>
            
            <p className="text-muted-foreground">Last updated: January 2024</p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              book an appointment, or contact us for support. This includes:
            </p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Health information shared during consultations</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process appointments and deliver medicines</li>
              <li>Send you reminders and health updates</li>
              <li>Respond to your comments and questions</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              All health data is encrypted and stored securely in compliance with applicable laws.
            </p>

            <h2>4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li>Healthcare providers for consultations</li>
              <li>Delivery partners for medicine delivery</li>
              <li>Service providers who assist our operations</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. 
              Contact us at privacy@mediokart.com to exercise these rights.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@mediokart.com
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
