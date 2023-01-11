import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Input, Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    fetchKasaDevices,
    fetchKasaAccounts,
    getKasaLinkAccounts,
    getKasaUnLinkAccounts,
    getInsertKasaDevices,
    insertToSystem,
} from './services';
import { BreadcrumbStore } from '../../../../store/BreadcrumbStore';
import { BuildingStore } from '../../../../store/BuildingStore';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { ComponentStore } from '../../../../store/ComponentStore';
import '../style.css';
import {
    faCircleCheck,
    faSignalStream,
    faLink,
    faLinkSlash,
    faMagnifyingGlass,
    faExclamationCircle,
    faClockFour,
    faBan,
} from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-loading-skeleton/dist/skeleton.css';
import { AvForm, AvGroup, AvInput, AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { InputGroup } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';
import Brick from '../../../../sharedComponents/brick';
import Typography from '../../../../sharedComponents/typography';
import colorPalette from '../../../../assets/scss/_colors.scss';

const SkeletonLoading = () => (
    <SkeletonTheme color="$primary-gray-1000" height={35}>
        <tr>
            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>
        </tr>
    </SkeletonTheme>
);

const DevicesSkeletonLoading = () => (
    <SkeletonTheme color="$primary-gray-1000" height={35}>
        <tr>
            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>

            <td>
                <Skeleton count={5} />
            </td>
        </tr>
    </SkeletonTheme>
);

const Provision = () => {
    //New Integrations
    const [totalItems, setTotalItems] = useState(0);

    // Modal states
    const [selected, setSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [showlink, setShowLink] = useState(false);
    const [checkFind, setCheckFind] = useState(true);
    const [showUnlink, setShowUnLink] = useState(false);
    const [showFind, setShowFind] = useState(false);
    const [showDone, setShowDone] = useState(false);
    const handleClose = () => setShow(false);
    const handleLinkClose = () => {
        setShowLink(false);
        setError(false);
        setEmail('');
        setPassword('');
    };
    const handleUnLinkClose = () => {
        setShowUnLink(false);
        setError(false);
    };
    const handleFindClose = () => setShowFind(false);
    const handleShow = () => setShow(true);
    const [linkedAccount, setLinkedAccount] = useState([]);
    const [readyData, setReadyData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [total, setTotal] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedKasaEmail, setSelectedKasaEmail] = useState('');
    const [selectedKasaId, setSelectedKasaId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAddProcessing, setIsAddProcessing] = useState(false);

    const [checkedEmail, setCheckedEmail] = useState([]);
    const [checkedEmailFind, setCheckedEmailFind] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'active',
    });
    const [auth, setAuth] = useState('');

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createDeviceData);
        obj[key] = value;
        setCreateDeviceData(obj);
    };
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [kasaDevices, setKasaDevices] = useState([]);

    const handleUnlink = async () => {
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
            getKasaDevices(arr, true);
            setShowFind(false);
        }
    };

    const handleCheckedEmail = (e) => {
        checkedEmail.push(e.target.value);
    };
    const handleCheckedEmailFind = (e) => {
        checkedEmailFind.push(e.target.value);
    };

    const handleAuthorize = async () => {
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

    const handleAdd = () => {
        linkedAccount.forEach((ele) => {
            if (ele.email === selectedKasaEmail) {
                setSelectedKasaId(ele.id);
            }
        });
        setShowEmail(false);
        setShowDone(true);
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
                setShowDone(false);
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
        setShow(false);
        setShowLink(false);
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Active Devices',
                        path: '/settings/active-devices',
                        active: true,
                    },
                    {
                        label: 'Provisioning',
                        path: '/settings/active-devices/Provision',
                        active: false,
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
        let params = `?building_id=${bldgId}`;
        await fetchKasaAccounts(params)
            .then((res) => {
                let kDevices = [];

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
                setTotal(arr);
                setIsProcessing(false);
                setKasaDevices(kDevices);
                // setTotalItems(response?.total_data);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    const getKasaDevices = async (details, path) => {
        setIsAddProcessing(true);
        let ready = [];
        let progress = [];
        let params = `?building_id=${bldgId}`;
        await fetchKasaDevices(params, details)
            .then((res) => {
                res.data.data.forEach((ele) => {
                    if (ele.action === 1) {
                        ready.push(ele);
                    } else {
                        progress.push(ele);
                    }
                });
                if (path === true) setCheckFind(false);
                setReadyData(ready);
                setProgressData(progress);
                setIsAddProcessing(false);
            })
            .catch((error) => {
                setIsAddProcessing(false);
            });
    };

    useEffect(() => {
        getKasaAccount();
    }, [auth]);

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
        if (selectedStatus === 0) return progressData;
        else if (selectedStatus === 1) return readyData;
        else if (selectedStatus === 2) return progressData;
    };

    const renderStatus = (row) => {
        if (row?.status === 'Found') {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="d-flex pending-container justify-content-center"
                    style={{ color: colorPalette.warning700 }}>
                    <FontAwesomeIcon icon={faClockFour} size="lg" style={{ color: colorPalette.warning700 }} />
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
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.primaryGray800 }} />
                        {row?.status}
                    </Typography.Subheader>
                );
            } else {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex active-container justify-content-center"
                        style={{ color: colorPalette.success700 }}>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" style={{ color: colorPalette.success700 }} />
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
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Timezone',
            accessor: 'timezone',
            callbackValue: renderTimezone,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'HS110s',
            accessor: 'HS110s',
            callbackValue: renderHS110s,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'KP115s',
            accessor: 'KP115s',
            callbackValue: renderKP115s,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'HS300s',
            accessor: 'HS300s',
            callbackValue: renderHS300s,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Sockets',
            accessor: 'Socket',
            callbackValue: renderSocket,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Remaining Capacity',
            accessor: 'Remaining_Capacity',
            callbackValue: renderRemainingCapacity,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    //Linked Devices
    const headerProps2 = [
        {
            name: 'Status',
            accessor: 'status',
            callbackValue: renderStatus,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Device ID',
            accessor: 'device_mac',
            callbackValue: renderDeviceMac,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Vendor',
            accessor: 'vendor',
            callbackValue: renderVendor,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Model',
            accessor: 'model',
            callbackValue: renderModel,
            // onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Kasa Account',
            accessor: 'kasa_account',
            callbackValue: renderKasaAccount,
            // onSort: (method, name) => setSortBy({ method, name }),
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
                                <FontAwesomeIcon icon={faLinkSlash} size="md" style={{ marginRight: '0.5rem' }} />
                                UnLink Account
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
                                <FontAwesomeIcon icon={faLink} size="md" style={{ marginRight: '0.5rem' }} />
                                Link Account
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
                            isLoadingComponent={<SkeletonLoading />}
                            id="linked_account"
                            onSearch={(query) => {
                                // setSearch(query);
                            }}
                            buttonGroupFilterOptions={[]}
                            rows={currentRow()}
                            searchResultRows={currentRow()}
                            disableColumnDragging={true}
                            // onDownload={() => handleDownloadCsv()}
                            headers={headerProps1}
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
                                <FontAwesomeIcon icon={faMagnifyingGlass} size="md" style={{ marginRight: '0.5rem' }} />
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
                                    <FontAwesomeIcon
                                        icon={faSignalStream}
                                        size="md"
                                        style={{ marginRight: '0.5rem' }}
                                    />
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
                        isLoadingComponent={<DevicesSkeletonLoading />}
                        id="linked_devices"
                        onSearch={(query) => {
                            // setSearch(query);
                        }}
                        onStatus={setSelectedStatus}
                        buttonGroupFilterOptions={[
                            { label: `Available (${progressData.length})` },
                            { label: `Completed (${readyData.length})` },
                            { label: 'Existing Devices' },
                        ]}
                        rows={currentRowDevices()}
                        disableColumnDragging={true}
                        searchResultRows={currentRowDevices()}
                        // onDownload={() => handleDownloadCsv()}
                        headers={headerProps2}
                        totalCount={(() => {
                            return totalItems;
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
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                size="lg"
                                className="ml-2"
                                style={{ marginRight: '4px', color: 'white' }}
                            />
                            Devices Added to system
                        </div>
                    </Alert>
                </Col>
            </Row>

            {/* Add network Modal - Commented for Future Use*/}
            {/* <Modal show={show} onHide={handleClose} centered dialogClassName="my-modal" contentClassName="my-modal">
                <Modal.Header>
                    <Modal.Title>Add Network</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Identifier</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Identifier"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('mac_address', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Input type="text" placeholder="Enter Password" className="font-weight-bold"></Input>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Building</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option selected>Select Building</option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: 'center', margin: '0rem' }}>
                    <button className="btn btn-outline-secondary" style={{ width: '8rem' }} onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            handleClose();
                        }}
                        style={{ width: '8rem' }}>
                        Add
                    </button>
                </Modal.Footer>
            </Modal> */}

            {/* Link Account Modal */}
            <Modal
                show={showlink}
                onHide={handleLinkClose}
                centered
                dialogClassName="my-modal1"
                contentClassName="my-modal1">
                <Modal.Header style={{ marginLeft: '1rem', marginTop: '10px', padding: '0px' }}>
                    <Modal.Title>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0px' }}>
                            Add TP Link - Kasa Account
                        </p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ marginTop: '0px' }}>
                    <AvForm className="authentication-form" autoComplete="off">
                        {error ? (
                            <div className="error-message">
                                <div style={{ marginRight: '1rem' }}>
                                    <FontAwesomeIcon
                                        icon={faExclamationCircle}
                                        size="lg"
                                        className="ml-2"
                                        style={{ marginRight: '4px', color: '#B42318' }}
                                    />
                                </div>
                                <div>{message}</div>
                            </div>
                        ) : (
                            ''
                        )}
                        <AvGroup className="">
                            <label>Email</label>
                            <InputGroup>
                                <AvInput
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    required
                                />
                            </InputGroup>
                        </AvGroup>
                        <AvGroup className="mb-3">
                            <label>Password</label>
                            <InputGroup>
                                <AvInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    required
                                />
                            </InputGroup>
                        </AvGroup>
                    </AvForm>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: 'center', margin: '0rem' }}>
                    <button className="btn btn-outline-secondary" style={{ width: '8rem' }} onClick={handleLinkClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            handleAuthorize();
                        }}
                        style={{ width: '8rem' }}>
                        Add
                    </button>
                </Modal.Footer>
            </Modal>

            {/* UnLink Account Modal */}
            <Modal
                show={showUnlink}
                onHide={handleUnLinkClose}
                centered
                dialogClassName="my-modal1"
                contentClassName="my-modal1">
                <Modal.Header style={{ marginLeft: '1rem', marginTop: '10px', padding: '0px' }}>
                    <Modal.Title>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0px' }}>Unlink Account</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ marginTop: '0px' }}>
                    <p style={{ textAlign: 'center' }}>
                        Choose the account that you would like to unlink from this building
                    </p>
                    <AvForm className="authentication-form" autoComplete="off">
                        {error ? (
                            <div className="error-message">
                                <div style={{ marginRight: '1rem' }}>
                                    <FontAwesomeIcon
                                        icon={faExclamationCircle}
                                        size="lg"
                                        className="ml-2"
                                        style={{ marginRight: '4px', color: '#B42318' }}
                                    />
                                </div>
                                <div>{message}</div>
                            </div>
                        ) : (
                            ''
                        )}
                        <AvGroup
                            className=""
                            style={{ border: '1px solid #EAECF0', borderRadius: '8px', padding: '0px 8px 4px' }}>
                            <label style={{ marginBottom: '0px', padding: '0.5rem' }}>Email</label>
                            <hr />
                            <AvCheckboxGroup name="email">
                                {linkedAccount.map((record, index) => {
                                    return (
                                        <>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <AvCheckbox
                                                    name="email"
                                                    value={record.id}
                                                    required
                                                    onChange={(e) => {
                                                        handleCheckedEmail(e);
                                                    }}
                                                />
                                                <label style={{ color: 'blue' }}>{record.email}</label>
                                            </div>
                                        </>
                                    );
                                })}
                            </AvCheckboxGroup>
                        </AvGroup>
                    </AvForm>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: 'center', margin: '0rem' }}>
                    <button className="btn btn-outline-secondary" style={{ width: '8rem' }} onClick={handleUnLinkClose}>
                        Cancel
                    </button>
                    <button
                        className="btn"
                        style={{ backgroundColor: '#B42318', width: '8rem' }}
                        onClick={() => {
                            handleUnlink();
                        }}>
                        Unlink
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Find Devices Modal */}
            <Modal
                show={showFind}
                onHide={handleFindClose}
                centered
                dialogClassName="my-modal1"
                contentClassName="my-modal1">
                <Modal.Header style={{ marginLeft: '1rem', marginTop: '10px', padding: '0px' }}>
                    <Modal.Title>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0px' }}>Find Devices</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ marginTop: '0px' }}>
                    <p style={{ textAlign: 'center' }}>Select the account you would like to find devices from</p>
                    <AvForm className="authentication-form" autoComplete="off">
                        {error && (
                            <Alert color="danger" isOpen={error ? true : false}>
                                <div>{message}</div>
                            </Alert>
                        )}
                        <AvGroup
                            className=""
                            style={{ border: '1px solid #EAECF0', borderRadius: '8px', padding: '0px 8px 4px' }}>
                            <label style={{ marginBottom: '0px', padding: '0.5rem' }}>Email</label>
                            <hr />
                            <AvCheckboxGroup name="email">
                                {linkedAccount.map((record, index) => {
                                    return (
                                        <>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <AvCheckbox
                                                    name="email"
                                                    value={record.id}
                                                    required
                                                    onChange={(e) => {
                                                        handleCheckedEmailFind(e);
                                                    }}
                                                />
                                                <label style={{ color: 'blue' }}>{record.email}</label>
                                            </div>
                                        </>
                                    );
                                })}
                            </AvCheckboxGroup>
                        </AvGroup>
                    </AvForm>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: 'center', margin: '0rem' }}>
                    <button className="btn btn-outline-secondary" style={{ width: '8rem' }} onClick={handleFindClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            handleFindDevices();
                        }}
                        style={{ width: '8rem' }}>
                        Find Devices
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Done Provisioning */}
            <Modal
                show={showEmail}
                onHide={() => {
                    setShowEmail(false);
                }}
                centered>
                <Modal.Header>
                    <Modal.Title>Verify Provisioning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Kasa Account</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    setSelectedKasaEmail(e.target.value);
                                }}>
                                <option selected>Select Kasa Account</option>
                                {linkedAccount.map((record) => {
                                    return <option value={record.email}>{record.email}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: 'center', margin: '0rem' }}>
                    <button
                        className="btn btn-outline-secondary"
                        style={{ width: '8rem' }}
                        onClick={() => {
                            setShowEmail(false);
                        }}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            handleAdd();
                        }}
                        style={{ width: '8rem' }}>
                        Add
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showDone}
                onHide={() => {
                    setShowDone(false);
                }}
                centered>
                <Modal.Body>
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Are you sure you want to add this account devices
                        <p style={{ fontWeight: 'bold' }}>{selectedKasaEmail}</p>in selected building{' '}
                        <p style={{ fontWeight: 'bold' }}>{localStorage.getItem('buildingName')} ?</p>
                    </p>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: 'center', margin: '0rem' }}>
                    <button
                        className="btn btn-outline-secondary"
                        style={{ width: '8rem' }}
                        onClick={() => {
                            setShowDone(false);
                            setShowEmail(true);
                        }}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            //  handleDone();
                        }}
                        style={{ width: '8rem' }}>
                        Done
                    </button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Provision;
