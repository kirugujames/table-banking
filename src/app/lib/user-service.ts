import api from './axios';

export interface Role {
    name: string;
    role_name: string;
    desk_access: number;
}

export interface User {
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    enabled: number;
    user_type: string;
    creation: string;
    roles: string[];
}

export interface CreateRoleData {
    role_name: string;
}

export interface CreateUserData {
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
}

export const userService = {
    async getAllRoles(): Promise<Role[]> {
        const response = await api.get('/api/method/sacc_app.api.get_all_roles');
        return response.data.message.data;
    },

    async createRole(data: CreateRoleData): Promise<any> {
        const response = await api.post('/api/method/sacc_app.api.create_role', data);
        return response.data.message;
    },

    async getAllUsers(): Promise<User[]> {
        const response = await api.get('/api/method/sacc_app.api.get_all_users');
        return response.data.message.data;
    },

    async createUser(data: CreateUserData): Promise<any> {
        const response = await api.post('/api/method/sacc_app.api.create_user', data);
        return response.data.message;
    },

    async setUserStatus(userId: string, status: 'Enabled' | 'Disabled'): Promise<any> {
        const response = await api.post('/api/method/sacc_app.api.set_user_status', {
            user_id: userId,
            status: status
        });
        return response.data.message;
    },
};
