import React, { createContext, useState, useContext, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);
    const oscillatorsRef = useRef([]);

    const initAudio = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();

            const masterGain = audioContextRef.current.createGain();
            masterGain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
            masterGain.connect(audioContextRef.current.destination);
            gainNodeRef.current = masterGain;

            // Refreshing 'Morning Dew' D Major (Open)
            // Clean, pure, and very harmonious to avoid buzzing
            const freqs = [146.83, 220.00, 293.66, 369.99, 440.00];

            freqs.forEach((freq) => {
                const osc = audioContextRef.current.createOscillator();
                const oscGain = audioContextRef.current.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
                // Very subtle detuning for natural warmth without buzzing
                osc.detune.setValueAtTime(Math.random() * 4 - 2, audioContextRef.current.currentTime);
                oscGain.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);

                osc.connect(oscGain);
                oscGain.connect(masterGain);

                osc.start();
                oscillatorsRef.current.push({ osc, gain: oscGain });

                setInterval(() => {
                    if (audioContextRef.current?.state === 'running') {
                        const now = audioContextRef.current.currentTime;
                        const randomGain = 0.02 + Math.random() * 0.04;
                        oscGain.gain.setTargetAtTime(randomGain, now, 2);
                    }
                }, 6000 + Math.random() * 4000);
            });
        }
    };

    const play = () => {
        if (!audioContextRef.current) initAudio();
        const ctx = audioContextRef.current;
        const masterGain = gainNodeRef.current;

        if (ctx.state === 'suspended') ctx.resume();

        masterGain.gain.setTargetAtTime(0.2, ctx.currentTime, 1);
        setIsPlaying(true);
    };

    const pause = () => {
        if (audioContextRef.current && gainNodeRef.current) {
            const ctx = audioContextRef.current;
            gainNodeRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
            setTimeout(() => {
                ctx.suspend();
                setIsPlaying(false);
            }, 500);
        }
    };

    const toggle = () => isPlaying ? pause() : play();

    return (
        <SoundContext.Provider value={{ isPlaying, play, pause, toggle }}>
            {children}
        </SoundContext.Provider>
    );
};
