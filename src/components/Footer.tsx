export default function Footer() {
  return (
    <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '4rem', color: 'var(--text-secondary)' }}>
      <p>&copy; {new Date().getFullYear()} Clea Solutions. All rights reserved.</p>
    </footer>
  );
}
