/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary theme colors
                'smoky-black': '#11120D',
                'floral-white': '#FFFBF4',
                arctic: {
                    50: '#F8FAFC',
                    100: '#F0F4F8',
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                'background-dark': '#11120D',
                'surface-dark': 'rgba(17, 18, 13, 0.95)',
                softblue: {
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                },
                // Keep brand for backwards compatibility
                brand: {
                    DEFAULT: '#3B82F6',
                    200: '#bfdbfe',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563EB',
                }
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            borderRadius: {
                DEFAULT: '1rem',
                'xl': '1.5rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
            },
            boxShadow: {
                'subtle': '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
                'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                'glow': '0 0 40px rgba(59, 130, 246, 0.3)',
            }
        },
    },
    plugins: [],
}
