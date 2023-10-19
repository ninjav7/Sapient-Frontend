import React, { useState } from 'react';
import moment from 'moment';

import Typography from '../../../sharedComponents/typography';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../../sharedComponents/form/checkbox';

import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';

import { openAlertsMockData } from './mock';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const OpenAlerts = () => {
    const [openAlertsList, setOpenAlertsList] = useState(openAlertsMockData);
    const [openAlertsCount, setOpenAlertListsCount] = useState(0);
    const [toBeAcknowledged, setToBeAcknowledged] = useState([]);

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
                    isBtnDisabled: toBeAcknowledged.length !== 0,
                }}
            />
        </div>
    );
};

export default OpenAlerts;
