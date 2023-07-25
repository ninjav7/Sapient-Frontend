import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { useHistory } from 'react-router-dom';
import colorPalette from '../../../assets/scss/_colors.scss';
import { ReactComponent as MiniLogo } from '../../../assets/icon/miniLogo.svg';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { ReactComponent as InactiveSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as ActiveSVG } from '../../../assets/icon/circle-check.svg';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../../../sharedComponents/trendsBadge';
import { fetchCustomerList, fetchSelectedCustomer, fetchOfflineDevices } from './services';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { getCustomerListCSVExport } from '../../../utils/tablesExport';
import 'moment-timezone';
import { percentageHandler, timeZone } from '../../../utils/helper';
import AddCustomer from './addCustomer';
import Brick from '../../../sharedComponents/brick';
import { formatConsumptionValue } from '../../../helpers/helpers';
import './style.scss';

const SkeletonLoading = () => (
    <SkeletonTheme color="$primary-gray-1000" height={35}>
        <tr>
            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>
            <th>
                <Skeleton count={5} />
            </th>
            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);

const Accounts = () => {
    // Modal states

    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const history = useHistory();

    const [isUserDataFetched, setIsUserDataFetched] = useState(false);
    const [openCustomer, setOpenCustomer] = useState(false);

    const closeAddCustomer = () => setOpenCustomer(false);
    const [userData, setUserData] = useState([]);
    const [offlineData, setOfflineData] = useState([]);

    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [search, setSearch] = useState('');
    const { download } = useCSVDownload();
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState({});

    const fetchTrendBadgeType = (now, old) => {
        if (now > old) return TRENDS_BADGE_TYPES.UPWARD_TREND;
        if (now < old) return TRENDS_BADGE_TYPES.DOWNWARD_TREND;
    };

    useEffect(() => {
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
        updateBreadcrumbStore();
    }, []);

    const getCustomerList = async () => {
        setIsUserDataFetched(true);
        const ordered_by = sortBy.name === undefined || sortBy.method === null ? 'vendor_name' : sortBy.name;
        const sort_by = sortBy.method === undefined || sortBy.method === null ? 'ace' : sortBy.method;
        let params = `?customer_search=${search}&timezone=${timeZone}&page_no=${pageNo}&page_size=${pageSize}&ordered_by=${ordered_by}&sort_by=${sort_by}`;
        await fetchCustomerList(params)
            .then(async (res) => {
                let response = res.data;
                let userDt = response?.data;

                let allArr = [];
                userDt.map((ele) => {
                    let match = offlineData.filter((el) => el?.vendor_id === ele?.vendor_id);
                    if (match.length > 0)
                        allArr.push({
                            active_devices: ele?.active_devices,
                            passive_devices: ele?.passive_devices,
                            status: ele?.status,
                            total_usage: ele?.total_usage / 1000,
                            old_usage: ele?.old_usage / 1000,
                            vendor_id: ele?.vendor_id,
                            vendor_name: ele?.vendor_name,
                            offline_active_devices: match[0]?.offline_active_devices,
                            offline_passive_devices: match[0]?.offline_passive_devices,
                        });
                });
                setTotalItems(response?.total_data);
                setUserData(allArr);
                setIsUserDataFetched(false);
            })
            .catch((error) => {
                setIsUserDataFetched(false);
            });
    };
    const getOfflineDevices = async () => {
        setIsUserDataFetched(true);
        await fetchOfflineDevices()
            .then((res) => {
                let response = res.data;
                setOfflineData(response?.data);
                setIsUserDataFetched(false);
            })
            .catch((error) => {
                setIsUserDataFetched(false);
            });
    };

    useEffect(() => {
        getOfflineDevices();
    }, []);

    useEffect(() => {
        if (offlineData.length !== 0) getCustomerList();
    }, [search, offlineData, pageNo, pageSize, sortBy]);

    const handleDownloadCsv = async () => {
        const search = '';
        await fetchCustomerList(search)
            .then((res) => {
                const responseData = res.data;
                download(
                    `Customer_Accounts_${new Date().toISOString().split('T')[0]}`,
                    getCustomerListCSVExport(responseData?.data, headerProps)
                );
            })
            .catch((error) => {});
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
            .catch((error) => {
                setIsUserDataFetched(false);
            });
    };

    const currentRow = () => {
        if (selectedStatus === 2) return userData;
        else if (selectedStatus === 0) {
            return userData.filter((ele) => ele?.status === true);
        } else {
            return userData.filter((ele) => ele?.status === false);
        }
    };

    const renderActiveDevices = (row) => {
        return (
            <>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography.Body size={Typography.Sizes.sm} className="mt-1">
                        {row?.active_devices}
                    </Typography.Body>
                    {row?.offline_active_devices > 0 ? (
                        <Typography.Subheader
                            size={Typography.Sizes.sm}
                            className="d-flex offline-container justify-content-center"
                            style={{ color: colorPalette.error700 }}>
                            {row?.offline_active_devices} offline
                        </Typography.Subheader>
                    ) : null}
                </div>
            </>
        );
    };

    const renderPassiveDevices = (row) => {
        return (
            <>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography.Body size={Typography.Sizes.sm} className="mt-1">
                        {row?.passive_devices}
                    </Typography.Body>
                    {row?.offline_passive_devices > 0 ? (
                        <Typography.Subheader
                            size={Typography.Sizes.sm}
                            className="d-flex offline-container justify-content-center"
                            style={{ color: colorPalette.error700 }}>
                            {row?.offline_passive_devices} offline
                        </Typography.Subheader>
                    ) : null}
                </div>
            </>
        );
    };

    const renderStatus = (row) => {
        if (row?.status === false) {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="d-flex inactive-container justify-content-center"
                    style={{ color: colorPalette.primaryGray800 }}>
                    <InactiveSVG style={{ marginTop: '0.125rem' }} />
                    Inactive
                </Typography.Subheader>
            );
        } else if (row?.status === true) {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="d-flex active-container justify-content-center"
                    style={{ color: colorPalette.success700 }}>
                    <ActiveSVG style={{ marginTop: '0.125rem' }} />
                    Active
                </Typography.Subheader>
            );
        }
    };

    const renderAccountID = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.sm}>{row?.vendor_id === '' ? '-' : row?.vendor_id}</Typography.Body>
        );
    };
    const renderAccountName = (row) => {
        return (
            <Typography.Link
                size={Typography.Sizes.md}
                className="mouse-pointer"
                onClick={() => redirectToVendorPage(row?.vendor_id)}>
                {row?.vendor_name === '' ? '-' : row?.vendor_name}
            </Typography.Link>
        );
    };

    const renderEnergy = (row) => {
        return (
            <>
                <Row style={{ padding: '0.5rem 0.625rem' }}>
                    <Typography.Body size={Typography.Sizes.sm} className="mr-2">
                        {formatConsumptionValue(row.total_usage, 2)} kWh
                    </Typography.Body>
                    <TrendsBadge
                        value={percentageHandler(row?.total_usage, row?.old_usage)}
                        type={fetchTrendBadgeType(row?.total_usage, row?.old_usage)}
                    />
                </Row>
            </>
        );
    };

    const renderActions = (row) => {
        return (
            <>
                <Row style={{ padding: '0.5rem 0.625rem' }}>
                    <Button
                        label="View"
                        size={Button.Sizes.lg}
                        className="sub-button"
                        type={Button.Type.secondaryGrey}
                        icon={<MiniLogo />}
                        onClick={() => {
                            redirectToVendorPage(row?.vendor_id);
                        }}
                    />
                </Row>
            </>
        );
    };

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
            name: 'Active Devices',
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
                                onClick={() => {
                                    setOpenCustomer(true);
                                }}
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
                        isLoading={isUserDataFetched}
                        isLoadingComponent={<SkeletonLoading />}
                        id="admin-accounts"
                        onSearch={(query) => {
                            setPageNo(1);
                            setPageSize(20);
                            setSearch(query);
                        }}
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
                isAddCustomerOpen={openCustomer}
                closeAddCustomerModal={closeAddCustomer}
                getCustomerList={getCustomerList}
                getOfflineDevices={getOfflineDevices}
                pageSize={setPageSize}
                pageNo={setPageNo}
            />
        </React.Fragment>
    );
};

export default Accounts;
