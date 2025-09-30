// Basic Solitaire (Klondike) game logic

class SolitaireGame {
    constructor() {
        this.stock = []; // face-down deck
        this.waste = []; // face-up cards
        this.foundations = {
            hearts: [],
            diamonds: [],
            clubs: [],
            spades: []
        };
        this.tableau = [[], [], [], [], [], [], []];
        this.score = 0;
        this.startTime = null;
        this.timerInterval = null;

        this.dom = {
            stock: document.getElementById('stock-pile'),
            waste: document.getElementById('waste-pile'),
            foundations: {
                hearts: document.getElementById('foundation-hearts'),
                diamonds: document.getElementById('foundation-diamonds'),
                clubs: document.getElementById('foundation-clubs'),
                spades: document.getElementById('foundation-spades'),
            },
            tableau: Array.from({ length: 7 }, (_, i) => document.getElementById(`column-${i}`)),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
        };

        this.handleClicks();
    }

    newGame() {
        // reset state
        this.stock = shuffleDeck(createDeck());
        this.waste = [];
        this.foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
        this.tableau = [[], [], [], [], [], [], []];
        this.score = 0;
        this.startTime = Date.now();
        this.startTimer();

        // deal tableau: 1..7 columns, last card face up
        for (let col = 0; col < 7; col++) {
            for (let i = 0; i <= col; i++) {
                const card = this.stock.pop();
                if (i === col) card.faceUp = true;
                this.tableau[col].push(card);
            }
        }

        this.renderAll();
    }

    // UI events
    handleClicks() {
        // Stock click -> move top to waste (or recycle waste back to stock when empty)
        this.dom.stock.addEventListener('click', () => {
            if (this.stock.length > 0) {
                const card = this.stock.pop();
                card.faceUp = true;
                this.waste.push(card);
            } else if (this.waste.length > 0) {
                // recycle waste back to stock face-down
                while (this.waste.length) {
                    const c = this.waste.pop();
                    c.faceUp = false;
                    this.stock.push(c);
                }
            }
            this.renderStockWaste();
        });

        // Simple waste -> foundation/tableau moves via double click
        this.dom.waste.addEventListener('dblclick', () => {
            const card = this.waste[this.waste.length - 1];
            if (!card) return;
            if (this.tryMoveToFoundation(card)) {
                this.waste.pop();
                this.score += 10;
            } else if (this.tryMoveToAnyTableau(card)) {
                this.waste.pop();
                this.score += 5;
            }
            this.renderAll();
        });

        // Tableau column click: try auto moves for top face-up card
        this.dom.tableau.forEach((colEl, colIdx) => {
            colEl.addEventListener('dblclick', () => {
                const col = this.tableau[colIdx];
                if (!col.length) return;
                const card = col[col.length - 1];
                if (!card.faceUp) return;
                if (this.tryMoveToFoundation(card)) {
                    col.pop();
                    this.score += 10;
                    this.flipTopIfNeeded(col);
                } else if (this.tryMoveToAnyOtherTableau(card, colIdx)) {
                    col.pop();
                    this.score += 5;
                    this.flipTopIfNeeded(col);
                }
                this.renderAll();
            });
        });
    }

    tryMoveToFoundation(card) {
        const pile = this.foundations[card.suit];
        const top = pile[pile.length - 1];
        if (card.canPlaceOnFoundation(top)) {
            pile.push(card);
            return true;
        }
        return false;
    }

    tryMoveToAnyTableau(card) {
        for (let i = 0; i < 7; i++) {
            const column = this.tableau[i];
            const top = column[column.length - 1];
            if (card.canPlaceOnTableau(top)) {
                column.push(card);
                return true;
            }
        }
        return false;
    }

    tryMoveToAnyOtherTableau(card, fromIdx) {
        for (let i = 0; i < 7; i++) {
            if (i === fromIdx) continue;
            const column = this.tableau[i];
            const top = column[column.length - 1];
            if (card.canPlaceOnTableau(top)) {
                column.push(card);
                return true;
            }
        }
        return false;
    }

    flipTopIfNeeded(column) {
        const top = column[column.length - 1];
        if (top && !top.faceUp) {
            top.flip();
        }
    }

    // Rendering
    renderAll() {
        this.renderStockWaste();
        this.renderFoundations();
        this.renderTableau();
        this.dom.score.textContent = this.score.toString();
    }

    renderStockWaste() {
        // stock
        this.dom.stock.innerHTML = '';
        if (this.stock.length > 0) {
            const back = document.createElement('div');
            back.className = 'card-back';
            this.dom.stock.appendChild(back);
        }

        // waste
        this.dom.waste.innerHTML = '';
        const top = this.waste[this.waste.length - 1];
        if (top) {
            if (!top.element) top.createElement();
            top.faceUp = true;
            top.updateElement();
            top.element.style.position = 'relative';
            this.dom.waste.appendChild(top.element);
        }
    }

    renderFoundations() {
        for (const suit of ['hearts','diamonds','clubs','spades']) {
            const el = this.dom.foundations[suit];
            el.innerHTML = '';
            const top = this.foundations[suit][this.foundations[suit].length - 1];
            if (top) {
                if (!top.element) top.createElement();
                top.faceUp = true;
                top.updateElement();
                top.element.style.position = 'relative';
                el.appendChild(top.element);
            }
        }
    }

    renderTableau() {
        this.dom.tableau.forEach((colEl, idx) => {
            colEl.innerHTML = '';
            const column = this.tableau[idx];
            column.forEach((card, i) => {
                if (!card.element) card.createElement();
                card.updateElement();
                card.element.style.position = 'absolute';
                card.element.style.top = `${i * 26}px`;
                colEl.appendChild(card.element);
            });
        });
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (!this.startTime) return;
            const secs = Math.floor((Date.now() - this.startTime) / 1000);
            const mm = String(Math.floor(secs / 60)).padStart(2, '0');
            const ss = String(secs % 60).padStart(2, '0');
            this.dom.timer.textContent = `${mm}:${ss}`;
        }, 1000);
    }
}

// Expose to window
window.SolitaireGame = SolitaireGame; 