import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Input from '../../sharedComponents/form/input/Input';
import Textarea from '../../sharedComponents/form/textarea/Textarea';
import Switch from 'react-switch';
import LineChart from '../charts/LineChart';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import Button from '../../sharedComponents/button/Button';
import { fetchPlugRules } from '../../services/plugRules';
import { ReactComponent as DeleteIcon } from '../../sharedComponents/assets/icons/delete-distructive.svg';
import { ConditionGroup } from '../../sharedComponents/conditionGroup';

import 'react-datepicker/dist/react-datepicker.css';
import { useHistory, useParams } from 'react-router-dom';
import Select from '../../sharedComponents/form/select';

import _ from 'lodash';

import { timePicker15MinutesIntervalOption } from '../../constants/time';

import moment from 'moment';

import {
    updatePlugRuleRequest,
    fetchPlugRuleDetails,
    deletePlugRuleRequest,
    getGraphDataRequest,
    linkSensorsToRuleRequest,
    listLinkSocketRulesRequest,
    unlinkSocketRequest,
    getUnlinkedSocketRules,
    getFiltersForSensorsRequest,
    getAllConditions,
} from '../../services/plugRules';
import './style.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Badge } from '../../sharedComponents/badge';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import { Checkbox } from '../../sharedComponents/form/checkbox';

const SkeletonLoading = () => (
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
            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);
const actionTypeInitial = [
    {
        label: 'Turn Off',
        value: 0,
    },
    {
        label: 'Turn On',
        value: 1,
    },
    {
        label: 'Do nothing',
        value: 2,
    },
];

const PlugRule = () => {
    const isLoadingRef = useRef(false);
    const { ruleId } = useParams();
    const searchTouchedRef = useRef(false);
    const [search, setSearch] = useState('');
    const [rulesToUnLink, setRulesToUnLink] = useState({
        rule_id: '',
        sensor_id: [],
    });

    const { v4: uuidv4 } = require('uuid');
    const history = useHistory();

    const getConditionId = () => uuidv4();
    const [currentData, setCurrentData] = useState([]);
    const [activeBuildingId, setActiveBuildingId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteConditionModal, setShowDeleteConditionModal] = useState(false);
    const [currentScheduleIdToDelete, setCurrentScheduleIdToDelete] = useState();

    const [rulesToLink, setRulesToLink] = useState({
        rule_id: '',
        sensor_id: [],
    });
    const [preparedScheduleData, setPreparedScheduleData] = useState();
    const [conditionDisabledDays, setConditionDisabledDays] = useState();
    const [skeletonLoading, setSkeletonLoading] = useState(true);

    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedRuleFilter, setSelectedRuleFilter] = useState(0);

    const [linkedRuleData, setLinkedRuleData] = useState([]);
    const [unLinkedRuleData, setUnLinkedRuleData] = useState([]);
    const [allSensors, setAllSensors] = useState([]);
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

    const [selectedIds, setSelectedIds] = useState([]);
    const [fetchedSelectedIds, setFetchedSelectedIds] = useState([]);
    const [sortBy, setSortBy] = useState({});

    const [allSearchData, setAllSearchData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);

    useEffect(() => {
        const preparedScheduleDataCopy = preparedScheduleData ? [...preparedScheduleData] : [];
        const workingDaysPerCondition = {};
        const data = preparedScheduleDataCopy?.forEach((curr) => {
            const { title } = curr;
            workingDaysPerCondition[title] = curr.data[0].action_day;
        });

        const flat = Object.values(workingDaysPerCondition).flat(1);
        const disabledDays = {};

        for (const [key, value] of Object.entries(workingDaysPerCondition)) {
            const restOfDays = flat.filter((el) => !value.includes(el));
            disabledDays[key] = restOfDays;
        }

        setConditionDisabledDays(disabledDays);
    }, [preparedScheduleData]);

    const groupedCurrentDataById = (actions) => {
        return (
            actions &&
            actions.reduce((acc, curr) => {
                const { condition_group_id } = curr;
                const objInAcc = acc.find((o) => o.title === condition_group_id);
                if (objInAcc) objInAcc.data.push(curr);
                else acc.push({ title: condition_group_id, data: [curr] });
                return acc;
            }, [])
        );
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Plug Rules',
                    path: '/control/plug-rules',
                    active: false,
                },
                {
                    label: currentData?.name,
                    path: '/control/plug-rules/:ruleId',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'control';
        });
    };

    const hours = [];
    const generateHours = () => {
        for (let day = 0; day < 8; day++) {
            for (let hour = 0; hour < 24; hour += 12) {
                hours.push(moment({ day, hour }).format('ddd h a'));
                setHoursNew(hours);
            }
        }
    };
    const fetchPlugRulesData = async () => {
        const params = '';
        await fetchPlugRules(params, '').then((res) => {
            const plugRules = res.data.data;

            plugRules &&
                plugRules.forEach((plugRule) => {
                    if (plugRule.name == currentData.name) {
                        setActiveBuildingId(plugRule.buildings[0].building_id);
                    }
                });
        });
    };

    useEffect(() => {
        generateHours();
        fetchPlugRuleDetail();
    }, []);

    useEffect(() => {
        updateBreadcrumbStore();
    }, [currentData.name]);

    const fetchPlugRuleDetail = async () => {
        await fetchPlugRuleDetails(ruleId).then((res) => {
            if (res.status) {
                setSkeletonLoading(false);
            }
            let response = res.data.data;
            setCurrentData(response);
            const scheduleData = groupedCurrentDataById(response.action);
            setPreparedScheduleData(scheduleData);
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
        await getGraphDataRequest(activeBuildingId, sensorsIdNow, currentData.id).then((res) => {
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

    useEffect(() => {
        totalGraphData?.length > 0 &&
            setLineChartData([
                {
                    data: totalGraphData.map(({ x, y }) => ({ x: moment(x).format('ddd h a'), y })),
                },
            ]);
    }, [totalGraphData]);

    const [selectedOption, setSelectedOption] = useState([]);
    const [selectedOptionMac, setSelectedOptionMac] = useState([]);

    const [equpimentTypeFilterString, setEqupimentTypeFilterString] = useState('');

    const [macTypeFilterString, setMacTypeFilterString] = useState('');

    const [locationTypeFilterString, setLocationTypeFilterString] = useState('');

    const [floorTypeFilterString, setFloorTypeFilterString] = useState('');
    const [spaceTypeFilterString, setSpaceTypeFilterString] = useState('');
    const [spaceTypeTypeFilterString, setSpaceTypeTypeFilterString] = useState('');

    const [sensorTypeFilterString, setSensorTypeFilterString] = useState('');

    const [sensorsIdNow, setSensorIdNow] = useState('');
    const [equpimentTypeAdded, setEqupimentTypeAdded] = useState([]);
    const [unlinkedSocketRuleSuccess, setUnlinkedSocketRuleSuccess] = useState(false);

    useEffect(() => {
        if (sensorsIdNow) {
            getGraphData();
        }
    }, [sensorsIdNow]);

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
    const handleScheduleDayChange = (day, condition_group_id) => {
        let currentObj = [...preparedScheduleData];

        currentObj.forEach((record) => {
            if (record.title === condition_group_id) {
                record.data.forEach((row) => {
                    if (row.action_day.includes(day)) {
                        row.action_day = row.action_day.filter((e) => e !== day);
                    } else {
                        row.action_day.push(day);
                    }
                });
            }
        });

        setPreparedScheduleData(currentObj);
    };
    const makeId = (checkedArray) => {
        const newId = getConditionId();
        if (!checkedArray.includes(newId)) {
            return newId;
        } else {
            makeId(checkedArray);
        }
    };

    const createScheduleCondition = async () => {
        const allConditions = await getAllConditions()
            .then((res) => {
                const { data } = res;
                return data;
            })
            .catch((error) => {});
        let currentObj = [...preparedScheduleData];

        const generateConditionGroupId = makeId(allConditions.condition_group_id);
        const generateFirstConditionId = makeId(allConditions.condition_id);
        const generateSecondConditionId = makeId(allConditions.condition_id);
        let obj = {
            title: generateConditionGroupId,
            data: [
                {
                    action_type: 1,
                    action_time: '08:00 AM',
                    action_day: [],
                    condition_id: generateFirstConditionId,
                    condition_group_id: generateConditionGroupId,
                    is_deleted: false,
                },
                {
                    action_type: 0,
                    action_time: '09:00 AM',
                    action_day: [],
                    condition_id: generateSecondConditionId,
                    condition_group_id: generateConditionGroupId,
                    is_deleted: false,
                },
            ],
        };
        currentObj.push(obj);
        setPreparedScheduleData(currentObj);
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

    const deleteScheduleCondition = (condition_group_id) => {
        let currentObj = [...preparedScheduleData];
        let resArray = [];
        currentObj.forEach((record) => {
            if (record.title !== condition_group_id) {
                resArray.push(record);
            }
        });
        setPreparedScheduleData(resArray);
        setShowDeleteConditionModal(false);
    };

    const updateSocketLink = async () => {
        if (rulesToLink.sensor_id.length === 0) {
            return;
        }
        setIsProcessing(true);
        await linkSensorsToRuleRequest({
            ...rulesToLink,
            sensor_id: rulesToLink.sensor_id.filter((sensor) => !fetchedSelectedIds.includes(sensor.id)),
            building_id: activeBuildingId,
        }).then((res) => {});

        setIsProcessing(false);
        setPageRefresh(!pageRefresh);
    };

    const updateSocketUnlink = async () => {
        if (rulesToUnLink.sensor_id.length === 0) {
            return;
        }
        setIsProcessing(true);

        await unlinkSocketRequest(rulesToUnLink)
            .then((res) => {})
            .catch((error) => {});

        setIsProcessing(false);
        setPageRefresh(!pageRefresh);

        history.push({
            pathname: `/control/plug-rules`,
        });
    };

    const handleSchedularConditionChange = (key, value, condition_id, condition_group_id) => {
        let currentObj = [...preparedScheduleData];
        currentObj.forEach((record) => {
            if (record.title === condition_group_id) {
                record.data.forEach((row) => {
                    if (row.condition_id === condition_id) {
                        if (value == '2') {
                            row['action_time'] = null;
                        }
                        row[key] = value;
                    }
                });
            }
        });
        setPreparedScheduleData(currentObj);
    };

    const handleSchedularTimeChange = (key, value, condition_id, condition_group_id) => {
        let currentObj = [...preparedScheduleData];

        currentObj.forEach((record) => {
            if (record.title === condition_group_id) {
                record.data.forEach((row) => {
                    if (row.condition_id === condition_id) {
                        row[key] = value;
                    }
                });
            }
        });
        setPreparedScheduleData(currentObj);
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

            setTotalSocket((totalCount) => --totalCount);
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

            setTotalSocket((totalCount) => ++totalCount);
        }

        const isAdding = value === 'false';

        setSelectedIds((prevState) => {
            return isAdding ? [...prevState, rule.id] : prevState.filter((sensorId) => sensorId !== rule.id);
        });
    };

    const updatePlugRuleData = async () => {
        setIsProcessing(true);
        let currentDataCopy = Object.assign({}, currentData);

        const formattedSchedule = [];
        preparedScheduleData.forEach((currentCondition) => {
            currentCondition.data.forEach((currentRow) => {
                formattedSchedule.push(currentRow);
            });
        });
        currentDataCopy.action = formattedSchedule;
        await updatePlugRuleRequest(currentDataCopy)
            .then((res) => {
                setIsProcessing(false);
                setPageRefresh(!pageRefresh);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    const addOptions = () => {
        return allData
            ?.filter((item) => item?.equipment_type_name?.length > 0)
            ?.map((record, index) => {
                setOptions((el) => [...el, { value: record?.equipment_type_id, label: record?.name }]);
                setEqupimentTypeAdded((el) => [...el, record?.equipment_type]);
                setMacOptions((el) => [...el, { value: record?.device_link, label: record?.device_link }]);
                if (record?.equipment_link_location) {
                    setLocationOptions((el) => [
                        ...el,
                        { value: record?.equipment_link_location_id, label: record?.equipment_link_location },
                    ]);
                }
                setSensorOptions((el) => [
                    ...el,
                    { value: record?.equipment_type_name, label: record?.equipment_type_name },
                ]);
            });
    };

    useEffect(() => {
        if (allData) {
            addOptions();
        }
    }, [allData]);

    const [removeEqupimentTypesDuplication, setRemoveEqupimentTypesDuplication] = useState();

    const uniqueMacIds = [];
    const [removeMacDuplication, setRemoveMacDuplication] = useState();

    const removeDuplicates = () => {
        setRemoveEqupimentTypesDuplication(_.uniqBy(options, 'label'));
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
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };

        isLoadingRef.current = true;

        activeBuildingId &&
            (await getUnlinkedSocketRules(
                pageSize,
                pageNo,
                ruleId,
                activeBuildingId,
                equpimentTypeFilterString,
                macTypeFilterString,
                locationTypeFilterString,
                sensorTypeFilterString,
                floorTypeFilterString,
                spaceTypeFilterString,
                spaceTypeTypeFilterString,
                {
                    ...sorting,
                }
            ).then((res) => {
                isLoadingRef.current = false;

                let response = res.data.data;

                setAllSensors(_.cloneDeep(_.uniqBy(response.data, 'id')));

                setUnlinkedSocketRuleSuccess(res.status);

                let unLinkedData = [];
                _.uniqBy(response.data, 'id').forEach((record) => {
                    record.linked_rule = false;
                    unLinkedData.push(record);
                });

                setUnLinkedRuleData(unLinkedData);
                setAllUnlinkedRuleAdded((el) => [...el, '1']);
                setTotalItems(response.total_data);
            }));
    };

    const fetchLinkedSocketRules = async () => {
        await listLinkSocketRulesRequest(ruleId, activeBuildingId, sortBy)
            .then((res) => {
                let response = res.data;
                let linkedData = [];

                if (res.statusText === 'OK') {
                    Array.isArray(res.data.data.sensor_id) && setTotalSocket(res.data.data.sensor_id.length);
                }

                setSelectedIds(response.data.sensor_id || []);
                setFetchedSelectedIds(response.data.sensor_id || []);

                response.data.sensor_id.forEach((record) => {
                    record.linked_rule = true;
                    linkedData.push(record);
                });

                setLinkedRuleData(linkedData);
            })
            .catch((error) => {});
    };

    useEffect(() => {
        const selectedSensors = selectedIds
            .map((id) => allSensors.find((sensor) => sensor.id === id))
            .map((sensor) => ({ ...sensor, linked_rule: true }));

        setRulesToLink((prevState) => ({ ...prevState, sensor_id: selectedIds }));

        setLinkedRuleData(selectedSensors);
    }, [allData.length, selectedIds, allSensors.length]);

    useEffect(() => {
        unLinkedRuleData.length > 0 &&
            setUnLinkedRuleData((olState) => olState.filter((sensor) => !selectedIds.includes(sensor.id)));
    }, [selectedIds.length, selectedIds.length, unLinkedRuleData.length]);

    useEffect(() => {
        if (ruleId === null) {
            return;
        }

        fetchUnLinkedSocketRules();
    }, [
        ruleId,
        equpimentTypeFilterString,
        macTypeFilterString,
        locationTypeFilterString,
        sensorTypeFilterString,
        floorTypeFilterString,
        spaceTypeFilterString,
        spaceTypeTypeFilterString,
        sortBy.method,
        sortBy.name,
        pageNo,
        pageSize,
    ]);

    // INITIAL TABLE
    useEffect(() => {
        let arr1 = [];
        let arr2 = [];

        arr1 = linkedRuleData;
        arr2 = unLinkedRuleData;

        const allRuleData = arr1.concat(arr2);

        // INITIAL TABLE
        setAllLinkedRuleData(allRuleData);
    }, [linkedRuleData, unLinkedRuleData]);

    const currentRow = () => {
        if (selectedRuleFilter === 0) {
            return allSensors;
        }
        if (selectedRuleFilter === 1) {
            //@TODO Here should be all the data, stored somewhere, const selectedItems = [{} .... {}];
            // and show when user selected but switched page
            return selectedIds.reduce((acc, id) => {
                const foundSelectedSensor = allSensors.find((sensor) => sensor.id === id);
                if (foundSelectedSensor) {
                    acc.push(foundSelectedSensor);
                }
                return acc;
            }, []);
        }

        return allSensors.filter(({ id }) => !selectedIds.find((sensorId) => sensorId === id));
    };

    const currentRowSearched = () => {
        if (selectedRuleFilter === 0) {
            return allSearchData;
        }
        if (selectedRuleFilter === 1) {
            //@TODO Here should be all the data, stored somewhere, const selectedItems = [{} .... {}];
            // and show when user selected but switched page
            return selectedIds.reduce((acc, id) => {
                const foundSelectedSensor = allSearchData.find((sensor) => sensor.id === id);
                if (foundSelectedSensor) {
                    acc.push(foundSelectedSensor);
                }
                return acc;
            }, []);
        }

        return allSearchData.filter(({ id }) => !selectedIds.find((sensorId) => sensorId === id));
    };

    const renderTagCell = (row) => {
        return (row.tag || []).map((tag, key) => <Badge text={tag} key={key} className="ml-1" />);
    };

    const renderLastUsedCell = (row, childrenTemplate) => {
        const { last_used_data } = row;

        return childrenTemplate(last_used_data ? moment(last_used_data).fromNow() : '');
    };

    const renderAssignRule = useCallback(
        (row, childrenTemplate) => childrenTemplate(row.assigned_rules?.length === 0 ? 'None' : row.assigned_rules),
        []
    );

    const renderEquipType = useCallback((row) => {
        return <Badge text={<span className="gray-950">{row.equipment_type_name}</span>} />;
    }, []);

    const renderLocation = useCallback((row, childrenTemplate) => {
        const location = [row.installed_floor, row.installed_space];

        return childrenTemplate(location.join(' - '));
    }, []);

    const [filterOptions, setFilterOptions] = useState([]);

    const filterHandler = (setter, options) => {
        setter(options.map(({ value }) => value).join('+'));
        setPageNo(1);
    };
    const fetchFiltersForSensors = async () => {
        isLoadingRef.current = true;
        const filters = await getFiltersForSensorsRequest({
            activeBuildingId,
            macTypeFilterString,
            equpimentTypeFilterString,
            sensorTypeFilterString,
            floorTypeFilterString,
            spaceTypeFilterString,
            spaceTypeTypeFilterString,
        });

        filters.data.forEach((filterOptions) => {
            const filterOptionsFetched = [
                {
                    label: 'MAC Address',
                    value: 'macAddresses',
                    placeholder: 'All Mac addresses',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.mac_address.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setMacTypeFilterString, options),
                    onDelete: () => {
                        setSelectedOptionMac([]);
                        setMacTypeFilterString('');
                    },
                },
                {
                    label: 'Equipment Type',
                    value: 'equipmentType',
                    placeholder: 'All Equipment Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.equipment_type.map((filterItem) => ({
                        value: filterItem.equipment_type_id,
                        label: filterItem.equipment_type_name,
                    })),
                    onClose: (options) => filterHandler(setEqupimentTypeFilterString, options),
                    onDelete: () => {
                        setSelectedOption([]);
                        setEqupimentTypeFilterString('');
                    },
                },
                {
                    label: 'Sensors',
                    value: 'sensors',
                    placeholder: 'All Sensors',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.sensor_count.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setSensorTypeFilterString, options),
                    onDelete: setSensorTypeFilterString(''),
                },
                {
                    label: 'Floor',
                    value: 'floor',
                    placeholder: 'All Floors',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.installed_floor.map((filterItem) => ({
                        value: filterItem.floor_id,
                        label: filterItem.floor_name,
                    })),
                    onClose: (options) => filterHandler(setFloorTypeFilterString, options),
                    onDelete: () => setFloorTypeFilterString(''),
                },
                {
                    label: 'Space',
                    value: 'space',
                    placeholder: 'All Spaces',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.installed_space.map((filterItem) => ({
                        value: filterItem.space_id,
                        label: filterItem.space_name,
                    })),
                    onClose: (options) => filterHandler(setSpaceTypeFilterString, options),
                    onDelete: () => setSpaceTypeFilterString(''),
                },
                {
                    label: 'Space Type',
                    value: 'spaceType',
                    placeholder: 'All Space Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.installed_space_type.map((filterItem) => ({
                        value: filterItem.space_type_id,
                        label: filterItem.space_type_name,
                    })),
                    onClose: (options) => filterHandler(setSpaceTypeTypeFilterString, options),
                    onDelete: () => setSpaceTypeTypeFilterString(''),
                },
            ];

            setFilterOptions(filterOptionsFetched);
        });

        isLoadingRef.current = false;
    };
    useEffect(() => {
        if (activeBuildingId) {
            fetchUnLinkedSocketRules();
            fetchFiltersForSensors();
            fetchLinkedSocketRules();
        }
    }, [
        activeBuildingId,
        macTypeFilterString,
        equpimentTypeFilterString,
        sensorTypeFilterString,
        locationTypeFilterString,
        floorTypeFilterString,
        spaceTypeFilterString,
        spaceTypeTypeFilterString,
    ]);

    const fetchAllData = async () => {
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };

        isLoadingRef.current = true;
        await getUnlinkedSocketRules(
            pageSize,
            pageNo,
            ruleId,
            activeBuildingId,
            equpimentTypeFilterString,
            macTypeFilterString,
            locationTypeFilterString,
            sensorTypeFilterString,
            floorTypeFilterString,
            spaceTypeFilterString,
            spaceTypeTypeFilterString,
            {
                sensor_search: search,
                ...sorting,
            }
        ).then((res) => {
            isLoadingRef.current = false;

            setUnlinkedSocketRuleSuccess(res.status);
            let response = res.data.data;
            let unLinkedData = [];
            response.data.forEach((record) => {
                record.linked_rule = false;
                unLinkedData.push(record);
            });
            setAllSearchData(unLinkedData);
            setTotalItemsSearched(response.total_data);
        });
    };

    const getAvailableActionType = (anotherSelectedValue) => {
        const resultArr = actionTypeInitial.map((el) => {
            if (el.value === anotherSelectedValue) {
                return { ...el, isDisabled: true };
            } else {
                return { ...el, isDisabled: false };
            }
        });
        return resultArr;
    };

    useEffect(() => {
        setAllSearchData([]);

        search && activeBuildingId && fetchAllData();
    }, [
        search,
        activeBuildingId,
        equpimentTypeFilterString,
        macTypeFilterString,
        locationTypeFilterString,
        sensorTypeFilterString,
        floorTypeFilterString,
        spaceTypeFilterString,
        spaceTypeTypeFilterString,
        sortBy.method,
        sortBy.name,
        pageNo,
        pageSize,
    ]);

    const RenderScheduleActionItem = ({ record }) => {
        const firstCondition = record.data[0];
        const secondCondition = record.data[1];
        return (
            <>
                <div className="plug-rule-schedule-row mb-1">
                    <div className="schedule-left-flex">
                        <div>
                            <Select
                                defaultValue={firstCondition.action_type}
                                onChange={(event) => {
                                    handleSchedularConditionChange(
                                        'action_type',
                                        event.value,
                                        firstCondition.condition_id,
                                        firstCondition.condition_group_id
                                    );
                                }}
                                options={getAvailableActionType(secondCondition.action_type)}
                            />
                        </div>
                        <div>at</div>
                        <div>
                            <Select
                                defaultValue={firstCondition.action_time}
                                onChange={(event) => {
                                    handleSchedularTimeChange(
                                        'action_time',
                                        event.value,
                                        firstCondition.condition_id,
                                        firstCondition.condition_group_id
                                    );
                                }}
                                isDisabled={firstCondition.action_type == '2'}
                                options={firstCondition.action_type == '2' ? [] : timePicker15MinutesIntervalOption}
                            />
                        </div>
                        <div>on</div>
                        <div className="schedular-weekday-group">
                            <ConditionGroup
                                handleButtonClick={(day) =>
                                    handleScheduleDayChange(day, firstCondition.condition_group_id)
                                }
                                disabledItemsList={conditionDisabledDays[firstCondition.condition_group_id]}
                                selectedItemsList={firstCondition.action_day}
                            />
                        </div>
                    </div>
                </div>
                <div className="plug-rule-schedule-row mb-1">
                    <div className="schedule-left-flex">
                        <div>
                            <Select
                                defaultValue={secondCondition.action_type}
                                onChange={(event) => {
                                    handleSchedularConditionChange(
                                        'action_type',
                                        event.value,
                                        secondCondition.condition_id,
                                        secondCondition.condition_group_id
                                    );
                                }}
                                options={getAvailableActionType(firstCondition.action_type)}
                            />
                        </div>
                        <div>at</div>
                        <div>
                            <Select
                                defaultValue={secondCondition.action_time}
                                onChange={(event) => {
                                    handleSchedularTimeChange(
                                        'action_time',
                                        event.value,
                                        secondCondition.condition_id,
                                        secondCondition.condition_group_id
                                    );
                                }}
                                isDisabled={secondCondition.action_type == '2'}
                                options={timePicker15MinutesIntervalOption}
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            label="Delete Condition"
                            onClick={() => {
                                showOptionToDelete(firstCondition.condition_group_id);
                                setCurrentScheduleIdToDelete(firstCondition.condition_group_id);
                                setShowDeleteConditionModal(true);
                            }}
                            size={Button.Sizes.md}
                            icon={<DeleteIcon />}
                            type={Button.Type.secondaryDistructive}
                        />
                    </div>
                </div>

                <hr className="plug-rule-schedule-breaker" />
            </>
        );
    };

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
                                size={Button.Sizes.md}
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
                                size={Button.Sizes.md}
                                onClick={() => {
                                    Promise.allSettled([
                                        updatePlugRuleData(),
                                        updateSocketLink(),
                                        updateSocketUnlink(),
                                    ]).then((value) => {
                                        history.push({
                                            pathname: `/control/plug-rules`,
                                        });
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
                                <div className="description-and-name-container">
                                    <div>
                                        <Input
                                            label="Name"
                                            id="name"
                                            placeholder="Enter Rule Name"
                                            value={currentData.name}
                                            onChange={(e) => {
                                                handleCurrentDataChange('name', e.target.value);
                                            }}
                                        />
                                        <Textarea
                                            type="textarea"
                                            label="Description"
                                            name="text"
                                            id="description"
                                            rows="4"
                                            placeholder="Enter Description of Rule"
                                            value={currentData.description}
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                handleCurrentDataChange('description', e.target.value);
                                            }}
                                        />
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
                                    {preparedScheduleData &&
                                        preparedScheduleData.map((record, index) => {
                                            return <RenderScheduleActionItem record={record} key={index} />;
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
                                label="Delete rule"
                                size={Button.Sizes.lg}
                                icon={<DeleteIcon />}
                                type={Button.Type.primaryDistructive}
                            />
                        </div>
                    </div>
                </>
            )}

            {selectedTab === 1 && (
                <div className="plug-rule-body">
                    <DataTableWidget
                        isLoading={isLoadingRef.current}
                        isLoadingComponent={<SkeletonLoading />}
                        id="sockets-plug-rules"
                        onSearch={(query) => {
                            setPageNo(1);
                            setSearch(query);
                        }}
                        buttonGroupFilterOptions={[{ label: 'All' }, { label: 'Selected' }, { label: 'Unselected' }]}
                        onStatus={setSelectedRuleFilter}
                        rows={currentRow()}
                        searchResultRows={currentRowSearched()}
                        filterOptions={filterOptions}
                        headers={[
                            {
                                name: 'Equipment Type',
                                accessor: 'equipment_type_name',
                                callbackValue: renderEquipType,
                                onSort: (method, name) => setSortBy({ method, name }),
                            },
                            {
                                name: 'Space Type',
                                accessor: 'space_type',
                                onSort: (method, name) => setSortBy({ method, name }),
                            },
                            {
                                name: 'Location',
                                accessor: 'equipment_link_location',
                                callbackValue: renderLocation,
                            },
                            {
                                name: 'MAC Address',
                                accessor: 'device_link',
                            },
                            {
                                name: 'Sensors',
                                accessor: 'sensor_count',
                            },
                            {
                                name: 'Assigned Rule',
                                accessor: 'assigned_rule',
                                callbackValue: renderAssignRule,
                            },
                            {
                                name: 'Tags',
                                accessor: 'tags',
                                callbackValue: renderTagCell,
                            },
                            {
                                name: 'Last Data',
                                accessor: 'last_data',
                                callbackValue: renderLastUsedCell,
                            },
                        ]}
                        onCheckboxRow={alert}
                        customCheckAll={() => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="vehicle1"
                                name="vehicle1"
                                checked={checkedAll}
                                onChange={() => {
                                    setCheckedAll(!checkedAll);
                                }}
                            />
                        )}
                        customCheckboxForCell={(record) => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="socket_rule"
                                name="socket_rule"
                                checked={selectedIds.includes(record?.id) || checkedAll}
                                value={selectedIds.includes(record?.id) || checkedAll ? true : false}
                                onChange={(e) => {
                                    setSensorIdNow(record?.id);
                                    handleRuleStateChange(e.target.value, record);
                                }}
                            />
                        )}
                        onPageSize={setPageSize}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        currentPage={pageNo}
                        totalCount={(() => {
                            if (search) {
                                return totalItemsSearched;
                            }
                            if (selectedRuleFilter === 0) {
                                return totalItems;
                            }

                            return 0;
                        })()}
                    />
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
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <Button
                        label={isDeletting ? 'Deletting' : 'Delete'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primaryDistructive}
                        onClick={() => {
                            deletePlugRule();
                        }}
                    />
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
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={() => setShowDeleteConditionModal(false)}
                    />

                    <Button
                        label={isDeletting ? 'Deletting' : 'Delete'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primaryDistructive}
                        onClick={() => {
                            deleteScheduleCondition(currentScheduleIdToDelete);
                        }}
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PlugRule;
