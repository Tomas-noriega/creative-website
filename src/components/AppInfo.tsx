import {appInfo} from '../content';
import {useReveals} from '../hooks/useReveals';
import {CurveEdge} from './CurveEdge';

/**
 * The rest of the app: guides, calculators, the PR feed and the look, then a
 * plain list of what it is built with. A quiet chalk section between the
 * dark progress reveals and the yellow plan finder.
 */
export function AppInfo() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} id="app" aria-labelledby="app-title" className="relative bg-fog px-4 pt-24 pb-24 text-ink sm:px-6 md:px-[4vw] md:pt-36 md:pb-36">
      <CurveEdge color="var(--color-fog)" />
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5" data-reveal>
          <p className="font-mono text-label text-tide-deep uppercase">{appInfo.eyebrow}</p>
          <h2 id="app-title" className="mt-4 text-display font-extralight uppercase">
            <span className="wide block font-display">{appInfo.heading[0]}</span>
            <span className="block font-serif text-tide-deep normal-case italic">{appInfo.heading[1]}</span>
          </h2>
        </div>
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-7" data-reveal>
          {appInfo.features.map((f, i) => (
            <li key={f.title} className="border-t border-ink/15 pt-5">
              <p className="font-mono text-label text-ink/50 uppercase">0{i + 1}</p>
              <h3 className="wide mt-2 font-display text-[1.375rem] font-light uppercase">{f.title}</h3>
              <p className="mt-2 text-body text-ink/75">{f.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 grid gap-8 rounded-[10px] bg-ink p-6 text-chalk md:mt-28 md:grid-cols-12 md:gap-10 md:p-10" data-reveal>
        <h3 className="wide font-display text-[clamp(1.375rem,2.4vw,2.25rem)] leading-none font-extralight uppercase md:col-span-4">{appInfo.stackHeading}</h3>
        <dl className="grid gap-x-8 sm:grid-cols-2 md:col-span-8">
          {appInfo.stack.map((s) => (
            <div key={s.k} className="border-t border-chalk/10 py-4">
              <dt className="font-mono text-label text-tide uppercase">{s.k}</dt>
              <dd className="mt-1.5 text-body text-chalk/80">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
