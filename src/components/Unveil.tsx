import {useEffect, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react';
import {brand, hero} from '../content';
import {clamp, easeOutCubic, lerp, pinProgress, range, smoothstep} from '../lib/math';
import {onFrame, scrollToY} from '../lib/scroll';

/**
 * The unveiling. The half-zip sits under a linen dust sheet on the studio
 * backdrop; the scroll (or the handle) pulls the sheet off one corner, it
 * skews and slides away, and the title card hands over to the name plate.
 *
 *   0.00 – 0.06  title card: MADE FOR THE Cape morning, the handle
 *   0.06 – 0.50  the sheet comes off
 *   0.45 – 0.55  title card clears
 *   0.55 – 0.85  name plate: GOOGLE WELLFLEET WOMEN’S ½ ZIP, $79, the slogan
 */

const STAGE_VH = 320;
const PULL = [0.06, 0.5] as const;

export function Unveil() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLElement[]>([]);
  const priceRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dragging = useRef(false);

  useEffect(() => {
    let lastP = -1;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect} = pinProgress(root);
      if (rect.bottom < 0) return;
      if (Math.abs(p - lastP) < 0.00005 && !dragging.current) return;
      lastP = p;

      // --- The sheet: lifts at the top-left corner, skews, slides away. ---
      const pull = smoothstep(range(p, ...PULL));
      sheetRef.current!.style.transform = `translate3d(${pull * 112}%, ${-pull * 34}%, 0) rotate(${pull * 10}deg) skewX(${-pull * 14}deg)`;
      sheetRef.current!.style.opacity = String(1 - smoothstep(clamp((pull - 0.75) / 0.25)));
      imgRef.current!.style.transform = `scale(${lerp(1.16, 1, easeOutCubic(pull))})`;
      // Hidden while fully covered, so no navy fringe shows at the clipped edge.
      imgRef.current!.style.visibility = pull > 0.001 ? 'visible' : 'hidden';

      // --- The handle rides the sheet's leading corner. ---
      const vis = 1 - range(p, 0.3, 0.42);
      handleRef.current!.style.opacity = String(vis);
      handleRef.current!.style.pointerEvents = vis > 0.2 ? 'auto' : 'none';
      handleRef.current!.style.transform = `translate3d(${pull * 70}%, ${-pull * 60}%, 0)`;

      // --- Title card. ---
      const out = range(p, 0.45, 0.55);
      introRef.current!.style.opacity = String(1 - out);
      introRef.current!.style.transform = `translate3d(${-out * 60}px, 0, 0)`;
      introRef.current!.style.filter = out > 0.01 ? `blur(${out * 10}px)` : '';

      // --- Name plate: each line slides in out of a blur, the price drifts. ---
      const plate = range(p, 0.55, 0.85);
      plateRef.current!.style.opacity = String(plate > 0 ? 1 : 0);
      plateRef.current!.style.pointerEvents = plate > 0.5 ? 'auto' : 'none';
      lineRefs.current.forEach((el, i) => {
        const k = easeOutCubic(clamp((plate - i * 0.1) / 0.55));
        el.style.opacity = String(k);
        el.style.transform = `translate3d(${(1 - k) * -80}px, 0, 0)`;
        el.style.filter = k < 0.99 ? `blur(${(1 - k) * 12}px)` : '';
      });
      const pk = easeOutCubic(range(p, 0.6, 1));
      priceRef.current!.style.opacity = String(pk * 0.9);
      priceRef.current!.style.transform = `translate3d(${lerp(120, 0, pk)}px, 0, 0)`;
    });
  }, []);

  const toScroll = (p: number) => {
    const root = rootRef.current!;
    return root.offsetTop + p * (root.offsetHeight - window.innerHeight);
  };

  /** Drag the handle across the photo; the distance becomes a scroll position. */
  const startDrag = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    const x0 = e.clientX;
    const y0 = e.clientY;
    const {p: p0} = pinProgress(rootRef.current!);
    const move = (ev: PointerEvent) => {
      const w = frame.getBoundingClientRect().width;
      const t = clamp(((ev.clientX - x0) + (y0 - ev.clientY) * 0.5) / (w * 0.9), -1, 1);
      scrollToY(toScroll(clamp(p0 + t * (PULL[1] - PULL[0]))));
    };
    const end = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  /** Keyboard: play the whole reveal. */
  const playReveal = () => scrollToY(toScroll(0.86), false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split('#')[0]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  return (
    <section id="top" ref={rootRef} aria-label="The unveiling" className="relative" style={{height: `${STAGE_VH}svh`}}>
      <div className="sticky top-0 h-screen-s overflow-hidden bg-fog text-ink">
        {/* A soft window light falling across the backdrop. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_40%,rgb(255_255_255/0.9),transparent_70%)]" />

        {/* The product, under its sheet. */}
        <div
          ref={frameRef}
          className="absolute top-[40svh] left-1/2 aspect-square w-[min(88vw,52svh)] -translate-x-1/2 md:top-1/2 md:right-[5vw] md:left-auto md:w-[min(46vw,80svh)] md:translate-x-0 md:-translate-y-1/2"
        >
          <div className="relative size-full overflow-hidden rounded-[10px] bg-fog">
            <img
              ref={imgRef}
              src={hero.image}
              alt="The Google Wellfleet Women’s ½ Zip in navy, laid flat."
              width={1500}
              height={1500}
              decoding="async"
              fetchPriority="high"
              onLoad={() => setLoaded(true)}
              className="size-full object-cover will-change-transform"
              style={{transform: 'scale(1.16)', visibility: 'hidden'}}
            />
            {/* The dust sheet: linen with folds catching a window light. */}
            <div
              ref={sheetRef}
              aria-hidden="true"
              className="absolute -inset-[8%] origin-top-left will-change-transform"
              style={{
                background:
                  'repeating-linear-gradient(97deg, rgb(0 0 0 / 0) 0 38px, rgb(0 0 0 / 0.08) 52px, rgb(255 255 255 / 0.22) 64px, rgb(0 0 0 / 0) 86px), repeating-linear-gradient(3deg, rgb(0 0 0 / 0.03) 0 1px, transparent 1px 3px), linear-gradient(170deg, #f4efe4, #e3d8c2 60%, #d4c6aa)',
                boxShadow: '0 30px 80px rgb(21 27 48 / 0.35)',
              }}
            />
          </div>
          <button
            ref={handleRef}
            type="button"
            onPointerDown={startDrag}
            onClick={(e) => {
              if (e.detail === 0) playReveal(); // keyboard activation only
            }}
            className="group absolute bottom-[12%] left-[8%] z-20 flex cursor-grab touch-none items-center gap-3 active:cursor-grabbing"
            aria-label="Reveal the half-zip"
          >
            <span className="relative grid size-5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-buoy/40 motion-reduce:animate-none" />
              <span className="size-2.5 rounded-full bg-buoy shadow-[0_0_16px_rgb(215_95_54/0.7)] transition-transform group-hover:scale-150" />
            </span>
            <span className="font-mono text-[0.625rem] tracking-[0.18em] whitespace-nowrap text-ink/80 uppercase">{hero.handle} →</span>
          </button>
        </div>

        {/* Title card — letters rise in once the photo is ready. */}
        <div ref={introRef} className="pointer-events-none absolute inset-x-4 top-[14svh] sm:inset-x-6 md:top-[24svh] md:right-auto md:left-[4vw] md:max-w-[44vw]">
          <h1 className="text-hero font-extralight uppercase" aria-label={`${hero.title[0]} ${hero.title[1]}`}>
            <span className="wide block font-display" aria-hidden="true">
              {[...hero.title[0]].map((ch, i) => (
                <span
                  key={i}
                  className={`inline-block ${loaded ? 'animate-[letter-in_1.4s_cubic-bezier(0.2,0.7,0.1,1)_both]' : 'opacity-0'}`}
                  style={{animationDelay: `${0.2 + i * 0.04}s`}}
                >
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </span>
            <span aria-hidden="true" className={`block text-tide-deep ${loaded ? 'animate-[fade-up_1.4s_cubic-bezier(0.2,0.7,0.1,1)_both] [animation-delay:0.8s]' : 'opacity-0'}`}>
              <span className="font-serif normal-case italic">{hero.title[1]}</span>
            </span>
          </h1>
          <p className="mt-6 max-w-[22rem] text-[0.9375rem] leading-relaxed text-ink/70 max-md:hidden">{hero.body}</p>
        </div>

        {/* Name plate. */}
        <div ref={plateRef} className="pointer-events-none absolute inset-0" style={{opacity: 0}}>
          <div className="absolute top-[13svh] left-4 sm:left-6 md:top-[20svh] md:left-[4vw] md:max-w-[44vw]">
            <p
              ref={(el) => {
                if (el) lineRefs.current[0] = el;
              }}
              className="wide font-display text-[clamp(1rem,2vw,1.75rem)] leading-none font-extralight tracking-[0.02em] uppercase"
            >
              {hero.model[0]}
            </p>
            <h2
              ref={(el) => {
                if (el) lineRefs.current[1] = el;
              }}
              className="wide mt-2 font-display text-[clamp(2rem,5vw,5rem)] leading-[0.95] font-light uppercase"
            >
              {hero.model[1]}
            </h2>
            <p
              ref={(el) => {
                if (el) lineRefs.current[2] = el;
              }}
              className="mt-4 text-[clamp(1.25rem,2.4vw,2.25rem)] leading-[1.02] uppercase md:mt-8"
            >
              <span className="wide font-display font-light">{hero.slogan[0]} </span>
              <span className="font-serif text-tide-deep normal-case italic">{hero.slogan[1]}</span>
            </p>
            <div
              ref={(el) => {
                if (el) lineRefs.current[3] = el;
              }}
              className="mt-5 max-md:hidden"
            >
              <p className="max-w-[24rem] text-[0.9375rem] leading-relaxed text-ink/70">{hero.note}</p>
              <a
                href={brand.shopUrl}
                target="_blank"
                rel="noopener"
                className="group mt-6 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-label text-chalk uppercase transition-colors hover:bg-buoy-deep"
              >
                Shop it — {brand.price}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
          <span
            ref={priceRef}
            aria-hidden="true"
            className="wide absolute right-4 bottom-[6svh] font-display text-[clamp(3.5rem,10vw,10rem)] leading-none font-extralight text-transparent sm:right-6 md:top-[6svh] md:right-[4vw] md:bottom-auto"
            style={{WebkitTextStroke: '1px rgb(215 95 54 / 0.85)'}}
          >
            {brand.price}
          </span>
        </div>

        {/* Bottom rail. */}
        <div className="absolute inset-x-4 bottom-5 z-20 flex items-center justify-between font-mono text-[0.625rem] tracking-[0.16em] text-ink/60 uppercase sm:inset-x-6 md:inset-x-[4vw]">
          <button type="button" onClick={share} className="hover:text-ink">
            {copied ? 'Link copied' : 'Share'}
          </button>
          <span className="flex items-center gap-2">
            <span className="h-6 w-[1.5px] overflow-hidden rounded-full bg-ink/15">
              <span className="block h-2 w-full animate-bounce bg-ink motion-reduce:animate-none" />
            </span>
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
