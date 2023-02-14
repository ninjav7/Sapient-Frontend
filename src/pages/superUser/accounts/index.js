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
import { TrendsBadge } from '../../../sharedComponents/trendsBadge';
import AddCustomer from './addCustomer';
import { fetchCustomerList, fetchSelectedCustomer, fetchOfflineDevices } from './services';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { getCustomerListCSVExport } from '../../../utils/tablesExport';
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
    const [isDeviceDataFetched, setIsDeviceDataFetched] = useState(false);
    const [openCustomer, setOpenCustomer] = useState(false);

    const closeAddCustomer = () => setOpenCustomer(false);
    const [userData, setUserData] = useState([]);
    const [offlineData, setOfflineData] = useState([]);

    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [search, setSearch] = useState('');
    const { download } = useCSVDownload();

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
        let params = `?customer_search=${search}`;
        await fetchCustomerList(params)
            .then((res) => {
                let response = res.data;
                setUserData(response?.data);
                setIsUserDataFetched(false);
            })
            .catch((error) => {
                setIsUserDataFetched(false);
            });
    };

    const getOfflineDeviceData = async () => {
        setIsDeviceDataFetched(true);
        let params = `?customer_search=${search}`;
        await fetchOfflineDevices(params)
            .then((res) => {
                let response = res.data;
                setOfflineData(response?.data);
                setIsDeviceDataFetched(false);
            })
            .catch((error) => {
                setIsDeviceDataFetched(false);
            });
    };

    useEffect(() => {
        getCustomerList();
        getOfflineDeviceData();
    }, [search]);

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
        if (vendorID === '' || vendorID === null) {
            return '';
        }
        localStorage.setItem('vendor_id', vendorID);
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
                    <Typography.Body size={Typography.Sizes.sm}>{row.total_usage.toFixed(2)} kWh </Typography.Body>
                    &nbsp;&nbsp;
                    <TrendsBadge
                        value={
                            isNaN(Math.abs(Math.round(row.percent_change)))
                                ? 0
                                : Math.abs(Math.round(row.percent_change))
                        }
                        type={
                            row?.percent_change < row?.percent_change
                                ? TrendsBadge.Type.DOWNWARD_TREND
                                : TrendsBadge.Type.UPWARD_TREND
                        }
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
        },
        {
            name: 'Account Name',
            accessor: 'vendor_name',
            callbackValue: renderAccountName,
        },
        {
            name: 'Status',
            accessor: 'status',
            callbackValue: renderStatus,
        },
        {
            name: 'Active Devices',
            accessor: 'active_devices',
            callbackValue: renderActiveDevices,
        },
        {
            name: 'Smart Meters',
            accessor: 'passive_devices',
            callbackValue: renderPassiveDevices,
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

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Accounts</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <Button
                                label="Add Customer"
                                size={Button.Sizes.lg}
                                type={Button.Type.primary}
                                icon={<PlusSVG />}
                                iconAlignment={Button.IconAlignment.left}
                                onClick={() => {
                                    setOpenCustomer(true);
                                }}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg={12} className="mt-4">
                    <DataTableWidget
                        isLoading={isUserDataFetched}
                        isLoadingComponent={<SkeletonLoading />}
                        id="admin-accounts"
                        onSearch={(query) => {
                            setSearch(query);
                        }}
                        onDownload={() => handleDownloadCsv()}
                        buttonGroupFilterOptions={[{ label: 'Active' }, { label: 'Inactive' }, { label: 'All' }]}
                        onStatus={setSelectedStatus}
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
            />
        </React.Fragment>
    );
};

export default Accounts;
