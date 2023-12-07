import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import 'moment-timezone';

import { UserStore } from '../../../store/UserStore.js';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload.js';
import { BuildingStore } from '../../../store/BuildingStore.js';
import { getRawDeviceDataTableCSVExport } from '../../../utils/tablesExport.js';

import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import { pageListSizes } from '../../../helpers/helpers';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { DownloadButton } from './../../../sharedComponents/dataTableWidget/components/DownloadButton';

import ViewSensorData from './ViewSensorData.js';

import { ReactComponent as RefreshSVG } from './../../../../src/assets/icon/refresh.svg';

import { getDeviceRawData } from './services.js';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const ViewPassiveRawData = ({ isModalOpen, closeModal, bldgTimezone, selectedPassiveDevice }) => {
    const { download } = useCSVDownload();
    const bldgName = BuildingStore.useState((s) => s.BldgName);

    const [isFetchingData, setDataFetching] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [isCSVDownloading, setCSVDownloading] = useState(false);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [rawDeviceData, setRawDeviceData] = useState([]);
    const [totalDataCount, setTotalDataCount] = useState(0);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    // Define a custom CSS class for the modal content
    const customModalStyle = {
        modalContent: {
            height: '90vh',
            overflowY: 'auto', // Enable vertical scrolling when content exceeds the height
        },
    };

    const currentRow = () => {
        return rawDeviceData;
    };

    const fetchRawDataForDevice = async (bldg_id, device_id, page_no = 1, page_size = 20, bldg_tz) => {
        setDataFetching(true);
        setTotalDataCount(0);
        setRawDeviceData([]);
        const params = `?building_id=${bldg_id}&device_id=${device_id}&page_no=${page_no}&page_size=${page_size}&tz_info=${bldg_tz}`;

        await getDeviceRawData(params)
            .then((res) => {
                const response = res?.data;
                if (response?.total_count) setTotalDataCount(response?.total_count);
                if (response) {
                    if (response?.data.length !== 0) setRawDeviceData(response?.data);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Unable to update Raw Data for due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to update Raw Data for due to Internal Server Error!.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setDataFetching(false);
                setProcessing(false);
            });
    };

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

    const renderRawDataTimestamp = (row) => {
        const formattedTimestamp = handleLastActiveDate(row?.time_stamp);

        return (
            <Typography.Body size={Typography.Sizes.md} className="mouse-pointer">
                {row?.time_stamp === '' ? '-' : formattedTimestamp}
            </Typography.Body>
        );
    };

    const renderGatewayMac = (row) => {
        return (
            <div size={Typography.Sizes.md} className="mouse-pointer">
                {row?.gateway_mac === '' ? '-' : row?.gateway_mac}
            </div>
        );
    };

    const renderSensorData = (row) => {
        return (
            <div
                size={Typography.Sizes.md}
                className="typography-wrapper link mouse-pointer"
                style={{ color: colorPalette?.datavizBlue500 }}>
                View
            </div>
        );
    };

    const headerProps = [
        {
            name: 'Timestamp',
            accessor: 'time_stamp',
            callbackValue: renderRawDataTimestamp,
        },
        {
            name: 'Gateway / MAC',
            accessor: 'gateway_mac',
            callbackValue: renderGatewayMac,
        },
        {
            name: 'Firmware',
            accessor: 'firmware',
        },
        {
            name: 'Sensor Type',
            accessor: 'sensor_type',
        },
        {
            name: 'Counter',
            accessor: 'counter',
        },
        {
            name: 'RSSI',
            accessor: 'rssi',
        },
        {
            name: 'Sensor Data',
            accessor: 'sensor_data',
            callbackValue: renderSensorData,
        },
    ];

    const downloadRawDataForCSVExport = async (bldg_id, device_id, bldg_tz) => {
        setCSVDownloading(true);
        const params = `?building_id=${bldg_id}&device_id=${device_id}&tz_info=${bldg_tz}`;

        await getDeviceRawData(params)
            .then((res) => {
                const responseData = res?.data?.data;

                if (responseData) {
                    const csvData = getRawDeviceDataTableCSVExport(responseData, headerProps);
                    download(`${bldgName}_Device_Raw_Data_${new Date().toISOString().split('T')[0]}`, csvData);
                }
            })
            .catch(() => {})
            .finally(() => {
                setCSVDownloading(false);
            });
    };

    useEffect(() => {
        if (!isModalOpen) setRawDeviceData([]);
    }, [isModalOpen]);

    useEffect(() => {
        if (selectedPassiveDevice?.equipments_id && selectedPassiveDevice?.bldg_id) {
            fetchRawDataForDevice(
                selectedPassiveDevice?.bldg_id,
                selectedPassiveDevice?.equipments_id,
                pageNo,
                pageSize,
                bldgTimezone
            );
        }
    }, [selectedPassiveDevice, pageNo, pageSize, bldgTimezone]);

    return (
        <>
            <Modal show={isModalOpen} onHide={closeModal} backdrop="static" keyboard={false} size="xl" centered>
                <div className="modal-dialog-custom" style={customModalStyle.modalContent}>
                    <div
                        className="passive-header-wrapper d-flex justify-content-between"
                        style={{ background: 'none' }}>
                        <div className="d-flex flex-column justify-content-between">
                            <Typography.Subheader size={Typography.Sizes.sm}>
                                {selectedPassiveDevice?.location}
                            </Typography.Subheader>
                            <Typography.Header size={Typography.Sizes.md}>
                                {selectedPassiveDevice?.identifier}
                            </Typography.Header>
                            <div className="d-flex justify-content-start mouse-pointer ">
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className="typography-wrapper active-tab-style">
                                    {`Raw Data`}
                                </Typography.Subheader>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div>
                                <Button
                                    label="Close"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={closeModal}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="default-padding">
                        <div className="d-flex justify-content-between">
                            <div></div>
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Button
                                    label={''}
                                    type={Button.Type.secondaryGrey}
                                    size={Button.Sizes.md}
                                    icon={!isProcessing ? <RefreshSVG /> : <Spinner size="sm" color="secondary" />}
                                    className="data-table-widget-action-button"
                                    onClick={() => {
                                        setProcessing(true);
                                        fetchRawDataForDevice(
                                            selectedPassiveDevice?.bldg_id,
                                            selectedPassiveDevice?.equipments_id,
                                            pageNo,
                                            pageSize,
                                            bldgTimezone
                                        );
                                    }}
                                />
                                <DownloadButton
                                    isCSVDownloading={isCSVDownloading}
                                    onClick={() => {
                                        downloadRawDataForCSVExport(
                                            selectedPassiveDevice?.bldg_id,
                                            selectedPassiveDevice?.equipments_id,
                                            bldgTimezone
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="raw-data-table-container">
                            <DataTableWidget
                                id="raw_data_list"
                                isLoading={isFetchingData}
                                isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length} noOfRows={10} />}
                                buttonGroupFilterOptions={[]}
                                rows={currentRow()}
                                disableColumnDragging={true}
                                searchResultRows={currentRow()}
                                headers={headerProps}
                                currentPage={pageNo}
                                onChangePage={setPageNo}
                                pageSize={pageSize}
                                onPageSize={setPageSize}
                                pageListSizes={pageListSizes}
                                totalCount={(() => {
                                    return totalDataCount;
                                })()}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            <ViewSensorData />
        </>
    );
};

export default ViewPassiveRawData;
