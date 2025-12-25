import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <h1 className="text-4xl font-bold mb-8 text-gradient">Disclaimer</h1>
            
            <p className="text-muted-foreground">Last updated: January 2024</p>

            <h2>Medical Disclaimer</h2>
            <p>
              The information provided on MedioKart is for general informational purposes only 
              and is not intended as a substitute for professional medical advice, diagnosis, 
              or treatment. Always seek the advice of your physician or other qualified health 
              provider with any questions you may have regarding a medical condition.
            </p>

            <h2>No Medical Diagnosis by AI</h2>
            <p>
              Our AI-powered features are designed to assist with care summaries, reminders, 
              and language translation only. The AI does NOT:
            </p>
            <ul>
              <li>Provide medical diagnoses</li>
              <li>Offer emergency medical advice</li>
              <li>Generate prescriptions</li>
              <li>Replace professional medical consultation</li>
            </ul>

            <h2>Emergency Situations</h2>
            <p>
              If you think you may have a medical emergency, call your doctor, go to the 
              emergency department, or call emergency services immediately. MedioKart is 
              not designed for emergency medical situations.
            </p>

            <h2>Doctor Verification</h2>
            <p>
              While we verify the credentials of healthcare providers on our platform, 
              we recommend patients verify their doctor's qualifications independently 
              through official medical council registries.
            </p>

            <h2>Medicine Delivery</h2>
            <p>
              Medicines delivered through our platform require valid prescriptions from 
              registered medical practitioners. We coordinate delivery but are not 
              responsible for the medicines themselves.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              MedioKart, its owners, employees, and partners shall not be held liable 
              for any adverse health outcomes resulting from the use of our platform. 
              Users assume all risks associated with using our services.
            </p>

            <h2>Contact</h2>
            <p>
              If you have concerns about any content or services on our platform, 
              please contact us at support@mediokart.com.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
