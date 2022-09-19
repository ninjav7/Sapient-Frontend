import { Store } from 'pullstate';
import { handleDateFormat } from '../helpers/helpers';

export const DateRangeStore = new Store({
    dateFilter: localStorage.getItem('dateFilter') === null ? 7 : localStorage.getItem('dateFilter'),
    startDate: handleDateFormat(localStorage.getItem('startDate'), 'startDate'),
    endDate: handleDateFormat(localStorage.getItem('endDate'), 'endDate'),
});
