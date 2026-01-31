import api from './axios';

export interface County {
    county_name: string;
    county_code: number;
}

export interface Constituency {
    name: string;
    constituency_name: string;
}

export interface Ward {
    name: string;
    ward_name: string;
}

export const locationService = {
    async getCounties() {
        const response = await api.get('/api/method/sacc_app.location_api.get_counties');
        return response.data.message.data as County[];
    },

    async getSubCounties(county: string) {
        const response = await api.get('/api/method/sacc_app.location_api.get_constituencies', {
            params: { county }
        });
        return response.data.message.data as Constituency[];
    },

    async getWards(constituency: string) {
        const response = await api.get('/api/method/sacc_app.location_api.get_wards', {
            params: { constituency }
        });
        return response.data.message.data as Ward[];
    }
};
