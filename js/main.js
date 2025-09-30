// Bootstrap and UI wiring

(function () {
    const game = new window.SolitaireGame();

    function start() {
        game.newGame();
    }

    document.getElementById('new-game').addEventListener('click', () => {
        start();
    });

    // Simple undo placeholder (no-op for now)
    document.getElementById('undo').addEventListener('click', () => {
        // TODO: implement undo stack
        alert('撤销功能稍后提供');
    });

    // Overlay button
    const overlay = document.getElementById('game-overlay');
    const playAgain = document.getElementById('play-again');
    if (playAgain) {
        playAgain.addEventListener('click', () => {
            overlay.style.display = 'none';
            start();
        });
    }

    // Start immediately
    start();

    // Expose for console debugging
    window.__solitaire = game;
})(); 