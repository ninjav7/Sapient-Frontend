// Convert to Alpha Numeric
export const convertToAlphaNumeric = (input) => {
    const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, '');
    return sanitizedInput;
};
