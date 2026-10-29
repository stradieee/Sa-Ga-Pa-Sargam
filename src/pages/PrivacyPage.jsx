export default function PrivacyPage() {
  return (
    <div className="content-page">
      <section className="section">
        <span className="eyebrow">Privacy</span>
        <h2>Voice data is processed locally and never stored</h2>
      </section>

      <section className="section">
        <div className="panel">
          <p>
            Sa Ga Pa Sargam analyzes microphone input directly in the browser using the Web Audio
            API. Your voice is never recorded, uploaded, or retained on a server. The microphone
            stream is used only while the session is active and is terminated when you stop the mic
            or leave the page.
          </p>

          <ul className="privacy-list">
            <li>No voice recordings are stored in a database.</li>
            <li>No session data is saved in browser storage after use.</li>
            <li>Live audio is processed locally in your device memory.</li>
            <li>When the mic is stopped, the stream is terminated immediately.</li>
            <li>We do not track or retain your personal voice data.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}