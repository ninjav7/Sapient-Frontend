import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../../sharedComponents/form/checkbox';

import { UserStore } from '../../../store/UserStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';

import { alertSettingsHeaderProps } from './constants';
import { openAlertsMockData } from './mock';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertHeader = (props) => {
    const history = useHistory();
    const { activeTab = false, handleTabSwitch } = props;

    return (
        <div className="alerts-header-wrapper d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between">
                <Typography.Header
                    size={Typography.Sizes.lg}
                    style={{ color: colorPalette.primaryGray700 }}
                    className="font-weight-bold">{`Alerts`}</Typography.Header>
                <div className="d-flex">
                    <Button
                        label={'Add Alert'}
                        size={Button.Sizes.md}
                        type={Button.Type.primary}
                        icon={<PlusSVG />}
                        onClick={() => {
                            history.push({ pathname: '/alerts/overall/add-alert' });
                        }}
                    />
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

const OpenAlerts = ({ handleLastActiveDate }) => {
    const [openAlertsList, setOpenAlertsList] = useState(openAlertsMockData);
    const [openAlertsCount, setOpenAlertListsCount] = useState(0);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [checkedAll, setCheckedAll] = useState(false);

    const handleAcknowledgement = () => {
        alert('Acknowledged');
    };

    const renderAlertType = (row) => {
        return (
            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                {row?.target_type === 'Building' ? (
                    <BuildingTypeSVG className="p-0 square" />
                ) : (
                    <EquipmentTypeSVG className="p-0 square" />
                )}
                <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                    {`${row?.target}`}
                </Typography.Body>
            </div>
        );
    };

    const renderAlertTimestamp = (row) => {
        const data = moment(row?.timestamps).fromNow();
        return <Typography.Body size={Typography.Sizes.lg}>{data}</Typography.Body>;
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
                headers={[
                    {
                        name: 'Target',
                        accessor: 'target',
                        callbackValue: renderAlertType,
                    },
                    {
                        name: 'Target Type',
                        accessor: 'target_type',
                    },
                    {
                        name: 'Condition',
                        accessor: 'condition',
                    },
                    {
                        name: 'Timestamps',
                        accessor: 'timestamps',
                        callbackValue: renderAlertTimestamp,
                    },
                ]}
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

const ClosedAlerts = ({ handleLastActiveDate }) => {
    const [closedAlertsList, setClosedAlertsList] = useState(openAlertsMockData);
    const [closedAlertsCount, setClosedAlertListsCount] = useState(0);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [checkedAll, setCheckedAll] = useState(false);

    const handleUnacknowledgement = () => {
        alert('Unacknowledged');
    };

    const renderAlertType = (row) => {
        return (
            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                {row?.target_type === 'Building' ? (
                    <BuildingTypeSVG className="p-0 square" />
                ) : (
                    <EquipmentTypeSVG className="p-0 square" />
                )}
                <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                    {`${row?.target}`}
                </Typography.Body>
            </div>
        );
    };

    const renderAlertTimestamp = (row) => {
        const data = moment(row?.timestamps).fromNow();
        return <Typography.Body size={Typography.Sizes.lg}>{data}</Typography.Body>;
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
                headers={[
                    {
                        name: 'Target',
                        accessor: 'target',
                        callbackValue: renderAlertType,
                    },
                    {
                        name: 'Target Type',
                        accessor: 'target_type',
                    },
                    {
                        name: 'Condition',
                        accessor: 'condition',
                    },
                    {
                        name: 'Timestamps',
                        accessor: 'timestamps',
                        callbackValue: renderAlertTimestamp,
                    },
                ]}
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
    const [alertSettingsList, setAlertSettingsList] = useState([]);
    const [alertSettingsCount, setAlertSettingsCount] = useState(0);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [checkedAll, setCheckedAll] = useState(false);

    const currentRow = () => {
        return alertSettingsList;
    };

    return (
        <div className="custom-padding">
            <DataTableWidget
                id="alert_settings_list"
                onSearch={(query) => {}}
                onStatus={(value) => {}}
                buttonGroupFilterOptions={[]}
                isCSVDownloading={false}
                onDownload={() => alert('Download CSV')}
                rows={currentRow()}
                disableColumnDragging={true}
                searchResultRows={currentRow()}
                headers={alertSettingsHeaderProps}
                filterOptions={[]}
                currentPage={pageNo}
                onChangePage={setPageNo}
                pageSize={pageSize}
                onPageSize={setPageSize}
                onDeleteRow={() => alert('Delete record')}
                isDeletable={true}
                totalCount={(() => {
                    return alertSettingsCount;
                })()}
            />
        </div>
    );
};

const Alerts = () => {
    const [activeTab, setActiveTab] = useState(0);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    const handleLastActiveDate = (last_login) => {
        let dt = '';
        if (isValidDate(new Date(last_login)) && last_login != null) {
            const last_dt = new Date(last_login);
            const dateFormat = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM` : `MMM D`;
            const timeFormat = userPrefTimeFormat === `12h` ? `hh:mm A` : `HH:mm`;
            dt = moment.utc(last_dt).format(`${dateFormat} 'YY @ ${timeFormat}`);
        } else {
            dt = 'Never';
        }
        return dt;
    };

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
                    {activeTab === 0 && <OpenAlerts handleLastActiveDate={handleLastActiveDate} />}
                    {activeTab === 1 && <ClosedAlerts handleLastActiveDate={handleLastActiveDate} />}
                    {activeTab === 2 && <AlertSettings />}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Alerts;
