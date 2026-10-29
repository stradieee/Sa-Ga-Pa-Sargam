import PitchDetector from "../components/PitchDetector";

export default function AppPage() {
  return (
    <div className="content-page">
      <section className="section">
        <span className="eyebrow">Practice app</span>
        <h2>Real-time swara tuning</h2>
      </section>

      <PitchDetector />
    </div>
  );
}