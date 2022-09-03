import { Store } from 'pullstate';

export const DateRangeStore = new Store({
    dateFilter: 1,
    startDate: null,
    endDate: null,
});
