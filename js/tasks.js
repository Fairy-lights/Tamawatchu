// ========================================
// Tamawatchu - Task Economy
// ========================================

const Tasks = (() => {
    const REWARD_TABLE = {
        1: { tokens: 5, penalty: 5, description: 'Quick/Easy' },
        2: { tokens: 12, penalty: 10, description: 'Low Effort' },
        3: { tokens: 25, penalty: 20, description: 'Medium Effort' },
        4: { tokens: 50, penalty: 35, description: 'High Focus' },
        5: { tokens: 100, penalty: 50, description: 'Epic Task' }
    };

    const BONUS_TOKENS = {
        DAILY_STREAK: 20,
        PERFECT_DAY: 50
    };

    function getRewardForStars(stars) {
        return REWARD_TABLE[stars]?.tokens || 0;
    }

    function getPenaltyForStars(stars) {
        return REWARD_TABLE[stars]?.penalty || 0;
    }

    function addTask(title, stars, deadline, description = '') {
        const state = GameState.getState();

        const task = {
            id: GameState.generateUUID(),
            title,
            description,
            stars: parseInt(stars),
            deadline: deadline ? new Date(deadline).toISOString() : null,
            completed: false,
            createdAt: new Date().toISOString()
        };

        GameState.addTask(task);
        return task;
    }

    function completeTask(taskId) {
        const state = GameState.getState();
        const task = state.tasks.find(t => t.id === taskId);

        if (!task || task.completed) return { success: false, tokens: 0 };

        const baseReward = getRewardForStars(task.stars);
        let totalReward = baseReward;

        // Apply schedule mode modifier
        if (state.schedule === 'holiday') {
            totalReward = Math.floor(baseReward * 0.5);
        }

        // Add daily streak bonus
        const today = new Date().toISOString().split('T')[0];
        if (state.streaks.currentDay === today) {
            totalReward += BONUS_TOKENS.DAILY_STREAK;
        } else {
            // New day - update streak
            GameState.updateStreaks({
                currentDay: today,
                count: 1,
                lastCompleted: new Date().toISOString()
            });
            totalReward += BONUS_TOKENS.DAILY_STREAK;
        }

        // Mark as completed
        GameState.updateTask(taskId, { completed: true });
        GameState.addTokens(totalReward);

        // Check for Perfect Day Bonus
        checkPerfectDayBonus();

        return {
            success: true,
            tokens: totalReward,
            baseReward,
            bonuses: {
                daily: BONUS_TOKENS.DAILY_STREAK,
                perfect: 0
            }
        };
    }

    function checkPerfectDayBonus() {
        const state = GameState.getState();
        const now = new Date();

        // Get all active tasks due before midnight today
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const activeTodayTasks = state.tasks.filter(t => {
            if (!t.deadline || t.completed) return false;
            const deadline = new Date(t.deadline);
            return deadline <= todayEnd;
        });

        // Check if all are completed
        if (activeTodayTasks.length > 0 && activeTodayTasks.every(t => t.completed)) {
            GameState.addTokens(BONUS_TOKENS.PERFECT_DAY);
            console.log(`Perfect Day Bonus! +${BONUS_TOKENS.PERFECT_DAY} ⚡`);
            return true;
        }

        return false;
    }

    function deleteTask(taskId) {
        GameState.removeTask(taskId);
    }

    function getActiveTasks() {
        const state = GameState.getState();
        return state.tasks.filter(t => !t.completed);
    }

    function getCompletedTasks() {
        const state = GameState.getState();
        return state.tasks.filter(t => t.completed);
    }

    function getTodaysTasks() {
        const state = GameState.getState();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return state.tasks.filter(t => {
            if (!t.deadline) return false;
            const deadline = new Date(t.deadline);
            return deadline >= today && deadline < tomorrow;
        });
    }

    function checkExpiredDeadlines() {
        const state = GameState.getState();
        const now = new Date();

        state.tasks.forEach(task => {
            if (!task.completed && task.deadline) {
                const deadline = new Date(task.deadline);
                if (now > deadline) {
                    const penalty = getPenaltyForStars(task.stars);
                    Health.applyDamage(penalty);
                    console.log(`Missed deadline: "${task.title}" -${penalty} HP`);
                }
            }
        });
    }

    function formatDeadlineCountdown(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate - now;

        if (diff < 0) return '⏰ Overdue!';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    return {
        getRewardForStars,
        getPenaltyForStars,
        addTask,
        completeTask,
        deleteTask,
        getActiveTasks,
        getCompletedTasks,
        getTodaysTasks,
        checkExpiredDeadlines,
        checkPerfectDayBonus,
        formatDeadlineCountdown,
        REWARD_TABLE,
        BONUS_TOKENS
    };
})();
