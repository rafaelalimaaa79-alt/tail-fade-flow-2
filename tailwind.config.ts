import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				rajdhani: ['Rajdhani', 'sans-serif'],
				// Make Rajdhani the default font for all text
				sans: ['Rajdhani', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        // Custom colors for the sports betting app
        onetime: {
          purple: '#6C5CE7',
          orange: '#F97316',
          green: '#10B981',
          red: '#EF4444',
          darkBlue: '#1E293B',
          lightGray: '#F1F5F9',
          dark: '#0F172A',
        }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'pulse-heartbeat': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(1.02)', opacity: '0.9' },
          '50%': { transform: 'scale(1.04)', opacity: '0.8' },
          '75%': { transform: 'scale(1.02)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fingerprint-scan': {
          '0%': { opacity: '0.5', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '0.5', transform: 'scale(0.95)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(108, 92, 231, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(108, 92, 231, 0.8)' },
        },
        'glow-pulse-purple': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(108, 92, 231, 0.3)',
            borderColor: 'rgba(108, 92, 231, 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(108, 92, 231, 0.8), 0 0 10px rgba(108, 92, 231, 0.4)',
            borderColor: 'rgba(108, 92, 231, 0.7)'
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-4px)' },
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-heartbeat': 'pulse-heartbeat 4s ease-in-out infinite',
        'fingerprint-scan': 'fingerprint-scan 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-purple': 'glow-pulse-purple 2s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
        'shake': 'shake 0.4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
