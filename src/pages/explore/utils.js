export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

export const truncateString = (inputString) => {
    if (inputString.length > 50) {
        return inputString.substring(0, 50);
    } else {
        return inputString;
    }
};
