import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import Typography from '../../../sharedComponents/typography';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';

import { UserStore } from '../../../store/UserStore';

import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';
import { ReactComponent as EmailAddressSVG } from '../../../sharedComponents/assets/icons/email-address-icon.svg';

import { separateEmails } from '../helpers';
import { TARGET_TYPES } from '../constants';
import { getAlertSettingsCSVExport } from '../../../utils/tablesExport';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { deleteConfiguredAlert, fetchAllConfiguredAlerts } from '../services';

import DeleteAlert from './DeleteAlert';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertSettings = (props) => {
    const { getAllConfiguredAlerts, configuredAlertsList = [] } = props;

    const history = useHistory();
    const { download } = useCSVDownload();

    const [search, setSearch] = useState('');
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedAlertObj, setSelectedAlertObj] = useState({});

    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    // Delete Device Modal states
    const [isDeleteAlertModalOpen, setDeleteAlertModalStatus] = useState(false);
    const closeDeleteAlertModal = () => setDeleteAlertModalStatus(false);
    const openDeleteAlertModal = () => setDeleteAlertModalStatus(true);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const renderAlertType = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                {row?.name ?? '-'}
            </Typography.Body>
        );
    };

    const renderTargetCount = (row) => {
        let totalCount = 0;

        if (row?.target_type === TARGET_TYPES.BUILDING) totalCount = row?.building_ids.length ?? 0;
        if (row?.target_type === TARGET_TYPES.EQUIPMENT) totalCount = row?.equipment_ids.length ?? 0;

        return (
            <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                {totalCount}
            </Typography.Body>
        );
    };

    const renderTargetType = (row) => {
        const { target_type = 'building' } = row;
        const formattedText = `${target_type?.charAt(0).toUpperCase()}${target_type?.slice(1)}`;

        return (
            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                {row?.target_type === TARGET_TYPES.BUILDING ? (
                    <BuildingTypeSVG className="p-0 square" />
                ) : (
                    <EquipmentTypeSVG className="p-0 square" />
                )}
                <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                    {formattedText ? formattedText : '-'}
                </Typography.Body>
            </div>
        );
    };

    const renderSentAddress = (row) => {
        const emailIds = separateEmails(row?.alert_emails);
        let renderText = '';
        if (emailIds.length === 0) renderText = `No Email Address configured`;
        if (emailIds.length === 1) renderText = emailIds[0];
        if (emailIds.length > 1) renderText = `Email Addresses configured: ${emailIds.length}`;

        return (
            <div>
                <div className="d-flex align-items-center" style={{ gap: '0.50rem' }}>
                    <EmailAddressSVG className="p-0 square" />
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        style={{ color: colorPalette.primaryGray600, fontWeight: 500 }}>
                        {`Email Address`}
                    </Typography.Subheader>
                </div>

                <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray500 }}>
                    {renderText}
                </Typography.Body>
                {row?.alert_reccurence && (
                    <Typography.Body size={Typography.Sizes.sm} style={{ color: colorPalette.primaryGray400 }}>
                        {/* {`Send if condition lasts 0 min, resend every 60 mins`} */}
                        {`Resend alert every ${row?.alert_reccurence_minutes} mins`}
                    </Typography.Body>
                )}
            </div>
        );
    };

    const renderAlertTimestamp = (row) => {
        const data = moment.utc(row?.created_at).fromNow();
        return <Typography.Body size={Typography.Sizes.lg}>{data}</Typography.Body>;
    };

    const renderConditions = (row) => {
        return (
            <div style={{ maxWidth: '15vw' }}>
                <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray500 }}>
                    {row?.alert_condition_description ? row?.alert_condition_description : '-'}
                </Typography.Body>
            </div>
        );
    };

    const handleEditClick = (record) => {
        record?.id && history.push({ pathname: `/alerts/overview/alert/edit/${record?.id}` });
    };

    const handleDeleteClick = (record) => {
        setSelectedAlertObj(record);
        openDeleteAlertModal();
    };

    const currentRow = () => {
        return configuredAlertsList;
    };

    const headerProps = [
        {
            name: 'Alert Name',
            accessor: 'name',
            callbackValue: renderAlertType,
        },
        {
            name: 'Target Count',
            accessor: 'target_count',
            callbackValue: renderTargetCount,
        },
        {
            name: 'Target Type',
            accessor: 'target_type',
            callbackValue: renderTargetType,
        },
        {
            name: 'Condition',
            accessor: 'alert_condition_description',
            callbackValue: renderConditions,
        },
        {
            name: 'Sent To',
            accessor: 'sent_to',
            callbackValue: renderSentAddress,
        },
        {
            name: 'Created',
            accessor: 'created_at',
            callbackValue: renderAlertTimestamp,
        },
    ];

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
            dt = '-';
        }
        return dt;
    };

    const handleDownloadCsv = async () => {
        setDownloadingCSVData(true);

        await fetchAllConfiguredAlerts()
            .then((res) => {
                const response = res?.data;
                const { success: isSuccessful, data } = response;
                if (isSuccessful && data) {
                    let csvData = getAlertSettingsCSVExport(data, headerProps, handleLastActiveDate);
                    download(`Alerts_Portfolio_${new Date().toISOString().split('T')[0]}`, csvData);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDownloadingCSVData(false);
            });
    };

    const handleAlertDeletion = async (alert_id) => {
        if (!alert_id) return;

        setIsDeleting(true);
        const params = `?alert_id=${alert_id}`;

        await deleteConfiguredAlert(params)
            .then((res) => {
                const response = res?.data;

                if (response?.success) {
                    getAllConfiguredAlerts();
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Alert deleted successfully.';
                        s.notificationType = 'success';
                    });
                    window.scrollTo(0, 0);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Unable to delete Alert due to Internal Server Error.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to delete Alert due to Internal Server Error.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setIsDeleting(false);
                closeDeleteAlertModal();
            });
    };

    useEffect(() => {
        getAllConfiguredAlerts({ search });
    }, [search]);

    return (
        <div className="custom-padding">
            <DataTableWidget
                id="alert_settings_list"
                onStatus={(value) => {}}
                buttonGroupFilterOptions={[]}
                onSearch={(query) => {
                    setPageNo(1);
                    setSearch(query);
                }}
                isCSVDownloading={isCSVDownloading}
                onDownload={handleDownloadCsv}
                rows={currentRow()}
                disableColumnDragging={true}
                searchResultRows={currentRow()}
                headers={headerProps}
                filterOptions={[]}
                currentPage={pageNo}
                onChangePage={setPageNo}
                pageSize={pageSize}
                onPageSize={setPageSize}
                onEditRow={(record, id, row) => handleEditClick(row)}
                isEditable={(row) => {
                    return true;
                }}
                onDeleteRow={(record, id, row) => handleDeleteClick(row)}
                isDeletable={(row) => {
                    return true;
                }}
                totalCount={(() => {
                    return configuredAlertsList.length;
                })()}
            />

            <DeleteAlert
                isModalOpen={isDeleteAlertModalOpen}
                closeModal={closeDeleteAlertModal}
                selectedAlertObj={selectedAlertObj}
                handleAlertDeletion={handleAlertDeletion}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default AlertSettings;
