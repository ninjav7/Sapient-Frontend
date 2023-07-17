import { Store } from 'pullstate';

export const UserStore = new Store({
    vendorId: localStorage.getItem('vendorId'),
    vendorName: localStorage.getItem('vendorName'),
    dateFormat: localStorage.getItem('date_format'),
    timeFormat: localStorage.getItem('time_format'),
    unit: localStorage.getItem('unit'),
    loginSuccess: localStorage.getItem('login_success'),
    message: localStorage.getItem('failed_message'),
    showNotification: false,
    notificationMessage: '',
    notificationType: '',
    componentType: 'alert',
    error: false,
    errorMessage: '',
});
