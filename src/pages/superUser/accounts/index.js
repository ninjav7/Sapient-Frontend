import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { Cookies } from 'react-cookie';

import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';

import AddCustomer from './addCustomer';
import Brick from '../../../sharedComponents/brick';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../../../sharedComponents/trendsBadge';

import { ReactComponent as MiniLogo } from '../../../assets/icon/miniLogo.svg';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { ReactComponent as InactiveSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as ActiveSVG } from '../../../assets/icon/circle-check.svg';

import { getCustomerListCSVExport } from '../../../utils/tablesExport';
import { percentageHandler, timeZone } from '../../../utils/helper';
import { formatConsumptionValue } from '../../../helpers/helpers';
import { fetchCustomerList, fetchSelectedCustomer, fetchOfflineDevices } from './services';

import colorPalette from '../../../assets/scss/_colors.scss';
import './style.scss';

const Accounts = () => {
    const { download } = useCSVDownload();

    const [totalItems, setTotalItems] = useState(0);
    const [customersList, setCustomersList] = useState([]);
    const [isFetchingCustomersList, setFetchingCustomersList] = useState(false);

    const [isCustomerModalOpen, setCustomerModal] = useState(false);
    const openCustomerModal = () => setCustomerModal(true);
    const closeCustomerModal = () => setCustomerModal(false);

    const [selectedStatus, setSelectedStatus] = useState(0);

    const [sortBy, setSortBy] = useState({});
    const [search, setSearch] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const fetchTrendBadgeType = (now, old) => {
        if (now > old) return TRENDS_BADGE_TYPES.UPWARD_TREND;
        if (now < old) return TRENDS_BADGE_TYPES.DOWNWARD_TREND;
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Accounts',
                    path: '/super-user/accounts',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'account';
        });
    };

    const getOfflineDevices = async (latestCustomersList) => {
        await fetchOfflineDevices()
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    const devicesList = response?.data;

                    if (latestCustomersList.length !== 0 && devicesList.length !== 0) {
                        let newMappedCustomerList = latestCustomersList;

                        newMappedCustomerList.forEach((customer) => {
                            const deviceObj = devicesList.find((device) => device?.vendor_id === customer?.vendor_id);
                            if (deviceObj?.vendor_id) {
                                customer.offline_active_devices = deviceObj?.offline_active_devices;
                                customer.offline_passive_devices = deviceObj?.offline_passive_devices;
                            }
                        });

                        setCustomersList(newMappedCustomerList);
                    }
                }
            })
            .catch((error) => {})
            .finally(() => {});
    };

    const getCustomersList = async () => {
        setFetchingCustomersList(true);
        setCustomersList([]);

        const ordered_by = sortBy?.name === undefined || sortBy?.method === null ? 'vendor_name' : sortBy?.name;
        const sort_by = sortBy?.method === undefined || sortBy?.method === null ? 'ace' : sortBy?.method;

        const params = `?customer_search=${search}&timezone=${timeZone}&page_no=${pageNo}&page_size=${pageSize}&ordered_by=${ordered_by}&sort_by=${sort_by}`;

        await fetchCustomerList(params)
            .then(async (res) => {
                const response = res?.data;

                if (response?.success) {
                    let responseData = response?.data;

                    responseData.forEach((el) => {
                        el.total_usage = el?.total_usage / 1000;
                        el.old_usage = el?.old_usage / 1000;
                    });

                    if (responseData) {
                        setCustomersList(responseData);
                        getOfflineDevices(responseData);
                    }
                    if (response?.total_data) setTotalItems(response?.total_data);
                }
            })
            .catch((error) => {})
            .finally(() => {
                setFetchingCustomersList(false);
            });
    };

    const handleDownloadCsv = async () => {
        setDownloadingCSVData(true);
        const params = `?timezone=${timeZone}`;

        await fetchCustomerList(params)
            .then((res) => {
                const responseData = res.data;
                download(
                    `Customer_Accounts_${new Date().toISOString().split('T')[0]}`,
                    getCustomerListCSVExport(responseData?.data, headerProps)
                );
            })
            .catch((error) => {})
            .finally(() => {
                setDownloadingCSVData(false);
            });
    };

    const redirectToVendorPage = async (vendorID) => {
        localStorage.removeItem('vendorName');
        localStorage.removeItem('daysCount');
        localStorage.removeItem('filterPeriod');
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
        if (vendorID === '' || vendorID === null) {
            return '';
        }
        localStorage.setItem('vendorId', vendorID);
        let params = `?vendor_id=${vendorID}`;
        await fetchSelectedCustomer(params)
            .then((res) => {
                let response = res.data;
                localStorage.setItem('vendorName', response?.data.vendor_name);
                window.open(`/energy/portfolio/overview`, '_blank');
            })
            .catch((error) => {});
    };

    const renderActiveDevices = (row) => (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Typography.Body size={Typography.Sizes.md} className="mt-1">
                    {row?.active_devices}
                </Typography.Body>
                {row?.offline_active_devices > 0 ? (
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex offline-container justify-content-center"
                        style={{ color: colorPalette.error700 }}>
                        {row?.offline_active_devices} offline
                    </Typography.Subheader>
                ) : null}
            </div>
        </>
    );

    const renderPassiveDevices = (row) => (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Typography.Body size={Typography.Sizes.md} className="mt-1">
                    {row?.passive_devices}
                </Typography.Body>
                {row?.offline_passive_devices > 0 ? (
                    <Typography.Body
                        size={Typography.Sizes.md}
                        className="d-flex offline-container justify-content-center"
                        style={{ color: colorPalette.error700 }}>
                        {row?.offline_passive_devices} offline
                    </Typography.Body>
                ) : null}
            </div>
        </>
    );

    const renderStatus = (row) => (
        <Typography.Body
            size={Typography.Sizes.md}
            className={`d-flex justify-content-center align-items-center 
                    ${row?.status ? `active-container` : `inactive-container`}`}
            style={{
                color: row?.status ? colorPalette.success700 : colorPalette.primaryGray800,
                cursor: 'pointer',
            }}>
            {row?.status ? <ActiveSVG width={20} height={15} /> : <InactiveSVG width={20} height={15} />}
            {row?.status ? `Active` : `Inactive`}
        </Typography.Body>
    );

    const renderAccountID = (row) => (
        <Typography.Body size={Typography.Sizes.md}>{row?.vendor_id === '' ? '-' : row?.vendor_id}</Typography.Body>
    );

    const renderAccountName = (row) => (
        <Typography.Link
            size={Typography.Sizes.md}
            className="mouse-pointer"
            onClick={() => redirectToVendorPage(row?.vendor_id)}>
            {row?.vendor_name === '' ? '-' : row?.vendor_name}
        </Typography.Link>
    );

    const renderEnergy = (row) => (
        <>
            <Row style={{ padding: '0.5rem 0.625rem' }}>
                <Typography.Body size={Typography.Sizes.md} className="mr-2">
                    {formatConsumptionValue(row.total_usage, 2)} kWh
                </Typography.Body>
                <TrendsBadge
                    value={percentageHandler(row?.total_usage, row?.old_usage)}
                    type={fetchTrendBadgeType(row?.total_usage, row?.old_usage)}
                />
            </Row>
        </>
    );

    const renderActions = (row) => (
        <Button
            label="View"
            size={Button.Sizes.lg}
            className="sub-button w-75"
            type={Button.Type.secondaryGrey}
            icon={<MiniLogo width={20} height={20} />}
            onClick={() => {
                redirectToVendorPage(row?.vendor_id);
            }}
        />
    );

    const headerProps = [
        {
            name: 'Account ID',
            accessor: 'vendor_id',
            callbackValue: renderAccountID,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Account Name',
            accessor: 'vendor_name',
            callbackValue: renderAccountName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Status',
            accessor: 'status',
            callbackValue: renderStatus,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Smart Plugs',
            accessor: 'active_devices',
            callbackValue: renderActiveDevices,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Smart Meters',
            accessor: 'passive_devices',
            callbackValue: renderPassiveDevices,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Energy Used kWh',
            accessor: 'total_usage',
            callbackValue: renderEnergy,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Actions',
            accessor: 'actions',
            callbackValue: renderActions,
        },
    ];

    const pageListSizes = [
        {
            label: '20 Rows',
            value: '20',
        },
        {
            label: '50 Rows',
            value: '50',
        },
        {
            label: '100 Rows',
            value: '100',
        },
    ];

    const currentRow = () => {
        if (selectedStatus === 0) return customersList.filter((el) => el?.status);
        if (selectedStatus === 1) return customersList.filter((el) => !el?.status);
        if (selectedStatus === 2) return customersList;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        getCustomersList();
    }, [search, pageNo, pageSize, sortBy]);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Accounts</Typography.Header>
                        </div>
                        <div className="d-flex">
                            <Button
                                label={'Add Customer'}
                                size={Button.Sizes.md}
                                type={Button.Type.primary}
                                onClick={openCustomerModal}
                                icon={<PlusSVG />}
                            />
                        </div>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        id="admin-accounts"
                        isLoading={isFetchingCustomersList}
                        isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length} noOfRows={15} />}
                        onSearch={(query) => {
                            setPageNo(1);
                            setPageSize(20);
                            setSearch(query);
                        }}
                        isCSVDownloading={isCSVDownloading}
                        onDownload={() => handleDownloadCsv()}
                        buttonGroupFilterOptions={[{ label: 'Active' }, { label: 'Inactive' }, { label: 'All' }]}
                        onStatus={setSelectedStatus}
                        onPageSize={(currentPageSize) => {
                            setPageNo(1);
                            setPageSize(currentPageSize);
                        }}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        currentPage={pageNo}
                        pageListSizes={pageListSizes}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        headers={headerProps}
                        totalCount={(() => {
                            return totalItems;
                        })()}
                    />
                </Col>
            </Row>

            <AddCustomer
                isAddCustomerOpen={isCustomerModalOpen}
                closeAddCustomerModal={closeCustomerModal}
                getCustomerList={getCustomersList}
                pageSize={setPageSize}
                pageNo={setPageNo}
            />
        </React.Fragment>
    );
};

export default Accounts;
