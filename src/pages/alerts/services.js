import axiosInstance from '../../services/axiosInstance';
import { listAlerts, alertAcknowledgement, createAlert } from '../../services/Network';

export function fetchAlertsList(alertType = 'unacknowledged') {
    return axiosInstance.get(`${listAlerts}?action=${alertType}`).then((res) => res);
}

export function updateAlertAcknowledgement(params, payload) {
    return axiosInstance.patch(`${alertAcknowledgement}${params}`, payload).then((res) => res);
}

export function createAlertServiceAPI(payload) {
    return axiosInstance.post(`${createAlert}`, payload).then((res) => res);
}
