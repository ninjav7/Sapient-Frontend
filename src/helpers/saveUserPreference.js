import { UserStore } from '../store/UserStore';

export const saveUserPreference = (dateFormat, timeFormat, unit) => {
    // check here
    localStorage.setItem('dateFormat', dateFormat);
    localStorage.setItem('timeFormat', timeFormat);
    localStorage.setItem('unit', unit);

    UserStore.update((store) => {
        store.dateFormat = dateFormat;
        store.timeFormat = timeFormat;
        store.unit = unit;
    });
};
