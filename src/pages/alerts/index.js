import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import Typography from '../../sharedComponents/typography';
import { Button } from '../../sharedComponents/button';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../sharedComponents/form/checkbox';

import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';

import { ReactComponent as PlusSVG } from '../../assets/icon/plus.svg';

import { openAlertsHeaderProps, closedAlertsHeaderProps } from './constants';

import colorPalette from '../../assets/scss/_colors.scss';
import './styles.scss';

const AlertHeader = (props) => {
    const { activeTab = false, handleTabSwitch } = props;

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
                    id="0"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 0 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    {`Open Alerts`}
                </Typography.Header>
                <Typography.Header
                    id="1"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 1 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    {`Closed Alerts`}
                </Typography.Header>
                <Typography.Header
                    id="2"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 2 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    {`Alert Settings`}
                </Typography.Header>
            </div>
        </div>
    );
};

const OpenAlerts = () => {
    const [openAlertsList, setOpenAlersList] = useState([]);
    const [openAlertsCount, setOpenAlertListsCount] = useState(0);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [checkedAll, setCheckedAll] = useState(false);

    const handleAcknowledgement = () => {
        alert('Acknowledged');
    };

    const currentRow = () => {
        return openAlertsList;
    };

    return (
        <div className="custom-padding">
            <DataTableWidget
                id="open_alerts_list"
                onSearch={(query) => {}}
                onStatus={(value) => {}}
                buttonGroupFilterOptions={[]}
                rows={currentRow()}
                disableColumnDragging={true}
                searchResultRows={currentRow()}
                headers={openAlertsHeaderProps}
                filterOptions={[]}
                customCheckAll={() => (
                    <Checkbox
                        label=""
                        type="checkbox"
                        id="open_alerts"
                        name="open_alerts"
                        checked={checkedAll}
                        onChange={() => {
                            setCheckedAll(!checkedAll);
                        }}
                    />
                )}
                customCheckboxForCell={(record) => (
                    <Checkbox label="" type="checkbox" id="kasa_device_check" name="kasa_device_check" />
                )}
                currentPage={pageNo}
                onChangePage={setPageNo}
                pageSize={pageSize}
                onPageSize={setPageSize}
                totalCount={(() => {
                    return openAlertsCount;
                })()}
                showExternalButton={true}
                externalButtonObj={{
                    label: 'Acknowledged',
                    onClick: handleAcknowledgement,
                    isBtnDisabled: false,
                }}
            />
        </div>
    );
};

const ClosedAlerts = () => {
    const [closedAlertsList, setClosedAlersList] = useState([]);
    const [closedAlertsCount, setClosedAlertListsCount] = useState(0);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [checkedAll, setCheckedAll] = useState(false);

    const handleUnacknowledgement = () => {
        alert('Unacknowledged');
    };

    const currentRow = () => {
        return closedAlertsList;
    };

    return (
        <div className="custom-padding">
            <DataTableWidget
                id="closed_alerts_list"
                onSearch={(query) => {}}
                onStatus={(value) => {}}
                buttonGroupFilterOptions={[]}
                rows={currentRow()}
                disableColumnDragging={true}
                searchResultRows={currentRow()}
                headers={closedAlertsHeaderProps}
                filterOptions={[]}
                customCheckAll={() => (
                    <Checkbox
                        label=""
                        type="checkbox"
                        id="open_alerts"
                        name="open_alerts"
                        checked={checkedAll}
                        onChange={() => {
                            setCheckedAll(!checkedAll);
                        }}
                    />
                )}
                customCheckboxForCell={(record) => (
                    <Checkbox label="" type="checkbox" id="kasa_device_check" name="kasa_device_check" />
                )}
                currentPage={pageNo}
                onChangePage={setPageNo}
                pageSize={pageSize}
                onPageSize={setPageSize}
                totalCount={(() => {
                    return closedAlertsCount;
                })()}
                showExternalButton={true}
                externalButtonObj={{
                    label: 'Unacknowledged',
                    onClick: handleUnacknowledgement,
                    isBtnDisabled: false,
                }}
            />
        </div>
    );
};

const AlertSettings = () => {
    return <div className="custom-padding">Alert Settings Tab</div>;
};

const Alerts = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabSwitch = (event) => {
        setActiveTab(+event.target.id);
    };

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
                    <AlertHeader activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    {activeTab === 0 && <OpenAlerts />}
                    {activeTab === 1 && <ClosedAlerts />}
                    {activeTab === 2 && <AlertSettings />}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Alerts;
