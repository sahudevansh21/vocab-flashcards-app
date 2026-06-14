"use client";

import { useState, useEffect } from 'react';

// Simple UUID generator (to avoid external npm dependency for 'uuid')
const generateUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

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

export default function DeckCreatorPage() {
  const [deckName, setDeckName] = useState('');
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [currentDeckWords, setCurrentDeckWords] = useState([]);
  const [message, setMessage] = useState('');

  const handleAddWord = (e) => {
    e.preventDefault();
    if (word.trim() && definition.trim()) {
      setCurrentDeckWords([...currentDeckWords, { id: generateUuid(), word: word.trim(), definition: definition.trim(), learned: false }]);
      setWord('');
      setDefinition('');
      setMessage('');
    } else {
      setMessage('Please enter both word and definition.');
    }
  };

  const handleSaveDeck = () => {
    if (!deckName.trim()) {
      setMessage('Deck name cannot be empty.');
      return;
    }
    if (currentDeckWords.length === 0) {
      setMessage('Please add some words to the deck before saving.');
      return;
    }

    const existingDecks = getDecks();
    const newDeck = {
      id: generateUuid(),
      name: deckName.trim(),
      cards: currentDeckWords,
    };

    saveDecks([...existingDecks, newDeck]);
    setDeckName('');
    setCurrentDeckWords([]);
    setMessage(`Deck '${newDeck.name}' saved successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemoveWord = (id) => {
    setCurrentDeckWords(currentDeckWords.filter(card => card.id !== id));
  };

  return (
    <div className="glass-card flex-col gap-4" style={{ maxWidth: '700px', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', background: 'linear-gradient(90deg, var(--gradient-start) 0%, var(--gradient-end) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Create New Flashcard Deck
      </h1>

      {message && <p style={{ color: message.includes('success') ? 'var(--accent-cyan)' : '#e53935', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

      <div className="input-group">
        <label htmlFor="deckName">Deck Name:</label>
        <input
          id="deckName"
          type="text"
          className="input-field"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="e.g., French Verbs, Science Terms"
        />
      </div>

      <form onSubmit={handleAddWord} className="flex-col gap-2">
        <div className="input-group">
          <label htmlFor="word">Word/Term:</label>
          <input
            id="word"
            type="text"
            className="input-field"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="e.g., Bonjour, Photosynthesis"
          />
        </div>
        <div className="input-group">
          <label htmlFor="definition">Definition/Translation:</label>
          <textarea
            id="definition"
            className="textarea-field"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="e.g., Hello, The process by which green plants and some other organisms..."
          ></textarea>
        </div>
        <button type="submit" className="btn">
          Add Word to Deck
        </button>
      </form>

      {currentDeckWords.length > 0 && (
        <div className="flex-col gap-2" style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-purple)' }}>Words in Current Deck ({currentDeckWords.length})</h2>
          <ul className="flex-col gap-1" style={{ listStyle: 'none', padding: 0 }}>
            {currentDeckWords.map((card) => (
              <li key={card.id} className="glass-card flex-row align-items-center justify-content-between" style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ flex: 1, marginRight: '1rem', fontWeight: '600' }}>{card.word}</span>
                <span style={{ flex: 2 }}>{card.definition}</span>
                <button onClick={() => handleRemoveWord(card.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginLeft: '1rem' }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleSaveDeck} className="btn" style={{ marginTop: '1rem' }}>
            Save Deck
          </button>
        </div>
      )}
    </div>
  );
}
