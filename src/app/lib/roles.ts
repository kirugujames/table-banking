export enum Role {
    ADMIN = 'admin',
    STAFF = 'staff',
    MEMBER = 'member',
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar?: string;
    company?: string;
}

export const PERMISSIONS = {
    [Role.ADMIN]: [
        'view_dashboard',
        'manage_members',
        'manage_loans',
        'manage_savings',
        'view_reports',
        'manage_settings',
        'manage_expenses',
    ],
    [Role.STAFF]: [
        'view_dashboard',
        'manage_members',
        'manage_loans',
        'manage_savings',
        'manage_expenses',
    ],
    [Role.MEMBER]: [
        'view_dashboard',
        'view_own_profile',
        'view_own_loans',
        'view_own_savings',
    ],
};

export const hasPermission = (user: User, permission: string): boolean => {
    const userPermissions = PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
};

export const isAdmin = (user: User): boolean => user.role === Role.ADMIN;
export const isStaff = (user: User): boolean => user.role === Role.STAFF;
export const isMember = (user: User): boolean => user.role === Role.MEMBER;
