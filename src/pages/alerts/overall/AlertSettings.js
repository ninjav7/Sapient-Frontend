import React, { useState } from 'react';

import Typography from '../../../sharedComponents/typography';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';

import { UserStore } from '../../../store/UserStore';

import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';
import { ReactComponent as EmailAddressSVG } from '../../../sharedComponents/assets/icons/email-address-icon.svg';

import { alertSettingsMock } from './mock';
import { TARGET_TYPES } from '../constants';
import { deleteConfiguredAlert } from '../services';

import DeleteAlert from './DeleteAlert';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertSettings = (props) => {
    const { getAllConfiguredAlerts } = props;

    const [alertSettingsList, setAlertSettingsList] = useState(alertSettingsMock);
    const [alertSettingsCount, setAlertSettingsCount] = useState(0);

    const [selectedAlertObj, setSelectedAlertObj] = useState({});

    console.log('SSR selectedAlertObj => ', selectedAlertObj);

    // Delete Device Modal states
    const [isDeleteAlertModalOpen, setDeleteAlertModalStatus] = useState(false);
    const closeDeleteAlertModal = () => setDeleteAlertModalStatus(false);
    const openDeleteAlertModal = () => setDeleteAlertModalStatus(true);

    const [isDeleting, setIsDeleting] = useState(false);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const renderAlertType = (row) => {
        return (
            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                {row?.target_type === TARGET_TYPES.BUILDING ? (
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

    const renderSentAddress = (row) => {
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
                    {`${row?.sent_to}`}
                </Typography.Body>
                <Typography.Body size={Typography.Sizes.sm} style={{ color: colorPalette.primaryGray400 }}>
                    {`Send if condition lasts 0 min, resend every 60 mins`}
                </Typography.Body>
            </div>
        );
    };

    const renderConditions = (row) => {
        return (
            <div style={{ maxWidth: '15vw' }}>
                <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray500 }}>
                    {`${row?.condition}`}
                </Typography.Body>
            </div>
        );
    };

    const handleDeleteClick = (record) => {
        setSelectedAlertObj(record);
        openDeleteAlertModal();
    };

    const currentRow = () => {
        return alertSettingsList;
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
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to delete Alert.'
                            : 'Unable to delete Alert due to Internal Server Error.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {})
            .finally(() => {
                setIsDeleting(false);
                closeDeleteAlertModal();
            });
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
                    },
                ]}
                filterOptions={[]}
                currentPage={pageNo}
                onChangePage={setPageNo}
                pageSize={pageSize}
                onPageSize={setPageSize}
                onDeleteRow={(record, id, row) => handleDeleteClick(row)}
                isDeletable={(row) => {
                    return true;
                }}
                totalCount={(() => {
                    return alertSettingsCount;
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
