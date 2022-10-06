import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { MultiSelect } from 'react-multi-select-component';
import Form from 'react-bootstrap/Form';
import { Table, Input, Button } from 'reactstrap';
import Switch from 'react-switch';
import LineChart from '../charts/LineChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useParams } from 'react-router-dom';
import Select from '../../sharedComponents/form/select';

import { timePicker15MinutesIntervalOption } from '../../constants/time';

import { faTrashCan } from '@fortawesome/pro-light-svg-icons';
import moment from 'moment';
import { Cookies } from 'react-cookie';
import {
    updatePlugRuleRequest,
    fetchPlugRuleDetails,
    deletePlugRuleRequest,
    getGraphDataRequest,
    getListSensorsForBuildingsRequest,
    linkSocketRequest,
    listLinkSocketRulesRequest,
    unlinkSocketRequest,
    getUnlinkedSocketRules,
} from '../../services/plugRules';
import './style.scss';
import { ceil } from 'lodash';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const PlugRule = () => {
    let cookies = new Cookies();
    const { ruleId } = useParams();

    const [rulesToUnLink, setRulesToUnLink] = useState({
        rule_id: '',
        sensor_id: [],
    });

    const activeBuildingId = localStorage.getItem('buildingId');

    const { v4: uuidv4 } = require('uuid');
    const history = useHistory();

    const getConditionId = () => uuidv4();
    const [currentData, setCurrentData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteConditionModal, setShowDeleteConditionModal] = useState(false);
    const [currentScheduleIdToDelete, setCurrentScheduleIdToDelete] = useState();

    const [rulesToLink, setRulesToLink] = useState({
        rule_id: '',
        sensor_id: [],
    });
    const [skeletonLoading, setSkeletonLoading] = useState(true);

    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedRuleFilter, setSelectedRuleFilter] = useState(0);

    const [linkedRuleData, setLinkedRuleData] = useState([]);
    const [unLinkedRuleData, setUnLinkedRuleData] = useState([]);
    const [allUnlinkedRuleAdded, setAllUnlinkedRuleAdded] = useState([]);
    const [isDeletting, setIsDeletting] = useState(false);
    const [allData, setAllData] = useState([]);
    const [allLinkedRuleData, setAllLinkedRuleData] = useState([]);
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [totalSocket, setTotalSocket] = useState(0);
    const [checkedAll, setCheckedAll] = useState(false);
    const [options, setOptions] = useState([]);
    const [macOptions, setMacOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [sensorOptions, setSensorOptions] = useState([]);
    const [annotationXAxis, setAnnotationXAxis] = useState([
        {
            x: 'Sat 12 am',
            x2: 'Sat 12 pm',
            label: {
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 2,
                text: 'off',
                textAnchor: 'middle',
                position: 'top',
                orientation: 'horizontal',
                offsetX: 60,
                offsetY: -15,

                style: {
                    background: '#333',
                    fontSize: '15px',
                    fontWeight: 400,
                },
            },
        },
        {
            x: 'Sun 12 am',
            x2: 'Sun 12 pm',
            label: {
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 2,
                text: 'off',
                textAnchor: 'middle',
                position: 'top',
                orientation: 'horizontal',
                offsetX: 60,
                offsetY: -15,

                style: {
                    background: '#333',
                    fontSize: '15px',
                    fontWeight: 400,
                },
            },
        },
    ]);
    const [hoursNew, setHoursNew] = useState([]);

    const hours = [];
    const generateHours = () => {
        for (let day = 0; day < 8; day++) {
            for (let hour = 0; hour < 24; hour += 12) {
                hours.push(moment({ day, hour }).format('ddd h a'));
                setHoursNew(hours);
            }
        }
    };

    useEffect(() => {
        generateHours();
        fetchPlugRuleDetail();
    }, []);

    const fetchPlugRuleDetail = async () => {
        await fetchPlugRuleDetails(ruleId).then((res) => {
            if (res.status) {
                setSkeletonLoading(false);
            }
            let response = res.data;
            setCurrentData(response.data);
        });
    };
    const deletePlugRule = async () => {
        setIsDeletting(true);
        await deletePlugRuleRequest(ruleId).then((res) => {
            if (res.status) {
                history.push({
                    pathname: `/control/plug-rules/`,
                });
            }
        });
    };
    const getGraphData = async () => {
        await getGraphDataRequest(activeBuildingId, sensorsIdNow).then((res) => {
            if (res.status) {
                let response = res.data;
                setTotalGraphData(response);
            }
        });
    };

    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
            id: 'areachart-2',
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#87AADE'],
        stroke: {
            curve: 'straight',
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
                formatter: function (value) {
                    return value + ' K';
                },
            },
        },

        annotations: {
            xaxis: [
                {
                    x: 'Mon 12 am',
                    x2: 'Mon 12 pm',
                    strokeDashArray: 0,
                    borderColor: '#775DD0',
                    label: {
                        borderColor: '#775DD0',
                        style: {
                            color: '#000',
                            background: '#775DD0',
                        },
                    },
                },
                {
                    x: 'Tue 12 am',
                    x2: 'Tue 12 pm',
                    strokeDashArray: 0,
                    borderColor: '#775DD0',
                    label: {
                        borderColor: '#775DD0',
                        style: {
                            color: '#000',
                            background: '#775DD0',
                        },
                    },
                },
            ],
        },

        xaxis: {
            categories: [
                'Sun 12AM',
                'Sun 12PM',
                'Mon 12AM',
                'Mon 12PM',
                'Tue 12AM',
                'Tue 12PM',
                'Wed 12AM',
                'Wed 12PM',
                'Thu 12AM',
                'Thu 12PM',
                'Fri 12AM',
                'Fri 12PM',
                'Sat 12AM',
                'Sat 12PM',
                'Sun 12AM',
            ],
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
                // cssClass: 'apexcharts-xaxis-label',
            },
        },
    });

    useEffect(() => {
        setLineChartOptions({
            chart: {
                type: 'line',
                zoom: {
                    enabled: false,
                },
                id: 'areachart-2',
            },
            dataLabels: {
                enabled: false,
            },

            colors: ['#87AADE'],
            stroke: {
                curve: 'straight',
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
                    formatter: function (value) {
                        return value + ' K';
                    },
                },
            },

            annotations: {
                xaxis: annotationXAxis,
            },

            xaxis: {
                categories: [
                    'Sun 12AM',
                    'Sun 12PM',
                    'Mon 12AM',
                    'Mon 12PM',
                    'Tue 12AM',
                    'Tue 12PM',
                    'Wed 12AM',
                    'Wed 12PM',
                    'Thu 12AM',
                    'Thu 12PM',
                    'Fri 12AM',
                    'Fri 12PM',
                    'Sat 12AM',
                    'Sat 12PM',
                    'Sun 12AM',
                ],
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
                },
            },
        });
    }, [annotationXAxis]);

    const [lineChartData, setLineChartData] = useState([]);

    const [totalGraphData, setTotalGraphData] = useState();

    useEffect(() => {
        setLineChartData([
            {
                data: [
                    {
                        x: `${hoursNew[2]}`,
                        y: '0.07',
                    },
                    {
                        x: `${hoursNew[3]}`,
                        y: '49.1',
                    },
                    {
                        x: `${hoursNew[4]}`,
                        y: '10.3',
                    },
                    {
                        x: `${hoursNew[5]}`,
                        y: '49.3',
                    },
                    {
                        x: `${hoursNew[6]}`,
                        y: '45.3',
                    },
                    {
                        x: `${hoursNew[7]}`,
                        y: '45.3',
                    },
                    {
                        x: `${hoursNew[8]}`,
                        y: '45.1',
                    },
                    {
                        x: `${hoursNew[9]}`,
                        y: '10.3',
                    },
                    {
                        x: `${hoursNew[10]}`,
                        y: '45.3',
                    },
                    {
                        x: `${hoursNew[11]}`,
                        y: '91.3',
                    },
                    {
                        x: `${hoursNew[12]}`,
                        y: '45.3',
                    },
                    {
                        x: `${hoursNew[13]}`,
                        y: '10.3',
                    },
                    {
                        x: `${hoursNew[14]}`,
                        y: '20.3',
                    },
                    {
                        x: `${hoursNew[15]}`,
                        y: '10.3',
                    },
                ],
            },
        ]);
    }, [hoursNew]);

    const [selectedOption, setSelectedOption] = useState([]);
    const [selectedOptionMac, setSelectedOptionMac] = useState([]);
    const [selectedOptionLocation, setSelectedOptionLocation] = useState([]);
    const [selectedOptionSensor, setSelectedOptionSensor] = useState([]);

    const [selectedEqupimentOption, setSelectedEqupimentOption] = useState([]);
    const [equpimentTypeFilterString, setEqupimentTypeFilterString] = useState('');

    const [selectedMacOption, setSelectedMacOption] = useState([]);
    const [macTypeFilterString, setMacTypeFilterString] = useState('');

    const [selectedLocationOption, setSelectedLocationOption] = useState([]);
    const [locationTypeFilterString, setLocationTypeFilterString] = useState('');

    const [selectedSensorOption, setSelectedSensorOption] = useState([]);
    const [sensorTypeFilterString, setSensorTypeFilterString] = useState('');

    const [sensorsIdNow, setSensorIdNow] = useState('');
    const [equpimentTypeAdded, setEqupimentTypeAdded] = useState([]);
    const [unlinkedSocketRuleSuccess, setUnlinkedSocketRuleSuccess] = useState(false);

    useEffect(() => {
        if (sensorsIdNow) {
            getGraphData();
        }
    }, [sensorsIdNow]);

    const handleEqupimentTypeFilter = () => {
        return selectedOption?.map((item) => {
            setSelectedEqupimentOption((el) => [...el, item?.value]);
        });
    };

    const handleMacFilter = () => {
        return selectedOptionMac?.map((item) => {
            setSelectedMacOption((el) => [...el, item?.value]);
        });
    };

    const handleLocationFilter = () => {
        return selectedOptionLocation?.map((item) => {
            setSelectedLocationOption((el) => [...el, item?.value]);
        });
    };

    const handleSensorFilter = () => {
        return selectedOptionSensor?.map((item) => {
            setSelectedSensorOption((el) => [...el, item?.value]);
        });
    };

    useEffect(() => {
        setSelectedEqupimentOption([]);
        handleEqupimentTypeFilter();
    }, [selectedOption]);

    useEffect(() => {
        setSelectedMacOption([]);
        handleMacFilter();
    }, [selectedOptionMac]);

    useEffect(() => {
        setSelectedLocationOption([]);
        handleLocationFilter();
    }, [selectedOptionLocation]);

    useEffect(() => {
        setSelectedSensorOption([]);
        handleSensorFilter();
    }, [selectedOptionSensor]);

    const equpimentTypeFilterStringFunc = () => {
        return setEqupimentTypeFilterString(selectedEqupimentOption?.join('%2B'));
    };

    const macFilterStringFunc = () => {
        return setMacTypeFilterString(selectedMacOption?.join('%2B'));
    };

    const locationFilterStringFunc = () => {
        return setLocationTypeFilterString(selectedLocationOption?.join('%2B'));
    };

    const sensorFilterStringFunc = () => {
        return setSensorTypeFilterString(selectedSensorOption?.join('%2B'));
    };

    useEffect(() => {
        equpimentTypeFilterStringFunc();
    }, [selectedEqupimentOption]);

    useEffect(() => {
        macFilterStringFunc();
    }, [selectedMacOption]);

    useEffect(() => {
        locationFilterStringFunc();
    }, [selectedLocationOption]);

    useEffect(() => {
        sensorFilterStringFunc();
    }, [selectedSensorOption]);

    const handleSwitchChange = () => {
        let obj = currentData;
        obj.is_active = !currentData.is_active;
        handleCurrentDataChange('is_active', obj.is_active);
    };

    const handleCurrentDataChange = (key, value) => {
        let obj = Object.assign({}, currentData);
        obj[key] = value;
        setCurrentData(obj);
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
        setShowDeleteConditionModal(false);
    };

    const updateSocketLink = async () => {
        if (rulesToLink.sensor_id.length === 0) {
            return;
        }
        setIsProcessing(true);

        await linkSocketRequest(rulesToLink).then((res) => {
            console.log(res.data);
        });

        setIsProcessing(false);
        setPageRefresh(!pageRefresh);
    };

    const updateSocketUnlink = async () => {
        if (rulesToUnLink.sensor_id.length === 0) {
            return;
        }
        setIsProcessing(true);

        await unlinkSocketRequest(rulesToUnLink)
            .then((res) => {
                console.log(res.data);
            })
            .catch((error) => {
                console.log('Failed to update requested Socket Unlinking!', error);
            });

        setIsProcessing(false);
        setPageRefresh(!pageRefresh);
    };

    const handleSchedularConditionChange = (key, value, condition_id) => {
        let currentObj = currentData;
        currentObj.action.forEach((record) => {
            if (record.condition_id === condition_id) {
                record[key] = value === true;
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

    const nextPageData = async (path) => {
        setPageNo(pageNo + 1);

        await getListSensorsForBuildingsRequest(totalSocket, pageNo, ruleId, activeBuildingId).then((res) => {
            let response = res.data;
            let unLinkedData = [];
            response.data.forEach((record) => {
                record.linked_rule = false;
                unLinkedData.push(record);
            });
            setUnLinkedRuleData(unLinkedData);
        });
    };

    const previousPageData = async (path) => {
        setPageNo(pageNo - 1);

        await getListSensorsForBuildingsRequest(totalSocket, pageNo, ruleId, activeBuildingId).then((res) => {
            let response = res.data;
            let unLinkedData = [];
            response.data.forEach((record) => {
                record.linked_rule = false;
                unLinkedData.push(record);
            });
            setUnLinkedRuleData(unLinkedData);
        });
    };

    const addOptions = () => {
        return allData
            ?.filter((item) => item?.equipment_type_name?.length > 0)
            ?.map((record, index) => {
                setOptions((el) => [...el, { value: record?.equipment_type, label: record?.name }]);
                setEqupimentTypeAdded((el) => [...el, record?.equipment_type]);
                setMacOptions((el) => [...el, { value: record?.device_link, label: record?.device_link }]);
                if (record?.equipment_link_location) {
                    setLocationOptions((el) => [
                        ...el,
                        { value: record?.equipment_link_location_id, label: record?.equipment_link_location },
                    ]);
                }
                setSensorOptions((el) => [...el, { value: record?.sensor_number_2, label: record?.sensor_number_2 }]);
            });
    };

    useEffect(() => {
        if (allData) {
            addOptions();
        }
    }, [allData]);

    const uniqueIds = [];
    const [removeEqupimentTypesDuplication, setRemoveEqupimentTypesDuplication] = useState();

    const uniqueMacIds = [];
    const [removeMacDuplication, setRemoveMacDuplication] = useState();

    const removeDuplicates = () => {
        const uniqueEqupimentTypes = options.filter((element) => {
            const isDuplicate = uniqueIds.includes(element.id);
            if (!isDuplicate) {
                uniqueIds.push(element.id);
                return true;
            }
            return false;
        });

        setRemoveEqupimentTypesDuplication(uniqueEqupimentTypes);
    };

    const removeMacDuplicates = () => {
        const uniqueMac = macOptions.filter((element) => {
            const isDuplicate = uniqueMacIds.includes(element?.device_link);

            if (!isDuplicate) {
                uniqueMacIds.push(element?.device_link);
                return true;
            }
            return false;
        });

        setRemoveMacDuplication(uniqueMac);
    };

    useEffect(() => {
        removeDuplicates();
    }, [options]);

    useEffect(() => {
        removeMacDuplicates();
    }, [macOptions]);

    const fetchUnLinkedSocketRules = async () => {
        await getUnlinkedSocketRules(
            pageSize,
            pageNo,
            ruleId,
            activeBuildingId,
            equpimentTypeFilterString,
            macTypeFilterString,
            locationTypeFilterString,
            sensorTypeFilterString
        ).then((res) => {
            setUnlinkedSocketRuleSuccess(res.status);
            let response = res.data;
            setTotalSocket(parseInt(response.total_data));
            let unLinkedData = [];
            response.data.forEach((record) => {
                record.linked_rule = false;
                unLinkedData.push(record);
            });
            setUnLinkedRuleData(unLinkedData);
            setAllUnlinkedRuleAdded((el) => [...el, '1']);
        });
    };

    const fetchLinkedSocketRules = async () => {
        await listLinkSocketRulesRequest(ruleId, activeBuildingId)
            .then((res) => {
                let response = res.data;
                let linkedData = [];
                response.data.sensor_id.forEach((record) => {
                    record.linked_rule = true;
                    linkedData.push(record);
                });
                setLinkedRuleData(linkedData);
            })
            .catch((error) => {
                console.log('Failed to fetch list of Linked Rules data', error);
            });
    };

    useEffect(() => {
        if (ruleId === null) {
            return;
        }

        fetchLinkedSocketRules();
        fetchUnLinkedSocketRules();
    }, [ruleId, equpimentTypeFilterString, macTypeFilterString, locationTypeFilterString, sensorTypeFilterString]);

    useEffect(() => {
        let arr1 = [];
        let arr2 = [];

        arr1 = linkedRuleData;
        arr2 = unLinkedRuleData;

        const allRuleData = arr1.concat(arr2);
        setAllLinkedRuleData(allRuleData);
        const fetchAllData = async () => {
            await getListSensorsForBuildingsRequest(totalSocket, pageNo, ruleId, activeBuildingId).then((res) => {
                let response = res.data;
                let unLinkedData = [];
                response.data.forEach((record) => {
                    record.linked_rule = false;
                    unLinkedData.push(record);
                });
                setAllData(unLinkedData);
                setAllUnlinkedRuleAdded((el) => [...el, '2']);
            });
        };
        fetchAllData();
    }, [linkedRuleData, unLinkedRuleData]);

    return (
        <>
            <div className="single-plug-rule-container">
                <div className="plug-rule-page-header">
                    <div>
                        <div className="mb-1">
                            <span className="plug-rule-device">Plug Rule</span>
                        </div>
                        <div>
                            <span className="plug-rule-device-name">{currentData.name}</span>
                            <span className="plug-rule-device-timezone">
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
                                className="btn btn-default plug-rule-cancel"
                                onClick={() => {
                                    history.push({
                                        pathname: `/control/plug-rules`,
                                    });
                                }}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary plug-rule-save ml-2"
                                onClick={() => {
                                    updatePlugRuleData();
                                    updateSocketLink();
                                    updateSocketUnlink();
                                    history.push({
                                        pathname: `/control/plug-rules`,
                                    });
                                }}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-2 single-passive-tabs">
                    <span
                        className={selectedTab === 0 ? 'mr-3 single-plug-rule-tab-active' : 'mr-3 single-plug-rule-tab'}
                        onClick={() => setSelectedTab(0)}>
                        Rule Details
                    </span>
                    <span
                        className={selectedTab === 1 ? 'mr-3 single-plug-rule-tab-active' : 'mr-3 single-plug-rule-tab'}
                        onClick={() => setSelectedTab(1)}>
                        Sockets ({totalSocket})
                    </span>
                </div>
            </div>

            {selectedTab === 0 && (
                <>
                    <div className="plug-rule-body">
                        <div className="plug-rule-body-container">
                            <div className="plug-rule-body-left-column">
                                <h5 className="plug-rule-title">Details</h5>
                                <span className="plug-rule-subtitle">
                                    Set filters to choose equipment for this rule.
                                </span>
                                <div className="mt-2">
                                    <div>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label className="device-label">Name</Form.Label>
                                            <Form.Control
                                                type="textarea"
                                                placeholder="Enter Rule Name"
                                                className="passive-location font-weight-bold"
                                                style={{ cursor: 'pointer' }}
                                                value={currentData.name}
                                                onChange={(e) => {
                                                    handleCurrentDataChange('name', e.target.value);
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label className="device-label">Description</Form.Label>
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
                            <div className="plug-rule-body-right-column">
                                <h5 className="plug-rule-title">Schedule</h5>
                                <span className="plug-rule-subtitle">Choose actions and times for this rule.</span>

                                <div className="plug-rule-schedule-container p-3">
                                    <div className="plug-rule-schedule-heading ml-1 mb-1">
                                        <div>Action</div>
                                        <div>Time</div>
                                        <div>Days</div>
                                    </div>

                                    <hr className="plug-rule-schedule-breaker" />

                                    {currentData.action &&
                                        currentData.action.map((record, index) => {
                                            return (
                                                <>
                                                    <div className="plug-rule-schedule-row mb-1">
                                                        <div className="schedule-left-flex">
                                                            <div>
                                                                <Select
                                                                    defaultValue={record.action_type}
                                                                    label="Select"
                                                                    onChange={(event) => {
                                                                        handleSchedularConditionChange(
                                                                            'action_type',
                                                                            event.value,
                                                                            record.condition_id
                                                                        );
                                                                    }}
                                                                    options={[
                                                                        {
                                                                            label: 'Turn Off',
                                                                            value: false,
                                                                        },
                                                                        {
                                                                            label: 'Turn On',
                                                                            value: true,
                                                                        },
                                                                    ]}
                                                                />
                                                            </div>
                                                            <div>at</div>
                                                            <div>
                                                                <Select
                                                                    defaultValue={record.action_time}
                                                                    label="Select"
                                                                    onChange={(event) => {
                                                                        handleSchedularTimeChange(
                                                                            'action_time',
                                                                            event.value,
                                                                            record.condition_id
                                                                        );
                                                                    }}
                                                                    options={timePicker15MinutesIntervalOption}
                                                                />
                                                            </div>
                                                            <div>on</div>
                                                            <div className="schedular-weekday-group">
                                                                <div
                                                                    className={
                                                                        record.action_day.includes('mon')
                                                                            ? 'schedular-weekday'
                                                                            : 'schedular-weekday-active'
                                                                    }
                                                                    onClick={() => {
                                                                        handleActionDayChange(
                                                                            'mon',
                                                                            record.condition_id
                                                                        );
                                                                        if (record.action_day.includes('mon')) {
                                                                            setAnnotationXAxis((current) =>
                                                                                current.filter((item) => {
                                                                                    return item?.x !== 'Mon 12 am';
                                                                                })
                                                                            );
                                                                        }
                                                                        if (!record.action_day.includes('mon')) {
                                                                            setAnnotationXAxis((prev) => [
                                                                                ...prev,
                                                                                {
                                                                                    x: 'Mon 12 am',
                                                                                    x2: 'Mon 12 pm',
                                                                                    label: {
                                                                                        borderColor: '#000',
                                                                                        borderWidth: 1,
                                                                                        borderRadius: 2,
                                                                                        text: 'off',
                                                                                        textAnchor: 'middle',
                                                                                        position: 'top',
                                                                                        orientation: 'horizontal',
                                                                                        offsetX: 60,
                                                                                        offsetY: -15,

                                                                                        style: {
                                                                                            background: '#333',
                                                                                            fontSize: '15px',
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            ]);
                                                                        }
                                                                    }}>
                                                                    Mo
                                                                </div>
                                                                <div
                                                                    className={
                                                                        record.action_day.includes('tue')
                                                                            ? 'schedular-weekday'
                                                                            : 'schedular-weekday-active'
                                                                    }
                                                                    onClick={() => {
                                                                        handleActionDayChange(
                                                                            'tue',
                                                                            record.condition_id
                                                                        );
                                                                        if (record.action_day.includes('tue')) {
                                                                            setAnnotationXAxis((current) =>
                                                                                current.filter((item) => {
                                                                                    return item?.x !== 'Tue 12 am';
                                                                                })
                                                                            );
                                                                        }
                                                                        if (!record.action_day.includes('tue')) {
                                                                            setAnnotationXAxis((prev) => [
                                                                                ...prev,
                                                                                {
                                                                                    x: 'Tue 12 am',
                                                                                    x2: 'Tue 12 pm',
                                                                                    label: {
                                                                                        borderColor: '#000',
                                                                                        borderWidth: 1,
                                                                                        borderRadius: 2,
                                                                                        text: 'off',
                                                                                        textAnchor: 'middle',
                                                                                        position: 'top',
                                                                                        orientation: 'horizontal',
                                                                                        offsetX: 60,
                                                                                        offsetY: -15,

                                                                                        style: {
                                                                                            background: '#333',
                                                                                            fontSize: '15px',
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            ]);
                                                                        }
                                                                    }}>
                                                                    Tu
                                                                </div>
                                                                <div
                                                                    className={
                                                                        record.action_day.includes('wed')
                                                                            ? 'schedular-weekday'
                                                                            : 'schedular-weekday-active'
                                                                    }
                                                                    onClick={() => {
                                                                        handleActionDayChange(
                                                                            'wed',
                                                                            record.condition_id
                                                                        );
                                                                        if (record.action_day.includes('wed')) {
                                                                            setAnnotationXAxis((current) =>
                                                                                current.filter((item) => {
                                                                                    return item?.x !== 'Wed 12 am';
                                                                                })
                                                                            );
                                                                        }
                                                                        if (!record.action_day.includes('wed')) {
                                                                            setAnnotationXAxis((prev) => [
                                                                                ...prev,
                                                                                {
                                                                                    x: 'Wed 12 am',
                                                                                    x2: 'Wed 12 pm',
                                                                                    label: {
                                                                                        borderColor: '#000',
                                                                                        borderWidth: 1,
                                                                                        borderRadius: 2,
                                                                                        text: 'off',
                                                                                        textAnchor: 'middle',
                                                                                        position: 'top',
                                                                                        orientation: 'horizontal',
                                                                                        offsetX: 60,
                                                                                        offsetY: -15,

                                                                                        style: {
                                                                                            background: '#333',
                                                                                            fontSize: '15px',
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            ]);
                                                                        }
                                                                    }}>
                                                                    We
                                                                </div>
                                                                <div
                                                                    className={
                                                                        record.action_day.includes('thr')
                                                                            ? 'schedular-weekday'
                                                                            : 'schedular-weekday-active'
                                                                    }
                                                                    onClick={() => {
                                                                        handleActionDayChange(
                                                                            'thr',
                                                                            record.condition_id
                                                                        );
                                                                        if (record.action_day.includes('thr')) {
                                                                            setAnnotationXAxis((current) =>
                                                                                current.filter((item) => {
                                                                                    return item?.x !== 'Thu 12 am';
                                                                                })
                                                                            );
                                                                        }
                                                                        if (!record.action_day.includes('thr')) {
                                                                            setAnnotationXAxis((prev) => [
                                                                                ...prev,
                                                                                {
                                                                                    x: 'Thu 12 am',
                                                                                    x2: 'Thu 12 pm',
                                                                                    label: {
                                                                                        borderColor: '#000',
                                                                                        borderWidth: 1,
                                                                                        borderRadius: 2,
                                                                                        text: 'off',
                                                                                        textAnchor: 'middle',
                                                                                        position: 'top',
                                                                                        orientation: 'horizontal',
                                                                                        offsetX: 60,
                                                                                        offsetY: -15,

                                                                                        style: {
                                                                                            background: '#333',
                                                                                            fontSize: '15px',
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            ]);
                                                                        }
                                                                    }}>
                                                                    Th
                                                                </div>
                                                                <div
                                                                    className={
                                                                        record.action_day.includes('fri')
                                                                            ? 'schedular-weekday'
                                                                            : 'schedular-weekday-active'
                                                                    }
                                                                    onClick={() => {
                                                                        handleActionDayChange(
                                                                            'fri',
                                                                            record.condition_id
                                                                        );
                                                                        if (record.action_day.includes('fri')) {
                                                                            setAnnotationXAxis((current) =>
                                                                                current.filter((item) => {
                                                                                    return item?.x !== 'Fri 12 am';
                                                                                })
                                                                            );
                                                                        }
                                                                        if (!record.action_day.includes('fri')) {
                                                                            setAnnotationXAxis((prev) => [
                                                                                ...prev,
                                                                                {
                                                                                    x: 'Fri 12 am',
                                                                                    x2: 'Fri 12 pm',
                                                                                    label: {
                                                                                        borderColor: '#000',
                                                                                        borderWidth: 1,
                                                                                        borderRadius: 2,
                                                                                        text: 'off',
                                                                                        textAnchor: 'middle',
                                                                                        position: 'top',
                                                                                        orientation: 'horizontal',
                                                                                        offsetX: 60,
                                                                                        offsetY: -15,

                                                                                        style: {
                                                                                            background: '#333',
                                                                                            fontSize: '15px',
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            ]);
                                                                        }
                                                                    }}>
                                                                    Fr
                                                                </div>
                                                                <div
                                                                    className={
                                                                        record.action_day.includes('sat')
                                                                            ? 'schedular-weekday'
                                                                            : 'schedular-weekday-active'
                                                                    }
                                                                    onClick={() => {
                                                                        handleActionDayChange(
                                                                            'sat',
                                                                            record.condition_id
                                                                        );
                                                                        if (record.action_day.includes('sat')) {
                                                                            setAnnotationXAxis((current) =>
                                                                                current.filter((item) => {
                                                                                    return item?.x !== 'Sat 12 am';
                                                                                })
                                                                            );
                                                                        }
                                                                        if (!record.action_day.includes('sat')) {
                                                                            setAnnotationXAxis((prev) => [
                                                                                ...prev,
                                                                                {
                                                                                    x: 'Sat 12 am',
                                                                                    x2: 'Sat 12 pm',
                                                                                    label: {
                                                                                        borderColor: '#000',
                                                                                        borderWidth: 1,
                                                                                        borderRadius: 2,
                                                                                        text: 'off',
                                                                                        textAnchor: 'middle',
                                                                                        position: 'top',
                                                                                        orientation: 'horizontal',
                                                                                        offsetX: 60,
                                                                                        offsetY: -15,

                                                                                        style: {
                                                                                            background: '#333',
                                                                                            fontSize: '15px',
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            ]);
                                                                        }
                                                                    }}>
                                                                    Sa
                                                                </div>
                                                                <div
                                                                    className={
                                                                        record.action_day.includes('sun')
                                                                            ? 'schedular-weekday'
                                                                            : 'schedular-weekday-active'
                                                                    }
                                                                    onClick={() => {
                                                                        handleActionDayChange(
                                                                            'sun',
                                                                            record.condition_id
                                                                        );
                                                                        if (record.action_day.includes('sun')) {
                                                                            setAnnotationXAxis((current) =>
                                                                                current.filter((item) => {
                                                                                    return item?.x !== 'Sun 12 am';
                                                                                })
                                                                            );
                                                                        }
                                                                        if (!record.action_day.includes('sun')) {
                                                                            setAnnotationXAxis((prev) => [
                                                                                ...prev,
                                                                                {
                                                                                    x: 'Sun 12 am',
                                                                                    x2: 'Sun 12 pm',
                                                                                    label: {
                                                                                        borderColor: '#000',
                                                                                        borderWidth: 1,
                                                                                        borderRadius: 2,
                                                                                        text: 'off',
                                                                                        textAnchor: 'middle',
                                                                                        position: 'top',
                                                                                        orientation: 'horizontal',
                                                                                        offsetX: 60,
                                                                                        offsetY: -15,

                                                                                        style: {
                                                                                            background: '#333',
                                                                                            fontSize: '15px',
                                                                                            fontWeight: 400,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            ]);
                                                                        }
                                                                    }}>
                                                                    Su
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <FontAwesomeIcon
                                                                icon={faTrashCan}
                                                                size="md"
                                                                onClick={() => {
                                                                    showOptionToDelete(record.condition_id);
                                                                    setCurrentScheduleIdToDelete(record.condition_id);
                                                                    setShowDeleteConditionModal(true);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <hr className="plug-rule-schedule-breaker" />
                                                </>
                                            );
                                        })}

                                    <button
                                        type="button"
                                        className="btn btn-default add-condition"
                                        onClick={() => {
                                            createScheduleCondition();
                                        }}>
                                        Add Condition
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="plug-rule-demand-chart-container">
                        <div className="plug-rule-chart-header m-3">
                            <div>
                                <h5 className="plug-rule-chart-title mb-1">Average Energy Demand</h5>
                                <p className="plugrule-chart-subtitle">Last 2 Weeks</p>
                            </div>
                            <div>
                                <p className="plug-rule-chart-subtitle mb-1">Estimated Energy Savings</p>
                                <h5 className="plug-rule-chart-title float-right">1,722 kWh</h5>
                            </div>
                        </div>

                        <div className="total-eng-consumtn">
                            {lineChartData && lineChartOptions && (
                                <LineChart options={lineChartOptions} series={lineChartData} height={200} />
                            )}
                        </div>
                    </div>
                    <div className="plug-rule-danger-zone-container">
                        <div className="plug-rule-danger-zone-header p-3">
                            <div>
                                <h5 className="plug-rule-chart-title mb-1">Danger zone</h5>
                            </div>
                        </div>

                        <div className="total-eng-consumtn card-body">
                            <Button
                                onClick={() => setShowDeleteModal(true)}
                                type="button"
                                className="btn btn-md btn-danger font-weight-bold trash-button-style">
                                <i className="uil uil-trash mr-2"></i>
                                Delete rule
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {selectedTab === 1 && (
                <div className="plug-rule-body-style">
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

                                    <MultiSelect
                                        options={removeEqupimentTypesDuplication}
                                        value={selectedOption}
                                        onChange={setSelectedOption}
                                        labelledBy="Columns"
                                        className="column-filter-styling"
                                        valueRenderer={() => {
                                            return 'Columns';
                                        }}
                                        ClearSelectedIcon={null}
                                    />
                                </Form.Group>
                            </div>

                            {/* MAC Address */}
                            <div>
                                <Form.Group>
                                    <Form.Label for="userState" className="card-title">
                                        MAC Address
                                    </Form.Label>

                                    <MultiSelect
                                        options={macOptions}
                                        value={selectedOptionMac}
                                        onChange={setSelectedOptionMac}
                                        labelledBy="MAC..."
                                        className="column-filter-styling"
                                        valueRenderer={() => {
                                            return 'MAC';
                                        }}
                                        ClearSelectedIcon={null}
                                    />
                                </Form.Group>
                            </div>
                            {/* Sensor */}
                            <div>
                                <Form.Group>
                                    <Form.Label for="userState" className="card-title">
                                        Sensors
                                    </Form.Label>

                                    <MultiSelect
                                        options={sensorOptions}
                                        value={selectedOptionSensor}
                                        onChange={setSelectedOptionSensor}
                                        labelledBy="Sensors"
                                        className="column-filter-styling"
                                        valueRenderer={() => {
                                            return 'Sensors';
                                        }}
                                        ClearSelectedIcon={null}
                                    />
                                </Form.Group>
                            </div>

                            <div>
                                <Form.Group>
                                    <Form.Label for="userState" className="card-title">
                                        Location
                                    </Form.Label>
                                    <MultiSelect
                                        options={locationOptions}
                                        value={selectedOptionLocation}
                                        onChange={setSelectedOptionLocation}
                                        labelledBy="Location"
                                        className="column-filter-styling"
                                        valueRenderer={() => {
                                            return 'Location';
                                        }}
                                        ClearSelectedIcon={null}
                                    />
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
                                            checked={checkedAll}
                                            onChange={() => {
                                                setCheckedAll(!checkedAll);
                                            }}
                                        />
                                    </th>
                                    <th>Equipment Type</th>
                                    <th>Location</th>
                                    <th>MAC Address</th>
                                    <th>Sensor</th>
                                    <th>Assigned Rule</th>
                                    <th>Tags</th>
                                    <th>Last Data</th>
                                </tr>
                            </thead>
                            {selectedRuleFilter === 0 && (
                                <>
                                    {unLinkedRuleData?.length !== 0 && allData?.length !== 0 ? (
                                        <tbody>
                                            {allLinkedRuleData.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                id="socket_rule"
                                                                name="socket_rule"
                                                                checked={record.linked_rule || checkedAll}
                                                                value={record.linked_rule || checkedAll ? true : false}
                                                                onChange={(e) => {
                                                                    setSensorIdNow(record?.id);
                                                                    handleRuleStateChange(e.target.value, record);
                                                                }}
                                                            />
                                                        </td>
                                                        {record.equipment_link_type === '' ? (
                                                            <td className="font-weight-bold panel-name">-</td>
                                                        ) : (
                                                            <td className="font-weight-bold panel-name">
                                                                <div className="plug-equip-container">
                                                                    {`${record.equipment_link_type}`}
                                                                </div>
                                                            </td>
                                                        )}

                                                        <td className="font-weight-bold">
                                                            {record.equipment_link_location}
                                                        </td>

                                                        <td className="font-weight-bold">{record.device_link}</td>

                                                        <td className="font-weight-bold">{record?.sensor_number_2}</td>

                                                        <td className="font-weight-bold">
                                                            {record.assigned_rules.length === 0
                                                                ? 'None'
                                                                : record.assigned_rules}
                                                        </td>

                                                        <td className="font-weight-bold">{record.tag?.[0]}</td>

                                                        <td className="font-weight-bold">{record.last_data}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    ) : (
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
                                    )}
                                </>
                            )}

                            {selectedRuleFilter === 1 && (
                                <>
                                    {unLinkedRuleData?.length !== 0 && allData?.length !== 0 ? (
                                        <tbody>
                                            {linkedRuleData.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                id="socket_rule"
                                                                name="socket_rule"
                                                                checked={record.linked_rule || checkedAll}
                                                                value={record.linked_rule || checkedAll ? true : false}
                                                                onChange={(e) => {
                                                                    handleRuleStateChange(e.target.value, record);
                                                                }}
                                                            />
                                                        </td>

                                                        {record.equipment_link_type === '' ? (
                                                            <td className="font-weight-bold panel-name">-</td>
                                                        ) : (
                                                            <td className="font-weight-bold panel-name">
                                                                <div className="plug-equip-container">
                                                                    {`${record.equipment_link_type}`}
                                                                </div>
                                                            </td>
                                                        )}

                                                        <td className="font-weight-bold">
                                                            {record.equipment_link_location}
                                                        </td>

                                                        <td className="font-weight-bold">{record.device_link}</td>

                                                        <td className="font-weight-bold">-</td>

                                                        <td className="font-weight-bold">
                                                            {record.assigned_rules.length === 0
                                                                ? 'None'
                                                                : record.assigned_rules}
                                                        </td>

                                                        <td className="font-weight-bold">{record.tag}</td>

                                                        <td className="font-weight-bold">{record.last_data}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    ) : (
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
                                    )}
                                </>
                            )}

                            {selectedRuleFilter === 2 && (
                                <>
                                    {unLinkedRuleData?.length !== 0 && allData?.length !== 0 ? (
                                        <tbody>
                                            {unLinkedRuleData.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                id="socket_rule"
                                                                name="socket_rule"
                                                                checked={record.linked_rule || checkedAll}
                                                                value={record.linked_rule || checkedAll ? true : false}
                                                                onChange={(e) => {
                                                                    handleRuleStateChange(e.target.value, record);
                                                                }}
                                                            />
                                                        </td>

                                                        {record.equipment_link_type === '' ? (
                                                            <td className="font-weight-bold panel-name">-</td>
                                                        ) : (
                                                            <td className="font-weight-bold panel-name">
                                                                <div className="plug-equip-container">
                                                                    {`${record.equipment_link_type}`}
                                                                </div>
                                                            </td>
                                                        )}

                                                        <td className="font-weight-bold">
                                                            {record.equipment_link_location}
                                                        </td>

                                                        <td className="font-weight-bold">{record.device_link}</td>

                                                        <td className="font-weight-bold">-</td>

                                                        <td className="font-weight-bold">
                                                            {record.assigned_rules.length === 0
                                                                ? 'None'
                                                                : record.assigned_rules}
                                                        </td>

                                                        <td className="font-weight-bold">{record.tag}</td>

                                                        <td className="font-weight-bold">{record.last_data}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    ) : (
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
                                    )}
                                </>
                            )}
                        </Table>
                        <div className="page-button-style">
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold mt-4"
                                disabled={pageNo <= 1}
                                onClick={() => {
                                    previousPageData();
                                }}>
                                Previous
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold mt-4"
                                disabled={pageNo >= ceil(totalSocket / pageSize)}
                                onClick={() => {
                                    nextPageData();
                                }}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body>
                    <div className="mb-4">
                        <h5 className="unlink-heading-style ml-2 mb-0">Delete Rule</h5>
                    </div>
                    <div className="m-2">
                        <div className="unlink-alert-styling mb-1">
                            Are you sure you want to delete the Rule with all related Conditions?
                        </div>
                    </div>
                    <div className="panel-edit-model-row-style ml-2 mr-2"></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShowDeleteModal(false)} className="unlink-cancel-style">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            deletePlugRule();
                        }}
                        className="unlink-reset-style">
                        {isDeletting ? 'Deletting' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showDeleteConditionModal}
                onHide={() => setShowDeleteConditionModal(false)}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body>
                    <div className="mb-4">
                        <h5 className="unlink-heading-style ml-2 mb-0">Delete Condition</h5>
                    </div>
                    <div className="m-2">
                        <div className="unlink-alert-styling mb-1">Are you sure you want to delete the Condition?</div>
                    </div>
                    <div className="panel-edit-model-row-style ml-2 mr-2"></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => setShowDeleteConditionModal(false)}
                        className="unlink-cancel-style">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            deleteScheduleCondition(currentScheduleIdToDelete);
                        }}
                        className="unlink-reset-style">
                        {isDeletting ? 'Deletting' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PlugRule;
