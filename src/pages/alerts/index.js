import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import Typography from '../../sharedComponents/typography';
import { Button } from '../../sharedComponents/button';

import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';

import { ReactComponent as PlusSVG } from '../../assets/icon/plus.svg';

import colorPalette from '../../assets/scss/_colors.scss';
import './styles.scss';

const AlertHeader = (props) => {
    const { activeTab = false, setActiveTab } = props;

    return (
        <div className="alerts-header-wrapper d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between">
                <Typography.Header
                    size={Typography.Sizes.lg}
                    style={{ color: colorPalette.primaryGray700 }}
                    className="font-weight-bold">{`Alerts`}</Typography.Header>
                <div className="d-flex">
                    <Button label={'Add Alert'} size={Button.Sizes.md} type={Button.Type.primary} icon={<PlusSVG />} />
                </div>
            </div>

            <div className="d-flex">
                <Typography.Header
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 0 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={() => {
                        setActiveTab(0);
                    }}>
                    {`Open Alerts`}
                </Typography.Header>
                <Typography.Header
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 1 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={() => {
                        setActiveTab(1);
                    }}>
                    {`Closed Alerts`}
                </Typography.Header>
                <Typography.Header
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 2 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={() => {
                        setActiveTab(2);
                    }}>
                    {`Alert Settings`}
                </Typography.Header>
            </div>
        </div>
    );
};

const Alerts = () => {
    const [activeTab, setActiveTab] = useState(0);

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Alerts',
                    path: '/alerts/portfolio',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'alerts';
        });
    };

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <AlertHeader activeTab={activeTab} setActiveTab={setActiveTab} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Alerts;
