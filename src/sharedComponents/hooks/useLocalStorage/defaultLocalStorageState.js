const getValue = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;
    try {
        return JSON.parse(value);
    } catch {
        return defaultValue;
    }
};

const defaultLocalStorageState = {
    token: getValue('token', null),
};

export default defaultLocalStorageState;

export { getValue };
