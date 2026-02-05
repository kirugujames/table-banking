import api from './axios';

export interface TopSaver {
    name: string;
    member_name: string;
    total_savings: number;
    current_month_savings: number;
}

export interface SavingsSummary {
    total_savings: number;
    monthly_deposits: number;
    monthly_withdrawals: number;
    active_savers_count: number;
}

export interface SavingsTrendItem {
    month: string;
    savings: number;
    expense: number;
}

export interface SavingsTransaction {
    name: string;
    member: string;
    member_name: string;
    type: string;
    amount: number;
    posting_date: string;
    payment_mode: string;
    reference_number: string | null;
}

export interface Pagination {
    limit_start: number;
    limit_page_length: number;
    total: number;
}

export const savingsService = {
    async recordDeposit(member: string, amount: number, mode: string, reference: string) {
        const response = await api.post('/api/method/sacc_app.api.record_savings_deposit', {
            member,
            amount,
            mode,
            reference
        });
        return response.data;
    },

    async recordWithdrawal(member: string, amount: number, mode: string, reference: string) {
        const response = await api.post('/api/method/sacc_app.api.record_savings_withdrawal', {
            member,
            amount,
            mode,
            reference
        });
        return response.data;
    },

    async getSavingsDashboard() {
        const response = await api.get('/api/method/sacc_app.api.get_savings_dashboard');
        if (response.data.message.status === 'success') {
            return response.data.message.data as SavingsSummary;
        }
        throw new Error(response.data.message.message || 'Failed to fetch savings summary');
    },

    async getTopSavers() {
        const response = await api.get('/api/method/sacc_app.api.get_top_savers');
        if (response.data.message.status === 'success') {
            return response.data.message.data as TopSaver[];
        }
        throw new Error(response.data.message.message || 'Failed to fetch top savers');
    },

    async getSavingsVsExpense() {
        const response = await api.get('/api/method/sacc_app.api.get_savings_vs_expense');
        if (response.data.message.status === 'success') {
            return response.data.message.data as SavingsTrendItem[];
        }
        throw new Error(response.data.message.message || 'Failed to fetch savings vs expense data');
    },

    async getSavingsTransactions(params: {
        limit_start?: number;
        limit_page_length?: number;
        searchTerm?: string;
    }) {
        const response = await api.get('/api/method/sacc_app.api.get_savings_transactions', {
            params
        });
        if (response.data.message.status === 'success') {
            return {
                data: response.data.message.data as SavingsTransaction[],
                pagination: response.data.message.pagination as Pagination
            };
        }
        throw new Error(response.data.message.message || 'Failed to fetch savings transactions');
    }
};
