/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#f42536',
                'background-light': '#f8f5f6',
                'background-dark': '#221011',
            },
            fontFamily: {
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
