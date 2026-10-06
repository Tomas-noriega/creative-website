import {useEffect} from 'react';
import {Footer, Header} from './components/Chrome';
import {Day} from './components/Day';
import {Details} from './components/Details';
import {Relaunch} from './components/Relaunch';
import {Shop} from './components/Shop';
import {Unveil} from './components/Unveil';
import {useReducedMotion} from './hooks/useReducedMotion';
import {startScroll} from './lib/scroll';

export default function App() {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);

  return (
    <>
      <Header />
      <main>
        <Unveil />
        <Details />
        <Day />
        <Relaunch />
        <Shop />
      </main>
      <Footer />
      {/* A fine grain over everything, like a printed lookbook. */}
      <div aria-hidden="true" className="grain-overlay" />
    </>
  );
}
