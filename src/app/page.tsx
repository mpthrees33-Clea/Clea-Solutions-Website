import Image from 'next/image';
import Link from 'next/link';
import NetworkBackground from '@/components/NetworkBackground';

export default function Home() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', position: 'relative' }}>
      <NetworkBackground />
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-green)', boxShadow: '0 0 30px var(--accent-green-glow)' }}>
            <Image src="/clea_logo.jpg" alt="Clea Solutions Eye" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
        <h1 className="glow-text text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1.1 }}>
          True Agentic AI.<br />Beyond the Chatbot.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Welcome to Clea Solutions. We believe in building robust, fine-tuned, and highly trained AI systems that solve real enterprise problems.
        </p>
        <Link href="/work" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'var(--accent-green)', color: '#000', fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 0 15px var(--accent-green-glow)' }}>
          See Our Work
        </Link>
      </section>

      {/* Vision Section */}
      <section className="glass-panel" style={{ padding: '4rem', marginTop: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Our Philosophy</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>01 //</span> Generic Bots Fail
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The era of wrapping a generic LLM API and calling it an "agent" is over. Off-the-shelf chatbots are unpredictable, hallucinate, and cannot be trusted with critical business logic. True solutions require deeper integration.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>02 //</span> Fine-Tuning is Key
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              At Clea Solutions, we believe that specialized training and fine-tuning are the only paths to success. We build models that understand your specific domain, ensuring high accuracy, reliability, and security.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>03 //</span> Agentic Workflows
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              An AI shouldn't just talk—it should act. We engineer autonomous agentic workflows that can make decisions, use tools, and execute complex, multi-step tasks across your existing infrastructure securely.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
