// Card class for Solitaire game
class Card {
    constructor(suit, value) {
        this.suit = suit; // 'hearts', 'diamonds', 'clubs', 'spades'
        this.value = value; // 1-13 (A, 2-10, J, Q, K)
        this.faceUp = false;
        this.element = null;
    }

    getDisplayValue() {
        if (this.value === 1) return 'A';
        if (this.value === 11) return 'J';
        if (this.value === 12) return 'Q';
        if (this.value === 13) return 'K';
        return this.value.toString();
    }

    getSuitSymbol() {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[this.suit];
    }

    isRed() { return this.suit === 'hearts' || this.suit === 'diamonds'; }
    isBlack() { return this.suit === 'clubs' || this.suit === 'spades'; }

    createElement() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.suit = this.suit;
        cardDiv.dataset.value = this.value;
        if (this.faceUp) {
            cardDiv.classList.add(this.isRed() ? 'red' : 'black');
            cardDiv.innerHTML = this.buildFaceHTML();
        } else {
            cardDiv.classList.add('face-down');
            cardDiv.innerHTML = '';
        }
        this.element = cardDiv;
        return cardDiv;
    }

    flip() {
        this.faceUp = !this.faceUp;
        if (this.element) {
            this.element.classList.add('flipping');
            setTimeout(() => { this.updateElement(); }, 300);
            setTimeout(() => { this.element.classList.remove('flipping'); }, 600);
        }
    }

    updateElement() {
        if (!this.element) return;
        this.element.className = 'card';
        this.element.dataset.suit = this.suit;
        this.element.dataset.value = this.value;
        if (this.faceUp) {
            this.element.classList.add(this.isRed() ? 'red' : 'black');
            this.element.innerHTML = this.buildFaceHTML();
        } else {
            this.element.classList.add('face-down');
            this.element.innerHTML = '';
        }
    }

    buildFaceHTML() {
        const value = this.getDisplayValue();
        const suitSymbol = this.getSuitSymbol();
        // Court cards: prefer image, fallback to inline SVG without string escaping hacks
        if (this.value >= 11 && this.value <= 13) {
            const label = value; // J/Q/K
            const imgPath = `images/courts/${label}-${this.suit}.png`;
            const fallbackSVG = this.buildCourtSVG(label);
            return `
                <div class="card-value">${value}</div>
                <div class="card-face">
                    <div class="court court-${label.toLowerCase()}">
                        <img class="court-img" src="${imgPath}" alt="${label}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                        <div class="court-fallback" style="display:none;">${fallbackSVG}</div>
                    </div>
                </div>
            `;
        }
        // A and number cards: single centered suit image preferred, fallback to large symbol
        const suitImgPath = `images/suits/${this.suit}.png`;
        return `
            <div class="card-value">${value}</div>
            <div class="card-face">
                <img class="suit-img" src="${suitImgPath}" alt="${this.suit}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <div class="pip pip-center" style="display:none;">${suitSymbol}</div>
            </div>
        `;
    }

    buildCourtSVG(label) {
        const fill = this.isRed() ? '#c62828' : '#1b1b1b';
        if (label === 'K') {
            return `<svg viewBox="0 0 100 120" class="court-svg"><rect x="10" y="20" width="80" height="90" rx="8" fill="#f5f5f5" stroke="${fill}"/><path d="M15 35 L50 15 L85 35" fill="${fill}"/><circle cx="50" cy="65" r="18" fill="${fill}" opacity="0.15"/><text x="50" y="75" text-anchor="middle" font-size="48" fill="${fill}">K</text></svg>`;
        }
        if (label === 'Q') {
            return `<svg viewBox="0 0 100 120" class="court-svg"><rect x="10" y="20" width="80" height="90" rx="8" fill="#f5f5f5" stroke="${fill}"/><path d="M20 40 C40 10, 60 10, 80 40" fill="none" stroke="${fill}" stroke-width="4"/><circle cx="50" cy="70" r="18" fill="${fill}" opacity="0.15"/><text x="50" y="80" text-anchor="middle" font-size="44" fill="${fill}">Q</text></svg>`;
        }
        return `<svg viewBox="0 0 100 120" class="court-svg"><rect x="10" y="20" width="80" height="90" rx="8" fill="#f5f5f5" stroke="${fill}"/><path d="M35 30 H70" stroke="${fill}" stroke-width="6"/><path d="M70 30 V80 C70 95, 55 100, 45 95" stroke="${fill}" stroke-width="6" fill="none"/><text x="50" y="85" text-anchor="middle" font-size="44" fill="${fill}">J</text></svg>`;
    }

    canPlaceOnTableau(otherCard) {
        if (!otherCard) return this.value === 13;
        return (this.isRed() !== otherCard.isRed()) && (this.value === otherCard.value - 1);
    }

    canPlaceOnFoundation(otherCard) {
        if (!otherCard) return this.value === 1;
        return this.suit === otherCard.suit && this.value === otherCard.value + 1;
    }

    getId() { return `${this.suit}-${this.value}`; }
    clone() { const c = new Card(this.suit, this.value); c.faceUp = this.faceUp; return c; }
}

function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck = [];
    for (const suit of suits) {
        for (let value = 1; value <= 13; value++) deck.push(new Card(suit, value));
    }
    return deck;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
