'use client';

import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Crown, Award } from 'lucide-react';

const sponsorshipPackages = [
  {
    name: 'Silver Partnership',
    tier: 'silver',
    investment: '$25,000',
    period: 'per year',
    icon: Award,
    color: 'from-gray-400 to-gray-600',
    popular: false,
    benefits: [
      { text: 'Logo on partners page', included: true },
      { text: '20 job postings per year', included: true },
      { text: '5 mentor slots', included: true },
      { text: '2 workshop opportunities', included: true },
      { text: '2 recruiting events', included: true },
      { text: '12 social media mentions', included: true },
      { text: 'Pitch session access', included: true },
      { text: 'Resume database', included: false },
      { text: 'Challenge hosting', included: false }
    ],
    highlights: [
      'Brand exposure on partner page',
      'Talent recruitment pipeline',
      'Mentor engagement opportunities'
    ]
  },
  {
    name: 'Gold Partnership',
    tier: 'gold',
    investment: '$50,000',
    period: 'per year',
    icon: Star,
    color: 'from-yellow-400 to-yellow-600',
    popular: true,
    benefits: [
      { text: 'Featured logo on website & materials', included: true },
      { text: '50 job postings per year', included: true },
      { text: '10 mentor slots', included: true },
      { text: '4 workshop opportunities', included: true },
      { text: '4 exclusive recruiting events', included: true },
      { text: '24 social media mentions', included: true },
      { text: 'Full resume database access', included: true },
      { text: 'Host 2 corporate challenges', included: true },
      { text: 'IP rights first look', included: false }
    ],
    highlights: [
      'Premium brand visibility',
      'Full talent database access',
      'Innovation challenge hosting'
    ]
  },
  {
    name: 'Platinum Partnership',
    tier: 'platinum',
    investment: '$100,000',
    period: 'per year',
    icon: Crown,
    color: 'from-purple-400 to-purple-600',
    popular: false,
    benefits: [
      { text: 'Homepage hero logo placement', included: true },
      { text: 'Unlimited job postings', included: true },
      { text: 'Unlimited mentor slots', included: true },
      { text: '24 workshop opportunities', included: true },
      { text: '12 exclusive recruiting events', included: true },
      { text: '52 social media mentions (weekly)', included: true },
      { text: 'Full resume database + 30 days early access', included: true },
      { text: 'Unlimited challenge hosting', included: true },
      { text: 'IP rights first look on all projects', included: true }
    ],
    highlights: [
      'Maximum brand exposure',
      'First access to all talent',
      'Full innovation pipeline access',
      'Exclusive IP opportunities'
    ]
  }
];

export default function SponsorshipSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              Corporate Partnership Opportunities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Partner with the Future of Innovation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access exceptional talent, cutting-edge projects, and innovation opportunities
            while building your employer brand in the tech ecosystem.
          </p>
        </motion.div>

        {/* Value Proposition Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { value: '200+', label: 'Tech Professionals Annually' },
            { value: '85%', label: 'Project Success Rate' },
            { value: '50+', label: 'Startups Launched' },
            { value: '15+', label: 'Countries Represented' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Sponsorship Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {sponsorshipPackages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className={`h-32 bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                  <Icon className="w-16 h-16 text-white" />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {pkg.investment}
                    </span>
                    <span className="text-gray-600">{pkg.period}</span>
                  </div>

                  {/* Key Highlights */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Key Benefits:
                    </p>
                    <ul className="space-y-1">
                      {pkg.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Full Benefits List */}
                  <div className="space-y-3 mb-8">
                    {pkg.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            benefit.included ? 'text-green-500' : 'text-gray-300'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            benefit.included ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          {benefit.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Request Partnership Info
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">
            Need a Custom Partnership?
          </h3>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Looking for tailored benefits, multi-year agreements, or specific innovation outcomes?
            Let's design a partnership that perfectly aligns with your strategic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all">
              Schedule Consultation
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
              Download Partnership Deck
            </button>
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-xl p-8 shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">TC</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 italic mb-4">
                "Partnering with TechMasters has transformed our talent acquisition strategy.
                We've hired 5 exceptional developers and gained early access to innovative
                solutions that directly impacted our product roadmap. The ROI has been phenomenal."
              </p>
              <div>
                <p className="font-semibold text-gray-900">Jennifer Martinez</p>
                <p className="text-sm text-gray-600">VP of Engineering, TechCorp Global</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
