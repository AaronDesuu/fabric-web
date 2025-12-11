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
        },
    },
    plugins: [],
};
