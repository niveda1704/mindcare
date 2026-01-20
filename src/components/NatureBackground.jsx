import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const Lotus = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 2.5c0 0 4 5.5 4 10.5 0 3.5-2 6-4 6-2 0-4-2.5-4-6 0-5 4-10.5 4-10.5z" />
        <path d="M17 14c3 0 5-1.5 5-1.5s-1 4.5-4.5 7" opacity="0.9" />
        <path d="M7 14c-3 0-5-1.5-5-1.5s1 4.5 4.5 7" opacity="0.9" />
        <path d="M12 22c4 0 7-1.5 8-2-2 1-5 1.5-8 1.5s-6-.5-8-1.5c1 .5 4 2 8 2z" opacity="0.8" />
    </svg>
);

const NatureBackground = () => {
    // Colors from Tailwind config
    // Colors from Tailwind config & Standard Palette for vibrancy
    const flowerColors = [
        'text-morning-accent-rose',
        'text-morning-accent-lavender',
        'text-pink-500',
        'text-rose-500',
        'text-purple-500',
        'text-fuchsia-500',
        'text-morning-accent-teal'
    ];

    const leafColors = [
        'text-emerald-500',
        'text-green-500',
        'text-lime-600',
        'text-teal-500',
        'text-garden-leaf'
    ];

    const [elements] = useState(() => {
        // Generate blooming flowers around edges and sporadically
        const flowers = Array.from({ length: 12 }).map((_, i) => ({
            id: `flower-${i}`,
            x: Math.random() * 100,
            y: Math.random() > 0.5 ? Math.random() * 25 : 75 + Math.random() * 25,
            size: 40 + Math.random() * 50,
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
            delay: Math.random() * 10,
            duration: 12 + Math.random() * 6,
            scale: 0.6 + Math.random() * 0.6,
            rotation: Math.random() * 360
        }));

        // Generate falling leaves from top
        const leaves = Array.from({ length: 14 }).map((_, i) => ({
            id: `leaf-${i}`,
            x: Math.random() * 100,
            delay: Math.random() * 20,
            duration: 18 + Math.random() * 10,
            size: 18 + Math.random() * 22,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            rotation: Math.random() * 360,
            sway: 15 + Math.random() * 25
        }));

        // Generate falling petals for extra delicacy
        const petals = Array.from({ length: 18 }).map((_, i) => ({
            id: `petal-${i}`,
            x: Math.random() * 100,
            delay: Math.random() * 15,
            duration: 12 + Math.random() * 8,
            size: 10 + Math.random() * 12,
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
            rotation: Math.random() * 360,
            sway: 30 + Math.random() * 30
        }));

        // Generate glowing particles
        const particles = Array.from({ length: 20 }).map((_, i) => ({
            id: `particle-${i}`,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 3,
            color: 'bg-morning-accent-lavender/30',
            duration: 6 + Math.random() * 6,
            driftX: (Math.random() - 0.5) * 80,
            delay: Math.random() * 10
        }));

        return { flowers, leaves, particles, petals };
    });

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-50 bg-morning-base/40">
            {/* Dynamic Mesh Gradients */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-morning-blooms-pink blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-morning-accent-teal/20 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Falling Leaves */}
            {elements.leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    initial={{ y: -50, x: `${leaf.x}vw`, opacity: 0, rotate: leaf.rotation }}
                    animate={{
                        y: '110vh',
                        opacity: [0, 0.4, 0.4, 0],
                        x: [`${leaf.x}vw`, `${leaf.x + leaf.sway / 10}vw`, `${leaf.x - leaf.sway / 10}vw`, `${leaf.x}vw`],
                        rotate: leaf.rotation + 360
                    }}
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,
                        delay: leaf.delay,
                        ease: "linear"
                    }}
                    className={`absolute ${leaf.color} opacity-50 filter blur-[0.5px]`}
                >
                    <Leaf size={leaf.size} strokeWidth={1} />
                </motion.div>
            ))}

            {/* Falling Petals */}
            {elements.petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    initial={{ y: -20, x: `${petal.x}vw`, opacity: 0, rotate: petal.rotation, scale: 0.8 }}
                    animate={{
                        y: '110vh',
                        opacity: [0, 0.5, 0.5, 0],
                        x: [`${petal.x}vw`, `${petal.x + petal.sway / 5}vw`, `${petal.x - petal.sway / 5}vw`],
                        rotate: petal.rotation + 720,
                        scale: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: petal.duration,
                        repeat: Infinity,
                        delay: petal.delay,
                        ease: "linear"
                    }}
                    className={`absolute ${petal.color} opacity-50`}
                >
                    <div
                        className="rounded-full blur-[1px]"
                        style={{
                            width: petal.size,
                            height: petal.size * 1.4,
                            backgroundColor: 'currentColor',
                            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                        }}
                    />
                </motion.div>
            ))}

            {/* Blooming Lotus Flowers */}
            {elements.flowers.map((flower) => (
                <motion.div
                    key={flower.id}
                    initial={{ opacity: 0, scale: 0, rotate: flower.rotation }}
                    animate={{
                        opacity: [0, 0.9, 0.9, 0],
                        scale: [0, flower.scale, flower.scale * 1.1, 0],
                        rotate: flower.rotation + 45
                    }}
                    transition={{
                        duration: flower.duration,
                        repeat: Infinity,
                        delay: flower.delay,
                        ease: "easeInOut"
                    }}
                    className={`absolute ${flower.color} filter drop-shadow-lg`}
                    style={{
                        left: `${flower.x}%`,
                        top: `${flower.y}%`,
                    }}
                >
                    <Lotus size={flower.size} />
                </motion.div>
            ))}

            {/* Glowing Particles */}
            {elements.particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.2, 0],
                        y: [0, -150],
                        x: [0, p.driftX]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                    className={`absolute rounded-full ${p.color} blur-[1.5px] shadow-[0_0_10px_currentColor]`}
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size
                    }}
                />
            ))}

            {/* Ambient Wind Effect */}
            <motion.div
                animate={{
                    x: ['-100%', '200%'],
                    opacity: [0, 0.08, 0]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatDelay: 10,
                    ease: "linear"
                }}
                className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-morning-accent-lavender/30 to-transparent"
            />
        </div>
    );
};

export default NatureBackground;
