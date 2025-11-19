'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

interface SuccessStory {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  achievement: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: 'Sarah Omondi',
    role: 'Founder & CEO',
    company: 'AgriTech Solutions',
    image: '/images/success-1.jpg',
    quote: 'TechMasters didn\'t just teach me to code - they taught me to build a sustainable business. Our platform now serves 10,000+ farmers across Kenya.',
    achievement: '$500K Seed Funding Raised',
  },
  {
    id: 2,
    name: 'James Mwangi',
    role: 'Co-Founder',
    company: 'HealthConnect',
    image: '/images/success-2.jpg',
    quote: 'The mentorship I received was invaluable. My mentors helped me navigate the healthcare regulatory landscape and build relationships with hospitals.',
    achievement: 'Partnered with 50+ Clinics',
  },
  {
    id: 3,
    name: 'Amina Hassan',
    role: 'CTO',
    company: 'EduLearn Platform',
    image: '/images/success-3.jpg',
    quote: 'The technical training was world-class. I went from a junior developer to leading a team of 15 engineers building Africa\'s next unicorn.',
    achievement: '100K+ Students Enrolled',
  },
  {
    id: 4,
    name: 'David Kamau',
    role: 'Founder',
    company: 'FinTech Innovations',
    image: '/images/success-4.jpg',
    quote: 'TechMasters connected me with investors who believed in my vision. Today, we\'re processing millions in transactions monthly.',
    achievement: '$1M Series A Closed',
  },
];

export default function SuccessStoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % successStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % successStories.length);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentStory = successStories[currentIndex];

  return (
    <section className="py-20 px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Success <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet the innovators who transformed their ideas into thriving businesses
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main card */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8 lg:p-12">
              {/* Left side - Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {/* Placeholder for image */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">👤</div>
                      <p className="text-sm">{currentStory.name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Achievement badge */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold whitespace-nowrap">
                  ✨ {currentStory.achievement}
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex flex-col justify-center">
                <Quote className="h-12 w-12 text-primary-400 mb-4" />
                
                <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{currentStory.quote}"
                </blockquote>

                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentStory.name}
                  </h4>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold">
                    {currentStory.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentStory.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Previous story"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Next story"
          >
            <ChevronRight className="h-6 w-6 text-gray-900 dark:text-white" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-primary-400'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/program/success-stories"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            Read More Success Stories
            <ChevronRight className="ml-1 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
