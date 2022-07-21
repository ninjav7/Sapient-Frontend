import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
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
import Switch from 'react-switch';
import LineChart from '../charts/LineChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseUrl, linkSocketRules, unLinkSocketRules } from '../../services/Network';
import axios from 'axios';
import { faTrashCan } from '@fortawesome/pro-light-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Cookies } from 'react-cookie';
import { BuildingStore } from '../../store/BuildingStore';
import './style.css';
import { ceil } from 'lodash';

const EditPlugRule = ({
    showEditRule,
    handleEditRuleClose,
    currentData,
    setCurrentData,
    handleCurrentDataChange,
    updatePlugRuleData,
    updateSocketLink,
    updateSocketUnlink,
    modelRefresh,
    setModelRefresh,
    rulesToLink,
    rulesToUnLink,
    setRulesToLink,
    setRulesToUnLink,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const activeBuildingId = localStorage.getItem('buildingId');

    const { v4: uuidv4 } = require('uuid');
    const getConditionId = () => uuidv4();

    const [activeRuleId, setActiveRuleId] = useState(null);

    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedRuleFilter, setSelectedRuleFilter] = useState(0);

    const [linkedRuleData, setLinkedRuleData] = useState([]);
    const [unLinkedRuleData, setUnLinkedRuleData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [allLinkedRuleData, setAllLinkedRuleData] = useState([]);
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [totalSocket,setTotalSocket]=useState(0);
    const [paginationData, setPaginationData] = useState({});

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    
    const socketData = [
        {
            equip_type: 'Monitor',
            location: 'Floor 1 > 152',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
        {
            equip_type: 'Desktop PC',
            location: 'Floor 1 > 152',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
        {
            equip_type: 'Floor Lamp',
            location: 'Floor 1 > 152',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
        {
            equip_type: 'Monitor',
            location: 'Floor 1 > 153',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
    ];

    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        toolbar: {
            show: true,
        },
        colors: ['#87AADE'],
        stroke: {
            curve: 'straight',
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        stroke: {
            width: [2, 2],
        },
        plotOptions: {
            bar: {
                columnWidth: '20%',
            },
        },
        tooltip: {
            shared: false,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            x: {
                show: true,
                format: 'dd/MMM',
            },
            y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    return value + ' K';
                },
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'dd/MMM - hh:mm TT',
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    var val = Math.abs(value);
                    if (val >= 1000) {
                        val = (val / 1000).toFixed(0) + ' K';
                    }
                    return val;
                },
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    });

    const [lineChartData, setLineChartData] = useState([
        {
            data: [
                {
                    x: 'May 13',
                    y: '0.07',
                },
                {
                    x: 'May 26',
                    y: '0.01',
                },
                {
                    x: 'May 27',
                    y: '123.45',
                },
                {
                    x: 'May 28',
                    y: '7.20',
                },
                {
                    x: 'Jun 3',
                    y: '0.07',
                },
                {
                    x: 'Jun 4',
                    y: '21.60',
                },
                {
                    x: 'Jun 5',
                    y: '25.20',
                },
                {
                    x: 'Jun 6',
                    y: '21.75',
                },
                {
                    x: 'Jun 8',
                    y: '820.01',
                },
            ],
        },
    ]);
    const handleFilterEquipment=(e)=>{
        let activeId=e.target.value;
        if(activeId==="All"){
            setAllLinkedRuleData(allData);
            // console.log(allData);
        }
        else{
        const result = allData.find( ({ id }) => id === activeId );
        // console.log(result);
        let arr=[];
        arr.push(result);
        // console.log(arr)
        setAllLinkedRuleData(arr);
        }
    }

    const handleSwitchChange = () => {
        let obj = currentData;
        obj.is_active = !currentData.is_active;
        handleCurrentDataChange('is_active', obj.is_active);
    };

    const createScheduleCondition = () => {
        let currentObj = currentData;
        let obj = {
            action_type: false,
            action_time: '08:00 AM',
            action_day: [],
            condition_id: getConditionId(),
            is_deleted: false,
        };
        currentObj.action.push(obj);
        handleCurrentDataChange('action', currentObj.action);
    };

    const showOptionToDelete = (condition_id) => {
        let currentObj = currentData;
        currentData.action.forEach((record) => {
            if (record.condition_id === condition_id) {
                record.is_deleted = !record.is_deleted;
            }
        });
        handleCurrentDataChange('action', currentObj.action);
    };

    const deleteScheduleCondition = (condition_id) => {
        let currentObj = currentData;
        let newArray = [];
        currentObj.action.forEach((record) => {
            if (record.condition_id !== condition_id) {
                newArray.push(record);
            }
        });
        currentObj.action = newArray;
        handleCurrentDataChange('action', currentObj.action);
    };

    const handleSchedularConditionChange = (key, value, condition_id) => {
        let currentObj = currentData;
        currentObj.action.forEach((record) => {
            if (record.condition_id === condition_id) {
                record[key] = value === 'true' ? true : false;
            }
        });
        handleCurrentDataChange('action', currentObj.action);
    };

    const handleSchedularTimeChange = (key, value, condition_id) => {
        let currentObj = currentData;
        currentObj.action.forEach((record) => {
            if (record.condition_id === condition_id) {
                record[key] = value;
            }
        });
        handleCurrentDataChange('action', currentObj.action);
    };

    const handleActionDayChange = (day, condition_id) => {
        let currentObj = currentData;

        currentObj.action.forEach((record) => {
            if (record.condition_id === condition_id) {
                let newArray = [];
                if (record.action_day.includes(day)) {
                    newArray = record.action_day.filter((el) => el !== day);
                } else {
                    record.action_day.push(day);
                    newArray = record.action_day;
                }
                record.action_day = newArray;
            }
        });
        handleCurrentDataChange('action', currentObj.action);
    };

    const handleRuleStateChange = (value, rule) => {
        if (value === 'true') {
            let linkedData = linkedRuleData;
            let unLinkedData = unLinkedRuleData;
            let newLinkedData = linkedData.filter((el) => el.id !== rule.id);
            rule.linked_rule = false;
            unLinkedData.push(rule);
            setLinkedRuleData(newLinkedData);
            setUnLinkedRuleData(unLinkedData);

            let recordToUnLink = rulesToUnLink;
            recordToUnLink.rule_id = currentData.id;
            recordToUnLink.sensor_id.push(rule.id);
            setRulesToUnLink(recordToUnLink);

            let recordToLink = rulesToLink;
            let newRecordToLink = recordToLink.sensor_id.filter((el) => el !== rule.id);
            recordToLink.sensor_id = newRecordToLink;
            setRulesToLink(recordToLink);
        }

        if (value === 'false') {
            let linkedData = linkedRuleData;
            let unLinkedData = unLinkedRuleData;
            let newUnLinkedData = unLinkedData.filter((el) => el.id !== rule.id);
            rule.linked_rule = true;
            linkedData.push(rule);
            setLinkedRuleData(linkedData);
            setUnLinkedRuleData(newUnLinkedData);

            let recordToLink = rulesToLink;
            recordToLink.rule_id = currentData.id;
            recordToLink.sensor_id.push(rule.id);
            setRulesToLink(recordToLink);

            let recordToUnLink = rulesToUnLink;
            let newRecordToUnLink = recordToUnLink.sensor_id.filter((el) => el !== rule.id);
            recordToUnLink.sensor_id = newRecordToUnLink;
            setRulesToUnLink(recordToUnLink);
        }
    };

    const nextPageData = async (path) => {
        // console.log("next path ",path);
        try {
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setPageNo(pageNo+1)
            let params = `?page_size=${pageSize}&page_no=${pageNo+1}&rule_id=${activeRuleId}&building_id=${activeBuildingId}`;
            await axios.get(`${BaseUrl}${unLinkSocketRules}${params}`, { headers }).then((res) => {
                let response = res.data;
                let unLinkedData = [];
                response.data.forEach((record) => {
                    record.linked_rule = false;
                    unLinkedData.push(record);
                });
                setUnLinkedRuleData(unLinkedData);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch all Active Devices');
        }
    };

    const previousPageData = async (path) => {
        try {
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setPageNo(pageNo-1)
            let params = `?page_size=${pageSize}&page_no=${pageNo-1}&rule_id=${activeRuleId}&building_id=${activeBuildingId}`;
            await axios.get(`${BaseUrl}${unLinkSocketRules}${params}`, { headers }).then((res) => {
                let response = res.data;
                    let unLinkedData = [];
                    response.data.forEach((record) => {
                        record.linked_rule = false;
                        unLinkedData.push(record);
                    });
                    setUnLinkedRuleData(unLinkedData);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch all Active Devices');
        }
    };


    useEffect(() => {
        if (activeRuleId === null) {
            return;
        }
        const fetchLinkedSocketRules = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?rule_id=${activeRuleId}&building_id=${activeBuildingId}`;
                await axios.get(`${BaseUrl}${linkSocketRules}${params}`, { headers }).then((res) => {
                    let response = res.data;
                   
                    let linkedData = [];
                    response.data.sensor_id.forEach((record) => {
                        record.linked_rule = true;
                        linkedData.push(record);
                    });
                    // console.log(response.data);
                    setLinkedRuleData(linkedData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch list of Linked Rules data');
            }
        };

        const fetchUnLinkedSocketRules = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?page_size=${pageSize}&page_no=${pageNo}&rule_id=${activeRuleId}&building_id=${activeBuildingId}`;
                await axios.get(`${BaseUrl}${unLinkSocketRules}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    // console.log(response.total_data);
                    setTotalSocket(parseInt(response.total_data));
                    let unLinkedData = [];
                    response.data.forEach((record) => {
                        record.linked_rule = false;
                        unLinkedData.push(record);
                    });
                    setUnLinkedRuleData(unLinkedData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch list of Unlinked Rules data');
            }
        };

        fetchLinkedSocketRules();
        fetchUnLinkedSocketRules();
    }, [activeRuleId]);

    useEffect(() => {
        let arr1 = [];
        let arr2 = [];

        arr1 = linkedRuleData;
        arr2 = unLinkedRuleData;

        const allRuleData = arr1.concat(arr2);
        setAllLinkedRuleData(allRuleData);
        // console.log(allRuleData);
        // console.log(totalSocket);
        const fetchAllData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?page_size=${totalSocket}&page_no=${pageNo}&rule_id=${activeRuleId}&building_id=${activeBuildingId}`;
                await axios.get(`${BaseUrl}${unLinkSocketRules}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    let unLinkedData = [];
                    response.data.forEach((record) => {
                        record.linked_rule = false;
                        unLinkedData.push(record);
                    });
                    setAllData(unLinkedData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch list of Unlinked Rules data');
            }
        };
        fetchAllData();
    }, [linkedRuleData, unLinkedRuleData]);

    useEffect(() => {
        // console.log('currentData', currentData);
        let id = currentData.id ? currentData.id : null;
        setActiveRuleId(id);
    }, [currentData]);

    return (
        <>
            <Modal
                show={showEditRule}
                onHide={handleEditRuleClose}
                dialogClassName="plug-edit-model-styling"
                backdrop="static"
                keyboard={false}>
                <div>
                    <div className="plugrule-container-bgrd">
                        <div className="single-plugrule-container">
                            <div className="plugrule-page-header">
                                <div>
                                    <div className="mb-1">
                                        <span className="plugrule-device-style">Plug Rule</span>
                                    </div>
                                    <div>
                                        <span className="plugrule-device-name">{currentData.name}</span>
                                        <span className="plugrule-device-timezone">
                                            {' '}
                                            TimeZone- {localStorage.getItem('timeZone')}
                                        </span>
                                    </div>
                                </div>
                                <div className="plug-rule-right-flex">
                                    <div className="plug-rule-switch-header">
                                        <Switch
                                            onChange={() => {
                                                handleSwitchChange();
                                            }}
                                            checked={!currentData.is_active}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={20}
                                            width={36}
                                        />
                                        <span className="ml-2 plug-rule-switch-font">Not Active</span>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-default plugrule-cancel-style"
                                            onClick={() => {
                                                handleEditRuleClose();
                                                setActiveRuleId(null);
                                            }}>
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary plugrule-save-style ml-2"
                                            onClick={() => {
                                                updatePlugRuleData();
                                                updateSocketLink();
                                                updateSocketUnlink();
                                                setActiveRuleId(null);
                                                handleEditRuleClose();
                                            }}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 single-passive-tabs-style">
                                <span
                                    className={
                                        selectedTab === 0
                                            ? 'mr-3 single-plugrule-tab-active'
                                            : 'mr-3 single-plugrule-tab'
                                    }
                                    onClick={() => setSelectedTab(0)}>
                                    Rule Details
                                </span>
                                <span
                                    className={
                                        selectedTab === 1
                                            ? 'mr-3 single-plugrule-tab-active'
                                            : 'mr-3 single-plugrule-tab'
                                    }
                                    onClick={() => setSelectedTab(1)}>
                                    Sockets ({totalSocket})
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedTab === 0 && (
                        <div>
                            <div className="container plug-rule-body-style">
                                <div className="row">
                                    <div className="col-4">
                                        <h5 className="plug-rule-title">Details</h5>
                                        <span className="plug-rule-subtitle">
                                            Set filters to choose equipment for this rule.
                                        </span>
                                        <div className="mt-2">
                                            <div>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label className="device-label-style">Name</Form.Label>
                                                    <Form.Control
                                                        type="textarea"
                                                        placeholder="Enter Rule Name"
                                                        className="passive-location-style font-weight-bold"
                                                        value={currentData.name}
                                                        onChange={(e) => {
                                                            handleCurrentDataChange('name', e.target.value);
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label className="device-label-style">Description</Form.Label>
                                                    <Input
                                                        type="textarea"
                                                        name="text"
                                                        id="exampleText"
                                                        rows="4"
                                                        placeholder="Enter Description of Rule"
                                                        value={currentData.description}
                                                        className="font-weight-bold"
                                                        onChange={(e) => {
                                                            handleCurrentDataChange('description', e.target.value);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <h5 className="plug-rule-title">Schedule</h5>
                                        <span className="plug-rule-subtitle">
                                            Choose actions and times for this rule.
                                        </span>

                                        <div className="plugrule-schedule-container p-3">
                                            <div className="plugrule-schedule-heading ml-1 mb-1">
                                                <div>Action</div>
                                                <div>Time</div>
                                                <div>Days</div>
                                            </div>

                                            <hr className="plugrule-schedule-breaker" />

                                            {currentData.action &&
                                                currentData.action.map((record, index) => {
                                                    return (
                                                        <>
                                                            <div className="plugrule-schedule-row mb-1">
                                                                <div className="schedule-left-flex">
                                                                    <div>
                                                                        <Input
                                                                            type="select"
                                                                            name="state"
                                                                            id="userState"
                                                                            className="font-weight-bold"
                                                                            size="sm"
                                                                            onChange={(e) => {
                                                                                handleSchedularConditionChange(
                                                                                    'action_type',
                                                                                    e.target.value,
                                                                                    record.condition_id
                                                                                );
                                                                            }}
                                                                            value={record.action_type}>
                                                                            <option value={false}>Turn Off</option>
                                                                            <option value={true}>Turn On</option>
                                                                        </Input>
                                                                    </div>
                                                                    <div>at</div>
                                                                    <div>
                                                                        <DatePicker
                                                                            value={record.action_time}
                                                                            showTimeSelect
                                                                            showTimeSelectOnly
                                                                            timeIntervals={15}
                                                                            timeCaption="Time"
                                                                            dateFormat="h:mm aa"
                                                                            className="time-picker-style"
                                                                            onChange={(date) => {
                                                                                handleSchedularTimeChange(
                                                                                    'action_time',
                                                                                    moment(date).format('hh:mm A'),
                                                                                    record.condition_id
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div>on</div>
                                                                    <div className="schedular-weekday-group">
                                                                        <div
                                                                            className={
                                                                                record.action_day.includes('mon')
                                                                                    ? 'schedular-weekday-active'
                                                                                    : 'schedular-weekday'
                                                                            }
                                                                            onClick={() => {
                                                                                handleActionDayChange(
                                                                                    'mon',
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            Mo
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                record.action_day.includes('tue')
                                                                                    ? 'schedular-weekday-active'
                                                                                    : 'schedular-weekday'
                                                                            }
                                                                            onClick={() => {
                                                                                handleActionDayChange(
                                                                                    'tue',
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            Tu
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                record.action_day.includes('wed')
                                                                                    ? 'schedular-weekday-active'
                                                                                    : 'schedular-weekday'
                                                                            }
                                                                            onClick={() => {
                                                                                handleActionDayChange(
                                                                                    'wed',
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            We
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                record.action_day.includes('thr')
                                                                                    ? 'schedular-weekday-active'
                                                                                    : 'schedular-weekday'
                                                                            }
                                                                            onClick={() => {
                                                                                handleActionDayChange(
                                                                                    'thr',
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            Th
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                record.action_day.includes('fri')
                                                                                    ? 'schedular-weekday-active'
                                                                                    : 'schedular-weekday'
                                                                            }
                                                                            onClick={() => {
                                                                                handleActionDayChange(
                                                                                    'fri',
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            Fr
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                record.action_day.includes('sat')
                                                                                    ? 'schedular-weekday-active'
                                                                                    : 'schedular-weekday'
                                                                            }
                                                                            onClick={() => {
                                                                                handleActionDayChange(
                                                                                    'sat',
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            Sa
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                record.action_day.includes('sun')
                                                                                    ? 'schedular-weekday-active'
                                                                                    : 'schedular-weekday'
                                                                            }
                                                                            onClick={() => {
                                                                                handleActionDayChange(
                                                                                    'sun',
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            Su
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {record.is_deleted ? (
                                                                    <div className="schedule-delete-group">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-default schedule-cancel-style"
                                                                            onClick={() => {
                                                                                showOptionToDelete(record.condition_id);
                                                                            }}>
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-default schedule-delete-style"
                                                                            onClick={() => {
                                                                                deleteScheduleCondition(
                                                                                    record.condition_id
                                                                                );
                                                                            }}>
                                                                            Delete?
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <FontAwesomeIcon
                                                                            icon={faTrashCan}
                                                                            size="md"
                                                                            onClick={() => {
                                                                                showOptionToDelete(record.condition_id);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <hr className="plugrule-schedule-breaker" />
                                                        </>
                                                    );
                                                })}

                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-default add-condition-style"
                                                    onClick={() => {
                                                        createScheduleCondition();
                                                    }}>
                                                    Add Condition
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="plugrule-demand-chart-container">
                                <div className="plugrule-chart-header m-3">
                                    <div>
                                        <h5 className="plugrule-chart-title mb-1">Average Energy Demand</h5>
                                        <p className="plugrule-chart-subtitle">Last 2 Weeks</p>
                                    </div>
                                    <div>
                                        <p className="plugrule-chart-subtitle mb-1">Estimated Energy Savings</p>
                                        <h5 className="plugrule-chart-title float-right">1,722 kWh</h5>
                                    </div>
                                </div>
                                <div className="total-eng-consumtn">
                                    <LineChart options={lineChartOptions} series={lineChartData} height={200} />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === 1 && (
                        <div>
                            <div className="container plug-rule-body-style">
                                <div className="row">
                                    <div className="socket-filters-flex">
                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title ml-2">
                                                    Show
                                                </Form.Label>
                                                <br />
                                                <div className="btn-group ml-2" role="group" aria-label="Basic example">
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className={
                                                                selectedRuleFilter === 0
                                                                    ? 'btn btn-light d-offline custom-active-btn'
                                                                    : 'btn btn-white d-inline custom-inactive-btn'
                                                            }
                                                            style={{
                                                                borderTopRightRadius: '0px',
                                                                borderBottomRightRadius: '0px',
                                                            }}
                                                            onClick={() => setSelectedRuleFilter(0)}>
                                                            All
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={
                                                                selectedRuleFilter === 1
                                                                    ? 'btn btn-light d-offline custom-active-btn'
                                                                    : 'btn btn-white d-inline custom-inactive-btn'
                                                            }
                                                            style={{ borderRadius: '0px' }}
                                                            onClick={() => setSelectedRuleFilter(1)}>
                                                            Selected
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={
                                                                selectedRuleFilter === 2
                                                                    ? 'btn btn-light d-offline custom-active-btn'
                                                                    : 'btn btn-white d-inline custom-inactive-btn'
                                                            }
                                                            style={{
                                                                borderTopLeftRadius: '0px',
                                                                borderBottomLeftRadius: '0px',
                                                            }}
                                                            onClick={() => setSelectedRuleFilter(2)}>
                                                            Unselected
                                                        </button>
                                                    </div>
                                                </div>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Equipment Type
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width"
                                                    onChange={(e)=>{handleFilterEquipment(e)}}>
                                                        <option>Select Equipment Type</option>
                                                    <option value="All">ALL</option>
                                                    {allData.map((record, index) => {
                                                         return (
                                                        <option value={record.id}>{record.name}</option>
                                                    )})}

                                                    {/* <option>Option 1</option> */}
                                                </Input>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Location
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width">
                                                    <option>Filtered</option>
                                                    {/* <option>Filtered</option> */}
                                                    {/* <option>Option 1</option> */}
                                                </Input>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Tags
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width">
                                                    <option>All</option>
                                                    {/* <option>Option 1</option> */}
                                                </Input>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Assigned Rule
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width">
                                                    <option>None</option>
                                                    {/* <option>Option 1</option> */}
                                                </Input>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <Table className="mb-0 bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        id="vehicle1"
                                                        name="vehicle1"
                                                        checked={false}
                                                        disabled
                                                    />
                                                </th>
                                                {/* <th>MAC Address</th> */}
                                                <th>Equipment Type</th>
                                                <th>Location</th>
                                                <th>Assigned Rule</th>
                                                {/* <th>Tags</th>
                                                <th>Last Data</th> */}
                                            </tr>
                                        </thead>

                                        {selectedRuleFilter === 0 && (
                                            <tbody>
                                                {allLinkedRuleData.map((record, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    id="socket_rule"
                                                                    name="socket_rule"
                                                                    checked={record.linked_rule}
                                                                    value={record.linked_rule ? true : false}
                                                                    onChange={(e) => {
                                                                        handleRuleStateChange(e.target.value, record);
                                                                    }}
                                                                />
                                                            </td>

                                                            {/* Just added */}
                                                            {/* <td className="font-weight-bold">{record.name}</td> */}

                                                            {record.equipment_link_type === '' ? (
                                                                <td className="font-weight-bold panel-name">
                                                                    {record.name}
                                                                </td>
                                                            ) : (
                                                                <td className="font-weight-bold panel-name">
                                                                    <div className="plug-equip-container">
                                                                        {`${record.equipment_link_type} [${record.equipment_link}]`}
                                                                    </div>
                                                                </td>
                                                            )}

                                                            <td className="font-weight-bold">
                                                                {record.equipment_link_location}
                                                            </td>

                                                            <td className="font-weight-bold">
                                                                {record.assigned_rules.length === 0
                                                                    ? 'None'
                                                                    : record.assigned_rules}
                                                            </td>

                                                            {/* <td className="font-weight-bold">{record.tag}</td>

                                                            <td className="font-weight-bold">{record.last_data}</td> */}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        )}

                                        {selectedRuleFilter === 1 && (
                                            <tbody>
                                                {linkedRuleData.map((record, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    id="socket_rule"
                                                                    name="socket_rule"
                                                                    checked={record.linked_rule}
                                                                    value={record.linked_rule ? true : false}
                                                                    onChange={(e) => {
                                                                        handleRuleStateChange(e.target.value, record);
                                                                    }}
                                                                />
                                                            </td>

                                                            <td className="font-weight-bold panel-name">
                                                                <div className="plug-equip-container">
                                                                    {`${record.equipment_link_type} [${record.equipment_link}]`}
                                                                </div>
                                                            </td>

                                                            <td className="font-weight-bold">
                                                                {record.equipment_link_location}
                                                            </td>
                                                            <td className="font-weight-bold">
                                                                {record.assigned_rules.length === 0
                                                                    ? 'None'
                                                                    : record.assigned_rules}
                                                            </td>
                                                            {/* <td className="font-weight-bold">{record.tag}</td>
                                                            <td className="font-weight-bold">{record.last_data}</td> */}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        )}

                                        {selectedRuleFilter === 2 && (
                                            <tbody>
                                                {unLinkedRuleData.map((record, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    id="socket_rule"
                                                                    name="socket_rule"
                                                                    checked={record.linked_rule}
                                                                    value={record.linked_rule ? true : false}
                                                                    onChange={(e) => {
                                                                        handleRuleStateChange(e.target.value, record);
                                                                    }}
                                                                />
                                                            </td>

                                                            <td className="font-weight-bold panel-name">
                                                                <div className="plug-equip-container">
                                                                    {`${record.equipment_link_type} [${record.equipment_link}]`}
                                                                </div>
                                                            </td>

                                                            <td className="font-weight-bold">
                                                                {record.equipment_link_location}
                                                            </td>
                                                            <td className="font-weight-bold">
                                                                {record.assigned_rules.length === 0
                                                                    ? 'None'
                                                                    : record.assigned_rules}
                                                            </td>
                                                            {/* <td className="font-weight-bold">{record.tag}</td>
                                                            <td className="font-weight-bold">{record.last_data}</td> */}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        )}
                                    </Table>
                                    <div className="page-button-style">
                    <button
                        type="button"
                        className="btn btn-md btn-light font-weight-bold mt-4"
                        disabled={pageNo<=1}
                        onClick={() => {
                            previousPageData();
                        }}>
                        Previous
                    </button>
                    <button
                        type="button"
                        className="btn btn-md btn-light font-weight-bold mt-4"
                        disabled={pageNo>=ceil(totalSocket/pageSize)}
                        onClick={() => {
                            nextPageData();
                        }}>
                        Next
                    </button>
                </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default EditPlugRule;
