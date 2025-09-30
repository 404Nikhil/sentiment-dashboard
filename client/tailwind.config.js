/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'primary': '#58A6FF',
                'background': '#0D1117',
                'card': '#161B22',
                'border': '#30363D',
                'text-primary': '#E6EDF3',
                'text-secondary': '#8B949E',
            }
        },
    },
    plugins: [],
}