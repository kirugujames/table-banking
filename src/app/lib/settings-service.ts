import api from './axios';

export interface SaccoSettings {
    name: string;
    owner: string;
    creation: string | null;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: string;
    registration_fee: number;
    charge_registration_fee_on_onboarding: number;
    doctype: string;
}

export interface UpdateSaccoSettingsData {
    registration_fee: number;
    charge_registration_fee_on_onboarding: number;
}

export const settingsService = {
    async getSettings() {
        const response = await api.get('/api/method/sacc_app.api.get_sacco_settings');
        return response.data.message.data as SaccoSettings;
    },

    async updateSettings(data: UpdateSaccoSettingsData) {
        const response = await api.post('/api/method/sacc_app.api.update_sacco_settings', data);
        return response.data.message.data as SaccoSettings;
    },

    async getCompanyDetails() {
        const response = await api.get('/api/method/sacc_app.api.get_company_details');
        return response.data.message.data as CompanyDetails;
    }
};

export interface CompanyDetails {
    name: string;
    company_name: string;
    abbr: string;
    default_currency: string;
    country: string;
    tax_id: string | null;
    domain: string | null;
    phone_no: string | null;
    email: string | null;
    logo: string | null;
}
