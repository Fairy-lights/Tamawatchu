// ========================================
// Tamawatchu - Game State Management
// ========================================

const GameState = (() => {
    const STORAGE_KEY = 'tamawatchu_state';
    const DEFAULT_STATE = {
        pet: {
            name: 'Tamawatchu',
            hp: 100,
            level: 1,
            cosmetics: {
                hat: null,
                glasses: null,
                wallpaper: 'default'
            },
            totemEquipped: false
        },
        tokens: 0,
        schedule: 'school',
        tasks: [],
        inventory: {
            cosmetics: [],
            elixirs: 0,
            totems: 1
        },
        streaks: {
            currentDay: new Date().toISOString().split('T')[0],
            count: 0,
            lastCompleted: null
        },
        lastSave: new Date().toISOString(),
        lastDecayCheck: new Date().toISOString()
    };

    let state = loadState();

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    function saveState() {
        try {
            state.lastSave = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    function getState() {
        return state;
    }

    function setState(patch) {
        state = {
            ...state,
            ...patch
        };
        saveState();
    }

    function updatePet(patch) {
        state.pet = {
            ...state.pet,
            ...patch
        };
        saveState();
    }

    function updateInventory(patch) {
        state.inventory = {
            ...state.inventory,
            ...patch
        };
        saveState();
    }

    function updateStreaks(patch) {
        state.streaks = {
            ...state.streaks,
            ...patch
        };
        saveState();
    }

    function addTask(task) {
        state.tasks.push(task);
        saveState();
    }

    function updateTask(taskId, patch) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
            Object.assign(task, patch);
            saveState();
        }
    }

    function removeTask(taskId) {
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        saveState();
    }

    function getTasks() {
        return state.tasks;
    }

    function addTokens(amount) {
        state.tokens += amount;
        saveState();
    }

    function subtractTokens(amount) {
        if (state.tokens >= amount) {
            state.tokens -= amount;
            saveState();
            return true;
        }
        return false;
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    // Auto-save every 30 seconds
    setInterval(saveState, 30000);

    return {
        loadState,
        saveState,
        getState,
        setState,
        updatePet,
        updateInventory,
        updateStreaks,
        addTask,
        updateTask,
        removeTask,
        getTasks,
        addTokens,
        subtractTokens,
        generateUUID
    };
})();
