import { Store } from 'pullstate';

export const UserStore = new Store({
    accountName: localStorage.getItem('accountName'),
    loginSuccess: localStorage.getItem('login_success'),
    message: localStorage.getItem('failed_message'),
});
