/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#121212",
                morning: {
                    base: "#F8FAF8",
                    card: "#FFFFFF",
                    header: "#EAF2EA",
                    sage: "#8E9B8E",
                    mist: "#DCE5DC",
                    accent: {
                        lavender: "#9B8CE6",
                        rose: "#D49B9B",
                        amber: "#E6C9AE",
                        teal: "#6FCDC1",
                    },
                    blooms: {
                        pink: "#FFE4E9",
                        lavender: "#F0F0FF",
                        peach: "#FFF0E4",
                        coral: "#FFD0CB",
                        violet: "#E2D1F9",
                        blue: "#E1F1F6",
                    }
                },
                garden: {
                    midnight: "#050B14",
                    forest: "#09140C",
                    teal: "#0D2E2E",
                    leaf: "#2D4F39",
                    highlight: {
                        lavender: "#7C6FE0",
                        rose: "#B97373",
                        amber: "#D9B48F",
                        teal: "#4FD1C5",
                    },
                    blooms: {
                        pink: "#FFD1DC",
                        lavender: "#E6E6FA",
                        peach: "#FFDAB9",
                        coral: "#F88379",
                        violet: "#B284BE",
                        blue: "#D1E9F0",
                    },
                    foliage: {
                        green: "#98FB98",
                        olive: "#BAB86C",
                        teal: "#4FD1C5",
                        gold: "#D4AF37",
                    },
                    particles: {
                        amber: "#FFBF00",
                        lavender: "#E6E6FA",
                        blue: "#87CEEB",
                    }
                },
                accent: {
                    pink: "#FFD1DC",
                    lavender: "#E6E6FA",
                    sky: "#D1E9F0",
                    beige: "#F5F5DC",
                },
                status: {
                    success: "#6EE7B7",
                    warning: "#FCD34D",
                    danger: "#FCA5A5",
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Poppins', 'Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 1.5s ease-out forwards',
                'slide-up': 'slideUp 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float-slow': 'float 30s linear infinite',
                'drift': 'drift 15s ease-in-out infinite',
                'glow': 'glow 8s ease-in-out infinite',
                'pollen': 'pollen 10s ease-in-out infinite',
                'bloom-slow': 'bloom 12s ease-in-out infinite alternate',
                'sway': 'sway 8s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(40px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%': { transform: 'translateY(-10vh) rotate(0deg)' },
                    '100%': { transform: 'translateY(110vh) rotate(360deg)' },
                },
                drift: {
                    '0%, 100%': { transform: 'translateX(0px)' },
                    '50%': { transform: 'translateX(60px)' },
                },
                glow: {
                    '0%, 100%': { opacity: '0.4', filter: 'blur(30px)' },
                    '50%': { opacity: '0.8', filter: 'blur(50px)' },
                },
                pollen: {
                    '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.2' },
                    '50%': { transform: 'translate(50px, -50px)', opacity: '0.6' },
                },
                bloom: {
                    '0%': { transform: 'scale(0.7) rotate(0deg)', opacity: '0' },
                    '20%': { opacity: '1' },
                    '80%': { opacity: '1' },
                    '100%': { transform: 'scale(1.1) rotate(20deg)', opacity: '0' },
                },
                sway: {
                    '0%, 100%': { transform: 'translateX(0px) rotate(0deg)' },
                    '50%': { transform: 'translateX(20px) rotate(5deg)' },
                }
            },
            boxShadow: {
                'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
            }
        },
    },
    plugins: [],
}
