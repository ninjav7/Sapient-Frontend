import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import { UserStore } from '../../../store/UserStore';
import { AlertsStore } from '../../../store/AlertStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import OpenAlerts from './OpenAlerts';
import ClosedAlerts from './ClosedAlerts';
import AlertSettings from './AlertSettings';
import AlertPageHeader from './AlertPageHeader';

import { fetchAlertsList, updateAlertAcknowledgement } from '../services';

import './styles.scss';

const Alerts = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isFetchingData, setFetchingData] = useState(false);

    const [openAlertsList, setOpenAlertsList] = useState([]);
    const [closedAlertsList, setClosedAlertsList] = useState([]);

    const handleTabSwitch = (event) => {
        setActiveTab(+event.target.id);
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Alerts',
                    path: '/alerts/overall',
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
                if (response && response.length !== 0) {
                    if (alertType === 'open') {
                        setOpenAlertsList(response);
                        AlertsStore.update((s) => {
                            s.alertCount = response.length;
                        });
                    }
                    if (alertType === 'close') setClosedAlertsList(response);
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
                    if (actionType === 'acknowledged') getAllAlerts('open');
                    if (actionType === 'unacknowledged') getAllAlerts('close');
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
        if (activeTab === 0) getAllAlerts('open');
        if (activeTab === 1) getAllAlerts('close');
    }, [activeTab]);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <AlertPageHeader activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    {activeTab === 0 && (
                        <OpenAlerts
                            alertsList={openAlertsList}
                            isProcessing={isFetchingData}
                            handleAlertAcknowledgement={handleAlertAcknowledgement}
                        />
                    )}
                    {activeTab === 1 && (
                        <ClosedAlerts
                            alertsList={closedAlertsList}
                            isProcessing={isFetchingData}
                            handleAlertAcknowledgement={handleAlertAcknowledgement}
                        />
                    )}
                    {activeTab === 2 && <AlertSettings />}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Alerts;
