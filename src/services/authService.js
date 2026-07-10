import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const authService = {
    // Register
    register: async (data) => {
        try {
            const response = await authApi.register(data);
            const { user, organization, token } = response.data.data;

            const store = useAuthStore.getState();
            store.login(user, token, organization);

            toast.success('Registration successful! Welcome to Studio X.');
            return { user, organization, token };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        }
    },

    // Login
    login: async (email, password) => {
        try {
            const response = await authApi.login({ email, password });
            const { user, organization, token } = response.data.data;

            const store = useAuthStore.getState();
            store.login(user, token, organization);

            toast.success('Welcome back!');
            return { user, organization, token };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Ignore logout errors
        } finally {
            const store = useAuthStore.getState();
            store.logout();
            toast.success('Logged out successfully');
        }
    },

    // Get profile
    getProfile: async () => {
        try {
            const response = await authApi.getProfile();
            const { user, tenant } = response.data.data;

            const store = useAuthStore.getState();
            store.setUser(user);
            store.setTenant(tenant);

            return { user, tenant };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch profile';
            toast.error(message);
            throw error;
        }
    },

    // Forgot password
    forgotPassword: async (email) => {
        try {
            await authApi.forgotPassword({ email });
            toast.success('If an account exists, you will receive a password reset link.');
            return true;
        } catch (error) {
            // Don't reveal if user exists or not
            toast.success('If an account exists, you will receive a password reset link.');
            return true;
        }
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        try {
            await authApi.resetPassword({ token, new_password: newPassword });
            toast.success('Password reset successful! Please login with your new password.');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Password reset failed. Please try again.';
            toast.error(message);
            throw error;
        }
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
        try {
            await authApi.changePassword({ current_password: currentPassword, new_password: newPassword });
            toast.success('Password changed successfully!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to change password.';
            toast.error(message);
            throw error;
        }
    },
};