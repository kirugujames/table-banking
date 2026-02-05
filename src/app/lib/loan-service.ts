import api from './axios';

export interface LoanDashboardStats {
    total_pending_applications: number;
    active_loans_count: number;
    active_loans_amount: number;
    total_disbursed_amount: number;
    default_rate: number;
}

export interface LoanApplication {
    member_name: string;
    member_id: string;
    loan_id: string;
    amount_applied: number;
    amount_disbursed: number;
    interest_rate: number;
    status: string;
    purpose: string;
    payment_progress: number;
    creation_date: string;
    loan_product?: string;
    repayment_period?: number;
    total_repayable?: number;
    outstanding_balance?: number;
    repayment_schedule?: RepaymentScheduleItem[];
}

export interface RepaymentScheduleItem {
    payment_date: string;
    amount: number;
    principal: number;
    interest: number;
    principal_to_be_demanded: number;
    interest_to_be_demanded: number;
    balance_after: number;
}

export interface Pagination {
    limit_start: number;
    limit_page_length: number;
    total: number;
}

export interface LoanApplicationsResponse {
    data: LoanApplication[];
    pagination: Pagination;
}

export const loanService = {
    async getLoanDashboard() {
        const response = await api.get('/api/method/sacc_app.api.get_loan_dashboard');
        if (response.data.message.status === 'success') {
            return response.data.message.data as LoanDashboardStats;
        }
        throw new Error(response.data.message.message || 'Failed to fetch loan dashboard stats');
    },

    async getLoanApplications(params: {
        status?: string;
        member_name?: string;
        member_id?: string;
        loan_id?: string;
        limit_start?: number;
        limit_page_length?: number;
    }) {
        const response = await api.get('/api/method/sacc_app.api.get_loan_applications', { params });
        if (response.data.message.status === 'success') {
            return response.data.message as LoanApplicationsResponse;
        }
        throw new Error(response.data.message.message || 'Failed to fetch loan applications');
    },

    async getAllLoanProducts() {
        const response = await api.get('/api/method/sacc_app.api.get_all_loan_products');
        if (response.data.message.status === 'success') {
            return response.data.message.data as {
                name: string;
                product_name: string;
                interest_rate: number;
                interest_period: string;
                interest_method: string;
                max_repayment_period: number;
                min_loan_amount: number;
                max_loan_amount: number;
                requires_guarantor: number;
                min_guarantors: number;
                description: string | null;
            }[];
        }
        throw new Error(response.data.message.message || 'Failed to fetch loan products');
    },

    async applyForLoan(data: {
        member: string;
        amount: number;
        loan_product: string;
        purpose: string;
        repayment_period: number;
        guarantors: {
            member: string;
            amount: number;
        }[];
    }) {
        const response = await api.post('/api/method/sacc_app.api.apply_for_loan', data);
        if (response.data.success || response.data.message === 'success') {
            return response.data;
        }
        // Handle Frappe error structure
        if (response.data.exception || response.data._server_messages) {
            throw { response: { data: response.data } };
        }
        return response.data;
    },

    async getLoanApplicationById(loanId: string) {
        const response = await api.get('/api/method/sacc_app.api.get_loan_application_by_id', {
            params: { loan_id: loanId }
        });
        if (response.data.message.status === 'success') {
            return response.data.message.data as LoanApplication;
        }
        throw new Error(response.data.message.message || 'Failed to fetch loan details');
    },

    async recordLoanRepayment(data: {
        loan: string;
        amount: number;
        mode: string;
        reference: string;
    }) {
        const response = await api.post('/api/method/sacc_app.api.record_loan_repayment', data);
        if (response.data.message?.status === 'success') {
            return response.data.message;
        }
        // Handle Frappe error structure
        if (response.data.exception || response.data._server_messages) {
            throw { response: { data: response.data } };
        }
        return response.data.message || response.data;
    },

    async createLoanProduct(data: {
        product_name: string;
        interest_rate: number;
        interest_period: string;
        interest_method: string;
        max_repayment_period: number;
        min_loan_amount: number;
        max_loan_amount: number;
        requires_guarantor: number;
        min_guarantors: number;
        description: string;
    }) {
        const response = await api.post('/api/method/sacc_app.api.create_loan_product', data);
        if (response.data.message?.status === 'success') {
            return response.data.message;
        }
        // Handle Frappe error structure
        if (response.data.exception || response.data._server_messages) {
            throw { response: { data: response.data } };
        }
        return response.data.message || response.data;
    }
};
