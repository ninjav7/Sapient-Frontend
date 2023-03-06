import { Store } from 'pullstate';

export const UserStore = new Store({
    vendorName: localStorage.getItem('vendorName'),
    vendorId: localStorage.getItem('vendorId'),
    loginSuccess: localStorage.getItem('login_success'),
    message: localStorage.getItem('failed_message'),
    showNotification: false,
    notificationMessage: '',
    notificationType: '',
    componentType: 'alert',
    error: false,
    errorMessage: '',
});
