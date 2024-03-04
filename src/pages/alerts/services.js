import axiosInstance from '../../services/axiosInstance';
import {
    listAlertsConfig,
    alertAcknowledgement,
    createAlertConfig,
    getConfiguredAlerts,
    deleteAlertConfig,
    getConfiguredAlertsById,
    updateAlertConfig,
    configuredEmailsList,
} from '../../services/Network';

export function fetchAlertsList(alertType = 'unacknowledged') {
    return axiosInstance.get(`${listAlertsConfig}?action=${alertType}`).then((res) => res);
}

export function fetchConfiguredEmailsList() {
    return axiosInstance.get(configuredEmailsList).then((res) => res);
}

export function updateAlertAcknowledgement(params, payload) {
    return axiosInstance.patch(`${alertAcknowledgement}${params}`, payload).then((res) => res);
}

export function createAlertServiceAPI(payload = {}) {
    return axiosInstance.post(`${createAlertConfig}`, payload).then((res) => res);
}

export function updateAlertServiceAPI(alertId, payload = {}) {
    return axiosInstance.patch(`${updateAlertConfig}/${alertId}`, payload).then((res) => res);
}

export function fetchAllConfiguredAlerts(params = '', payload = {}) {
    return axiosInstance.post(`${getConfiguredAlerts}${params}`, payload).then((res) => res);
}

export function fetchConfiguredAlertById(alert_id) {
    return axiosInstance.get(`${getConfiguredAlertsById}/${alert_id}`).then((res) => res);
}

export function deleteConfiguredAlert(params) {
    return axiosInstance.delete(`${deleteAlertConfig}${params}`).then((res) => res);
}
