import PitchDetector from "../components/PitchDetector";

const exercises = [
  { title: "Sa sustain", accuracy: "92%", type: "Warm-up" },
  { title: "Re stability", accuracy: "88%", type: "Precision" },
  { title: "Ga climb", accuracy: "90%", type: "Range" },
  { title: "Pa ceiling", accuracy: "85%", type: "Control" },
];

const streakData = [68, 80, 74, 86, 95, 88, 92];

export default function DashboardPage() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar-panel panel">
        <div className="brand-row">
          <div className="small-logo">S</div>
          <div>
            <div className="tiny-label">Practice</div>
            <h3>Sa Ga Pa</h3>
          </div>
        </div>

        <nav className="side-nav">
          <button className="nav-pill active" type="button">Overview</button>
          <button className="nav-pill" type="button">Exercises</button>
          <button className="nav-pill" type="button">Streak</button>
          <button className="nav-pill" type="button">Settings</button>
        </nav>

        <div className="mini-card">
          <span className="tiny-label">Current mode</span>
          <strong>D major</strong>
        </div>

        <div className="mini-card">
          <span className="tiny-label">Progress</span>
          <strong>84% in tune</strong>
        </div>
      </aside>

      <main className="dashboard-main">
        <section className="top-stats">
          <div className="stats-card panel">
            <span className="tiny-label">Daily streak</span>
            <strong>12 days</strong>
          </div>
          <div className="stats-card panel">
            <span className="tiny-label">Best note</span>
            <strong>Pa</strong>
          </div>
          <div className="stats-card panel">
            <span className="tiny-label">Average cents</span>
            <strong>+8¢</strong>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <span className="tiny-label">Practice trend</span>
              <h3>Pitch consistency</h3>
            </div>
            <span className="chip success">+6.2%</span>
          </div>

          <div className="chart-bars">
            {streakData.map((value, i) => (
              <div key={i} className="bar-col">
                <div className="bar-fill" style={{ height: `${value}%` }} />
              </div>
            ))}
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel exercise-panel">
            <div className="panel-header">
              <div>
                <span className="tiny-label">Focus</span>
                <h3>Exercises</h3>
              </div>
            </div>

            <div className="exercise-list">
              {exercises.map((exercise) => (
                <div key={exercise.title} className="exercise-item">
                  <div>
                    <strong>{exercise.title}</strong>
                    <small>{exercise.type}</small>
                  </div>
                  <span>{exercise.accuracy}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel tuner-panel">
            <div className="panel-header">
              <div>
                <span className="tiny-label">Live tuner</span>
                <h3>Real-time pitch</h3>
              </div>
            </div>

            <PitchDetector compact />
          </div>
        </section>
      </main>
    </div>
  );
}