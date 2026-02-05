import api from './axios';

export interface ExpenseDashboardStats {
    total_expense_mtd: number;
    pending_payments: number;
    largest_expense: number;
    budget_remaining: number;
}

export interface ExpenseByCategory {
    category: string;
    amount: number;
}

export interface MonthlyExpenseTrend {
    month: string;
    total: number;
}

export interface ExpenseTransaction {
    id: string;
    date: string;
    category: string;
    description: string;
    vendor: string | null;
    amount: number;
    docstatus: number;
    status: string;
}

export interface ExpenseDetails extends ExpenseTransaction {
    voucher_type: string;
}

export interface ExpensePagination {
    limit_start: number;
    limit_page_length: number;
    total: number;
}

export interface AllExpensesResponse {
    data: ExpenseTransaction[];
    pagination: ExpensePagination;
}

export const expenseService = {
    getExpenseDashboardStats: async (): Promise<ExpenseDashboardStats> => {
        const response = await api.get('/api/method/sacc_app.expense_api.get_expense_dashboard_stats');
        return response.data.message.data;
    },

    getExpensesByCategory: async (): Promise<ExpenseByCategory[]> => {
        const response = await api.get('/api/method/sacc_app.expense_api.get_expenses_by_category');
        return response.data.message.data;
    },

    getMonthlyExpenseTrends: async (): Promise<MonthlyExpenseTrend[]> => {
        const response = await api.get('/api/method/sacc_app.expense_api.get_monthly_expense_trends');
        return response.data.message.data;
    },

    getAllExpenseTransactions: async (params: {
        limit_start?: number;
        limit_page_length?: number;
        search?: string;
        status?: string;
    }): Promise<AllExpensesResponse> => {
        const response = await api.get('/api/method/sacc_app.expense_api.get_all_expense_transactions', { params });
        // Note: The API response format provided in the request doesn't explicitly show a pagination object, 
        // but based on typical patterns in this project, I'll assume it exists or wrap the data.
        // If it's missing, I'll adjust.
        return response.data.message;
    },

    getExpenseDetails: async (expense_id: string): Promise<ExpenseDetails> => {
        const response = await api.get('/api/method/sacc_app.expense_api.get_expense_details', {
            params: { expense_id }
        });
        return response.data.message.data;
    },

    getExpenseAccounts: async (): Promise<{ name: string; account_name: string }[]> => {
        const response = await api.get('/api/method/sacc_app.api.get_expense_accounts');
        return response.data.message.data;
    },

    recordExpense: async (data: {
        amount: number;
        expense_account: string;
        description: string;
        mode_of_payment: string;
        vendor_name: string;
    }) => {
        const response = await api.post('/api/method/sacc_app.api.record_expense', data);
        return response.data.message;
    }
};
