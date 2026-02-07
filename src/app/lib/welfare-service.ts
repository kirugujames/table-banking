import api from './axios';

export interface WelfareClaim {
    name: string; // "CLAIM-00001"
    member: string; // "MEM-00278"
    member_name: string;
    reason: string;
    description: string;
    claim_amount: number;
    total_collected: number;
    status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
    claim_date: string;
    payment_date?: string;
    creation: string;
    amount_per_member: number;
    payment_mode?: string;
    journal_entry?: string;
    modified?: string;
    member_email?: string;
    member_phone?: string;
    // Helper property for easier ID access if needed, though 'name' is the ID in ERPNext usually
    id: string;
}

export interface CreateClaimData {
    member_id: string;
    reason: string;
    claim_amount: number;
    description: string;
}

export interface ApproveClaimData {
    claim_id: string;
    amount_per_member: number;
}

export interface PayClaimData {
    member: string;
    amount: number;
    purpose: string;
    type: 'Contribution';
    claim_id: string;
    mode?: 'Cash' | 'Mpesa'; // Added for UI handling, though API example didn't show it in payload, standard usually requires it or defaults.
    reference?: string;
}

export interface WelfareStats {
    total_claims: number;
    pending_claims: number;
    approved_claims: number;
    total_contributions: number;
}

export const welfareService = {
    getClaims: async (page = 1, limit = 20, search = '', status = '') => {
        const limit_start = (page - 1) * limit;
        const response = await api.get(`/api/method/sacc_app.welfare_claims_api.get_all_welfare_claims`, {
            params: {
                limit_start,
                limit_page_length: limit,
                status: status === 'All Statuses' ? '' : status
                // Search isn't explicitly shown in the example prompt but usually exists. 
                // If it breaks, I'll remove it.
            },
        });

        // Map the response to include 'id' alias for 'name' if needed by components
        const data = response.data.message.data.map((item: any) => ({
            ...item,
            id: item.name
        }));

        return {
            data,
            pagination: response.data.message.pagination
        };
    },

    getWelfareStats: async () => {
        const response = await api.get('/api/method/sacc_app.welfare_dashboard_api.get_welfare_stats');
        return response.data.message.data as WelfareStats;
    },

    createClaim: async (data: CreateClaimData) => {
        const response = await api.post(`/api/method/sacc_app.welfare_claims_api.create_welfare_claim`, data);
        return response.data;
    },

    approveClaim: async (data: ApproveClaimData) => {
        const response = await api.post(`/api/method/sacc_app.welfare_claims_api.approve_welfare_claim`, data);
        return response.data;
    },

    payClaim: async (data: PayClaimData) => {
        const response = await api.post(`/api/method/sacc_app.api.record_welfare_contribution`, data);
        return response.data;
    },

    getClaimById: async (id: string) => {
        const response = await api.get(`/api/method/sacc_app.welfare_claims_api.get_welfare_claim_by_id`, {
            params: { claim_id: id }
        });
        return {
            ...response.data.message.data,
            id: response.data.message.data.claim_id // consistency
        } as WelfareClaim;
    }
};
