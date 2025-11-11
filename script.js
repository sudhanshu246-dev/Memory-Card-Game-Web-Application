   // Game elements
        const gameBoard = document.getElementById('gameBoard');
        const movesElement = document.getElementById('moves');
        const timerElement = document.getElementById('timer');
        const matchesElement = document.getElementById('matches');
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const message = document.getElementById('message');
        const finalMoves = document.getElementById('finalMoves');
        const finalTime = document.getElementById('finalTime');

        // Game state
        let cards = [];
        let flippedCards = [];
        let moves = 0;
        let matches = 0;
        let gameStarted = false;
        let timer = 0;
        let timerInterval;

        // Card symbols
        const cardSymbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍐', '🥭'];

        // Initialize the game
        function initGame() {
            // Create pairs of cards
            cards = [...cardSymbols, ...cardSymbols];
            
            // Shuffle the cards
            shuffleCards();
            
            // Clear the game board
            gameBoard.innerHTML = '';
            
            // Create card elements
            cards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.symbol = symbol;
                card.dataset.index = index;
                
                card.innerHTML = `
                    <div class="card-front">${symbol}</div>
                    <div class="card-back">?</div>
                `;
                
                card.addEventListener('click', flipCard);
                gameBoard.appendChild(card);
            });
            
            // Reset game state
            flippedCards = [];
            moves = 0;
            matches = 0;
            gameStarted = false;
            timer = 0;
            
            // Update UI
            movesElement.textContent = moves;
            matchesElement.textContent = `${matches}/${cardSymbols.length}`;
            timerElement.textContent = `${timer}s`;
            
            // Hide message
            message.style.display = 'none';
            
            // Clear timer
            clearInterval(timerInterval);
        }

        // Shuffle the cards using Fisher-Yates algorithm
        function shuffleCards() {
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
        }

        // Flip a card
        function flipCard() {
            if (!gameStarted) return;
            
            const card = this;
            
            // Don't allow flipping if:
            // - Card is already flipped
            // - Two cards are already flipped
            if (card.classList.contains('flipped') || flippedCards.length >= 2) {
                return;
            }
            
            // Flip the card
            card.classList.add('flipped');
            flippedCards.push(card);
            
            // Check for match if two cards are flipped
            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = moves;
                
                const [card1, card2] = flippedCards;
                
                if (card1.dataset.symbol === card2.dataset.symbol) {
                    // Match found
                    setTimeout(() => {
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        flippedCards = [];
                        
                        matches++;
                        matchesElement.textContent = `${matches}/${cardSymbols.length}`;
                        
                        // Check for win
                        if (matches === cardSymbols.length) {
                            endGame();
                        }
                    }, 500);
                } else {
                    // No match - flip cards back
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        flippedCards = [];
                    }, 1000);
                }
            }
        }

        // Start the game
        function startGame() {
            if (gameStarted) return;
            
            gameStarted = true;
            
            // Start timer
            timerInterval = setInterval(() => {
                timer++;
                timerElement.textContent = `${timer}s`;
            }, 1000);
            
            // Disable start button
            startBtn.disabled = true;
        }

        // End the game
        function endGame() {
            clearInterval(timerInterval);
            
            // Show win message
            finalMoves.textContent = moves;
            finalTime.textContent = timer;
            message.style.display = 'block';
            
            // Re-enable start button
            startBtn.disabled = false;
        }

        // Event listeners
        startBtn.addEventListener('click', startGame);
        resetBtn.addEventListener('click', initGame);

        // Initialize the game on page load
        window.addEventListener('DOMContentLoaded', initGame);