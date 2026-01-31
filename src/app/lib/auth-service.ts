import api from './axios';
import { User, Role } from './roles';

export const mapApiRoleToInternalRole = (roles: string[]): Role => {
    if (roles.includes('Administrator') || roles.includes('System Manager')) {
        return Role.ADMIN;
    }
    if (roles.includes('Accounts Manager') || roles.includes('HR Manager')) {
        return Role.STAFF;
    }
    return Role.MEMBER;
};

export const authService = {
    async login(usr: string, pwd: string) {
        const response = await api.post('/api/method/sacc_app.api.login', { usr, pwd });
        return response.data.message;
    },

    async verifyOtp(email: string, otp: string) {
        const response = await api.post('/api/method/sacc_app.api.verify_otp', { email, otp });
        return response.data.message;
    },

    async checkUserExists(email: string) {
        const response = await api.post('/api/method/sacc_app.api.check_user_exists', { email });
        return response.data.message;
    },

    async resetPassword(email: string, otp: string, new_password: string) {
        const response = await api.post('/api/method/sacc_app.api.reset_password', { email, otp, new_password });
        return response.data.message;
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await api.get('/api/method/sacc_app.api.get_current_user');
            const data = response.data.message;
            if (data.authenticated) {
                return {
                    id: data.user_id,
                    email: data.user_id,
                    name: data.full_name,
                    role: mapApiRoleToInternalRole(data.roles),
                    company: data.company,
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            return null;
        }
    },

    saveAuthData(apiKey: string, apiSecret: string) {
        localStorage.setItem('api_key', apiKey);
        localStorage.setItem('api_secret', apiSecret);
    },

    clearAuthData() {
        localStorage.removeItem('api_key');
        localStorage.removeItem('api_secret');
        localStorage.removeItem('user');
    },

    saveUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getStoredUser(): User | null {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    }
};
