import api from './axios';

export interface MemberStats {
    total_members: number;
    active_members: number;
    new_members_this_month: number;
    other_members: number;
}

export interface MemberListItem {
    name: string;
    member_name: string;
    email: string;
    phone: string;
    status: string;
    registration_date: string;
}

export interface RegistrationDetails {
    name: string;
    first_name: string;
    last_name: string;
    member_name: string;
    email: string;
    phone: string;
    national_id: string;
    county: string;
    sub_county: string;
    ward: string;
    village: string;
    national_id_image: string | null;
    passport_photo: string | null;
    status: string;
    registration_fee_paid: number;
    total_savings: number;
    total_loan_outstanding: number;
}

export interface FinancialSummary {
    total_savings: number;
    total_loan_outstanding: number;
    total_welfare_contribution: number;
}

export interface MemberFullDetails {
    registration_details: RegistrationDetails;
    financial_summary: FinancialSummary;
}

export const memberService = {
    async getMemberStats() {
        const response = await api.get('/api/method/sacc_app.member_api.get_member_stats');
        return response.data.message.data as MemberStats;
    },

    async getMemberList(limit_start = 0, limit_page_length = 7, search = '', status = '') {
        const response = await api.get('/api/method/sacc_app.member_api.get_member_list', {
            params: { limit_start, limit_page_length, search, status }
        });
        return response.data.message.data as MemberListItem[];
    },

    async getMemberFullDetails(memberId: string) {
        const response = await api.get('/api/method/sacc_app.member_api.get_member_full_details', {
            params: { member_id: memberId }
        });
        return response.data.message.data as MemberFullDetails;
    },

    async createMemberApplication(data: any) {
        const response = await api.post('/api/method/sacc_app.api.create_member_application', data);
        return response.data;
    },

    async payRegistrationFee(memberId: string, amount: number) {
        const response = await api.post('/api/method/sacc_app.member_api.pay_registration_fee', {
            member_id: memberId,
            amount: amount
        });
        return response.data;
    },

    async updateMemberStatus(memberId: string, status: string) {
        const response = await api.post('/api/method/sacc_app.member_api.update_member_status', {
            member_id: memberId,
            status: status
        });
        return response.data;
    }
};
