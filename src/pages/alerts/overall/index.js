import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import { UserStore } from '../../../store/UserStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import OpenAlerts from './OpenAlerts';
import ClosedAlerts from './ClosedAlerts';
import AlertSettings from './AlertSettings';
import AlertPageHeader from './AlertPageHeader';

import { fetchAlertsList } from '../services';

import './styles.scss';

const Alerts = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isFetchingData, setFetchingData] = useState(false);

    const [openAlertsList, setOpenAlertsList] = useState([]);
    const [closedAlertsList, setClosedAlertsList] = useState([]);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

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
                    alertType === 'open' && setOpenAlertsList(response);
                    alertType === 'close' && setClosedAlertsList(response);
                }
            })
            .catch(() => {})
            .finally(() => {
                setFetchingData(false);
            });
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
                    {activeTab === 0 && <OpenAlerts alertsList={openAlertsList} isProcessing={isFetchingData} />}
                    {activeTab === 1 && <ClosedAlerts alertsList={closedAlertsList} isProcessing={isFetchingData} />}
                    {activeTab === 2 && <AlertSettings />}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Alerts;
