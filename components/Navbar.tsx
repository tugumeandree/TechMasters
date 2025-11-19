'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
  children?: NavLink[];
}

const navigation: NavLink[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Program',
    href: '/program',
    children: [
      { name: 'Four Pillars', href: '/program/pillars' },
      { name: 'Success Stories', href: '/program/success-stories' },
      { name: 'Mentors', href: '/program/mentors' },
    ],
  },
  {
    name: 'Partners',
    href: '/partners',
    children: [
      { name: 'Browse Technologies', href: '/partners/showcase' },
      { name: 'Request a Solution', href: '/partners/request' },
      { name: 'Sponsorship Tiers', href: '/partners/sponsorship-tiers' },
      { name: 'Corporate Challenges', href: '/partners/corporate-challenges' },
    ],
  },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Check if route is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold gradient-text">TechMasters</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8" ref={dropdownRef}>
          {navigation.map((item) => (
            <div 
              key={item.name} 
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.name)}
              onMouseLeave={() => item.children && setOpenDropdown(null)}
            >
              {item.children ? (
                <>
                  <button 
                    className={`flex items-center gap-x-1 text-sm font-semibold leading-6 transition-colors py-2 ${
                      isActive(item.href)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === item.name && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block rounded-lg px-4 py-3 text-sm font-semibold leading-6 transition-colors ${
                              isActive(child.href)
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-semibold leading-6 transition-colors py-2 ${
                    isActive(item.href)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Link
            href="/auth/login"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/apply"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all"
          >
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-in slide-in-from-top duration-200">
          <div className="space-y-2 px-4 pb-6 pt-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`h-5 w-5 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.name && (
                      <div className="ml-4 mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block rounded-lg px-3 py-2 text-sm font-semibold leading-7 transition-colors ${
                              isActive(child.href)
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-6 space-y-2">
              <Link
                href="/auth/login"
                className={`block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                  pathname === '/auth/login'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Log in
              </Link>
              <Link
                href="/apply"
                className="block rounded-lg bg-primary-600 px-3 py-2 text-base font-semibold text-white text-center hover:bg-primary-500 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
