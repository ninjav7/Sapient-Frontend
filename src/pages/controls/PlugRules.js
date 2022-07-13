import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Button,
    Input,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {
    BaseUrl,
    listPlugRules,
    createPlugRule,
    updatePlugRule,
    linkSocket,
    unLinkSocket,
    getBuilding,
} from '../../services/Network';
import { ChevronDown } from 'react-feather';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import EditPlugRule from './EditPlugRule';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import './style.css';

const PlugRuleTable = ({
    plugRuleData,
    handleEditRuleShow,
    currentData,
    setCurrentData,
    handleCurrentDataChange,
    modelRefresh,
    setModelRefresh,
}) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Days</th>
                            <th>Socket Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plugRuleData.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td
                                        className="font-weight-bold panel-name"
                                        onClick={() => {
                                            setModelRefresh(!modelRefresh);
                                            setCurrentData(record);
                                            handleEditRuleShow();
                                        }}>
                                        {record.name}
                                    </td>
                                    <td className="font-weight-bold">
                                        {record.description === '' ? '-' : record.description}
                                    </td>
                                    <td className="font-weight-bold">{record.days ? record.days : '-'}</td>
                                    <td className="font-weight-bold">{record.socketCount ? record.socketCount : 0}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const PlugRules = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    
    // Add Rule Model
    const [showAddRule, setShowAddRule] = useState(false);
    const handleAddRuleClose = () => setShowAddRule(false);
    const handleAddRuleShow = () => setShowAddRule(true);

    // Edit Rule Model
    const [showEditRule, setShowEditRule] = useState(false);
    const handleEditRuleClose = () => setShowEditRule(false);
    const handleEditRuleShow = () => setShowEditRule(true);

    const activeBuildingId = localStorage.getItem('buildingId');

    const [buildingId, setBuildingId] = useState(1);
    const [ruleData, setRuleData] = useState([
        {
            name: '8am-6pm M-F',
            description: '-',
            days: 'Weekdays',
            socketCount: 15,
        },
        {
            name: 'Workstations 7am-5pm',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
        {
            name: 'Refrigerators',
            description: '-',
            days: 'All Days',
            socketCount: 25,
        },
        {
            name: '9am-7pm',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
        {
            name: 'Ice/Water Machines',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
        {
            name: '8am-9pm M-F',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [createRuleData, setCreateRuleData] = useState({
        building_id: '',
        action: [],
    });
    const [buildingRecord, setBuildingRecord] = useState([]);

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [currentData, setCurrentData] = useState({});

    const [modelRefresh, setModelRefresh] = useState(false);

    const [plugRuleData, setPlugRuleData] = useState([]);
    const [onlinePlugRuleData, setOnlinePlugRuleData] = useState([]);
    const [offlinePlugRuleData, setOfflinePlugRuleData] = useState([]);

    const [rulesToLink, setRulesToLink] = useState({
        rule_id: '',
        sensor_id: [],
    });

    const [rulesToUnLink, setRulesToUnLink] = useState({
        rule_id: '',
        sensor_id: [],
    });

    const handleCreatePlugRuleChange = (key, value) => {
        let obj = Object.assign({}, createRuleData);
        obj[key] = value;
        setCreateRuleData(obj);
    };

    const handleCurrentDataChange = (key, value) => {
        let obj = Object.assign({}, currentData);
        obj[key] = value;
        setCurrentData(obj);
    };

    const savePlugRuleData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let newRuleData = Object.assign({}, createRuleData);
            newRuleData.building_id = localStorage.getItem('buildingId');

            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${createPlugRule}`, newRuleData, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setIsProcessing(false);
            setPageRefresh(!pageRefresh);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to create Plug Rule');
        }
    };

    const updatePlugRuleData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            setIsProcessing(true);

            let params = `?role_id=${currentData.id}`;
            await axios
                .patch(`${BaseUrl}${updatePlugRule}${params}`, currentData, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setIsProcessing(false);
            setPageRefresh(!pageRefresh);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to update requested Plug Rule');
        }
    };

    const updateSocketLink = async () => {
        if (rulesToLink.sensor_id.length === 0) {
            return;
        }
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${linkSocket}`, rulesToLink, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setIsProcessing(false);
            setPageRefresh(!pageRefresh);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to update requested Socket Linking!');
        }
    };

    const updateSocketUnlink = async () => {
        if (rulesToUnLink.sensor_id.length === 0) {
            return;
        }
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${unLinkSocket}`, rulesToUnLink, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setIsProcessing(false);
            setPageRefresh(!pageRefresh);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to update requested Socket Unlinking!');
        }
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Plug Rules',
                        path: '/control/plug-rules',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'control';
            });
        };
        const getBuildingData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                    let data = res.data;
                    setBuildingRecord(data);
                    console.log("Get Building",data);
                    data.map((record, index) => {
                        if(record.building_id===activeBuildingId){
                            localStorage.setItem("timeZone",record.timezone);
                            // console.log("timezone",record.timezone);
                        }
                    })
                });   
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Data');
            }
        };
        getBuildingData();
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        const fetchPlugRuleData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${activeBuildingId}`;
                await axios.get(`${BaseUrl}${listPlugRules}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    // console.log("Plug Rule Data",response.data)
                    setPlugRuleData(response.data);
                    let onlineData = [];
                    let offlineData = [];
                    response.data.forEach((record) => {
                        record.is_active ? onlineData.push(record) : offlineData.push(record);
                    });
                    setOnlinePlugRuleData(onlineData);
                    setOfflinePlugRuleData(offlineData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch list of Plug Rules data');
            }
        };
        fetchPlugRuleData();
    }, [pageRefresh]);

    useEffect(() => {
        const fetchPlugRuleData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${activeBuildingId}`;
                await axios.get(`${BaseUrl}${listPlugRules}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    // console.log("Plug Rule Data",response.data)
                    setPlugRuleData(response.data);
                    let onlineData = [];
                    let offlineData = [];
                    response.data.forEach((record) => {
                        record.is_active ? onlineData.push(record) : offlineData.push(record);
                    });
                    setOnlinePlugRuleData(onlineData);
                    setOfflinePlugRuleData(offlineData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch list of Plug Rules data');
            }
        };
        fetchPlugRuleData();
    }, [activeBuildingId]);

    return (
        <React.Fragment>
            <div className="plug-rules-header-style mt-4 ml-4 mr-3">
                <div className="plug-left-header">
                    {/* <div className="plug-blg-name">NYPL</div> */}
                    <div className="plug-blg-name">
                        {localStorage.getItem('buildingName') === 'null' ? '' : localStorage.getItem('buildingName')}
                    </div>
                    <div className="plug-heading-style">Plug Rules</div>
                </div>
                <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                    <div className="mr-2">
                        <button
                            type="button"
                            className="btn btn-md btn-primary font-weight-bold"
                            onClick={() => {
                                handleAddRuleShow();
                            }}>
                            <FontAwesomeIcon icon={faPlus} size="md" className="mr-2" />
                            Add Rule
                        </button>
                    </div>
                </div>
            </div>

            <div className="plug-rules-header-style mt-4 ml-4 mr-4">
                <div className="plug-search-tabs-style">
                    <div className="search-container mr-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                        <input className="search-box ml-2" type="search" name="search" placeholder="Search" />
                    </div>

                    <div className="btn-group ml-2" role="group" aria-label="Basic example">
                        <div>
                            <button
                                type="button"
                                className={
                                    selectedTab === 0
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
                                onClick={() => setSelectedTab(0)}>
                                All Statuses
                            </button>

                            <button
                                type="button"
                                className={
                                    selectedTab === 1
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderRadius: '0px' }}
                                onClick={() => setSelectedTab(1)}>
                                <i className="uil uil-wifi mr-1"></i>Online
                            </button>

                            <button
                                type="button"
                                className={
                                    selectedTab === 2
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                                onClick={() => setSelectedTab(2)}>
                                <i className="uil uil-wifi-slash mr-1"></i>Offline
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <UncontrolledDropdown className="d-inline float-right">
                        <DropdownToggle color="white">
                            Columns
                            <i className="icon">
                                <ChevronDown></ChevronDown>
                            </i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Phoenix Baker</DropdownItem>
                            <DropdownItem active={true} className="bg-primary">
                                Olivia Rhye
                            </DropdownItem>
                            <DropdownItem>Lana Steiner</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>

            <Row>
                <Col lg={8}>
                    {selectedTab === 0 && (
                        <PlugRuleTable
                            plugRuleData={plugRuleData}
                            handleEditRuleShow={handleEditRuleShow}
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            handleCurrentDataChange={handleCurrentDataChange}
                            modelRefresh={modelRefresh}
                            setModelRefresh={setModelRefresh}
                            rulesToLink={rulesToLink}
                            rulesToUnLink={rulesToUnLink}
                            setRulesToLink={setRulesToLink}
                            setRulesToUnLink={setRulesToUnLink}
                        />
                    )}
                    {selectedTab === 1 && (
                        <PlugRuleTable
                            plugRuleData={onlinePlugRuleData}
                            handleEditRuleShow={handleEditRuleShow}
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            handleCurrentDataChange={handleCurrentDataChange}
                            modelRefresh={modelRefresh}
                            setModelRefresh={setModelRefresh}
                            rulesToLink={rulesToLink}
                            rulesToUnLink={rulesToUnLink}
                            setRulesToLink={setRulesToLink}
                            setRulesToUnLink={setRulesToUnLink}
                        />
                    )}
                    {selectedTab === 2 && (
                        <PlugRuleTable
                            plugRuleData={offlinePlugRuleData}
                            handleEditRuleShow={handleEditRuleShow}
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            handleCurrentDataChange={handleCurrentDataChange}
                            modelRefresh={modelRefresh}
                            setModelRefresh={setModelRefresh}
                            rulesToLink={rulesToLink}
                            rulesToUnLink={rulesToUnLink}
                            setRulesToLink={setRulesToLink}
                            setRulesToUnLink={setRulesToUnLink}
                        />
                    )}
                </Col>
            </Row>

            {/* Add Rule Model  */}
            <Modal show={showAddRule} onHide={handleAddRuleClose} centered>
                <div className="mt-3 ml-3">
                    <Modal.Title>Add Plug Rule</Modal.Title>
                </div>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleCreatePlugRuleChange('name', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Description"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleCreatePlugRuleChange('description', e.target.value);
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleAddRuleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            savePlugRuleData();
                            handleAddRuleClose();
                        }}
                        disabled={isProcessing}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Rule Model  */}
            <EditPlugRule
                showEditRule={showEditRule}
                handleEditRuleClose={handleEditRuleClose}
                currentData={currentData}
                setCurrentData={setCurrentData}
                handleCurrentDataChange={handleCurrentDataChange}
                updatePlugRuleData={updatePlugRuleData}
                modelRefresh={modelRefresh}
                setModelRefresh={setModelRefresh}
                rulesToLink={rulesToLink}
                rulesToUnLink={rulesToUnLink}
                setRulesToLink={setRulesToLink}
                setRulesToUnLink={setRulesToUnLink}
                updateSocketLink={updateSocketLink}
                updateSocketUnlink={updateSocketUnlink}
            />
        </React.Fragment>
    );
};

export default PlugRules;
