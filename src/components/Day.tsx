import {useEffect, useRef, useState, type RefObject} from 'react';
import {day} from '../content';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {CurveEdge} from './CurveEdge';

/**
 * A day in the half-zip, as a dial. The section pins while the hand sweeps
 * from sunrise toward night with the scroll; each moment takes the centre
 * of the dial in turn and the clock runs up to it, the list beside it
 * follows, and a tide light comes on for every stop the hand has reached.
 */

const SECTION_VH = 420;
const START = -225; // dial angle for the first hour (degrees, 0 = east)
const SWEEP = 270;
const SPAN = day.end - day.start;
const EVENING = 18;

const angleFor = (hour: number) => ((START + ((hour - day.start) / SPAN) * SWEEP) * Math.PI) / 180;
const polar = (r: number, a: number) => ({x: 200 + Math.cos(a) * r, y: 200 + Math.sin(a) * r});

/** 13.5 → {time: '1:30', ap: 'pm'} */
function clock(hour: number) {
  let h = Math.floor(hour);
  let m = Math.round((hour - h) * 60);
  if (m === 60) {
    h += 1;
    m = 0;
  }
  const ap = h >= 12 ? 'pm' : 'am';
  return {time: `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}`, ap};
}

function Dial({needleRef, arcRef}: {needleRef: RefObject<SVGGElement | null>; arcRef: RefObject<SVGPathElement | null>}) {
  const ticks = [];
  for (let i = 0; i <= SPAN * 4; i++) {
    const hour = day.start + i / 4;
    const a = angleFor(hour);
    const major = i % 8 === 0;
    const p1 = polar(major ? 150 : 158, a);
    const p2 = polar(168, a);
    ticks.push(<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={hour >= EVENING ? '#d75f36' : 'rgb(246 243 236 / 0.55)'} strokeWidth={major ? 2 : 1} />);
    if (major) {
      const t = polar(128, a);
      const c = clock(hour);
      ticks.push(
        <text key={`t${i}`} x={t.x} y={t.y + 5} textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="13" fill={hour >= EVENING ? '#e8825d' : 'rgb(246 243 236 / 0.7)'}>
          {c.time.replace(':00', '')}
          {c.ap[0]}
        </text>,
      );
    }
  }
  const r0 = polar(176, angleFor(EVENING));
  const r1 = polar(176, angleFor(day.end));
  const s0 = polar(176, angleFor(day.start));
  return (
    <svg viewBox="0 0 400 400" className="size-full" aria-hidden="true">
      <circle cx="200" cy="200" r="194" fill="#121831" stroke="rgb(143 193 181 / 0.5)" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="186" fill="none" stroke="rgb(246 243 236 / 0.08)" />
      {/* Sunset zone. */}
      <path d={`M${r0.x} ${r0.y} A176 176 0 0 1 ${r1.x} ${r1.y}`} fill="none" stroke="#d75f36" strokeWidth="6" />
      {/* Trail that fills behind the hand. */}
      <path ref={arcRef} d={`M${s0.x} ${s0.y} A176 176 0 1 1 ${r1.x} ${r1.y}`} pathLength={1} fill="none" stroke="var(--color-tide)" strokeWidth="2" strokeDasharray="1 1" strokeDashoffset="1" opacity="0.9" />
      {ticks}
      <text x="200" y="352" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="11" letterSpacing="3" fill="rgb(246 243 236 / 0.45)">
        CAPE COD · EDT
      </text>
      <g ref={needleRef} style={{transformOrigin: '200px 200px'}}>
        <line x1="200" y1="200" x2="200" y2="48" stroke="#f6f3ec" strokeWidth="3" strokeLinecap="round" />
        <line x1="200" y1="200" x2="200" y2="232" stroke="#f6f3ec" strokeWidth="5" strokeLinecap="round" />
      </g>
      <circle cx="200" cy="200" r="13" fill="#1c2440" stroke="var(--color-tide)" strokeWidth="1.5" />
    </svg>
  );
}

export function Day() {
  const rootRef = useRef<HTMLElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const apRef = useRef<HTMLSpanElement>(null);
  const ledRefs = useRef<HTMLSpanElement[]>([]);
  const [active, setActive] = useState(0);
  const n = day.items.length;

  useEffect(() => {
    let lastP = -1;
    let current = -1;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      // Each moment gets an equal share of the scroll: the hand runs up to
      // it over the first 55% of its share, then holds.
      const u = range(p, 0.05, 0.92);
      const idx = clamp(Math.floor(u * n), 0, n - 1);
      const local = clamp(u * n - idx);
      const from = idx === 0 ? day.start : day.items[idx - 1].at;
      const hour = lerp(from, day.items[idx].at, easeOutCubic(clamp(local / 0.55)));

      needleRef.current!.style.transform = `rotate(${((hour - day.start) / SPAN) * SWEEP - 135}deg)`;
      arcRef.current!.style.strokeDashoffset = String(1 - (hour - day.start) / SPAN);
      const c = clock(hour);
      timeRef.current!.textContent = c.time;
      apRef.current!.textContent = c.ap;

      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
      ledRefs.current.forEach((led, i) => {
        const on = i < idx || (i === idx && local >= 0.55);
        led.style.opacity = on ? '1' : '0.15';
      });
    });
  }, [n]);

  const item = day.items[active];

  return (
    <section ref={rootRef} id="day" aria-labelledby="day-title" className="relative bg-ink-2" style={{height: `${SECTION_VH}svh`}}>
      <CurveEdge color="var(--color-ink-2)" />
      <div className="sticky top-0 grid h-screen-s content-center gap-8 overflow-hidden px-4 pt-16 sm:px-6 md:grid-cols-12 md:gap-10 md:px-[4vw] md:pt-0">
        {/* The dial. */}
        <div className="relative mx-auto w-[min(80vw,46svh)] md:col-span-6 md:w-[min(40vw,74svh)]">
          {/* Tide lights. */}
          <div className="mb-4 flex justify-center gap-2" aria-hidden="true">
            {day.items.map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) ledRefs.current[i] = el;
                }}
                className="size-2.5 rounded-full bg-tide shadow-[0_0_10px_var(--color-tide)] transition-opacity duration-150"
                style={{opacity: 0.15}}
              />
            ))}
          </div>
          <div className="relative aspect-square">
            <Dial needleRef={needleRef} arcRef={arcRef} />
            <div className="absolute inset-x-0 top-[57%] text-center">
              <p className="flex items-baseline justify-center gap-1.5">
                <span ref={timeRef} className="wide font-display text-[clamp(2rem,5vw,3.75rem)] leading-none font-extralight tabular-nums">
                  6:00
                </span>
                <span ref={apRef} className="font-serif text-[clamp(1rem,1.8vw,1.5rem)] text-tide italic">
                  am
                </span>
              </p>
              <p className="mx-auto mt-2 max-w-[16rem] px-6 font-mono text-[0.625rem] tracking-[0.14em] text-chalk/60 uppercase">{item.benefit}</p>
            </div>
          </div>
        </div>

        {/* The list. */}
        <div className="md:col-span-5 md:col-start-8">
          <p className="font-mono text-label text-tide uppercase">{day.eyebrow}</p>
          <h2 id="day-title" className="wide mt-3 font-display text-[clamp(1.5rem,2.8vw,2.75rem)] leading-none font-extralight uppercase">
            {day.heading}
          </h2>
          <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.12em] text-chalk uppercase md:hidden">
            <span className="text-tide">
              {clock(item.at).time}
              {clock(item.at).ap}
            </span>{' '}
            · {item.label}
          </p>
          <ol className="mt-6 max-md:hidden md:mt-10">
            {day.items.map((s, i) => {
              const on = i === active;
              const done = i < active;
              const c = clock(s.at);
              return (
                <li key={s.label} className="flex items-baseline justify-between gap-4 border-t border-chalk/10 py-2.5 md:py-3.5">
                  <span className={`font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors duration-500 ${on ? 'text-chalk' : done ? 'text-chalk/55' : 'text-chalk/25'}`}>
                    <span className={on ? 'text-tide' : ''}>
                      {c.time}
                      {c.ap}
                    </span>{' '}
                    · {s.label}
                  </span>
                  <span className={`shrink-0 font-serif max-md:hidden text-[clamp(1rem,1.5vw,1.25rem)] italic transition-all duration-500 ${on ? 'translate-x-0 text-chalk' : done ? 'text-chalk/55' : 'translate-x-2 text-chalk/20'}`}>
                    {s.benefit}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 font-mono text-[0.625rem] tracking-[0.14em] text-chalk/40 uppercase max-md:hidden">{day.note}</p>
        </div>
      </div>
    </section>
  );
}
