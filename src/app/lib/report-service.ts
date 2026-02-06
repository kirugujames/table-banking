import api from './axios';

export interface ReportColumn {
    fieldname: string;
    label: string;
    fieldtype: string;
    options?: string;
    width?: number;
    hidden?: number;
}

export interface ReportData {
    columns: ReportColumn[];
    data: any[];
    report_summary?: any[];
}

export const reportService = {
    async getProfitAndLoss(fromDate: string, toDate: string): Promise<ReportData> {
        const response = await api.get('/api/method/sacc_app.api.get_profit_and_loss', {
            params: { from_date: fromDate, to_date: toDate }
        });
        return response.data.message;
    },

    async getBalanceSheet(toDate: string): Promise<ReportData> {
        const response = await api.get('/api/method/sacc_app.api.get_balance_sheet', {
            params: { to_date: toDate }
        });
        return response.data.message;
    },

    async getTrialBalance(fromDate: string, toDate: string): Promise<ReportData> {
        const response = await api.get('/api/method/sacc_app.api.get_trial_balance', {
            params: { from_date: fromDate, to_date: toDate }
        });
        return response.data.message;
    },

    async getAccountStatement(fromDate: string, toDate: string, accounts?: string): Promise<ReportData> {
        const response = await api.get('/api/method/sacc_app.api.get_account_statement', {
            params: { from_date: fromDate, to_date: toDate, accounts }
        });
        return response.data.message;
    },

    async getLoanReport(fromDate: string, toDate: string): Promise<ReportData> {
        const response = await api.get('/api/method/sacc_app.api.get_loan_report', {
            params: { from_date: fromDate, to_date: toDate }
        });
        return response.data.message;
    },

    async getLoanAging(toDate: string): Promise<ReportData> {
        const response = await api.get('/api/method/sacc_app.api.get_loan_aging_report', {
            params: { to_date: toDate }
        });
        return response.data.message;
    },

    async getLoanLedger(fromDate: string, toDate: string, member?: string): Promise<ReportData> {
        const response = await api.get('/api/method/sacc_app.api.get_loan_ledger_report', {
            params: { from_date: fromDate, to_date: toDate, member }
        });
        return response.data.message;
    },

    async getAccounts(): Promise<{ name: string; account_name: string }[]> {
        const response = await api.get('/api/method/sacc_app.api.get_all_accounts');
        return response.data.message.data;
    }
};
