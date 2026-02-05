import api from './axios';

export interface TransactionDashboardData {
    today_transactions_amount: number;
    total_in: number;
    total_out: number;
    net_flow: number;
}

export interface Transaction {
    transaction_id: string;
    date: string;
    member_name: string;
    type: string;
    category: string;
    amount: number;
    reference: string;
    status: string;
}

export interface TransactionPagination {
    limit_start: number;
    limit_page_length: number;
    total: number;
}

export interface TransactionsResponse {
    status: string;
    data: Transaction[];
    pagination: TransactionPagination;
}

export interface TransactionParams {
    limit_start?: number;
    limit_page_length?: number;
    category?: string;
    status?: string;
    search?: string;
}

export interface AccountAffected {
    account: string;
    debit: number;
    credit: number;
}

export interface PartyInvolved {
    id: string;
    name: string;
    type: string;
}

export interface TransactionDetails {
    transaction_id: string;
    date: string;
    accounts_affected: AccountAffected[];
    parties_involved: PartyInvolved[];
    remarks: string;
}

export const transactionService = {
    getTransactionDashboard: async (): Promise<TransactionDashboardData> => {
        const response = await api.get('/api/method/sacc_app.api.get_transactions_dashboard');
        return response.data.message.data;
    },

    getAllTransactions: async (params: TransactionParams): Promise<TransactionsResponse> => {
        const response = await api.get('/api/method/sacc_app.api.get_all_transactions', { params });
        return response.data.message;
    },

    getTransactionDetails: async (transaction_id: string): Promise<TransactionDetails> => {
        const response = await api.get('/api/method/sacc_app.api.get_transaction_details', {
            params: { transaction_id }
        });
        return response.data.message.data;
    }
};
