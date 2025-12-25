import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0ea5e9', // Sky blue
                secondary: '#64748b', // Slate
                danger: '#ef4444', // Red
                success: '#22c55e', // Green
                warning: '#eab308', // Yellow
            },
        },
    },
    plugins: [],
}
export default config
