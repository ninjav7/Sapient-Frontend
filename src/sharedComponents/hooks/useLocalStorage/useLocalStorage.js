import { getValue } from './defaultLocalStorageState';

const useLocalStorage = (key, defaultState) => {
    return [
        getValue(key, defaultState),
        (value) => {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
    ];
};

export default useLocalStorage;
