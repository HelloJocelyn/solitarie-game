// Bootstrap and UI wiring

(function () {
    const game = new window.SolitaireGame();

    function start() {
        game.newGame();
    }

    // i18n init
    const langSelect = document.getElementById('lang-select');
    if (window.i18n) {
        window.i18n.initLanguage(langSelect);
    }

    document.getElementById('new-game').addEventListener('click', () => {
        start();
    });

    // Simple undo placeholder (no-op for now)
    document.getElementById('undo').addEventListener('click', () => {
        alert(window.i18n ? window.i18n.t('undo', window.i18n.getCurrentLang()) : 'Undo');
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