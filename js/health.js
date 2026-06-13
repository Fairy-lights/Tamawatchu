// ========================================
// Tamawatchu - Health System & Decay
// ========================================

const Health = (() => {
    const SCHEDULE_CONFIG = {
        school: {
            sleepStart: 22,  // 10 PM
            sleepEnd: 7,     // 7 AM
            decayRate: 1,    // HP per hour
            decayRateSleep: 0
        },
        summer: {
            sleepStart: 0,   // 12 AM (midnight)
            sleepEnd: 9,     // 9 AM
            decayRate: 0.5,  // HP per hour
            decayRateSleep: 0
        },
        holiday: {
            sleepStart: null,
            sleepEnd: null,
            decayRate: 0,    // No decay
            decayRateSleep: 0
        }
    };

    const MAX_HP = 100;
    let lastDecayTime = new Date();
    let decayInterval = null;
    let inactivityMultiplier = 1;

    function getCurrentHP() {
        const state = GameState.getState();
        return Math.max(0, Math.min(MAX_HP, state.pet.hp));
    }

    function isInSleep(schedule) {
        const config = SCHEDULE_CONFIG[schedule];
        if (!config || config.sleepStart === null) return false;

        const now = new Date();
        const hour = now.getHours();

        if (config.sleepStart < config.sleepEnd) {
            return hour >= config.sleepStart && hour < config.sleepEnd;
        } else {
            return hour >= config.sleepStart || hour < config.sleepEnd;
        }
    }

    function getDecayRate(schedule) {
        const config = SCHEDULE_CONFIG[schedule];
        if (!config) return 0;

        if (isInSleep(schedule)) {
            return config.decayRateSleep;
        }
        return config.decayRate * inactivityMultiplier;
    }

    function applyDecay() {
        const state = GameState.getState();
        const now = new Date();
        const timePassed = (now - lastDecayTime) / (1000 * 60 * 60); // Hours

        const decayRate = getDecayRate(state.schedule);
        const damage = timePassed * decayRate;

        if (damage > 0) {
            applyDamage(damage);
            inactivityMultiplier = 1; // Reset on activity
        }

        lastDecayTime = now;
    }

    function applyDamage(amount) {
        const state = GameState.getState();
        let newHP = state.pet.hp - amount;

        // Check for Totem of Undying
        if (newHP <= 0 && state.inventory.totems > 0) {
            newHP = 50;
            state.inventory.totems -= 1;
            console.log('Totem activated! Pet revived.');
            GameState.updateInventory({ totems: state.inventory.totems });
            showTotemActivation();
        }

        newHP = Math.max(0, newHP);
        GameState.updatePet({ hp: newHP });

        if (newHP <= 0) {
            onPetDeath();
        }

        updateHealthBar();
    }

    function healPet(amount) {
        const state = GameState.getState();
        const newHP = Math.min(MAX_HP, state.pet.hp + amount);
        GameState.updatePet({ hp: newHP });
        updateHealthBar();
    }

    function updateHealthBar() {
        const healthBar = document.getElementById('healthBar');
        const healthValue = document.getElementById('healthValue');

        if (!healthBar || !healthValue) return;

        const currentHP = getCurrentHP();
        const percentage = (currentHP / MAX_HP) * 100;

        healthBar.style.width = percentage + '%';
        healthValue.textContent = Math.floor(currentHP);

        if (currentHP < 30) {
            healthBar.classList.add('low');
        } else {
            healthBar.classList.remove('low');
        }
    }

    function startDecayLoop() {
        applyDecay();

        decayInterval = setInterval(() => {
            applyDecay();
        }, 60000); // Check every minute
    }

    function stopDecayLoop() {
        if (decayInterval) {
            clearInterval(decayInterval);
        }
    }

    function markActivity() {
        lastDecayTime = new Date();
        inactivityMultiplier = 1;
    }

    function onPetDeath() {
        console.warn('Pet has died!');
        // Could trigger special UI event here
    }

    function showTotemActivation() {
        const petContainer = document.querySelector('.pet-container');
        if (!petContainer) return;

        petContainer.style.animation = 'shieldPulse 1s ease-out';
        setTimeout(() => {
            petContainer.style.animation = '';
        }, 1000);
    }

    function checkExpiredDeadlines() {
        const state = GameState.getState();
        const now = new Date();

        state.tasks.forEach(task => {
            if (!task.completed && task.deadline) {
                const deadline = new Date(task.deadline);
                if (now > deadline) {
                    const penalty = Tasks.getPenaltyForStars(task.stars);
                    applyDamage(penalty);
                    console.log(`Missed deadline for "${task.title}": -${penalty} HP`);
                }
            }
        });
    }

    return {
        getCurrentHP,
        getDecayRate,
        isInSleep,
        applyDecay,
        applyDamage,
        healPet,
        updateHealthBar,
        startDecayLoop,
        stopDecayLoop,
        markActivity,
        checkExpiredDeadlines,
        MAX_HP
    };
})();
