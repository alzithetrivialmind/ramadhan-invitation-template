import { useEffect } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import FAB from './components/FAB';
import AudioPlayer from './components/AudioPlayer';
import './index.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="scroll-container bg-gray-50 text-gray-800 font-sans min-h-screen relative">
      <AudioPlayer />
      <Hero />
      <EventDetails />
      <Gallery />
      <RSVP />
      <FAB />
    </div>
  );
}

export default App;
