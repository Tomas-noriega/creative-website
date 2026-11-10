import {useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MutableRefObject, type PointerEvent as ReactPointerEvent} from 'react';
import {createStage, FEATURES, hasWebGL, MODEL_DIR, type Stage} from '../lib/reelModel';

/**
 * The hero product: the confirmed Reel Lifts icon sculpture from Mission 2,
 * rendered live. Drag sideways to turn it, use the buttons to zoom, reset or
 * jump to a feature. Without WebGL it shows the confirmed preview image.
 */
export function ModelStage({
  apiRef,
  reducedMotion,
  onReady,
}: {
  apiRef: MutableRefObject<Stage | null>;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [mode, setMode] = useState<'loading' | '3d' | 'fallback'>(() => (hasWebGL() ? 'loading' : 'fallback'));
  const [feature, setFeature] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'fallback') {
      onReady();
      return;
    }
    let stage: Stage | null = null;
    let cancelled = false;
    const mount = mountRef.current!;
    createStage(mount, {
      reducedMotion,
      onFrame: () => {
        const pts = stage?.project();
        if (!pts) return;
        for (const f of FEATURES) {
          const el = dotRefs.current[f.id];
          const p = pts[f.id];
          if (!el) continue;
          el.style.opacity = p ? '1' : '0';
          el.style.pointerEvents = p ? 'auto' : 'none';
          if (p) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        }
      },
    })
      .then((s) => {
        if (cancelled) return s.dispose();
        stage = s;
        apiRef.current = s;
        setMode('3d');
        onReady();
      })
      .catch(() => {
        if (!cancelled) setMode('fallback');
        onReady();
      });

    // Only render while the hero is on screen.
    const io = new IntersectionObserver(([e]) => stage?.setActive(e.isIntersecting));
    io.observe(mount);
    return () => {
      cancelled = true;
      io.disconnect();
      stage?.dispose();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode === 'fallback', reducedMotion]);

  /** Sideways drags turn the model; vertical swipes still scroll the page. */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = apiRef.current;
    if (!s) return;
    let x = e.clientX;
    let y = e.clientY;
    const move = (ev: PointerEvent) => {
      s.rotateBy(ev.clientX - x, e.pointerType === 'mouse' ? ev.clientY - y : 0);
      x = ev.clientX;
      y = ev.clientY;
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    setFeature(null);
  };

  const onKey = (e: ReactKeyboardEvent) => {
    const s = apiRef.current;
    if (!s) return;
    const k: Record<string, () => void> = {
      ArrowLeft: () => s.rotateBy(-40, 0),
      ArrowRight: () => s.rotateBy(40, 0),
      ArrowUp: () => s.rotateBy(0, -40),
      ArrowDown: () => s.rotateBy(0, 40),
      '+': () => s.zoom(1),
      '=': () => s.zoom(1),
      '-': () => s.zoom(-1),
      '0': () => s.reset(),
    };
    if (k[e.key]) {
      e.preventDefault();
      k[e.key]();
    }
  };

  const pick = (id: string) => {
    const next = feature === id ? null : id;
    setFeature(next);
    apiRef.current?.focus(next);
  };

  if (mode === 'fallback') {
    return (
      <figure className="relative size-full bg-ink">
        <img
          src={`${MODEL_DIR}preview.png`}
          alt="Static preview of the Reel Lifts icon sculpture: two lifters filming themselves inside a glowing gold app-icon frame."
          className="size-full object-contain"
          decoding="async"
        />
        <figcaption className="absolute inset-x-0 bottom-3 text-center font-mono text-[0.5625rem] tracking-[0.16em] text-chalk/60 uppercase">
          Static preview · 3D needs WebGL
        </figcaption>
      </figure>
    );
  }

  const active = FEATURES.find((f) => f.id === feature);
  const btn = 'grid size-8 place-items-center rounded-full bg-chalk/10 text-chalk backdrop-blur-sm transition-colors hover:bg-buoy hover:text-ink focus-visible:outline-2 focus-visible:outline-buoy';

  return (
    <div className="relative size-full bg-[#0c0b09]">
      <div
        ref={mountRef}
        role="img"
        tabIndex={0}
        aria-label="Interactive 3D model of the Reel Lifts icon: two lifters filming themselves in a glowing gold app-icon frame. Drag or use the arrow keys to turn it."
        onPointerDown={onPointerDown}
        onKeyDown={onKey}
        className="absolute inset-0 cursor-grab touch-pan-y outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-buoy"
      />
      {mode === 'loading' && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-chalk/60 uppercase motion-safe:animate-pulse">Loading 3D model</span>
        </div>
      )}

      {/* Feature hotspots, placed on the parts they describe. */}
      <div data-model-ui className="pointer-events-none absolute inset-0 overflow-clip">
        {FEATURES.map((f, i) => (
          <button
            key={f.id}
            ref={(el) => {
              dotRefs.current[f.id] = el;
            }}
            type="button"
            onClick={() => pick(f.id)}
            aria-label={`${f.title}: ${f.body}`}
            aria-pressed={feature === f.id}
            className="absolute top-0 left-0 grid size-7 place-items-center rounded-full border border-buoy/70 bg-ink/70 font-mono text-[0.5625rem] text-buoy opacity-0 transition-colors hover:bg-buoy hover:text-ink"
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      {active && (
        <div className="pointer-events-none absolute inset-x-3 top-3 rounded-md bg-ink/80 p-3 text-chalk backdrop-blur-sm sm:right-auto sm:max-w-[17rem]">
          <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-buoy uppercase">{active.title}</p>
          <p className="mt-1 text-[0.8125rem] leading-snug text-chalk/85">{active.body}</p>
        </div>
      )}

      {/* Controls. */}
      <div data-model-ui className="absolute right-3 bottom-3 flex items-center gap-1.5">
        <span className="mr-1 font-mono text-[0.5625rem] tracking-[0.16em] text-chalk/55 uppercase max-sm:hidden">Drag to rotate</span>
        <button type="button" className={btn} aria-label="Zoom out" onClick={() => apiRef.current?.zoom(-1)}>
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        <button type="button" className={btn} aria-label="Zoom in" onClick={() => apiRef.current?.zoom(1)}>
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        <button
          type="button"
          className={btn}
          aria-label="Reset view"
          onClick={() => {
            setFeature(null);
            apiRef.current?.reset();
          }}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true" fill="none"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.6h2.6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
    </div>
  );
}
