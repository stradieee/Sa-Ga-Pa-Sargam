export default function ContactPage() {
  return (
    <div className="content-page">
      <section className="section">
        <span className="eyebrow">Contact</span>
        <h2>Questions, partnerships, or feedback?</h2>
      </section>

      <section className="section">
        <div className="panel form-panel">
          <form className="contact-form">
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>

            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>

            <label>
              Message
              <textarea rows="5" placeholder="Tell us about your vocal goals or product questions." />
            </label>

            <button type="button" className="primary-btn">
              Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}