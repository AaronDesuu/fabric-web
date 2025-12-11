/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#8a1c1c", // Crimson
                secondary: "#0f172a", // Midnight Blue
                accent: "#c0c0c0", // Silver
                surface: "#f8fafc", // Very light blue-grey
            },
            fontFamily: {
                heading: ["Playfair Display", "serif"],
                body: ["Inter", "sans-serif"],
            },
            spacing: {
                'unit': '1rem',
            },
            maxWidth: {
                'container': '1200px',
            },
            keyframes: {
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0px)',
                    },
                    '50%': {
                        transform: 'translateY(-10px)',
                    },
                },
                slideInFromLeft: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-100px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
            },
            animation: {
                fadeInUp: 'fadeInUp 1s ease-out forwards',
                float: 'float 3s ease-in-out infinite',
                slideInFromLeft: 'slideInFromLeft 0.8s ease-out forwards',
            },
        },
    },
    plugins: [],
};
