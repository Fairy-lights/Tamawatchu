// ========================================
// Tamawatchu - Main Application
// ========================================

const App = (() => {
    let gameLoopInterval = null;

    function initialize() {
        console.log('🌙 Tamawatchu is waking up...');

        // Load state
        const state = GameState.getState();
        console.log('Loaded state:', state);

        // Render UI
        UI.initialize();

        // Render pet and clock
        Pet.renderBlob(document.querySelector('.pet-container'), state.pet);
        Clock.renderClock(document.getElementById('clockContainer'));

        // Start systems
        Health.startDecayLoop();
        Clock.updateDeadlines(state.tasks);

        // Start game loop
        startGameLoop();

        // Auto-save
        window.addEventListener('beforeunload', () => {
            GameState.saveState();
        });

        console.log('✨ Tamawatchu is ready!');
    }

    function startGameLoop() {
        // Update every 2 seconds
        gameLoopInterval = setInterval(() => {
            tick();
        }, 2000);

        // Initial tick
        tick();
    }

    function tick() {
        const state = GameState.getState();

        // Check for expired deadlines
        Tasks.checkExpiredDeadlines();

        // Update UI
        UI.updateAll();

        // Refresh health bar
        Health.updateHealthBar();
    }

    function stop() {
        if (gameLoopInterval) {
            clearInterval(gameLoopInterval);
        }
        Health.stopDecayLoop();
    }

    return {
        initialize,
        startGameLoop,
        stop,
        tick
    };
})();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.initialize);
} else {
    App.initialize();
}
