// ========================================
// Tamawatchu - Capsule Machine
// ========================================

const Capsule = (() => {
    const CAPSULE_COST = 50;
    const ITEM_POOL = Pet.COSMETIC_POOL;

    function canPullCapsule() {
        const state = GameState.getState();
        return state.tokens >= CAPSULE_COST;
    }

    function pullCapsule() {
        if (!canPullCapsule()) {
            return {
                success: false,
                reason: 'Not enough tokens'
            };
        }

        // Deduct cost
        if (!GameState.subtractTokens(CAPSULE_COST)) {
            return {
                success: false,
                reason: 'Failed to deduct tokens'
            };
        }

        const item = generateItem();
        return {
            success: true,
            item: item
        };
    }

    function generateItem() {
        const rand = Math.random() * 100;
        let tier;

        if (rand < 60) {
            tier = 'common';
        } else if (rand < 90) {
            tier = 'rare';
        } else {
            tier = 'epic';
        }

        return getItemFromTier(tier);
    }

    function getItemFromTier(tier) {
        const state = GameState.getState();
        const pool = ITEM_POOL[tier];

        if (!pool || pool.length === 0) {
            return { id: 'error', name: 'Error', type: 'error' };
        }

        // For cosmetics, check for duplicates
        if (tier !== 'epic') {
            const availableItems = pool.filter(item => {
                return !state.inventory.cosmetics.includes(item.id);
            });

            if (availableItems.length > 0) {
                const selected = availableItems[Math.floor(Math.random() * availableItems.length)];
                addItemToInventory(selected);
                return selected;
            } else {
                // All items collected from this tier, get epic or re-roll
                return generateItem();
            }
        } else {
            // Epic items can have duplicates
            const selected = pool[Math.floor(Math.random() * pool.length)];
            addItemToInventory(selected);
            return selected;
        }
    }

    function addItemToInventory(item) {
        const state = GameState.getState();

        if (item.type === 'cosmetic') {
            if (!state.inventory.cosmetics.includes(item.id)) {
                state.inventory.cosmetics.push(item.id);
            }
        } else if (item.type === 'utility') {
            if (item.id === 'elixir_focus') {
                state.inventory.elixirs += 1;
            } else if (item.id === 'totem_undying') {
                state.inventory.totems += 1;
            }
        }

        GameState.updateInventory(state.inventory);
    }

    function useElixir() {
        const state = GameState.getState();

        if (state.inventory.elixirs <= 0) {
            return false;
        }

        state.inventory.elixirs -= 1;
        GameState.updateInventory(state.inventory);

        // Freeze decay for 4 hours (would need a timer in app loop)
        console.log('Elixir of Focus activated for 4 hours');
        return true;
    }

    function getInventorySummary() {
        const state = GameState.getState();
        const items = [];

        state.inventory.cosmetics.forEach(cosmeticId => {
            const item = findItemById(cosmeticId);
            if (item) items.push(item);
        });

        if (state.inventory.elixirs > 0) {
            items.push({
                id: 'elixir_focus',
                name: `Elixir of Focus (x${state.inventory.elixirs})`,
                type: 'utility'
            });
        }

        if (state.inventory.totems > 0) {
            items.push({
                id: 'totem_undying',
                name: `Totem of Undying (x${state.inventory.totems})`,
                type: 'utility'
            });
        }

        return items;
    }

    function findItemById(id) {
        for (const tier in ITEM_POOL) {
            const item = ITEM_POOL[tier].find(i => i.id === id);
            if (item) return item;
        }
        return null;
    }

    return {
        CAPSULE_COST,
        canPullCapsule,
        pullCapsule,
        generateItem,
        getItemFromTier,
        addItemToInventory,
        useElixir,
        getInventorySummary,
        findItemById
    };
})();
