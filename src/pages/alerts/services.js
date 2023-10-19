import axiosInstance from '../../services/axiosInstance';
import { listAlerts } from '../../services/Network';

export function fetchAlertsList(alertType = 'open') {
    return axiosInstance.get(`${listAlerts}/${alertType}/list`).then((res) => res);
}
