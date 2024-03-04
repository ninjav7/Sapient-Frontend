import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import Typography from '../../../sharedComponents/typography';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import SkeletonLoader from '../../../components/SkeletonLoader';

import { UserStore } from '../../../store/UserStore';

import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';
import { ReactComponent as EmailAddressSVG } from '../../../sharedComponents/assets/icons/email-address-icon.svg';

import { separateEmails } from '../helpers';
import { timeZone } from '../../../utils/helper';
import { TARGET_TYPES } from '../constants';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import { getAlertSettingsCSVExport } from '../../../utils/tablesExport';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { fetchBuildingList } from '../../settings/buildings/services';
import { deleteConfiguredAlert, fetchAllConfiguredAlerts, fetchConfiguredEmailsList } from '../services';

import DeleteAlert from './DeleteAlert';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertSettings = (props) => {
    const { getAllConfiguredAlerts, isProcessing = false, configuredAlertsList = [] } = props;

    const history = useHistory();
    const { download } = useCSVDownload();

    const [search, setSearch] = useState('');
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedAlertObj, setSelectedAlertObj] = useState({});
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const targetTypes = [
        {
            label: 'Building',
            value: 'building',
        },
        {
            label: 'Equipment',
            value: 'equipment',
        },
    ];
    const [buildingsList, setBuildingsList] = useState([]);
    const [configuredEmailsList, setConfiguredEmailsList] = useState([]);

    const [selectedTargetType, setSelectedTargetType] = useState([]);
    const [selectedBuildingsList, setSelectedBuildingsList] = useState([]);

    // Delete Device Modal states
    const [isDeleteAlertModalOpen, setDeleteAlertModalStatus] = useState(false);
    const closeDeleteAlertModal = () => setDeleteAlertModalStatus(false);
    const openDeleteAlertModal = () => setDeleteAlertModalStatus(true);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [filterOptions, setFilterOptions] = useState([
        {
            label: 'Target Type',
            value: 'target_type',
            placeholder: 'All Target Types',
            filterType: FILTER_TYPES.MULTISELECT,
            filterOptions: targetTypes,
            onClose: (options) => {
                if (options && options.length !== 0) {
                    let targets = [];
                    for (let i = 0; i < options.length; i++) {
                        targets.push(options[i].value);
                    }
                    setPageNo(1);
                    setSelectedTargetType(targets);
                }
            },
            onDelete: () => {
                setPageNo(1);
                setSelectedTargetType([]);
            },
        },
        {
            label: 'Buildings',
            value: 'building',
            placeholder: 'All Buildings',
            filterType: FILTER_TYPES.MULTISELECT,
            filterOptions: buildingsList.map((el) => ({
                value: el?.building_id,
                label: el?.building_name,
            })),
            onClose: (options) => {
                if (options && options.length !== 0) {
                    let bldgIds = [];
                    for (let i = 0; i < options.length; i++) {
                        bldgIds.push(options[i].value);
                    }
                    setPageNo(1);
                    setSelectedBuildingsList(bldgIds);
                }
            },
            onDelete: () => {
                setPageNo(1);
                setSelectedBuildingsList([]);
            },
        },
        {
            label: 'Send To',
            value: 'send_to',
            placeholder: 'All Email IDs',
            filterType: FILTER_TYPES.MULTISELECT,
            filterOptions: [].map((el) => ({
                value: el?.id,
                label: el?.name,
            })),
            onClose: () => {},
            onDelete: () => {
                setPageNo(1);
            },
        },
    ]);

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

    const handleLastActiveDate = (createdAt) => {
        let dt = '-';

        if (createdAt) {
            const dateFormat = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM` : `MMM D`;
            const timeFormat = userPrefTimeFormat === `12h` ? `hh:mm A` : `HH:mm`;
            dt = moment.utc(createdAt).tz(timeZone).format(`${dateFormat} 'YY @ ${timeFormat}`);
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
                    data.forEach((el) => {
                        el.created_at_formatted = handleLastActiveDate(el?.created_at);
                    });
                    let csvData = getAlertSettingsCSVExport(data, headerProps);
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

    const getBuildingsList = async () => {
        await fetchBuildingList()
            .then((res) => {
                const data = res?.data;
                if (data && data.length !== 0) {
                    setBuildingsList(data);
                }
            })
            .catch(() => {})
            .finally(() => {});
    };

    const getConfiguredEmailsList = async (alertType) => {
        await fetchConfiguredEmailsList()
            .then((res) => {
                const response = res?.data;
                const { success: isSuccessful, data } = response;
                if (isSuccessful && data) {
                    const seperatedEmailIds = data.map((item) => item.split(',')).flat();
                    if (seperatedEmailIds && seperatedEmailIds.length !== 0) setConfiguredEmailsList(seperatedEmailIds);
                }
            })
            .catch(() => {});
    };

    useEffect(() => {
        getBuildingsList();
        getConfiguredEmailsList();
    }, []);

    useEffect(() => {
        if (buildingsList && buildingsList.length !== 0) {
            const updatedFilterOptions = filterOptions.map((option) => {
                if (option.value === 'building') {
                    return {
                        ...option,
                        filterOptions: buildingsList.map((el) => ({
                            value: el?.building_id,
                            label: el?.building_name,
                        })),
                    };
                }
                return option;
            });
            setFilterOptions(updatedFilterOptions);
        }
    }, [buildingsList]);

    useEffect(() => {
        if (configuredEmailsList && configuredEmailsList.length !== 0) {
            const updatedFilterOptions = filterOptions.map((option) => {
                if (option.value === 'send_to') {
                    return {
                        ...option,
                        filterOptions: configuredEmailsList.map((emailId) => ({
                            value: emailId,
                            label: emailId,
                        })),
                    };
                }
                return option;
            });
            setFilterOptions(updatedFilterOptions);
        }
    }, [configuredEmailsList]);

    useEffect(() => {
        getAllConfiguredAlerts({ search, selectedTargetType, selectedBuildingsList });
    }, [search, selectedTargetType, selectedBuildingsList]);

    return (
        <div className="custom-padding">
            <DataTableWidget
                id="alert_settings_list"
                isLoading={isProcessing}
                isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length + 1} noOfRows={10} />}
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
                filterOptions={filterOptions}
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
