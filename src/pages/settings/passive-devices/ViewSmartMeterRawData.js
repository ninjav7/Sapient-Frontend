import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import { pageListSizes } from '../../../helpers/helpers';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { DownloadButton } from './../../../sharedComponents/dataTableWidget/components/DownloadButton';
import { ReactComponent as RefreshSVG } from './../../../../src/assets/icon/refresh.svg';
import './styles.scss';

const ViewPassiveRawData = ({ isModalOpen, closeModal, selectedPassiveDevice }) => {
    const [isFetchingData, setDataFetching] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [isCSVDownloading, setCSVDownloading] = useState(false);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [rawDeviceData, setRawDeviceData] = useState([]);
    const [totalDataCount, setTotalDataCount] = useState(0);

    const currentRow = () => {
        return rawDeviceData;
    };

    // Define a custom CSS class for the modal content
    const customModalStyle = {
        modalContent: {
            minHeight: '90vh',
        },
    };

    return (
        <Modal show={isModalOpen} onHide={closeModal} backdrop="static" keyboard={false} size="xl" centered>
            <div className="modal-dialog-custom" style={customModalStyle.modalContent}>
                <div className="passive-header-wrapper d-flex justify-content-between" style={{ background: 'none' }}>
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
                                }}
                            />

                            <DownloadButton
                                isCSVDownloading={isCSVDownloading}
                                onClick={() => {
                                    setCSVDownloading(true);
                                }}
                            />
                        </div>
                    </div>

                    <DataTableWidget
                        id="raw_data_list"
                        isLoading={isFetchingData}
                        isLoadingComponent={<SkeletonLoader noOfColumns={5} noOfRows={10} />}
                        buttonGroupFilterOptions={[]}
                        rows={currentRow()}
                        disableColumnDragging={true}
                        searchResultRows={currentRow()}
                        headers={[
                            {
                                name: 'Timestamp',
                                accessor: 'time_stamp',
                            },
                            {
                                name: 'Gateway / MAC',
                                accessor: 'gateway_mac',
                            },
                            {
                                name: 'Firmware',
                                accessor: 'firmware',
                            },
                            {
                                name: 'CT Firmware',
                                accessor: 'ct_firmware',
                            },
                        ]}
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
        </Modal>
    );
};

export default ViewPassiveRawData;
