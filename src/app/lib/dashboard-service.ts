import api from './axios';

export interface DashboardStats {
    total_members: number;
    total_savings: number;
    active_loans: number;
    default_rate: number;
}

export interface LoanBreakdownItem {
    loan_product: string;
    count: number;
    total_amount: number;
    outstanding_amount: number;
}

export interface RecentActivityItem {
    type: string;
    member: string;
    member_name: string;
    amount: number;
    date: string;
    timestamp: string;
    details: string;
}

export interface PaymentRequestItem {
    loan: string;
    member: string;
    member_name: string;
    amount: number;
    status: string;
    product: string;
}

export interface SavingsGrowthItem {
    month_name: string;
    year: number;
    total: number;
}

export const dashboardService = {
    async getDashboardStats() {
        const response = await api.get('/api/method/sacc_app.dashboard_api.get_dashboard_stats');
        return response.data.message.data as DashboardStats;
    },

    async getLoanBreakdown() {
        const response = await api.get('/api/method/sacc_app.dashboard_api.get_loan_breakdown');
        return response.data.message.data as LoanBreakdownItem[];
    },

    async getRecentActivities(limit_start = 0, limit_page_length = 15, search = '') {
        const response = await api.get('/api/method/sacc_app.dashboard_api.get_recent_activities', {
            params: { limit_start, limit_page_length, search }
        });
        return response.data.message.data as RecentActivityItem[];
    },

    async getUpcomingPayments(limit_start = 0, limit_page_length = 20, search = '') {
        const response = await api.get('/api/method/sacc_app.dashboard_api.get_payment_requests', {
            params: { limit_start, limit_page_length, search }
        });
        return response.data.message.data as PaymentRequestItem[];
    },

    async getSavingsGrowth() {
        const response = await api.get('/api/method/sacc_app.dashboard_api.get_savings_growth');
        return response.data.message.data as SavingsGrowthItem[];
    }
};
