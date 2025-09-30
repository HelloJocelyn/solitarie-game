// Card class for Solitaire game
class Card {
    constructor(suit, value) {
        this.suit = suit; // 'hearts', 'diamonds', 'clubs', 'spades'
        this.value = value; // 1-13 (A, 2-10, J, Q, K)
        this.faceUp = false;
        this.element = null;
    }

    // Get display value (A, 2-10, J, Q, K)
    getDisplayValue() {
        if (this.value === 1) return 'A';
        if (this.value === 11) return 'J';
        if (this.value === 12) return 'Q';
        if (this.value === 13) return 'K';
        return this.value.toString();
    }

    // Get suit symbol
    getSuitSymbol() {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[this.suit];
    }

    // Check if card is red
    isRed() {
        return this.suit === 'hearts' || this.suit === 'diamonds';
    }

    // Check if card is black
    isBlack() {
        return this.suit === 'clubs' || this.suit === 'spades';
    }

    // Create HTML element for the card
    createElement() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.suit = this.suit;
        cardDiv.dataset.value = this.value;
        
        if (this.faceUp) {
            cardDiv.classList.add(this.isRed() ? 'red' : 'black');
            cardDiv.innerHTML = 
                <div class="card-value"></div>
                <div class="card-suit top"></div>
                <div class="card-suit bottom"></div>
            ;
        } else {
            cardDiv.classList.add('face-down');
        }
        
        this.element = cardDiv;
        return cardDiv;
    }

    // Flip the card with animation
    flip() {
        this.faceUp = !this.faceUp;
        if (this.element) {
            // Add flip animation
            this.element.classList.add('flipping');
            
            // Change content halfway through animation
            setTimeout(() => {
                this.updateElement();
            }, 300);
            
            // Remove animation class after completion
            setTimeout(() => {
                this.element.classList.remove('flipping');
            }, 600);
        }
    }

    // Update the card element
    updateElement() {
        if (!this.element) return;
        
        this.element.className = 'card';
        this.element.dataset.suit = this.suit;
        this.element.dataset.value = this.value;
        
        if (this.faceUp) {
            this.element.classList.add(this.isRed() ? 'red' : 'black');
            this.element.innerHTML = 
                <div class="card-value"></div>
                <div class="card-suit top"></div>
                <div class="card-suit bottom"></div>
            ;
        } else {
            this.element.classList.add('face-down');
            this.element.innerHTML = '';
        }
    }

    // Check if this card can be placed on another card (for tableau)
    canPlaceOnTableau(otherCard) {
        if (!otherCard) return this.value === 13; // King can be placed on empty space
        
        // Must be opposite color and one value lower
        return (this.isRed() !== otherCard.isRed()) && (this.value === otherCard.value - 1);
    }

    // Check if this card can be placed on foundation
    canPlaceOnFoundation(otherCard) {
        if (!otherCard) return this.value === 1; // Ace can start foundation
        
        // Must be same suit and one value higher
        return this.suit === otherCard.suit && this.value === otherCard.value + 1;
    }

    // Get card identifier
    getId() {
        return ${this.suit}-;
    }

    // Clone the card
    clone() {
        const clonedCard = new Card(this.suit, this.value);
        clonedCard.faceUp = this.faceUp;
        return clonedCard;
    }
}

// Utility function to create a full deck
function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck = [];
    
    for (const suit of suits) {
        for (let value = 1; value <= 13; value++) {
            deck.push(new Card(suit, value));
        }
    }
    
    return deck;
}

// Utility function to shuffle deck
function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
