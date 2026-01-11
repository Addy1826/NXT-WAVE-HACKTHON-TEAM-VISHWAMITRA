/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Semantic Color System ("Trust Blue" Theme)
                primary: {
                    50: '#eff6ff',   // blue-50
                    100: '#dbeafe',  // blue-100
                    200: '#bfdbfe',  // blue-200
                    300: '#93c5fd',  // blue-300
                    400: '#60a5fa',  // blue-400
                    500: '#3b82f6',  // blue-500 (Brand Base)
                    600: '#2563eb',  // blue-600
                    700: '#1d4ed8',  // blue-700
                    800: '#1e40af',  // blue-800
                    900: '#1e3a8a',  // blue-900 (Deep Text)
                },
                secondary: {
                    50: '#f5f3ff',   // violet-50
                    100: '#ede9fe',  // violet-100
                    200: '#ddd6fe',  // violet-200
                    300: '#c4b5fd',  // violet-300
                    400: '#a78bfa',  // violet-400
                    500: '#8b5cf6',  // violet-500 (Accents)
                    600: '#7c3aed',  // violet-600
                    700: '#6d28d9',  // violet-700
                    800: '#5b21b6',  // violet-800
                    900: '#4c1d95',  // violet-900
                },
                neutral: {
                    50: '#f8fafc',   // slate-50 (Cool Backgrounds)
                    100: '#f1f5f9',  // slate-100
                    200: '#e2e8f0',  // slate-200 (Borders)
                    300: '#cbd5e1',  // slate-300
                    400: '#94a3b8',  // slate-400
                    500: '#64748b',  // slate-500 (Subtext)
                    600: '#475569',  // slate-600 (Body Text)
                    700: '#334155',  // slate-700
                    800: '#1e293b',  // slate-800
                    900: '#0f172a',  // slate-900 (Headings)
                },
                // Replaces explicit 'gray' usage with same neutral scale for consistency
                gray: {
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
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.8125rem', { lineHeight: '1.6' }],
                'sm': ['0.875rem', { lineHeight: '1.6' }],
                'base': ['1rem', { lineHeight: '1.7' }],
                'lg': ['1.125rem', { lineHeight: '1.7' }],
                'xl': ['1.25rem', { lineHeight: '1.6' }],
                '2xl': ['1.5rem', { lineHeight: '1.5' }],
                '3xl': ['1.875rem', { lineHeight: '1.4' }],
                '4xl': ['2.25rem', { lineHeight: '1.3' }],
            },
            transitionDuration: {
                DEFAULT: '300ms',
            },
            transitionTimingFunction: {
                DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            animation: {
                'fade-in': 'fadeIn 400ms ease-in-out',
                'slide-up': 'slideUp 400ms ease-out',
                'breathe': 'breathe 4000ms ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                breathe: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
        },
    },
    plugins: [],
}
