export default function HomePage() {
  const benefits = [
    {
      title: "Precision frequency feedback",
      text: "See your vocal frequency in real time and adjust pitch with visual and numeric guidance.",
    },
    {
      title: "Sa Re Ga Ma training",
      text: "Learn the swaras in a calm, structured system rooted in Indian classical vocal practice.",
    },
    {
      title: "Octave-driven progression",
      text: "Train across low, medium, and high registers to build range, steadiness, and tonal consistency.",
    },
  ];

  const metrics = [
    { label: "Swaras", value: "7" },
    { label: "Octaves", value: "3" },
    { label: "Mode", value: "D major" },
  ];

  return (
    <>
      <section className="hero section">
        <div className="hero-copy">
          <span className="eyebrow">Precision vocal training</span>
          <h2>Train with clarity, pitch, and confidence.</h2>
          <p>
            Sa Ga Pa Sargam is built for singers who want real-time pitch awareness, Indian
            classical note alignment, and focused practice with zero friction.
          </p>

          <div className="hero-actions">
            <a href="/app" className="primary-btn">Open practice app</a>
            <a href="/curriculum" className="secondary-btn">View curriculum</a>
          </div>

          <div className="stat-row">
            {metrics.map((item) => (
              <div key={item.label} className="mini-stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel hero-card">
          <div className="panel-header">
            <p className="label">Live sample</p>
            <span className="chip">D major</span>
          </div>

          <div className="mini-graph">
            {[15, 28, 45, 62, 76, 68, 52, 33, 20, 50, 72, 62].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>

          <div className="note-preview">
            <span>Sa</span>
            <span>Re</span>
            <span>Ga</span>
            <span>Ma</span>
            <span>Pa</span>
            <span>Dha</span>
            <span>Ni</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span className="eyebrow">Why singers use it</span>
          <h3>Built for better intonation and consistency</h3>
        </div>

        <div className="feature-grid">
          {benefits.map((item) => (
            <article key={item.title} className="panel feature-card">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="panel cta-banner">
          <div>
            <span className="eyebrow">Start today</span>
            <h3>Practice in a focused, voice-first environment.</h3>
          </div>
          <a href="/app" className="primary-btn">Go to app</a>
        </div>
      </section>
    </>
  );
}