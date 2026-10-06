import {useState, type MouseEvent} from 'react';
import {brand, nav} from '../content';
import {scrollToHash} from '../lib/scroll';

function go(e: MouseEvent<HTMLAnchorElement>, then?: () => void) {
  const hash = e.currentTarget.getAttribute('href');
  if (!hash?.startsWith('#')) return;
  e.preventDefault();
  then?.();
  scrollToHash(hash);
}

/** The mark: a wave over the horizon line. */
function Mark({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 28 20" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 9c3-4 6-4 8 0s5 4 8 0 6-4 8 0" />
      <path d="M2 16h24" opacity="0.55" />
    </svg>
  );
}

/**
 * A thin top rail: mark + tagline left, links right. It runs over the fog,
 * the navy and the sand, so the rail inverts whatever is under it.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${open ? '' : 'mix-blend-difference'}`}>
      <div className="mx-4 flex items-center justify-between gap-6 border-b border-white/25 py-4 text-white sm:mx-6 md:mx-[4vw] md:py-5">
        <a href="#top" onClick={(e) => go(e)} className="flex items-center gap-5" aria-label={`${brand.name} — back to top`}>
          <span className="flex items-center gap-2.5">
            <Mark className="h-4 w-6" />
            <span className="wide font-display text-[0.9375rem] font-light tracking-[0.18em]">{brand.wordmark}</span>
          </span>
          <span className="hidden text-[0.6875rem] leading-[1.35] text-white/65 lg:block">
            {brand.tagline[0]}
            <br />
            {brand.tagline[1]}
          </span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-6 md:gap-9">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e)} className="hidden font-mono text-[0.625rem] tracking-[0.16em] text-white/75 uppercase transition-colors hover:text-white md:block">
              {item.label}
            </a>
          ))}
          <a href="#shop" onClick={(e) => go(e)} className="hidden font-mono text-[0.625rem] tracking-[0.16em] text-white uppercase underline-offset-4 hover:underline sm:block">
            Shop {brand.price}
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu" aria-label={open ? 'Close menu' : 'Open menu'} className="flex h-8 w-8 flex-col items-end justify-center gap-[5px]">
            <span className={`h-px bg-white transition-all duration-300 ${open ? 'w-6 translate-y-[3px] rotate-45' : 'w-6'}`} />
            <span className={`h-px bg-white transition-all duration-300 ${open ? 'w-6 -translate-y-[3px] -rotate-45' : 'w-4'}`} />
          </button>
        </nav>
      </div>
      <div id="menu" inert={!open} className={`fixed inset-0 -z-10 flex flex-col justify-center gap-4 bg-ink/96 px-6 text-chalk backdrop-blur-xl transition-opacity duration-500 md:px-[4vw] ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        {[...nav, {label: `Shop ${brand.price}`, href: '#shop'}].map((item, i) => (
          <a key={item.href} href={item.href} onClick={(e) => go(e, () => setOpen(false))} className="group flex items-baseline gap-5">
            <span className="font-mono text-label text-tide">0{i + 1}</span>
            <span className="wide font-display text-[clamp(2rem,6vw,5rem)] leading-none font-extralight uppercase transition-transform duration-500 group-hover:translate-x-3">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink px-4 py-8 sm:px-6 md:px-[4vw]">
      <div className="flex flex-col gap-4 border-t border-chalk/10 pt-8 font-mono text-[0.625rem] tracking-[0.14em] text-chalk/50 uppercase md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-2.5 text-chalk/80">
          <Mark className="h-3 w-5 text-tide" />
          {brand.wordmark} · a student relaunch concept
        </span>
        <span className="max-w-[40rem] md:text-center">Class marketing project · Not affiliated with or endorsed by Google · Product photos: Google Merch Shop</span>
        <a href="#top" onClick={(e) => go(e)} className="hover:text-chalk">
          Back under the sheet ↑
        </a>
      </div>
    </footer>
  );
}
