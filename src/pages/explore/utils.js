export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

export const truncateString = (inputString) => {
    if (inputString.length > 60) {
        return inputString.substring(0, 60);
    } else {
        return inputString;
    }
};
