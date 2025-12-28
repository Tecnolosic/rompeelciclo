
import { useCallback } from 'react';

// Using consistent sound effects from reliable CDNs or local assets if available.
// For now, we will use robust base64 placeholders or reliable URLs.
// Pro-tip: Preload these in a real prod app.

const SOUNDS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Sci-fi click
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Achievement
    levelUp: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Power up
    error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Error beep
    type: 'https://assets.mixkit.co/active_storage/sfx/241/241-preview.mp3', // Typing click
};

export const useSoundFX = () => {
    const play = useCallback((type: keyof typeof SOUNDS, volume = 0.5) => {
        try {
            const audio = new Audio(SOUNDS[type]);
            audio.volume = volume;
            audio.play().catch(e => console.warn('Audio play failed', e));
        } catch (e) {
            console.error('Audio initialization failed', e);
        }
    }, []);

    return {
        playClick: () => play('click', 0.2),
        playSuccess: () => play('success', 0.4),
        playLevelUp: () => play('levelUp', 0.6),
        playError: () => play('error', 0.3),
        playType: () => play('type', 0.1),
    };
};
