export default function Contact() {
  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', position: 'relative', zIndex: 1 }}>
      <section style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="glow-text text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            Ready to build a real agentic solution? Let's talk about your enterprise needs.
          </p>
        </div>

        <form className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Your Name"
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder="(555) 555-5555"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Project Description</label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="Tell us about the agentic workflow you need..."
              rows={5}
              required
              className="form-input"
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <button 
            type="submit" 
            style={{
              marginTop: '1rem',
              padding: '1rem 2rem',
              backgroundColor: 'var(--accent-green)',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 15px var(--accent-green-glow)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 25px var(--accent-green-glow)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 15px var(--accent-green-glow)';
            }}
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
