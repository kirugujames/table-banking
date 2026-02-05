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

export interface RepaymentScheduleItem {
    payment_date: string;
    amount: number;
    principal: number;
    interest: number;
    principal_to_be_demanded: number;
    interest_to_be_demanded: number;
    balance_after: number;
}

export interface MemberLoan {
    name: string;
    loan_product: string;
    loan_amount: number;
    interest_rate: number;
    repayment_period: number;
    status: string;
    total_repayable: number;
    outstanding_balance: number;
    repayment_schedule: RepaymentScheduleItem[];
    creation: string;
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

    async payRegistrationFee(memberId: string, amount: number, mode: string, reference: string) {
        const response = await api.post(`/api/method/sacc_app.api.pay_registration_fee`, {
            member: memberId,
            amount: amount,
            mode: mode,
            reference: reference
        });
        return response.data;
    },

    async disableMember(memberId: string) {
        const response = await api.post('/api/method/sacc_app.member_api.disable_member', {
            member_id: memberId
        });
        return response.data;
    },

    async enableMember(memberId: string) {
        const response = await api.post('/api/method/sacc_app.member_api.enable_member', {
            member_id: memberId
        });
        return response.data;
    },

    async editMember(memberId: string, data: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        national_id: string;
        county: string;
        sub_county: string;
        ward: string;
        village: string;
        national_id_image?: string;
        passport_photo?: string;
    }) {
        const response = await api.post('/api/method/sacc_app.member_api.edit_member', {
            member_id: memberId,
            ...data
        });
        return response.data;
    },

    async getMemberLoans(memberId: string) {
        const response = await api.get('/api/method/sacc_app.api.get_member_loans', {
            params: { member: memberId }
        });
        return response.data.message.data as MemberLoan[];
    },

    async getAllMembers() {
        const response = await api.get('/api/method/sacc_app.api.get_all_members');
        return response.data.message.data as {
            name: string;
            member_name: string;
            phone: string;
            email: string;
            status: string;
            national_id: string;
            total_savings: number;
        }[];
    }
};
