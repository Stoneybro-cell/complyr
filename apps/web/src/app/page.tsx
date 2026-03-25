import Navigation from '../components/home/Navigation';
import Hero from '../components/home/Hero';
import Problem from '../components/home/Problem';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import UseCases from '../components/home/UseCases';
import Technology from '../components/home/Technology';
import FinalCTA from '../components/home/FinalCTA';
import Footer from '../components/home/Footer';

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .grain-overlay {
            background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuD11hgePaEaw1vdLnF_my3ErcsuUDXtWG-fEF-5Qii1PepG9TuwZM0IYWflGdYWxwoh_o1gEcdv5QHQfYJMUfRiYEfm1MSvEwprt9cQrMkLG-jjmOj29sPCSrOEjr5oV70eqSfz_27NrYwUV1zbe3ino530dDtycQegBHeigaNfeXyeV43Ijw1Vndia6DBMJHTW0FTgePzRNJbdnzCjzKegCO1qEdNMisdt3nQHENCScZX-nwNJLFx5yxm8F7LSgb36PIxueWH3-Do);
            opacity: 0.03;
            pointer-events: none
        }
        .line-draw {
            background: linear-gradient(to bottom, transparent, #474747 50%, transparent);
            width: 1px
        }
      `}} />
      <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;700;800;900&family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      <div 
        className="min-h-screen selection:bg-[#ffffff] selection:text-[#1a1c1c] font-['Inter']" 
        style={{ backgroundColor: '#0E0E0E', color: '#E2E2E2', WebkitFontSmoothing: 'antialiased' }}
      >
        <Navigation />
        <main className="relative overflow-hidden">
          <div className="fixed inset-0 grain-overlay z-[1]"></div>
          <Hero />
          <Problem />
          <HowItWorks />
          <Features />
          <UseCases />
          <Technology />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}