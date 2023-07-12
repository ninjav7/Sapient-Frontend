export const convertNullToSingleQuotes = (obj) => {
    const result = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) result[key] = obj[key] === null ? '' : obj[key];
    }
    return result;
};
