// Convert to Alpha Numeric
export const convertToAlphaNumeric = (input) => {
    const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, '');
    return sanitizedInput;
};

export const convertToMac = (deviceSearch) => {
    let mac = deviceSearch;
    if (!deviceSearch.includes(':')) mac = deviceSearch.match(/.{1,2}/g).join(':');
    return mac;
};
