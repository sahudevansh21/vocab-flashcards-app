import Link from 'next/link';

export default function Home() {
  return (
    <div className="glass-card flex-col gap-4 text-center" style={{ maxWidth: '600px', width: '100%' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(90deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Custom Vocabulary Flashcards
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>
        Your personal tool for mastering new words. Create, manage, and review custom flashcard decks right in your browser.
      </p>
      <div className="flex-row gap-2" style={{ justifyContent: 'center' }}>
        <Link href="/deck-creator" className="btn">
          Start Creating Decks
        </Link>
        <Link href="/deck-manager" className="btn btn-secondary">
          Manage Decks
        </Link>
      </div>
    </div>
  );
}
