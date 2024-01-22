import axiosInstance from '../../services/axiosInstance';
import {
    listAlerts,
    alertAcknowledgement,
    createAlert,
    getConfiguredAlerts,
    deleteAlert,
    getConfiguredAlertsById,
} from '../../services/Network';

export function fetchAlertsList(alertType = 'unacknowledged') {
    return axiosInstance.get(`${listAlerts}?action=${alertType}`).then((res) => res);
}

export function updateAlertAcknowledgement(params, payload) {
    return axiosInstance.patch(`${alertAcknowledgement}${params}`, payload).then((res) => res);
}

export function createAlertServiceAPI(payload = {}) {
    return axiosInstance.post(`${createAlert}`, payload).then((res) => res);
}

export function fetchAllConfiguredAlerts() {
    return axiosInstance.get(getConfiguredAlerts).then((res) => res);
}

export function fetchConfiguredAlertById(alert_id) {
    return axiosInstance.get(`${getConfiguredAlertsById}/${alert_id}`).then((res) => res);
}

export function deleteConfiguredAlert(params) {
    return axiosInstance.delete(`${deleteAlert}${params}`).then((res) => res);
}
