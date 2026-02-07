export const parseFrappeError = (error: any, defaultMessage: string = 'An error occurred'): string => {
    const errorData = error.response?.data;
    if (!errorData) return defaultMessage;

    if (errorData._server_messages) {
        try {
            const messages = JSON.parse(errorData._server_messages);
            const parsedMessage = JSON.parse(messages[0]);
            return parsedMessage.message || defaultMessage;
        } catch (e) {
            console.error('Failed to parse _server_messages', e);
        }
    }

    if (errorData.exception) {
        // Check for specific common errors
        if (errorData.exception.includes('Duplicate entry')) {
            const match = errorData.exception.match(/Duplicate entry '(.+)' for key '(.+)'/);
            if (match) {
                return `Value '${match[1]}' already exists.`;
            }
            return "A unique field value already exists in the system.";
        }

        // Fallback to extraction from traceback or exception string
        return errorData.exception.split(':').pop()?.trim() || defaultMessage;
    }

    if (errorData.message) {
        return errorData.message;
    }

    return defaultMessage;
};
