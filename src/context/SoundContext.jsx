import React, { createContext, useState, useContext, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const audioRef = useRef(null);

    // Track Library
    const tracks = {
        'piano': 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-111452.mp3', // Soft Piano
        'forest': 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=forest-birds-114510.mp3',
        'rain': 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_3d1d141e9d.mp3?filename=heavy-rain-nature-sounds-8186.mp3',
        'ocean': 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_804e9c2776.mp3?filename=ocean-waves-111774.mp3'
    };

    const playTrack = (trackName = 'piano') => {
        if (!audioRef.current) {
            audioRef.current = new Audio(tracks[trackName]);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        } else if (currentTrack !== trackName) {
            // If switching tracks, stop the old one
            audioRef.current.pause();
            audioRef.current = new Audio(tracks[trackName]);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }

        audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed first):", e));
        setIsPlaying(true);
        setCurrentTrack(trackName);
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggle = () => isPlaying ? pause() : playTrack(currentTrack || 'piano');

    return (
        <SoundContext.Provider value={{ isPlaying, playTrack, pause, toggle, currentTrack }}>
            {children}
        </SoundContext.Provider>
    );
};
