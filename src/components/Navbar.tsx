import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Clea Solutions</span>
      </Link>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link href="/">Vision</Link>
        <Link href="/work">Our Work</Link>
      </div>
    </nav>
  );
}
