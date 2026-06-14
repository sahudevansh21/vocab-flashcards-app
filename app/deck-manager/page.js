"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const getDecks = () => {
  if (typeof window !== 'undefined') {
    const storedDecks = localStorage.getItem('vocabDecks');
    return storedDecks ? JSON.parse(storedDecks) : [];
  }
  return [];
};

const saveDecks = (decks) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vocabDecks', JSON.stringify(decks));
  }
};

export default function DeckManagerPage() {
  const [decks, setDecks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setDecks(getDecks());
  }, []);

  const handleDeleteDeck = (id) => {
    if (confirm('Are you sure you want to delete this deck?')) {
      const updatedDecks = decks.filter(deck => deck.id !== id);
      saveDecks(updatedDecks);
      setDecks(updatedDecks);
      setMessage('Deck deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="glass-card flex-col gap-4" style={{ maxWidth: '800px', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', background: 'linear-gradient(90deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Manage Your Flashcard Decks
      </h1>

      {message && <p style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

      {decks.length === 0 ? (
        <p className="text-center" style={{ fontSize: '1.1rem' }}>
          You haven't created any decks yet. <Link href="/deck-creator" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>Create one now!</Link>
        </p>
      ) : (
        <div className="flex-col gap-2">
          {decks.map(deck => (
            <div key={deck.id} className="glass-card flex-row align-items-center justify-content-between" style={{ padding: '1rem 1.5rem', width: '100%', flexDirection: 'row', alignItems: 'center' }}>
              <div className="flex-col gap-1" style={{ flexGrow: 1 }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{deck.name}</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.8 }}>{deck.cards.length} words</p>
              </div>
              <div className="flex-row gap-1">
                <Link href={`/flashcard-review?deckId=${deck.id}`} className="btn">
                  Review
                </Link>
                <button onClick={() => handleDeleteDeck(deck.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
