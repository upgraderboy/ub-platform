import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { CommunitySection } from '@/components/CommunitySection';
import { TerminalSection } from '@/components/TerminalSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Ambient background light spheres */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[var(--accent-color)] opacity-15 dark:opacity-20 blur-[130px] transition-all" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500 opacity-10 dark:opacity-15 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-purple-500 opacity-10 dark:opacity-10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <PortfolioSection />
          <CommunitySection />
          <TerminalSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
