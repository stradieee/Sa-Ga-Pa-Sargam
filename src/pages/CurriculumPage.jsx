const modules = [
  {
    title: "Breath and focus",
    description:
      "Start with slow, steady breath, relaxed posture, and reduced vocal tension so your pitch becomes stable before complexity increases.",
  },
  {
    title: "Sa Re Ga Ma",
    description:
      "Train the first five notes with listening discipline, micro-adjustments, and a clean sense of interval movement.",
  },
  {
    title: "Pa Dha Ni Sa",
    description:
      "Develop upper-register confidence with balanced transitions and controlled sustain across the scale.",
  },
  {
    title: "Octave discipline",
    description:
      "Move between low, medium, and high registers with consistent tone quality and good resonance without strain.",
  },
];

const routine = [
  "1 minute: gentle humming and voice wake-up",
  "3 minutes: sustain target swara with live pitch matching",
  "2 minutes: compare to adjacent notes and adjust pitch",
  "3 minutes: repeat full scale across octave levels",
  "1 minute: relax and reset breath",
];

export default function CurriculumPage() {
  return (
    <div className="content-page">
      <section className="section">
        <span className="eyebrow">Curriculum</span>
        <h2>Progressive training for intonation and range</h2>
        <p className="section-lead">
          This curriculum balances pitch precision, resonance awareness, and relaxed vocal mechanics
          so students can build confidence without forcing the voice.
        </p>
      </section>

      <section className="section">
        <div className="feature-grid">
          {modules.map((item) => (
            <article key={item.title} className="panel feature-card">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="label">Daily routine</p>
              <h3>10 minute flow</h3>
            </div>
          </div>

          <ul className="checklist">
            {routine.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}