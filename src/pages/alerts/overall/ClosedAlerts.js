import React, { useState } from 'react';
import moment from 'moment';

import Typography from '../../../sharedComponents/typography';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../../sharedComponents/form/checkbox';

import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const ClosedAlerts = (props) => {
    const { alertsList = [], isProcessing = false } = props;

    const [selectedAlertIds, setSelectedAlertIds] = useState([]);

    const [count, setCount] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleUnacknowledgement = (selectedIds) => {
        alert(`Total Alerts will be Unacknowledged : ${selectedIds.length}`);
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

    const handleAlertSelect = (isCurrentlyChecked, alertObj, currentSelectedAlertIds) => {
        if (alertObj?.id) {
            const newSelectedAlertIds =
                isCurrentlyChecked === 'false'
                    ? [...currentSelectedAlertIds, alertObj.id]
                    : currentSelectedAlertIds.filter((el) => el !== alertObj.id);
            setSelectedAlertIds(newSelectedAlertIds);
        }
    };

    const handleSelectAllAlerts = (isCurrentlyChecked, alertsList) => {
        const selectedAlertIds = isCurrentlyChecked === 'false' ? alertsList.map((el) => el?.id) : [];
        setSelectedAlertIds(selectedAlertIds);
    };

    const currentRow = () => {
        return alertsList;
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
                        id="closed_alerts"
                        name="closed_alerts"
                        checked={selectedAlertIds.length === alertsList.length}
                        value={selectedAlertIds.length === alertsList.length}
                        onClick={(e) => {
                            handleSelectAllAlerts(e.target.value, alertsList);
                        }}
                        disabled={alertsList.length === 0}
                    />
                )}
                customCheckboxForCell={(record) => (
                    <Checkbox
                        label=""
                        type="checkbox"
                        id="closed_alerts_check"
                        name="closed_alerts_check"
                        checked={selectedAlertIds.includes(record?.id)}
                        value={selectedAlertIds.includes(record?.id)}
                        onClick={(e) => {
                            handleAlertSelect(e.target.value, record, selectedAlertIds);
                        }}
                    />
                )}
                currentPage={pageNo}
                onChangePage={setPageNo}
                pageSize={pageSize}
                onPageSize={setPageSize}
                totalCount={(() => {
                    return count;
                })()}
                showExternalButton={true}
                externalButtonObj={{
                    label: 'Unacknowledged',
                    onClick: () => {
                        handleUnacknowledgement(selectedAlertIds);
                    },
                    isBtnDisabled: selectedAlertIds.length === 0,
                }}
            />
        </div>
    );
};

export default ClosedAlerts;
