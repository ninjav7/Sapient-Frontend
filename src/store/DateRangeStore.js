import { Store } from 'pullstate';
import { handleDateFormat, handleTimeFormat } from '../helpers/helpers';

export const DateRangeStore = new Store({
    dateFilter: localStorage.getItem('dateFilter') === null ? 6 : localStorage.getItem('dateFilter'),
    startDate: handleDateFormat(localStorage.getItem('startDate'), 'startDate'),
    endDate: handleDateFormat(localStorage.getItem('endDate'), 'endDate'),
    filterPeriod: localStorage.getItem('filterPeriod') === null ? 'Last 7 Days' : localStorage.getItem('filterPeriod'),
    daysCount: localStorage.getItem('daysCount'),
    startTime: handleTimeFormat(localStorage.getItem('startTime'), 'startTime'),
    endTime: handleTimeFormat(localStorage.getItem('endDate'), 'endTime'),
});
