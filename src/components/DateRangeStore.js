import { Store } from 'pullstate';

export const DateRangeStore = new Store({
    dateFilter: 30,
    startDate: null,
    endDate: null,
});
