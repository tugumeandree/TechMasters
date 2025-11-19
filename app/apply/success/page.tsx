'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Mail, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ApplicationSuccessPage() {
  const [applicationId, setApplicationId] = useState('');

  useEffect(() => {
    // Generate application ID on client side only
    setApplicationId(`APP-${Date.now().toString().slice(-8)}`);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 lg:p-12 text-center">
            {/* Success Icon */}
            <div className="mb-8 animate-scale-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">
              Application Submitted Successfully!
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 animate-slide-up animation-delay-100">
              Thank you for applying to TechMasters. Your journey to innovation starts here!
            </p>

            {/* Application Number */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-8 animate-slide-up animation-delay-200">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Your Application ID
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {applicationId || 'Loading...'}
              </p>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8 animate-slide-up animation-delay-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What happens next?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      1. Check Your Email
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You'll receive a confirmation email with your application details within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      2. Application Review
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our team will review your application within 2-3 weeks. We'll contact you if we need additional information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      3. Interview Invitation
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shortlisted candidates will be invited for an interview with our selection committee.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-lg shadow-lg hover:bg-primary-500 transition-all"
              >
                Back to Home
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white dark:bg-gray-800 dark:text-primary-400 border-2 border-primary-600 rounded-lg shadow-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-all"
              >
                Sign In
              </Link>
            </div>
            
            {/* Info Note */}
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Once your application is approved, you'll receive login credentials via email to access your dashboard.
            </p>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </>
  );
}
