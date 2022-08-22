import { Store } from 'pullstate';

export const UserStore = new Store({
    accountName: localStorage.getItem('accountName'),
});
