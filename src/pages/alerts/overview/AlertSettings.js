import React, { useState } from 'react';
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
import { deleteConfiguredAlert } from '../services';

import DeleteAlert from './DeleteAlert';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertSettings = (props) => {
    const { getAllConfiguredAlerts, configuredAlertsList = [] } = props;

    const history = useHistory();

    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedAlertObj, setSelectedAlertObj] = useState({});

    // Delete Device Modal states
    const [isDeleteAlertModalOpen, setDeleteAlertModalStatus] = useState(false);
    const closeDeleteAlertModal = () => setDeleteAlertModalStatus(false);
    const openDeleteAlertModal = () => setDeleteAlertModalStatus(true);

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
                    {`${row?.target_type === TARGET_TYPES.BUILDING ? 'Building' : 'Equipment'} of any type`}
                </Typography.Body>
            </div>
        );
    };

    const renderTargetType = (row) => {
        const { target_type = 'building' } = row;
        const formattedText = `${target_type?.charAt(0).toUpperCase()}${target_type?.slice(1)}`;

        return (
            <Typography.Body size={Typography.Sizes.lg} style={{ color: colorPalette.primaryGray700 }}>
                {formattedText ? formattedText : '-'}
            </Typography.Body>
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
        const data = moment(row?.created_at).fromNow();
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
                        accessor: 'target_type',
                        callbackValue: renderAlertType,
                    },
                    {
                        name: 'Target Type',
                        accessor: 'target_type',
                        callbackValue: renderTargetType,
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
                        callbackValue: renderAlertTimestamp,
                    },
                ]}
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
