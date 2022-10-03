import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { fetchPlugRules, updatePlugRuleRequest, createPlugRuleRequest } from '../../services/plugRules';
import axios from 'axios';
import { useAtom } from 'jotai';
import { BaseUrl, linkSocket } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import './style.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { buildingData } from '../../store/globalState';

const PlugRuleTable = ({ plugRuleData, skeletonLoading }) => {
    const history = useHistory();

    const redirectToPlugRulePage = (ruleId) => {
        history.push({
            pathname: `/control/plug-rules/${ruleId}`,
        });
    };
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr className="mouse-pointer">
                            <th>Name</th>
                            <th>Description</th>
                            <th>Days</th>
                            <th>Socket Count</th>
                            <th></th>
                        </tr>
                    </thead>
                    {skeletonLoading ? (
                        <tbody>
                            <SkeletonTheme color="#202020" height={35}>
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
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                        <tbody>
                            {plugRuleData.map((record, index) => {
                                return (
                                    <tr key={index} className="mouse-pointer">
                                        <td
                                            className="font-weight-bold panel-name"
                                            onClick={() => {
                                                redirectToPlugRulePage(record.id);
                                            }}>
                                            {record.name}
                                        </td>
                                        <td className="font-weight-bold">
                                            {record.description === '' ? '-' : record.description}
                                        </td>
                                        <td className="font-weight-bold">{record.days ? record.days : '-'}</td>
                                        <td className="font-weight-bold">
                                            {record.socketCount ? record.socketCount : 0}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
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

    const activeBuildingId = localStorage.getItem('buildingId');
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [createRuleData, setCreateRuleData] = useState({
        building_id: '',
        action: [],
    });

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
        let newRuleData = Object.assign({}, createRuleData);
        newRuleData.building_id = [localStorage.getItem('buildingId')];
        setIsProcessing(true);
        await createPlugRuleRequest(newRuleData)
            .then((res) => {
                setIsProcessing(false);
                setPageRefresh(!pageRefresh);
            })
            .catch((error) => {
                setIsProcessing(false);
                console.log('Failed to update requested Plug Rule', error);
            });
    };

    const updatePlugRuleData = async () => {
        setIsProcessing(true);
        await updatePlugRuleRequest(currentData)
            .then((res) => {
                setIsProcessing(false);
                setPageRefresh(!pageRefresh);
            })
            .catch((error) => {
                setIsProcessing(false);
                console.log('Failed to update requested Plug Rule', error);
            });
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

    // Building List Data Globally
    const [buildingListData] = useAtom(buildingData);

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
            buildingListData.map((record) => {
                if (record.building_id === activeBuildingId) {
                    localStorage.setItem('timeZone', record.timezone);
                }
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Building Data');
        }
    };

    useEffect(() => {
        getBuildingData();
        updateBreadcrumbStore();
    }, [buildingListData]);

    const fetchPlugRuleData = async () => {
        await fetchPlugRules(activeBuildingId).then((res) => {
            if (res.status) {
                setSkeletonLoading(false);
            }
            let response = res.data;
            setPlugRuleData(response.data);
            let onlineData = [];
            let offlineData = [];
            response.data.forEach((record) => {
                record.is_active ? onlineData.push(record) : offlineData.push(record);
            });
            setOnlinePlugRuleData(onlineData);
            setOfflinePlugRuleData(offlineData);
        });
    };

    useEffect(() => {
        fetchPlugRuleData();
    }, [pageRefresh]);

    useEffect(() => {
        fetchPlugRuleData();
    }, [activeBuildingId]);

    return (
        <React.Fragment>
            <div className="plug-rules-header mt-4 ml-4 mr-3">
                <div className="plug-left-header">
                    {/* <div className="plug-blg-name">NYPL</div> */}
                    <div className="plug-blg-name">
                        {localStorage.getItem('buildingName') === 'null' ? '' : localStorage.getItem('buildingName')}
                    </div>
                    <div className="plug-heading">Plug Rules</div>
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

            <div className="plug-rules-header mt-4 ml-4 mr-4">
                <div className="plug-search-tabs">
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
            </div>

            <Row>
                <Col lg={8}>
                    {selectedTab === 0 && (
                        <PlugRuleTable
                            plugRuleData={plugRuleData}
                            skeletonLoading={skeletonLoading}
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
                            skeletonLoading={skeletonLoading}
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
                            skeletonLoading={skeletonLoading}
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
        </React.Fragment>
    );
};

export default PlugRules;
