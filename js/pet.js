// ========================================
// Tamawatchu - Pet System
// ========================================

const Pet = (() => {
    const COLORS = {
        mint: '#D1E8E2',
        blush: '#F3D5C8',
        lavender: '#E8D5F0',
        peach: '#F0D8D0'
    };

    const COSMETIC_POOL = {
        common: [
            {
                id: 'hat_strawberry',
                name: '🍓 Strawberry Hat',
                emoji: '🍓',
                type: 'cosmetic',
                description: 'A cute strawberry hat for Tamawatchu!',
                effect: null
            },
            {
                id: 'hat_cloud',
                name: '☁️ Cloud Hat',
                emoji: '☁️',
                type: 'cosmetic',
                description: 'Fluffy cloud hat. Comforting!',
                effect: { type: 'decay_reduce', value: 0.25, duration: null }
            },
            {
                id: 'hat_mushroom',
                name: '🍄 Mushroom Hat',
                emoji: '🍄',
                type: 'cosmetic',
                description: 'Classic red mushroom hat.',
                effect: null
            },
            {
                id: 'glasses_tiny',
                name: '👓 Tiny Glasses',
                emoji: '👓',
                type: 'cosmetic',
                description: 'Adorable tiny glasses.',
                effect: null
            },
            {
                id: 'glasses_heart',
                name: '💕 Heart Shades',
                emoji: '💕',
                type: 'cosmetic',
                description: 'Love-tinted heart-shaped glasses!',
                effect: { type: 'hp_gain', value: 1, duration: null }
            }
        ],
        rare: [
            {
                id: 'color_lavender',
                name: '💜 Lavender Color',
                emoji: '💜',
                type: 'cosmetic',
                description: 'Change pet to soft lavender.',
                effect: null
            },
            {
                id: 'color_peach',
                name: '🍑 Peach Color',
                emoji: '🍑',
                type: 'cosmetic',
                description: 'Change pet to warm peachy tone.',
                effect: null
            },
            {
                id: 'wallpaper_dots',
                name: '⚪ Polka Dot BG',
                emoji: '⚪',
                type: 'cosmetic',
                description: 'Cute polka dot background.',
                effect: null
            },
            {
                id: 'wallpaper_stars',
                name: '⭐ Starry BG',
                emoji: '⭐',
                type: 'cosmetic',
                description: 'Dreamy starry background!',
                effect: { type: 'token_boost', value: 0.1, duration: null }
            }
        ],
        epic: [
            {
                id: 'elixir_focus',
                name: '⏱️ Elixir of Focus',
                emoji: '⏱️',
                type: 'utility',
                description: 'Freezes all health decay for 4 hours. Use wisely!',
                effect: { type: 'decay_freeze', duration: 14400000 }
            },
            {
                id: 'totem_undying',
                name: '🛡️ Totem of Undying',
                emoji: '🛡️',
                type: 'utility',
                description: 'Auto-revives Tamawatchu if health reaches 0 HP. Restores to 50 HP.',
                effect: { type: 'auto_revive', value: 50 }
            },
            {
                id: 'phoenix_feather',
                name: '🔥 Phoenix Feather',
                emoji: '🔥',
                type: 'utility',
                description: 'Instantly restore 30 HP. Rebirth energy!',
                effect: { type: 'instant_heal', value: 30 }
            },
            {
                id: 'golden_acorn',
                name: '🌰 Golden Acorn',
                emoji: '🌰',
                type: 'utility',
                description: 'Instant +100 ⚡ tokens. Pure gold!',
                effect: { type: 'token_grant', value: 100 }
            },
            {
                id: 'time_crystal',
                name: '⏲️ Time Crystal',
                emoji: '⏲️',
                type: 'utility',
                description: '2x token gains for 1 hour. Productivity boost!',
                effect: { type: 'token_multiplier', value: 2, duration: 3600000 }
            }
        ]
    };

    function renderBlob(container, petData) {
        container.innerHTML = '';
        const blob = document.createElement('div');
        blob.className = 'pet-blob';

        let blobColor = petData.cosmetics.wallpaper === 'blush' ? COLORS.blush : COLORS.mint;
        if (petData.cosmetics.wallpaper === 'lavender') blobColor = COLORS.lavender;
        if (petData.cosmetics.wallpaper === 'peach') blobColor = COLORS.peach;

        blob.style.background = blobColor;
        container.appendChild(blob);

        // Render cosmetics on top
        if (petData.cosmetics.hat) {
            const hat = document.createElement('div');
            hat.className = 'pet-accessory pet-hat';
            hat.innerHTML = '🎩';
            container.appendChild(hat);
        }

        if (petData.cosmetics.glasses) {
            const glasses = document.createElement('div');
            glasses.className = 'pet-accessory pet-glasses';
            glasses.innerHTML = '👓';
            container.appendChild(glasses);
        }
    }

    function applyCosmetics(petContainer, cosmetics) {
        const existingHat = petContainer.querySelector('.pet-hat');
        const existingGlasses = petContainer.querySelector('.pet-glasses');

        if (existingHat) existingHat.remove();
        if (existingGlasses) existingGlasses.remove();

        renderBlob(petContainer, { cosmetics });
    }

    function getCosmetics() {
        return { COLORS, COSMETIC_POOL };
    }

    function getSleepMask() {
        // Returns emoji for sleep mode (used in Holiday schedule)
        return '😴';
    }

    return {
        renderBlob,
        applyCosmetics,
        getCosmetics,
        getSleepMask,
        COLORS,
        COSMETIC_POOL
    };
})();

// Add CSS for pet accessories
const style = document.createElement('style');
style.textContent = `
.pet-accessory {
    position: absolute;
    font-size: 40px;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.pet-hat {
    top: 35%;
    left: 50%;
}

.pet-glasses {
    top: 50%;
    left: 50%;
}
`;
document.head.appendChild(style);
