// ========================================
// Tamawatchu - UI System
// ========================================

const UI = (() => {
    let lastRenderTime = 0;
    const RENDER_DEBOUNCE = 200; // ms

    function initialize() {
        renderHeader();
        renderPetSection();
        renderTaskManager();
        renderCapsuleSection();
        renderInventory();
        attachEventListeners();
    }

    function renderHeader() {
        const state = GameState.getState();
        const tokenCount = document.getElementById('tokenCount');
        const scheduleSelect = document.getElementById('scheduleSelect');

        if (tokenCount) tokenCount.textContent = state.tokens;
        if (scheduleSelect) scheduleSelect.value = state.schedule;
    }

    function renderPetSection() {
        const state = GameState.getState();
        const petContainer = document.querySelector('.pet-container');
        const petNameDisplay = document.getElementById('petNameDisplay');

        if (petContainer) {
            Pet.renderBlob(petContainer, state.pet);
        }

        if (petNameDisplay) {
            petNameDisplay.textContent = state.pet.name;
        }

        updateReviveIndicator();
        Health.updateHealthBar();
    }

    function renderTaskManager() {
        const state = GameState.getState();
        const taskList = document.getElementById('taskList');

        if (!taskList) return;

        if (state.tasks.length === 0) {
            taskList.innerHTML = '<div class="empty-state">No tasks yet. Create one!</div>';
            return;
        }

        taskList.innerHTML = '';

        state.tasks.forEach(task => {
            if (task.completed) return; // Hide completed tasks for now

            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';

            const stars = '⭐'.repeat(task.stars);
            const deadline = task.deadline ? Tasks.formatDeadlineCountdown(task.deadline) : 'No deadline';
            const reward = Tasks.getRewardForStars(task.stars);

            taskItem.innerHTML = `
                <div class="task-info">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-stars">${stars}</div>
                    <div class="task-deadline">${deadline}</div>
                </div>
                <div>⚡ +${reward}</div>
                <div class="task-actions">
                    <button class="btn btn-small complete-task" data-id="${task.id}">Done</button>
                    <button class="btn btn-small delete-task" data-id="${task.id}">Delete</button>
                </div>
            `;

            taskList.appendChild(taskItem);
        });
    }

    function renderCapsuleSection() {
        const state = GameState.getState();
        const clawBtn = document.getElementById('clawMachineBtn');
        const machineResult = document.getElementById('machineResult');

        if (clawBtn) {
            clawBtn.disabled = !Capsule.canPullCapsule();
        }

        if (machineResult) {
            machineResult.innerHTML = '';
        }
    }

    function renderInventory() {
        const inventory = document.getElementById('inventory');

        if (!inventory) return;

        const items = Capsule.getInventorySummary();

        if (items.length === 0) {
            inventory.innerHTML = '<div class="empty-state">No items yet.</div>';
            return;
        }

        inventory.innerHTML = '';

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `inventory-item ${item.type}`;
            itemDiv.innerHTML = `
                <div class="inventory-item-name">${escapeHtml(item.name)}</div>
            `;
            inventory.appendChild(itemDiv);
        });
    }

    function attachEventListeners() {
        // Add Task
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', handleAddTask);
        }

        // Task Actions (Event Delegation)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('complete-task')) {
                handleCompleteTask(e.target.dataset.id);
            }
            if (e.target.classList.contains('delete-task')) {
                handleDeleteTask(e.target.dataset.id);
            }
        });

        // Capsule
        const clawBtn = document.getElementById('clawMachineBtn');
        if (clawBtn) {
            clawBtn.addEventListener('click', handleClawMachinePull);
        }

        // Modal Close
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('itemModal');
        if (modalClose && modal) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('show');
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }

        // Schedule Select
        const scheduleSelect = document.getElementById('scheduleSelect');
        if (scheduleSelect) {
            scheduleSelect.addEventListener('change', handleScheduleChange);
        }

        // Difficulty radio buttons
        const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
        difficultyRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                console.log('Difficulty selected:', radio.value);
            });
        });
    }

    function handleAddTask() {
        const title = document.getElementById('taskTitle');
        const description = document.getElementById('taskDescription');
        const difficulty = document.querySelector('input[name="difficulty"]:checked');
        const deadline = document.getElementById('taskDeadline');

        if (!title.value.trim()) {
            alert('Please enter a task title');
            return;
        }

        if (!difficulty) {
            alert('Please select a difficulty');
            return;
        }

        if (!deadline.value) {
            alert('Please select a deadline');
            return;
        }

        Tasks.addTask(
            title.value.trim(),
            difficulty.value,
            deadline.value,
            description.value.trim()
        );

        // Clear form
        title.value = '';
        description.value = '';
        difficulty.checked = false;
        deadline.value = '';

        renderTaskManager();
        renderCapsuleSection();
    }

    function handleCompleteTask(taskId) {
        const result = Tasks.completeTask(taskId);

        if (result.success) {
            showParticleConfetti();
            showNotification(`+${result.tokens} ⚡`, 'success');
        }

        renderTaskManager();
        renderCapsuleSection();
        renderHeader();
    }

    function handleDeleteTask(taskId) {
        if (confirm('Delete this task?')) {
            Tasks.deleteTask(taskId);
            renderTaskManager();
        }
    }

    function handleClawMachinePull() {
        const result = Capsule.pullCapsule();

        if (!result.success) {
            showNotification(result.reason, 'error');
            return;
        }

        const item = result.item;
        const clawBtn = document.getElementById('clawMachineBtn');
        const clawGripper = document.querySelector('.claw-gripper');
        const dispenserItem = document.getElementById('dispenserItem');
        const machineResult = document.getElementById('machineResult');

        updateClawExpression('excited');

        // Disable button during animation
        clawBtn.disabled = true;

        // Start claw grab animation
        if (clawGripper) {
            clawGripper.classList.add('active', 'grabbing');
        }

        // After claw returns (2 seconds)
        setTimeout(() => {
            if (clawGripper) {
                clawGripper.classList.remove('active', 'grabbing');
            }

            // Show item in dispenser
            if (dispenserItem) {
                dispenserItem.textContent = item.emoji || '✨';
                dispenserItem.classList.remove('hidden');
            }

            // Show result text
            if (machineResult) {
                machineResult.innerHTML = `🎉 You got: <strong>${escapeHtml(item.name)}</strong>!`;
            }

            // Show item description modal
            showItemModal(item);

            // Apply instant effects
            if (item.effect) {
                applyItemEffect(item);
            }

            showParticleConfetti();
            renderInventory();
            renderCapsuleSection();
            renderHeader();
            renderPetSection();
            updateReviveIndicator();

            // Change claw face back to happy
            updateClawExpression('happy');

            // Re-enable button
            clawBtn.disabled = false;
        }, 2000);
    }

    function showItemModal(item) {
        const modal = document.getElementById('itemModal');
        const modalEmoji = document.getElementById('modalItemEmoji');
        const modalName = document.getElementById('modalItemName');
        const modalDescription = document.getElementById('modalItemDescription');
        const modalEffect = document.getElementById('modalItemEffect');

        if (!modal) return;

        modalEmoji.textContent = item.emoji || '✨';
        modalName.textContent = item.name;
        modalDescription.textContent = item.description || 'A wonderful item!';

        if (item.effect) {
            const effectText = getEffectDescription(item.effect);
            modalEffect.innerHTML = `<strong>✨ Effect:</strong> ${effectText}`;
            modalEffect.style.display = 'block';
        } else {
            modalEffect.style.display = 'none';
        }

        modal.classList.add('show');
        setTimeout(() => {
            modal.classList.remove('show');
        }, 4000);
    }

    function getEffectDescription(effect) {
        switch (effect.type) {
            case 'decay_freeze':
                return 'Freeze decay for 4 hours!';
            case 'auto_revive':
                return 'Auto-revive at 50 HP when health reaches 0!';
            case 'instant_heal':
                return `Restore ${effect.value} HP instantly!`;
            case 'token_grant':
                return `Gain ${effect.value} ⚡ tokens!`;
            case 'token_multiplier':
                return `${effect.value}x token gains for 1 hour!`;
            case 'decay_reduce':
                return `Reduce decay by ${effect.value} HP/hour`;
            case 'hp_gain':
                return `+1 maximum HP`;
            case 'token_boost':
                return `+10% token bonus`;
            default:
                return 'Special effect!';
        }
    }

    function applyItemEffect(item) {
        if (!item.effect) return;

        switch (item.effect.type) {
            case 'instant_heal':
                Health.healPet(item.effect.value);
                break;
            case 'token_grant':
                GameState.addTokens(item.effect.value);
                break;
            // Duration effects handled by app.js game loop
        }
    }

    function updateClawExpression(expression) {
        const clawFace = document.getElementById('clawFace');
        if (!clawFace) return;

        const mouth = clawFace.querySelector('#mouth');
        const cheekLeft = clawFace.querySelector('#cheekLeft');
        const cheekRight = clawFace.querySelector('#cheekRight');
        const pupils = clawFace.querySelectorAll('[id^="pupil"]');

        switch (expression) {
            case 'happy':
                if (mouth) mouth.setAttribute('d', 'M 35 65 Q 50 75 65 65');
                if (cheekLeft) cheekLeft.setAttribute('opacity', '0.6');
                if (cheekRight) cheekRight.setAttribute('opacity', '0.6');
                break;
            case 'excited':
                if (mouth) mouth.setAttribute('d', 'M 30 60 Q 50 80 70 60');
                pupils.forEach(p => p.setAttribute('r', '6'));
                if (cheekLeft) cheekLeft.setAttribute('opacity', '0.8');
                if (cheekRight) cheekRight.setAttribute('opacity', '0.8');
                break;
            case 'neutral':
            default:
                if (mouth) mouth.setAttribute('d', 'M 35 65 Q 50 68 65 65');
                if (cheekLeft) cheekLeft.setAttribute('opacity', '0.4');
                if (cheekRight) cheekRight.setAttribute('opacity', '0.4');
                pupils.forEach(p => {
                    p.setAttribute('r', '4');
                });
        }
    }

    function updateReviveIndicator() {
        const state = GameState.getState();
        const reviveIndicator = document.getElementById('reviveIndicator');

        if (!reviveIndicator) return;

        const totemCount = state.inventory.totems || 0;
        reviveIndicator.textContent = `🛡️ Totems: ${totemCount}`;
        reviveIndicator.style.color = totemCount > 0 ? '#5A5A5A' : '#CCC';
    }

    function handleScheduleChange(e) {
        const newSchedule = e.target.value;
        GameState.setState({ schedule: newSchedule });
        Health.updateHealthBar();
        showNotification(`Schedule changed to ${newSchedule}`, 'info');
    }

    function showParticleConfetti() {
        const container = document.getElementById('particleContainer');

        if (!container) return;

        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const emojis = ['✨', '⭐', '💫', '🎉', '🎊', '💖', '✨', '🌟'];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            particle.textContent = emoji;

            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            const tx = (Math.random() - 0.5) * 200;
            particle.style.setProperty('--tx', tx + 'px');

            particle.style.animation = `particleFall 2s ease-in forwards`;

            container.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }
    }

    function showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Could add a toast UI here
    }

    function updateAll() {
        const now = Date.now();
        if (now - lastRenderTime < RENDER_DEBOUNCE) return;

        renderHeader();
        renderTaskManager();
        renderCapsuleSection();
        renderInventory();
        Clock.updateDeadlines(GameState.getTasks());

        lastRenderTime = now;
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    return {
        initialize,
        renderHeader,
        renderPetSection,
        renderTaskManager,
        renderCapsuleSection,
        renderInventory,
        attachEventListeners,
        showParticleConfetti,
        showNotification,
        updateAll
    };
})();
