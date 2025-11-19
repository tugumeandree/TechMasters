import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ValueProposition from '@/components/landing/ValueProposition';
import JourneyTimeline from '@/components/landing/JourneyTimeline';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import PillarsSection from '@/components/PillarsSection';
import StatsSection from '@/components/StatsSection';
import SponsorshipSection from '@/components/landing/SponsorshipSection';
import SuccessStoriesCarousel from '@/components/SuccessStoriesCarousel';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ValueProposition />
      <JourneyTimeline />
      <FeaturesShowcase />
      <PillarsSection />
      <StatsSection />
      <SponsorshipSection />
      <SuccessStoriesCarousel />
      <Footer />
    </main>
  );
}
