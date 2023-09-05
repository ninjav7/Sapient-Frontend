import { UserStore } from '../store/UserStore';

export const saveUserPreference = (dateFormat, timeFormat, unit) => {
    localStorage.setItem('dateFormat', dateFormat);
    localStorage.setItem('timeFormat', timeFormat);
    localStorage.setItem('unit', unit);

    UserStore.update((store) => {
        store.dateFormat = dateFormat;
        store.timeFormat = timeFormat;
        store.unit = unit;
    });
};
