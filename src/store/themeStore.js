import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'dark', // ✅ Set dark as default

            setTheme: (theme) => {
                set({ theme });
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            },

            toggleTheme: () => {
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light';
                    if (newTheme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { theme: newTheme };
                });
            },

            initialize: () => {
                // Always default to dark
                const prefersDark = true; // Force dark
                const defaultTheme = 'dark';
                document.documentElement.classList.add('dark');
                return defaultTheme;
            },
        }),
        {
            name: 'theme-storage',
        }
    )
);