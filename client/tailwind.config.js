/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'primary': '#0A84FF', 
                'background': '#1C1C1E', 
                'card': '#2C2C2E', 
                'border': '#38383A', 
                'text-primary': '#F2F2F7', 
                'text-secondary': '#8D8D92', 
            }
        },
    },
    plugins: [],
}