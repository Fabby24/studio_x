import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            tenant: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setLoading: (isLoading) => set({ isLoading }),

            setUser: (user) => set({ user }),
            setTenant: (tenant) => set({ tenant }),

            login: (user, token, tenant) => {
                set({
                    user,
                    token,
                    tenant,
                    isAuthenticated: true,
                    isLoading: false,
                });
                localStorage.setItem('token', token);
                localStorage.setItem('tenant', JSON.stringify(tenant));
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    tenant: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
                localStorage.removeItem('token');
                localStorage.removeItem('tenant');
            },

            initialize: async () => {
                const token = localStorage.getItem('token');
                const tenant = JSON.parse(localStorage.getItem('tenant') || 'null');

                if (token && tenant) {
                    set({
                        token,
                        tenant,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return true;
                }
                return false;
            },

            updateUser: (user) => {
                set({ user });
                localStorage.setItem('user', JSON.stringify(user));
            },

            hasPermission: (permission) => {
                const { user } = get();
                if (!user) return false;
                if (user.role === 'super_admin') return true;
                return user.permissions?.includes(permission) || false;
            },

            isAdmin: () => {
                const { user } = get();
                return user?.role === 'org_admin' || user?.role === 'super_admin';
            },

            isSuperAdmin: () => {
                const { user } = get();
                return user?.role === 'super_admin';
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                tenant: state.tenant,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);