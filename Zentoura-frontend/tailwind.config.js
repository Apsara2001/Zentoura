/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                zentoura: {
                    primary: '#C299FF',    // Lilac Glow
                    secondary: '#98F2DC',  // Mint Macaron
                    accent: '#FFB59A',     // Neo Peach
                    yellow: '#FFD93D',     // Solar Yellow
                    lavender: '#F3E8FF',   // Soft Lavender
                    deep: '#7A4FFF',       // Deep Lilac
                    dreamy: '#DFCCFF',     // Dreamy Lavender (Light Footer BG)
                    deepest: '#2D0066',    // Deepest Obsidian (Dark Footer Text)
                    twilight: '#5B4DA3',   // Twilight Blue
                },
                primary: {
                    DEFAULT: '#C299FF',
                    50: '#F3E8FF',
                    100: '#E9D5FF',
                    200: '#D8B4FE',
                    300: '#C084FC',
                    400: '#A855F7',
                    500: '#C299FF', // Base Lilac Glow
                    600: '#7A4FFF', // Deep Lilac
                    700: '#6B21A8',
                    800: '#581C87',
                    900: '#3B0764',
                },
                secondary: {
                    DEFAULT: '#98F2DC',
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    400: '#34D399',
                    500: '#98F2DC', // Base Mint Macaron
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                },
                accent: '#FFB59A',
                charcoal: '#212529',
                muted: '#6B7280',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-aura': 'linear-gradient(135deg, #C299FF 0%, #7A4FFF 100%)',
                'gradient-tropical': 'linear-gradient(135deg, #98F2DC 0%, #C299FF 100%)',
                'gradient-sunset': 'linear-gradient(135deg, #FFB59A 0%, #FFD93D 100%)',
                'hero-pattern': "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000')",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
