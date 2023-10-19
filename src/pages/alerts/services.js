import axiosInstance from '../../services/axiosInstance';
import { listAlerts, alertAcknowledgement } from '../../services/Network';

export function fetchAlertsList(alertType = 'open') {
    return axiosInstance.get(`${listAlerts}/${alertType}/list`).then((res) => res);
}

export function updateAlertAcknowledgement(params, payload) {
    return axiosInstance.patch(`${alertAcknowledgement}${params}`, payload).then((res) => res);
}
