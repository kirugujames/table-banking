import CryptoJS from 'crypto-js';

// Default encryption key - in production this should be an environment variable
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'sacco-dashboard-secure-key-2024';

export const secureStorage = {
    setItem: (key: string, value: string) => {
        try {
            const encryptedValue = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            console.error('Error encrypting data:', error);
        }
    },

    getItem: (key: string): string | null => {
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return null;

            const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
            const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);

            // If decryption fails (empty string), it might be old plaintext data
            // In that case, return null to force re-login/re-fetch
            if (!decryptedValue) return null;

            return decryptedValue;
        } catch (error) {
            // If decryption crashes (e.g. malformed data), return null
            console.error('Error decrypting data:', error);
            return null;
        }
    },

    removeItem: (key: string) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    }
};
