'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, CheckCircle, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PartnerRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    
    // Contact Person
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    position: '',
    
    // Request Details
    requestType: 'build-solution', // or 'browse-technologies'
    problemStatement: '',
    desiredOutcomes: '',
    timeline: '',
    budget: '',
    technicalRequirements: '',
    
    // Additional Info
    additionalInfo: '',
  });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'browse') {
      setFormData(prev => ({ ...prev, requestType: 'browse-technologies' }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/partner-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/apply/success?type=partner');
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3 md:mb-4">
              <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4 px-4">
              Corporate Partner Request
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 px-4">
              Let our innovators build solutions for your business challenges
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Company Information */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Company Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Industry</option>
                    <option value="finance">Financial Services</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="technology">Technology</option>
                    <option value="telecommunications">Telecommunications</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="energy">Energy & Utilities</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Size</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1,000 employees</option>
                    <option value="1001+">1,000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Contact Person</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Solution Request</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    What problem do you need solved? *
                  </label>
                  <textarea
                    name="problemStatement"
                    required
                    rows={4}
                    value={formData.problemStatement}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe the business challenge or technical problem you're facing..."
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Desired Outcomes *
                  </label>
                  <textarea
                    name="desiredOutcomes"
                    required
                    rows={3}
                    value={formData.desiredOutcomes}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="What success looks like for this solution..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Timeline</option>
                      <option value="urgent">Urgent (1-2 months)</option>
                      <option value="short">Short-term (3-6 months)</option>
                      <option value="medium">Medium-term (6-12 months)</option>
                      <option value="long">Long-term (12+ months)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Budget</option>
                      <option value="<10k">Less than $10,000</option>
                      <option value="10k-50k">$10,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">$100,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Technical Requirements (Optional)
                  </label>
                  <textarea
                    name="technicalRequirements"
                    rows={3}
                    value={formData.technicalRequirements}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Any specific technologies, platforms, or integrations needed..."
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    rows={3}
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Any other relevant information..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
