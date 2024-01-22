import React, { useState } from 'react';
import moment from 'moment';

import Typography from '../../../sharedComponents/typography';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../../sharedComponents/form/checkbox';
import SkeletonLoader from '../../../components/SkeletonLoader';

import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';

import { TARGET_TYPES } from '../constants';
import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const OpenAlerts = (props) => {
    const { alertsList = [], isProcessing = false, handleAlertAcknowledgement } = props;

    const [selectedAlertIds, setSelectedAlertIds] = useState([]);

    const [count, setCount] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(100);

    const handleAcknowledgement = (selectedIds) => {
        handleAlertAcknowledgement('acknowledged', selectedIds);
        setSelectedAlertIds([]);
    };

    const renderAlertType = (row) => {
        return (
            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                {row?.target_type === TARGET_TYPES.BUILDING ? (
                    <BuildingTypeSVG className="p-0 square" />
                ) : (
                    <EquipmentTypeSVG className="p-0 square" />
                )}
                <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                    {`${row?.target_description}`}
                </Typography.Body>
            </div>
        );
    };

    const renderTargetType = (row) => {
        const formattedText = `${row?.target_type?.charAt(0).toUpperCase()}${row?.target_type?.slice(1)}`;

        return (
            <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                {formattedText ? formattedText : '-'}
            </Typography.Body>
        );
    };

    const renderAlertTimestamp = (row) => {
        const data = moment(row?.created_at).fromNow();
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
                id="open_alerts_list"
                isLoading={isProcessing}
                isLoadingComponent={<SkeletonLoader noOfColumns={5} noOfRows={10} />}
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
                        callbackValue: renderTargetType,
                    },
                    {
                        name: 'Condition',
                        accessor: 'alert_condition_description',
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
                        id="open_alerts_check"
                        name="open_alerts_check"
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
                    label: 'Acknowledged',
                    onClick: () => {
                        handleAcknowledgement(selectedAlertIds);
                    },
                    isBtnDisabled: selectedAlertIds.length === 0,
                }}
            />
        </div>
    );
};

export default OpenAlerts;
