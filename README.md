# Custom Vocabulary Flashcards

## Problem Statement
Students or language learners often need a flexible way to memorize new vocabulary words and their definitions. Existing flashcard tools can be too complex or require accounts, making it difficult to quickly create and practice custom word lists without internet dependency or external data storage.

## Solution
This website provides a simple interface for users to create custom flashcard decks by adding words and their definitions. Users can then review these decks in an interactive flashcard mode and track which words they've learned, all managed entirely within their browser's local storage.

## Features

### Deck Creator
*   Easily add new vocabulary words and their definitions.
*   Organize words into custom flashcard decks.

### Flashcard Review
*   Select a deck and review words in an interactive flashcard interface.
*   Flip cards to reveal definitions.
*   Mark words as 'learned' to track progress.

### Deck Manager
*   View all created decks.
*   Delete existing decks.

## Technologies Used
*   Next.js 14 (App Router)
*   React 18
*   Client-side local storage for data persistence
*   Pure CSS for styling (no Tailwind CSS or CSS Modules)

## Getting Started

### Prerequisites
*   Node.js (LTS version recommended)
*   npm or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone [repository-url]
    cd custom-vocab-flashcards
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```

### Running the Development Server
```bash
npm run dev
# or yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production
```bash
npm run build
```
This command builds the application for production to the `.next` folder.

### Running the Production Server
```bash
npm run start
```
Starts the Next.js production server.
