export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <strong>McJoe a cafe</strong>
        <span>Open daily · 7:00 AM – 9:00 PM</span>
        <span>© {new Date().getFullYear()} McJoe. Freshly brewed.</span>
      </div>
    </footer>
  );
}
