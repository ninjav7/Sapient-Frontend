import { Store } from 'pullstate';

export const LoadingStore = new Store({
    isLoading: true,
    isBreakerDataFetched: false,
});
