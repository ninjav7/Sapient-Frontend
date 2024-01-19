import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';

import { UserStore } from '../../../store/UserStore';
import { AlertsStore } from '../../../store/AlertStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import OpenAlerts from './OpenAlerts';
import ClosedAlerts from './ClosedAlerts';
import AlertSettings from './AlertSettings';
import AlertPageHeader from './AlertPageHeader';

import { fetchAlertsList, fetchAllConfiguredAlerts, updateAlertAcknowledgement } from '../services';

import './styles.scss';

const Alerts = () => {
    const { alertType } = useParams();
    const history = useHistory();

    const [isFetchingData, setFetchingData] = useState(false);

    const [openAlertsList, setOpenAlertsList] = useState([]);
    const [closedAlertsList, setClosedAlertsList] = useState([]);
    const [configuredAlertsList, setConfiguredAlertsList] = useState([]);

    const handleTabSwitch = (e) => {
        history.push({ pathname: `/alerts/overview/${e.target.id}` });
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Alerts',
                    path: '/alerts/overview/open-alerts',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'alerts';
        });
    };

    const getAllAlerts = async (alertType) => {
        setFetchingData(true);

        await fetchAlertsList(alertType)
            .then((res) => {
                const response = res?.data;
                const { success: isSuccessful, data } = response;
                if (isSuccessful && data) {
                    if (alertType === 'unacknowledged') {
                        setOpenAlertsList(data);
                        AlertsStore.update((s) => {
                            s.alertCount = data.length;
                        });
                    }
                    if (alertType === 'acknowledged') {
                        setClosedAlertsList(data);
                    }
                }
            })
            .catch(() => {})
            .finally(() => {
                setFetchingData(false);
            });
    };

    const getAllConfiguredAlerts = async () => {
        setFetchingData(true);

        await fetchAllConfiguredAlerts()
            .then((res) => {
                const response = res?.data;
                const { success: isSuccessful, data } = response;
                if (isSuccessful && data) {
                    setConfiguredAlertsList(data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setFetchingData(false);
            });
    };

    const handleAlertAcknowledgement = async (actionType, payload = []) => {
        if (!actionType) return;

        const params = `?action=${actionType}`;

        await updateAlertAcknowledgement(params, payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = `${response?.message} successfully.`;
                        s.notificationType = 'success';
                    });
                    if (actionType === 'acknowledged') getAllAlerts('unacknowledged');
                    if (actionType === 'unacknowledged') getAllAlerts('acknowledged');
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Failed to update Alert status.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Failed to update Alert status due to Internal Server Error.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {});
    };

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (alertType === 'open-alerts') getAllAlerts('unacknowledged');
        if (alertType === 'closed-alerts') getAllAlerts('acknowledged');
        if (alertType === 'alert-settings') getAllConfiguredAlerts();
    }, [alertType]);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <AlertPageHeader alertType={alertType} handleTabSwitch={handleTabSwitch} />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    {alertType === 'open-alerts' && (
                        <OpenAlerts
                            alertsList={openAlertsList}
                            isProcessing={isFetchingData}
                            handleAlertAcknowledgement={handleAlertAcknowledgement}
                        />
                    )}
                    {alertType === 'closed-alerts' && (
                        <ClosedAlerts
                            alertsList={closedAlertsList}
                            isProcessing={isFetchingData}
                            handleAlertAcknowledgement={handleAlertAcknowledgement}
                        />
                    )}
                    {alertType === 'alert-settings' && (
                        <AlertSettings getAllConfiguredAlerts={getAllConfiguredAlerts} />
                    )}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Alerts;
