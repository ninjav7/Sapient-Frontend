import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useParams } from 'react-router-dom';
import { Row, Col, Alert, Spinner } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import {
    fetchKasaDevices,
    fetchKasaAccounts,
    getKasaLinkAccounts,
    getKasaUnLinkAccounts,
    getInsertKasaDevices,
    insertToSystem,
} from './services';

import { buildingData } from '../../../../store/globalState';
import { updateBuildingStore } from '../../../../helpers/updateBuildingStore';
import { BreadcrumbStore } from '../../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../../store/ComponentStore';

import { ReactComponent as CircleCheckSVG } from '../../../../assets/icon/circle-check.svg';
import { ReactComponent as LinkSVG } from '../../../../assets/icon/link.svg';
import { ReactComponent as LinkSlashSVG } from '../../../../assets/icon/link-slash.svg';
import { ReactComponent as MagnifyingGlassSVG } from '../../../../assets/icon/magnifying-glass.svg';
import { ReactComponent as CircleXmarkSVG } from '../../../../assets/icon/circle-xmark.svg';
import { ReactComponent as SignalStreamSVG } from '../../../../assets/icon/signal-stream.svg';
import { ReactComponent as ClockSVG } from '../../../../assets/icon/clock.svg';

import Brick from '../../../../sharedComponents/brick';
import Typography from '../../../../sharedComponents/typography';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';

import LinkModal from './LinkModal';
import UnLinkModal from './UnLinkModal';
import FindDevicesModal from './FindDevicesModal';

import colorPalette from '../../../../assets/scss/_colors.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../style.css';
import SkeletonLoader from '../../../../components/SkeletonLoader';

const Provision = () => {
    //New Integrations
    const [totalItems, setTotalItems] = useState(0);

    // Modal states
    const [showlink, setShowLink] = useState(false);
    const [checkFind, setCheckFind] = useState(true);
    const [showUnlink, setShowUnLink] = useState(false);
    const [showFind, setShowFind] = useState(false);
    const [checkedEmailFind, setCheckedEmailFind] = useState([]);

    const handleLinkClose = () => {
        setShowLink(false);
        setError(false);
    };

    const handleUnLinkClose = () => {
        setShowUnLink(false);
        setError(false);
    };

    const handleFindClose = () => setShowFind(false);

    const [linkedAccount, setLinkedAccount] = useState([]);
    const [totalReadyData, setTotalReadyData] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const [availableDevices, setAvailableDevices] = useState(0);
    const [existingDevices, setExistingDevices] = useState(0);
    const [isAddProcessing, setIsAddProcessing] = useState(false);
    const [kasaDevicesList, setKasaDevicesList] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState(0);
    const [auth, setAuth] = useState('');
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [kasaDevices, setKasaDevices] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [devicesearch, setDeviceSearch] = useState('');
    const [deviceSortBy, setDeviceSortBy] = useState({});
    const [devicePageNo, setDevicePageNo] = useState(1);
    const [devicePageSize, setDevicePageSize] = useState(20);
    const [selectedAccount, setSelectedAccount] = useState({});

    const handleUnlink = async (checkedEmail) => {
        let authData = {
            kasa_account_id: checkedEmail,
            building_id: bldgId,
        };
        await getKasaUnLinkAccounts(authData)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.success === false) {
                        setError(true);
                        setMessage(res.data.message);
                    } else {
                        handleUnLinkClose();
                        let arr = {
                            kasa_account_ids: [],
                            find_new: false,
                        };
                        getKasaAccount();
                        getKasaDevices(arr);
                    }
                }
            })
            .catch((error) => {
                setError(true);
            });
    };

    const handleFindDevices = () => {
        if (checkedEmailFind.length === 0) {
            setShowFind(true);
            setCheckFind(true);
        } else {
            let arr = {
                kasa_account_ids: checkedEmailFind,
                find_new: true,
            };
            setSelectedAccount(arr);

            setShowFind(false);
        }
    };
    useEffect(() => {
        if (Object.entries(selectedAccount).length !== 0)
            getKasaDevices(selectedAccount, true, selectedStatus === 0 ? 'Found' : 'Completed');
    }, [selectedAccount, devicePageNo, devicePageSize, devicesearch, deviceSortBy, selectedStatus]);

    const handleAuthorize = async (email, password) => {
        let authData = {
            username: email,
            password: password,
            building_id: bldgId,
        };
        await getKasaLinkAccounts(authData)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.success === false) {
                        setError(true);
                        setMessage(res.data.message);
                    } else {
                        handleLinkClose();
                        localStorage.setItem('kasa_id', res.data.id);
                        setAuth(res.data.id);
                    }
                }
            })
            .catch((error) => {});
    };

    const [showAddMsg, setShowAddMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDone = async () => {
        setIsLoading(true);
        setCheckFind(true);
        let arr = {
            kasa_account_id: checkedEmailFind,
            building_id: bldgId,
        };
        await insertToSystem(arr)
            .then((res) => {
                if (res.data.success === true) setShowAddMsg(true);

                setIsLoading(false);
                let arr = {
                    kasa_account_ids: checkedEmailFind,
                    find_new: true,
                };
                getKasaDevices(arr, false);
            })
            .catch((error) => {
                setError(true);
                setIsLoading(false);
                setCheckFind(false);
            });
    };

    const handleAddDevice = async (e, kasa_account_id, device_id) => {
        let authData = {
            building_id: bldgId,
            device_id: device_id,
            kasa_account_id: kasa_account_id,
        };
        await getInsertKasaDevices(authData)
            .then((res) => {
                if (res.status === 200) {
                    getKasaDevices();
                }
            })
            .catch((error) => {
                setError(true);
            });
    };

    useEffect(() => {
        setShowLink(false);
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Smart Plugs',
                        path: `/settings/smart-plugs/${bldgId}`,
                        active: false,
                    },
                    {
                        label: 'Provisioning',
                        path: '/settings/smart-plugs/provision',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const getKasaAccount = async () => {
        setIsProcessing(true);
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name === undefined ? 'email' : sortBy.name,
                sort_by: sortBy.method === undefined ? 'ace' : sortBy.method,
            };

        await fetchKasaAccounts(pageNo, pageSize, bldgId, search, {
            ...sorting,
        })
            .then((res) => {
                let kDevices = [];
                setTotalItems(res?.data?.data?.length);
                let Hs = 0;
                let kp = 0;
                let Hs1 = 0;
                let socket = 0;
                let capy = 0;
                let kasadata = [];
                res.data.data.forEach((ele) => {
                    let a = {
                        id: ele.id,
                        email: ele.email,
                        HS110s: ele.HS110s,
                        KP115s: ele.KP115s,
                        HS300s: ele.HS300s,
                        Socket: ele.Socket,
                        Remaining_Capacity: 256 - ele.Socket,
                    };
                    kasadata.push(a);
                    if (ele.is_provisioned === false) {
                        kDevices.push(ele.id);
                    }
                    Hs = Hs + ele.HS110s;
                    kp = kp + ele.KP115s;
                    Hs1 = Hs1 + ele.HS300s;
                    socket = socket + ele.Socket;
                    capy = capy + (256 - ele.Socket);
                });
                setLinkedAccount(kasadata);
                let arr = {
                    HS110s: Hs,
                    KP115s: kp,
                    HS300s: Hs1,
                    Socket: socket,
                    Remaining_Capacity: capy,
                };
                setIsProcessing(false);
                setKasaDevices(kDevices);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    const getKasaDevices = async (details, path, statusType = 'Found') => {
        setIsAddProcessing(true);
        setKasaDevicesList([]);

        const sorting = deviceSortBy.method &&
            deviceSortBy.name && {
                order_by: deviceSortBy.name === undefined ? 'device_mac' : deviceSortBy.name,
                sort_by: deviceSortBy.method === undefined ? 'ace' : deviceSortBy.method,
            };

        await fetchKasaDevices(
            devicePageNo,
            devicePageSize,
            bldgId,
            devicesearch,
            {
                ...sorting,
            },
            details,
            statusType
        )
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (path) setCheckFind(false);
                    if (response?.data.length > 0) setKasaDevicesList(response?.data);
                    if (response?.found) setAvailableDevices(+response?.found);
                    if (response?.completed) setExistingDevices(+response?.completed);
                    statusType === 'Found'
                        ? setTotalReadyData(response?.found)
                        : setTotalReadyData(response?.completed);
                }
                setIsAddProcessing(false);
            })
            .catch((error) => {
                setIsAddProcessing(false);
            });
    };

    useEffect(() => {
        getKasaAccount();
    }, [auth, search, sortBy, pageNo, pageSize]);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
        }
    }, [buildingListData, bldgId]);

    //Linked Accounts
    const currentRow = () => {
        return linkedAccount;
    };

    const renderEmail = (row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <a className="typography-wrapper link mouse-pointer">{row.email}</a>
                <Brick sizeInPixels={3} />
            </div>
        );
    };

    const renderHS110s = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.HS110s}</Typography.Body>;
    };

    const renderTimezone = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.timezone !== '' ? row.timezone : '-'}</Typography.Body>;
    };

    const renderKP115s = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.KP115s}</Typography.Body>;
    };

    const renderHS300s = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.HS300s}</Typography.Body>;
    };

    const renderSocket = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.Socket}</Typography.Body>;
    };

    const renderRemainingCapacity = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.Remaining_Capacity}</Typography.Body>;
    };

    //Linked Devices
    const currentRowDevices = () => {
        return kasaDevicesList;
    };

    const renderStatus = (row) => {
        if (row?.status === 'Found') {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="d-flex pending-container justify-content-center"
                    style={{ color: colorPalette.warning700 }}>
                    <ClockSVG />
                    {row?.status}
                </Typography.Subheader>
            );
        } else {
            if (row?.status === 'Failed') {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex inactive-container justify-content-center"
                        style={{ color: colorPalette.primaryGray800 }}>
                        <CircleXmarkSVG />
                        {row?.status}
                    </Typography.Subheader>
                );
            } else {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex active-container justify-content-center"
                        style={{ color: colorPalette.success700 }}>
                        <CircleCheckSVG />
                        {row?.status}
                    </Typography.Subheader>
                );
            }
        }
    };

    const renderDeviceMac = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.device_mac}</Typography.Body>;
    };

    const renderVendor = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.vendor}</Typography.Body>;
    };

    const renderModel = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.model}</Typography.Body>;
    };

    const renderKasaAccount = (row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <a className="typography-wrapper link mouse-pointer">{row.kasa_account}</a>
                <Brick sizeInPixels={3} />
            </div>
        );
    };

    //Linked Accounts
    const headerProps1 = [
        {
            name: 'Email',
            accessor: 'email',
            callbackValue: renderEmail,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Timezone',
            accessor: 'timezone',
            callbackValue: renderTimezone,
        },
        {
            name: 'HS110s',
            accessor: 'HS110s',
            callbackValue: renderHS110s,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'KP115s',
            accessor: 'KP115s',
            callbackValue: renderKP115s,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'HS300s',
            accessor: 'HS300s',
            callbackValue: renderHS300s,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Sockets',
            accessor: 'Socket',
            callbackValue: renderSocket,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Remaining Capacity',
            accessor: 'Remaining_Capacity',
            callbackValue: renderRemainingCapacity,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    //Linked Devices
    const headerProps2 = [
        {
            name: 'Status',
            accessor: 'status',
            callbackValue: renderStatus,
        },
        {
            name: 'Device ID',
            accessor: 'device_mac',
            callbackValue: renderDeviceMac,
        },
        {
            name: 'Vendor',
            accessor: 'vendor',
            callbackValue: renderVendor,
        },
        {
            name: 'Model',
            accessor: 'model',
            callbackValue: renderModel,
        },
        {
            name: 'Kasa Account',
            accessor: 'kasa_account',
            callbackValue: renderKasaAccount,
        },
    ];
    const pageListSizes = [
        {
            label: '5 Rows',
            value: '5',
        },
        {
            label: '10 Rows',
            value: '10',
        },
        {
            label: '15 Rows',
            value: '15',
        },
    ];

    return (
        <React.Fragment>
            {/* Linked Accounts */}
            <Row className="page-title mb-3">
                <Col className="header-container">
                    <span className="heading-style">Add Devices</span>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <span className="sub-heading">Linked TP-Link Accounts</span>
                    <div
                        className="mb-4 btn-group custom-button-group float-right"
                        role="group"
                        aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-outline-secondary font-weight-bold"
                                onClick={() => {
                                    setShowUnLink(true);
                                    setShowAddMsg(false);
                                }}>
                                <LinkSlashSVG style={{ marginRight: '0.5rem' }} />
                                &nbsp; UnLink Account
                            </button>
                        </div>
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-outline-secondary font-weight-bold"
                                onClick={() => {
                                    setShowLink(true);
                                    setShowAddMsg(false);
                                }}>
                                <LinkSVG style={{ marginRight: '0.5rem' }} />
                                &nbsp; Link Account
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <div>
                        <DataTableWidget
                            isLoading={isProcessing}
                            isLoadingComponent={<SkeletonLoader noOfColumns={headerProps1.length} noOfRows={5} />}
                            id="linked_account"
                            onSearch={(query) => {
                                setPageNo(1);
                                setSearch(query);
                            }}
                            buttonGroupFilterOptions={[]}
                            rows={currentRow()}
                            searchResultRows={currentRow()}
                            disableColumnDragging={true}
                            headers={headerProps1}
                            currentPage={pageNo}
                            onChangePage={setPageNo}
                            pageSize={pageSize}
                            onPageSize={setPageSize}
                            pageListSizes={pageListSizes}
                            totalCount={(() => {
                                return totalItems;
                            })()}
                        />
                    </div>
                </Col>
            </Row>

            {/* Linked Devices */}
            <Row className="mt-4">
                <Col lg={7}>
                    <span className="sub-heading">Devices</span>
                </Col>
                <Col md={5}>
                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-outline-secondary font-weight-bold"
                                onClick={() => {
                                    setShowFind(true);
                                    setShowAddMsg(false);
                                }}>
                                <MagnifyingGlassSVG style={{ marginRight: '0.5rem' }} />
                                Find Devices
                            </button>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={handleDone}
                                disabled={checkFind}>
                                {isLoading ? (
                                    <Spinner color={'white'} size="sm" style={{ marginRight: '0.5rem' }} />
                                ) : (
                                    <SignalStreamSVG style={{ marginRight: '0.5rem' }} />
                                )}
                                <div style={{ display: 'inline-block' }}>Add to System</div>
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Brick sizeInRem={1.5} />
            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        isLoading={isAddProcessing}
                        isLoadingComponent={<SkeletonLoader noOfColumns={headerProps2.length} noOfRows={15} />}
                        id="devices_linked"
                        onSearch={(query) => {
                            setDevicePageNo(1);
                            setDeviceSearch(query);
                        }}
                        onStatus={(value) => {
                            setDevicePageNo(1);
                            setSelectedStatus(value);
                        }}
                        buttonGroupFilterOptions={[
                            { label: `Available (${availableDevices})` },
                            { label: `Existing Devices (${existingDevices})` },
                        ]}
                        rows={currentRowDevices()}
                        disableColumnDragging={true}
                        searchResultRows={currentRowDevices()}
                        headers={headerProps2}
                        currentPage={devicePageNo}
                        onChangePage={setDevicePageNo}
                        pageSize={devicePageSize}
                        onPageSize={setDevicePageSize}
                        totalCount={(() => {
                            return totalReadyData;
                        })()}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={1}></Col>
                <Col lg={10}>
                    <Alert variant="success" isOpen={showAddMsg}>
                        <div>
                            {' '}
                            <CircleCheckSVG className="ml-2" style={{ marginRight: '0.25rem', color: 'white' }} />
                            Devices Added to system
                        </div>
                    </Alert>
                </Col>
            </Row>

            {/* Link Account Modal */}
            <LinkModal
                showlink={showlink}
                handleLinkClose={handleLinkClose}
                error={error}
                message={message}
                handleAuthorize={handleAuthorize}
            />

            {/* UnLink Account Modal */}
            <UnLinkModal
                showUnlink={showUnlink}
                handleUnLinkClose={handleUnLinkClose}
                error={error}
                message={message}
                handleUnlink={handleUnlink}
                linkedAccount={linkedAccount}
            />

            {/* Find Devices Modal */}
            <FindDevicesModal
                showFind={showFind}
                handleFindClose={handleFindClose}
                error={error}
                message={message}
                handleFindDevices={handleFindDevices}
                linkedAccount={linkedAccount}
                checkedEmailFind={checkedEmailFind}
            />
        </React.Fragment>
    );
};

export default Provision;
