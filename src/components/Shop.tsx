import {useEffect, useRef, useState} from 'react';
import {brand, shop} from '../content';
import {useFitText} from '../hooks/useFitText';
import {useReveals} from '../hooks/useReveals';
import {clamp, easeOutCubic} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {CurveEdge} from './CurveEdge';

/**
 * Find your plan, then join the waitlist. The section turns brand yellow;
 * a two-question plan finder answers on the spot (nothing is sent
 * anywhere) and the call to action opens an email to join the waitlist.
 */
export function Shop() {
  const ref = useReveals<HTMLElement>();
  const [level, setLevel] = useState(1);
  const [goal, setGoal] = useState(0);
  const markRef = useFitText<HTMLSpanElement>();
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  // The wordmark rises out of its masks, letter by letter, as you reach it.
  useEffect(() => {
    let last = -1;
    return onFrame(() => {
      const mark = markRef.current;
      if (!mark) return;
      const r = mark.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top > vh + 50 || r.bottom < -50) return;
      const k = clamp((vh - r.top) / (r.height * 1.6 + vh * 0.25));
      if (Math.abs(k - last) < 0.0008) return;
      last = k;
      const n = letterRefs.current.length;
      letterRefs.current.forEach((el, i) => {
        const e = easeOutCubic(clamp((k - (i / n) * 0.45) / 0.55));
        el.style.transform = `translate3d(0, ${(1 - e) * 105}%, 0) rotate(${(1 - e) * 8}deg)`;
      });
    });
  }, [markRef]);

  const plan = shop.plans[level][goal];

  return (
    <section ref={ref} id="shop" aria-labelledby="shop-title" className="relative bg-sand px-4 pt-24 pb-8 text-ink sm:px-6 md:px-[4vw] md:pt-36">
      <CurveEdge color="var(--color-sand)" />
      {/* Knurling: the cross-hatch on a barbell grip. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgb(21 27 48 / 0.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgb(21 27 48 / 0.035) 0 1px, transparent 1px 4px)',
        }}
      />
      <div className="relative grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5" data-reveal>
          <p className="font-mono text-label text-ink/70 uppercase">{shop.eyebrow}</p>
          <h2 id="shop-title" className="mt-4 text-display font-extralight uppercase">
            <span className="wide block font-display">{shop.heading[0]}</span>
            <span className="block font-serif text-buoy-deep normal-case italic">{shop.heading[1]}</span>
          </h2>
          <p className="mt-6 max-w-[26rem] text-body text-ink/80">{shop.body}</p>
        </div>

        <div className="space-y-6 md:col-span-6 md:col-start-7" data-reveal>
          <fieldset>
            <legend className="font-mono text-label text-ink/70 uppercase">Where you are now</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {shop.levels.map((s, i) => (
                <label key={s} className="cursor-pointer">
                  <input type="radio" name="level" value={s} checked={level === i} onChange={() => setLevel(i)} className="peer sr-only" />
                  <span className="block min-w-[3.25rem] rounded-full px-4 py-2 text-center text-[0.875rem] ring-1 ring-ink/35 transition-colors peer-checked:bg-ink peer-checked:text-sand peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-ink">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-mono text-label text-ink/70 uppercase">What you’re chasing</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {shop.goals.map((f, i) => (
                <label key={f} className="cursor-pointer">
                  <input type="radio" name="goal" value={f} checked={goal === i} onChange={() => setGoal(i)} className="peer sr-only" />
                  <span className="block rounded-full px-4 py-2 text-[0.875rem] ring-1 ring-ink/35 transition-colors peer-checked:bg-ink peer-checked:text-sand peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-ink">
                    {f}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div role="status" className="border-t border-ink/15 pt-5">
            <p className="font-mono text-label text-ink/70 uppercase">Your Reel Lifts plan</p>
            <p className="mt-2 flex items-baseline gap-4">
              <span className="wide font-display text-[clamp(2.5rem,5vw,4rem)] leading-none font-extralight">{plan.name}</span>
              <span key={`${level}-${goal}`} className="animate-[fade-up_0.6s_cubic-bezier(0.2,0.7,0.1,1)] text-body text-ink/80">
                {plan.advice}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <a
              href={brand.ctaUrl}
              className="group flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-label text-chalk uppercase transition-colors hover:bg-chalk hover:text-ink"
            >
              {brand.cta} — {plan.name} plan
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <span className="font-mono text-label text-ink/70 uppercase">{shop.note}</span>
          </div>
        </div>
      </div>

      {/* Wordmark, edge to edge. */}
      <p className="relative mt-24 leading-none md:mt-36" aria-hidden="true">
        <span ref={markRef} className="wide inline-block font-display leading-[0.78] font-extralight whitespace-nowrap text-ink">
          {[...brand.wordmark].map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
              <span
                ref={(el) => {
                  if (el) letterRefs.current[i] = el;
                }}
                className="inline-block origin-bottom-left will-change-transform"
                style={{transform: 'translate3d(0,105%,0)'}}
              >
                {ch === ' ' ? '\u00a0' : ch}
              </span>
            </span>
          ))}
        </span>
      </p>
    </section>
  );
}
