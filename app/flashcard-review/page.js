"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function FlashcardReviewPage() {
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deckId');

  const loadDecksAndSetCurrent = useCallback(() => {
    const allDecks = getDecks();
    setDecks(allDecks);

    let selectedDeck = null;
    if (deckId) {
      selectedDeck = allDecks.find(d => d.id === deckId);
    }

    if (!selectedDeck && allDecks.length > 0) {
      selectedDeck = allDecks[0]; // Default to the first deck if no ID or ID not found
    }
    
    if (selectedDeck && selectedDeck.cards.length > 0) {
        // Shuffle cards for a fresh review session, but keep 'learned' status intact
        const shuffledCards = [...selectedDeck.cards].sort(() => Math.random() - 0.5);
        setCurrentDeck({ ...selectedDeck, cards: shuffledCards });
        setCurrentCardIndex(0);
    } else {
        setCurrentDeck(selectedDeck);
        setCurrentCardIndex(0);
    }
    setShowDefinition(false);
  }, [deckId]);

  useEffect(() => {
    loadDecksAndSetCurrent();
  }, [loadDecksAndSetCurrent]);

  const handleNextCard = (markLearned = false) => {
    if (!currentDeck) return;

    // Create a new array to update the card's learned status locally within the current session's shuffled deck
    const updatedCurrentDeckCards = currentDeck.cards.map((card, index) => 
      index === currentCardIndex ? { ...card, learned: markLearned } : card
    );
    
    // Update the 'learned' status in local storage for the *original* deck (identified by its ID and card IDs)
    const allDecks = getDecks();
    const deckIndex = allDecks.findIndex(d => d.id === currentDeck.id);
    if (deckIndex > -1) {
        allDecks[deckIndex].cards = allDecks[deckIndex].cards.map(originalCard => {
            const updatedCard = updatedCurrentDeckCards.find(c => c.id === originalCard.id);
            return updatedCard ? { ...originalCard, learned: updatedCard.learned } : originalCard;
        });
        saveDecks(allDecks);
    }

    setCurrentDeck(prevDeck => ({ ...prevDeck, cards: updatedCurrentDeckCards }));
    setShowDefinition(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentDeck.cards.length);

    if ((currentCardIndex + 1) % currentDeck.cards.length === 0 && currentDeck.cards.length > 0) {
        setMessage('Deck completed! Reshuffling...');
        setTimeout(() => {
            setMessage('');
            // Re-shuffle the cards, using the now updated `updatedCurrentDeckCards` for the shuffle pool
            const reShuffledCards = [...updatedCurrentDeckCards].sort(() => Math.random() - 0.5);
            setCurrentDeck(prevDeck => ({ ...prevDeck, cards: reShuffledCards }));
            setCurrentCardIndex(0);
        }, 2000);
    }
  };

  const currentCard = currentDeck?.cards[currentCardIndex];
  const learnedCount = currentDeck?.cards.filter(card => card.learned).length || 0;

  if (decks.length === 0) {
    return (
      <div className="glass-card flex-col gap-4 text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', background: 'linear-gradient(90deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Flashcard Review
        </h1>
        <p style={{ fontSize: '1.1rem' }}>
          It looks like you haven't created any decks yet.
        </p>
        <Link href="/deck-creator" className="btn">
          Create Your First Deck
        </Link>
      </div>
    );
  }

  if (!currentDeck || currentDeck.cards.length === 0) {
    return (
      <div className="glass-card flex-col gap-4 text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', background: 'linear-gradient(90deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Flashcard Review
        </h1>
        <p style={{ fontSize: '1.1rem' }}>
          Please select a deck to review from the <Link href="/deck-manager" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>Deck Manager</Link>.
          {decks.length > 0 && ` Or review the default deck: ${decks[0].name}`}
        </p>
        {decks.length > 0 && (
            <Link href={`/flashcard-review?deckId=${decks[0].id}`} className="btn">
              Start Default Deck
            </Link>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card flex-col gap-4 text-center" style={{ maxWidth: '700px', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', background: 'linear-gradient(90deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Reviewing: {currentDeck.name}
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>
        Card {currentCardIndex + 1} / {currentDeck.cards.length} &bull; Learned: {learnedCount}
      </p>
      {message && <p style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>{message}</p>}

      <div
        className="glass-card flex-col gap-4"
        style={{
          minHeight: '200px', 
          cursor: 'pointer', 
          width: '100%', 
          backgroundColor: currentCard?.learned ? 'rgba(0, 188, 212, 0.15)' : 'var(--glass-bg)',
          borderColor: currentCard?.learned ? 'var(--accent-cyan)' : 'var(--glass-border)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
        onClick={() => setShowDefinition(!showDefinition)}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>
          {currentCard?.word}
        </h2>
        {showDefinition && (
          <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', marginTop: '0.5rem' }}>
            {currentCard?.definition}
          </p>
        )}
        <p style={{fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem'}}>{showDefinition ? 'Click to hide definition' : 'Click to reveal definition'}</p>
      </div>

      <div className="flex-row gap-2" style={{ justifyContent: 'center', width: '100%' }}>
        <button onClick={() => handleNextCard(false)} className="btn btn-secondary" style={{ flex: 1 }}>
          Next Card
        </button>
        <button onClick={() => handleNextCard(true)} className="btn" style={{ flex: 1, backgroundColor: 'var(--accent-cyan)' }}>
          Mark Learned & Next
        </button>
      </div>
      <Link href="/deck-manager" className="btn btn-secondary" style={{ width: '100%', maxWidth: 'calc(50% - 0.5rem)' }}>
        Back to Decks
      </Link>
    </div>
  );
}
