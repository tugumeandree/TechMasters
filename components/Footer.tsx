import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">TechMasters</h3>
            <p className="text-xs md:text-sm text-gray-400">
              Empowering African technologists to build innovative solutions and sustainable businesses.
            </p>
            <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
              <a href="#" className="hover:text-primary-400 transition-colors active:scale-95">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors active:scale-95">
                <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors active:scale-95">
                <Github className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors active:scale-95">
                <Mail className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>

          {/* Program */}
          <div>
            <h4 className="text-white text-sm md:text-base font-semibold mb-3 md:mb-4">Program</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/program/pillars" className="hover:text-primary-400 transition-colors">
                  Four Pillars
                </Link>
              </li>
              <li>
                <Link href="/program/success-stories" className="hover:text-primary-400 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/program/mentors" className="hover:text-primary-400 transition-colors">
                  Our Mentors
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-primary-400 transition-colors">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-white text-sm md:text-base font-semibold mb-3 md:mb-4">Partners</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/partners/showcase" className="hover:text-primary-400 transition-colors">
                  Browse Technologies
                </Link>
              </li>
              <li>
                <Link href="/partners/request" className="hover:text-primary-400 transition-colors">
                  Request a Solution
                </Link>
              </li>
              <li>
                <Link href="/partners/sponsorship-tiers" className="hover:text-primary-400 transition-colors">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-primary-400 transition-colors">
                  Our Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm md:text-base font-semibold mb-3 md:mb-4">Company</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-800">
          <p className="text-xs md:text-sm text-gray-400 text-center">
            © {currentYear} TechMasters. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
