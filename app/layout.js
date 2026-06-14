import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Custom Vocabulary Flashcards',
  description: 'Create and review custom vocabulary flashcards, all managed in your browser.',
};

function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/deck-creator" className="navbar-link">Deck Creator</Link>
      <Link href="/flashcard-review" className="navbar-link">Flashcard Review</Link>
      <Link href="/deck-manager" className="navbar-link">Deck Manager</Link>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
