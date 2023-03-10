import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Input from '../../sharedComponents/form/input/Input';
import Textarea from '../../sharedComponents/form/textarea/Textarea';
import Switch from 'react-switch';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import Button from '../../sharedComponents/button/Button';
import { Spinner } from 'reactstrap';
import { fetchPlugRules, getEstimateSensorSavingsRequst } from '../../services/plugRules';
import { ReactComponent as DeleteIcon } from '../../sharedComponents/assets/icons/delete-distructive.svg';
import { ConditionGroup } from '../../sharedComponents/conditionGroup';
import { useNotification } from '../../sharedComponents/notification/useNotification';
import { Notification } from '../../sharedComponents/notification/Notification';
import colors from '../../assets/scss/_colors.scss';
import { fetchBuildingsList } from '../../services/buildings';
import { UNITS } from '../../constants/units';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { getSocketsForPlugRulePageTableCSVExport } from '../../utils/tablesExport';

import 'react-datepicker/dist/react-datepicker.css';
import { useHistory, useParams } from 'react-router-dom';
import Select from '../../sharedComponents/form/select';
import _ from 'lodash';

import {
    timePicker15MinutesIntervalOption24HourFormat,
    timePicker15MinutesIntervalOption12HourFormat,
} from '../../constants/time';
import { daysOfWeekFull } from '../../constants/days';

import moment from 'moment';

import {
    updatePlugRuleRequest,
    createPlugRuleRequest,
    fetchPlugRuleDetails,
    deletePlugRuleRequest,
    getGraphDataRequest,
    linkSensorsToRuleRequest,
    listLinkSocketRulesRequest,
    unlinkSocketRequest,
    getUnlinkedSocketRules,
    getFiltersForSensorsRequest,
    reassignSensorsToRuleRequest,
    getAllConditions,
} from '../../services/plugRules';
import './style.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Badge } from '../../sharedComponents/badge';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import { Checkbox } from '../../sharedComponents/form/checkbox';
import Typography from '../../sharedComponents/typography';

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
const indexOfDay = {
    mon: 0,
    tue: 1,
    wed: 2,
    thr: 3,
    fri: 4,
    sat: 5,
    sun: 6,
};
const formatAverageData = (data) => {
    const res = [];
    data.forEach((el) => {
        const today = moment();
        const from_date = today.startOf('week').startOf('isoWeek');
        if (el.dayOfWeek === 'Sunday') {
            from_date.day(el.dayOfWeek).add(1, 'weeks');
        } else {
            from_date.day(el.dayOfWeek);
        }
        const formattedHourFromBackend = el.hour.split(':');
        const timeWithHours = from_date.set('hour', formattedHourFromBackend[0]);

        res.push({ x: timeWithHours.unix() * 1000, y: el.consumption });
    });
    return res;
};
const notificationCreateData = {
    title: 'Rule has been created',
};

const notificationUpdatedData = {
    title: 'Rule has been updated',
};

const PlugRule = () => {
    const isLoadingRef = useRef(false);
    const { ruleId } = useParams();
    const { download } = useCSVDownload();

    const [isCreateRuleMode, setIsCreateRuleMode] = useState(false);
    const [buildingListData, setBuildingListData] = useState([]);
    const [buildingListDataNotFormatted, setBuildingListDataNotFormatted] = useState([]);
    const [isChangedRuleDetails, setIsChangedRuleDetails] = useState(false);
    const [estimatedEnergySavings, setEstimatedEnergySavings] = useState(0);
    const [isChangedSockets, setIsChangedSockets] = useState(false);
    const [isDisabledSaveButton, setIsDisabledSaveButton] = useState(true);
    const [isFetchedPlugRulesData, setIsFetchedPlugRulesData] = useState(false);
    const [equipmentTypeFilterString, setEquipmentTypeFilterString] = useState('');
    const searchTouchedRef = useRef(false);
    const [search, setSearch] = useState('');
    const [openSnackbar] = useNotification();
    const [rulesToUnLink, setRulesToUnLink] = useState({
        rule_id: '',
        sensor_id: [],
    });
    const [is24Format, setIs24Format] = useState(false);
    const timepickerOption = is24Format
        ? timePicker15MinutesIntervalOption24HourFormat
        : timePicker15MinutesIntervalOption12HourFormat;

    const { v4: uuidv4 } = require('uuid');
    const history = useHistory();

    const getConditionId = () => uuidv4();
    const initialCurrentData = {
        name: '',
        building_id: '',
        description: '',
    };
    const [currentData, setCurrentData] = useState(initialCurrentData);
    const [activeBuildingId, setActiveBuildingId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [offHoursPlots, setOffHoursPlots] = useState([]);
    const [showDeleteConditionModal, setShowDeleteConditionModal] = useState(false);
    const [currentScheduleIdToDelete, setCurrentScheduleIdToDelete] = useState();

    const [rulesToLink, setRulesToLink] = useState({
        rule_id: '',
        sensor_id: [],
    });
    const [socketsToReassign, setSocketsToReassign] = useState({});
    const [checkedAllReassignSockets, setCheckedAllReassignSockets] = useState(false);
    const [buildingError, setBuildingError] = useState({ text: '' });
    const [nameError, setNameError] = useState(false);
    const [preparedScheduleData, setPreparedScheduleData] = useState([]);
    const [conditionDisabledDays, setConditionDisabledDays] = useState();
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedRuleFilter, setSelectedRuleFilter] = useState(0);
    const [loadingSocketsUpdate, setLoadingSocketsUpdate] = useState(false);
    const [showSocketsModal, setShowSocketsModal] = useState(false);
    const [dataToUnassign, setDataToUnassign] = useState([]);
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
    const initialSortingState = { name: '', method: 'ace' };
    const [hoursNew, setHoursNew] = useState([]);

    const [selectedIds, setSelectedIds] = useState([]);
    const [fetchedSelectedIds, setFetchedSelectedIds] = useState([]);
    const [sortBy, setSortBy] = useState(initialSortingState);

    const [allSearchData, setAllSearchData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);

    useEffect(() => {
        const preparedScheduleDataCopy = preparedScheduleData ? [...preparedScheduleData] : [];
        const workingDaysPerCondition = {};
        const data = preparedScheduleDataCopy?.forEach((curr) => {
            const { title } = curr;
            if (!curr.data[0].is_deleted) {
                workingDaysPerCondition[title] = curr.data[0].action_day;
            }
        });

        const flat = Object.values(workingDaysPerCondition).flat(1);
        const disabledDays = {};

        for (const [key, value] of Object.entries(workingDaysPerCondition)) {
            const restOfDays = flat.filter((el) => !value.includes(el));
            disabledDays[key] = restOfDays;
        }

        setConditionDisabledDays(disabledDays);
        if (selectedIds.length) {
            fetchEstimateSensorSavings();
        }
    }, [preparedScheduleData]);
    useEffect(() => {
        const Is24HoursFormat = buildingListDataNotFormatted.find(
            (el) => el.building_id == currentData.building_id
        )?.time_format;
        setIs24Format(Is24HoursFormat);
    }, [currentData, buildingListDataNotFormatted]);

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
    const formatBuildingListData = (data) => {
        return data.map((el) => {
            return { value: el.building_id, label: el.building_name };
        });
    };

    const getBuildingData = async () => {
        await fetchBuildingsList(false).then((res) => {
            let data = res.data;
            setBuildingListDataNotFormatted(data);
            const formattedData = formatBuildingListData(data);

            setBuildingListData(formattedData);
        });
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
            setIsFetchedPlugRulesData(true);
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
        calculateOffHoursPlots();
    }, [preparedScheduleData, currentData]);
    useEffect(() => {
        generateHours();
        getBuildingData();
        if (ruleId == 'create-plug-rule') {
            setIsCreateRuleMode(true);
        } else {
            setIsCreateRuleMode(false);
            setIsChangedRuleDetails(false);
            fetchPlugRuleDetail();
        }
    }, [ruleId]);

    const filterHandler = (setter, options) => {
        setter(options.map(({ value }) => value));
        setPageNo(1);
    };

    useEffect(() => {
        if (!isFetchedPlugRulesData) {
            fetchPlugRulesData();
        }
    }, [currentData.name, isFetchedPlugRulesData]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, [currentData.name]);

    const fetchPlugRuleDetail = async () => {
        await fetchPlugRuleDetails(ruleId).then((res) => {
            if (res.status) {
                setSkeletonLoading(false);
            }
            let response = Object.assign({}, res.data.data[0]);
            response.building_id = response.building[0].building_id;
            setActiveBuildingId(response.building_id);
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
    const initialLineChartData = () => {
        const res = [];
        const data = Object.values(daysOfWeekFull);

        data.forEach((el) => {
            const today = moment();
            const from_date = today.startOf('week').startOf('isoWeek');
            if (el === 'Sunday') {
                from_date.day(el).add(1, 'weeks');
            } else {
                from_date.day(el);
            }
            const timeWithHours = from_date.set('hour', 0);
            res.push({ x: timeWithHours.unix() * 1000, y: 0 });
        });
        let response = [{ name: `Average Energy demand`, data: res }];

        return response;
    };

    const [lineChartData, setLineChartData] = useState(initialLineChartData());

    const getGraphData = async () => {
        if (selectedIds.length) {
            await getGraphDataRequest(selectedIds, currentData.id).then((res) => {
                if (res && res?.data.length) {
                    const formattedData = formatAverageData(res.data);
                    let response = [{ name: `Average Energy demand`, data: formattedData }];
                    setLineChartData(response);
                }
            });
        }
    };
    useEffect(() => {
        if (currentData?.building_id?.length && currentData?.building_id !== 'create-plug-rule') {
            setActiveBuildingId(currentData.building_id);
            fetchLinkedSocketRules();
        }
    }, [currentData.building_id]);

    const [equpimentTypeFilterString, setEqupimentTypeFilterString] = useState('');

    const [macTypeFilterString, setMacTypeFilterString] = useState('');

    const [locationTypeFilterString, setLocationTypeFilterString] = useState('');

    const [floorTypeFilterString, setFloorTypeFilterString] = useState('');
    const [spaceTypeFilterString, setSpaceTypeFilterString] = useState('');
    const [spaceTypeTypeFilterString, setSpaceTypeTypeFilterString] = useState('');

    const [sensorTypeFilterString, setSensorTypeFilterString] = useState('');
    const [assignedRuleFilterString, setAssignedRuleFilterString] = useState('');
    const [tagsFilterString, setTagsFilterString] = useState('');
    const [lastUsedDataFilterString, setLastUsedDataFilterString] = useState('');

    const [sensorsIdNow, setSensorIdNow] = useState('');
    const [equpimentTypeAdded, setEqupimentTypeAdded] = useState([]);
    const [unlinkedSocketRuleSuccess, setUnlinkedSocketRuleSuccess] = useState(false);
    useEffect(() => {
        if (selectedIds.length) {
            getGraphData();
            fetchEstimateSensorSavings();
        }
    }, [selectedIds]);

    const handleSwitchChange = () => {
        let obj = currentData;
        obj.is_active = !currentData.is_active;
        handleCurrentDataChange('is_active', obj.is_active);
        setIsChangedRuleDetails(true);
    };
    useEffect(() => {
        if (isChangedSockets || isChangedRuleDetails) {
            setIsDisabledSaveButton(false);
        } else {
            setIsDisabledSaveButton(true);
        }
    }, [isChangedRuleDetails, isChangedSockets]);

    const handleCurrentDataChange = (key, value) => {
        let obj = Object.assign({}, currentData);
        obj[key] = value;
        if (key == 'building_id' && value) {
            setBuildingError({ text: '' });
        }
        if (key == 'name' && value) {
            setNameError(false);
        }
        setCurrentData(obj);
        setIsChangedRuleDetails(true);
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

        setIsChangedRuleDetails(true);
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
                    action_time: '08:00',
                    action_day: [],
                    condition_id: generateFirstConditionId,
                    condition_group_id: generateConditionGroupId,
                    is_deleted: false,
                },
                {
                    action_type: 0,
                    action_time: '09:00',
                    action_day: [],
                    condition_id: generateSecondConditionId,
                    condition_group_id: generateConditionGroupId,
                    is_deleted: false,
                },
            ],
        };
        currentObj.push(obj);
        setPreparedScheduleData(currentObj);
        setIsChangedRuleDetails(true);
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
            if (record.title === condition_group_id) {
                const { data, title } = record;
                const formattedData = [];
                data.forEach((el) => {
                    formattedData.push({ ...el, is_deleted: true });
                });
                const formattedRecord = {
                    title,
                    data: formattedData,
                };

                resArray.push(formattedRecord);
            } else {
                resArray.push(record);
            }
        });
        setPreparedScheduleData(resArray);
        setIsChangedRuleDetails(true);
        setShowDeleteConditionModal(false);
    };

    const reassignSensorsToRule = async () => {
        const listToRemoveForReassign = [];
        dataToUnassign.forEach((el) => {
            if (!socketsToReassign.includes(el.id)) {
                listToRemoveForReassign.push(el.id);
            }
        });
        let listOfsocketsToReassign = [];

        if (listToRemoveForReassign.length) {
            listOfsocketsToReassign = rulesToLink.sensor_id.filter(function (val) {
                return listToRemoveForReassign.indexOf(val) == -1;
            });
        } else {
            listOfsocketsToReassign = rulesToLink.sensor_id;
        }

        listOfsocketsToReassign &&
            (await reassignSensorsToRuleRequest({
                rule_id: ruleId,
                building_id: activeBuildingId,
                sensor_id: listOfsocketsToReassign,
            }).then((res) => {}));
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
        setIsChangedRuleDetails(true);
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
        setIsChangedRuleDetails(true);
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

    const handleReassignSocketsCheckboxClick = (value, socket) => {
        let newSocketsToReassign = [...socketsToReassign];
        if (value) {
            newSocketsToReassign = newSocketsToReassign.filter((el) => el !== socket.id);
        } else {
            newSocketsToReassign = newSocketsToReassign.push(socket.id);
        }
        setSocketsToReassign(newSocketsToReassign);
    };

    const handleRuleStateChange = (value, rule) => {
        if (value === 'true') {
            if (checkedAll) {
                setCheckedAll(false);
            }
            let linkedData = [...linkedRuleData];
            let unLinkedData = [...unLinkedRuleData];
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
            if (allSensors.length - selectedIds.length == 0) {
                setCheckedAll(true);
            }

            let linkedData = [...linkedRuleData];
            let unLinkedData = [...unLinkedRuleData];
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
        setIsChangedSockets(true);
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
        currentDataCopy.building_id = [currentDataCopy.building_id];
        await updatePlugRuleRequest(currentDataCopy)
            .then((res) => {
                setIsProcessing(false);
                setPageRefresh(!pageRefresh);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    const fetchEstimateSensorSavings = async () => {
        const formattedSchedule = currentData?.action?.map((action) => {
            const { action_day, action_time, action_type, ...rest } = action;
            const preparedActionDays = action_day.map((day) => {
                return daysOfWeekFull[day];
            });
            return { action_time, action_type, action_days: preparedActionDays };
        });

        await getEstimateSensorSavingsRequst(formattedSchedule, selectedIds, ruleId).then((res) => {
            setEstimatedEnergySavings(res.data);
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
    const headerProps = [
        {
            name: 'Equipment Type',
            accessor: 'equipment_type_name',
            callbackValue: renderEquipType,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Location',
            accessor: 'equipment_link_location',
            callbackValue: renderLocation,
        },
        {
            name: 'Space Type',
            accessor: 'space_type',
            onSort: (method, name) => setSortBy({ method, name }),
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
    ];
    const [removeEqupimentTypesDuplication, setRemoveEqupimentTypesDuplication] = useState();

    const dataForCSV = () => {
        let newPlugRuleData = [];

        if (selectedTab === 0) {
            newPlugRuleData = allSensors;
        }

        if (selectedTab === 1) {
            newPlugRuleData = allSensors;
        }

        if (selectedTab === 2) {
            newPlugRuleData = allSensors;
        }
        return newPlugRuleData;
    };
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
                activeBuildingId,
                equpimentTypeFilterString,
                macTypeFilterString,
                locationTypeFilterString,
                sensorTypeFilterString,
                floorTypeFilterString,
                spaceTypeFilterString,
                spaceTypeTypeFilterString,
                assignedRuleFilterString,
                tagsFilterString,
                true,
                {
                    ...sorting,
                }
            ).then((res) => {
                isLoadingRef.current = false;

                let response = res.data;
                setAllSensors(response?.data);

                setUnlinkedSocketRuleSuccess(res.status);

                let unLinkedData = [];
                _.uniqBy(response, 'id').forEach((record) => {
                    record.linked_rule = false;
                    unLinkedData.push(record);
                });

                setUnLinkedRuleData(unLinkedData);
                setAllUnlinkedRuleAdded((el) => [...el, '1']);
                setTotalItems(response?.total_data);
            }));
    };

    const handleDownloadCsv = async () => {
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };

        await getUnlinkedSocketRules(
            pageSize,
            pageNo,
            activeBuildingId,
            equpimentTypeFilterString,
            macTypeFilterString,
            locationTypeFilterString,
            sensorTypeFilterString,
            floorTypeFilterString,
            spaceTypeFilterString,
            spaceTypeTypeFilterString,
            assignedRuleFilterString,
            tagsFilterString,
            false,
            {
                ...sorting,
            }
        )
            .then((res) => {
                let responseData = res?.data;
                download(
                    `Sockets${new Date().toISOString().split('T')[0]}`,
                    getSocketsForPlugRulePageTableCSVExport(responseData.data, headerProps)
                );
            })
            .catch((error) => {});
    };

    const fetchLinkedSocketRules = async () => {
        await listLinkSocketRulesRequest(ruleId, currentData.building_id, sortBy)
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
        const selectedSensors = [...selectedIds]
            .map((id) => allSensors.find((sensor) => sensor.id === id))
            .map((sensor) => ({ ...sensor, linked_rule: true }));

        setRulesToLink((prevState) => ({ ...prevState, sensor_id: selectedIds }));
        setLinkedRuleData(selectedSensors);
    }, [allData.length, allSensors?.length]);

    useEffect(() => {
        unLinkedRuleData.length > 0 &&
            setUnLinkedRuleData((olState) => olState.filter((sensor) => !selectedIds.includes(sensor.id)));
    }, [selectedIds.length, selectedIds.length, unLinkedRuleData.length]);

    useEffect(() => {
        if (ruleId === null) {
            return;
        }
        if (activeBuildingId.length) {
            fetchFiltersForSensors();
        }

        fetchUnLinkedSocketRules();
    }, [
        ruleId,
        currentData.name,
        activeBuildingId,
        equpimentTypeFilterString,
        macTypeFilterString,
        locationTypeFilterString,
        sensorTypeFilterString,
        floorTypeFilterString,
        spaceTypeFilterString,
        assignedRuleFilterString,
        tagsFilterString,
        spaceTypeTypeFilterString,
        sortBy.method,
        sortBy.name,
        pageNo,
        pageSize,
    ]);

    useEffect(() => {
        let arr1 = [];
        let arr2 = [];

        arr1 = linkedRuleData;
        arr2 = unLinkedRuleData;

        const allRuleData = arr1.concat(arr2);

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

    const selectAllRowsSensors = async (checkedAll) => {
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };

        if (checkedAll) {
            activeBuildingId &&
                (await getUnlinkedSocketRules(
                    pageSize,
                    pageNo,
                    activeBuildingId,
                    equpimentTypeFilterString,
                    macTypeFilterString,
                    locationTypeFilterString,
                    sensorTypeFilterString,
                    floorTypeFilterString,
                    spaceTypeFilterString,
                    spaceTypeTypeFilterString,
                    assignedRuleFilterString,
                    tagsFilterString,
                    false,
                    {
                        ...sorting,
                    }
                ).then((res) => {
                    isLoadingRef.current = false;

                    let response = res.data;
                    const preparedIdofSockets = [];
                    _.cloneDeep(_.uniqBy(response.data, 'id')).forEach((socket) => {
                        preparedIdofSockets.push(socket.id);
                    });
                    setRulesToLink((prevState) => ({
                        ...prevState,
                        sensor_id: preparedIdofSockets,
                    }));

                    setTotalSocket(response.total_data);
                }));
        } else {
            setRulesToUnLink({ rule_id: ruleId, sensor_id: fetchedSelectedIds });
            setRulesToLink([]);
            setSelectedIds([]);

            setRulesToUnLink((prev) => ({ rule_id: prev.rule_id, sensor_id: fetchedSelectedIds }));
            setTotalSocket(0);
        }
        setIsChangedSockets(true);
        setCheckedAll(checkedAll);
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
    const validatePlugRuleForm = (data) => {
        let valid = true;
        if (!data.name.length) {
            setNameError(true);
            valid = false;
        }
        if (!data.building_id.length) {
            setBuildingError({ text: 'please select building' });
            valid = false;
        }
        return valid;
    };
    const handleContinueAndSaveClick = async () => {
        Promise.allSettled([
            isChangedRuleDetails && updatePlugRuleData(),
            isChangedSockets && reassignSensorsToRule(),
            isChangedSockets && updateSocketUnlink(),
        ]).then((value) => {
            handleCloseSocketsModal(true);
            fetchUnLinkedSocketRules();
            fetchFiltersForSensors();
            fetchLinkedSocketRules();
            fetchPlugRuleDetail();
            openSnackbar({ ...notificationUpdatedData, type: Notification.Types.success, duration: 5000 });
            setIsChangedRuleDetails(false);
            setIsChangedSockets(false);
        });
    };

    const handleCheckIfSocketAssignedToAnotherRule = (rulesToLink) => {
        const dataUnassign = [];
        const idSocketsToAssign = [];
        const socketsToReassign = [];
        allSensors.forEach((sensor) => {
            if (rulesToLink?.sensor_id?.includes(sensor.id)) {
                if (sensor.assigned_rule_id && sensor.assigned_rule_id !== ruleId) {
                    socketsToReassign.push(sensor.id);
                    dataUnassign.push(sensor);
                } else {
                    idSocketsToAssign.push(sensor.id);
                }
            }
        });
        setDataToUnassign(dataUnassign);
        setSocketsToReassign(socketsToReassign);
        if (dataUnassign.length) {
            return { isAssignedToAnotherRule: true, dataToAssign: idSocketsToAssign };
        } else {
            return { isAssignedToAnotherRule: false, dataToAssign: idSocketsToAssign };
        }
    };
    const handleSaveClicked = async () => {
        const { isAssignedToAnotherRule } = handleCheckIfSocketAssignedToAnotherRule(rulesToLink);
        if (isAssignedToAnotherRule) {
            setShowSocketsModal(true);
            return;
        }
        if (isCreateRuleMode) {
            const isValid = validatePlugRuleForm(currentData);
            if (isValid) {
                let currentDataCopy = Object.assign({}, currentData);

                const formattedSchedule = [];
                preparedScheduleData.forEach((currentCondition) => {
                    currentCondition.data.forEach((currentRow) => {
                        formattedSchedule.push(currentRow);
                    });
                });
                currentDataCopy.action = formattedSchedule;
                currentDataCopy.building_id = [currentData.building_id || localStorage.getItem('buildingId')];
                openSnackbar({ ...notificationCreateData, type: Notification.Types.success, duration: 5000 });
                await createPlugRuleRequest(currentDataCopy)
                    .then((res) => {
                        const { data } = res;
                        history.push({
                            pathname: `/control/plug-rules/${data.data.plug_rule_id}`,
                        });
                    })
                    .catch((error) => {
                        setIsProcessing(false);
                    });
            }
        } else {
            Promise.allSettled([
                isChangedSockets && updateSocketUnlink(),
                isChangedSockets && reassignSensorsToRule(),
                isChangedRuleDetails && updatePlugRuleData(),
            ]).then((value) => {
                openSnackbar({ ...notificationUpdatedData, type: Notification.Types.success, duration: 5000 });
                setIsChangedRuleDetails(false);
                setIsChangedSockets(false);
                fetchUnLinkedSocketRules();
                fetchFiltersForSensors();
                fetchLinkedSocketRules();
                fetchPlugRuleDetail();
            });
        }
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
    const fetchFiltersForSensors = async () => {
        isLoadingRef.current = true;
        await getFiltersForSensorsRequest({
            activeBuildingId,
            macTypeFilterString,
            equpimentTypeFilterString,
            sensorTypeFilterString,
            floorTypeFilterString,
            spaceTypeFilterString,
            spaceTypeTypeFilterString,
        }).then((filters) => {
            const filterOptions = filters.data?.length ? filters.data[0] : filters.data;
            const filterOptionsFetched = [
                {
                    label: 'Equipment Type',
                    value: 'equipmentType',
                    placeholder: 'All Equipment Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions?.equipment_type.map((filterItem) => ({
                        value: filterItem.equipment_type_id,
                        label: filterItem.equipment_type_name,
                    })),
                    onClose: (options) => filterHandler(setEqupimentTypeFilterString, options),
                    onDelete: () => {
                        setEqupimentTypeFilterString('');
                    },
                },
                {
                    label: 'Floor',
                    value: 'floor',
                    placeholder: 'All Floors',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions?.installed_floor.map((filterItem) => ({
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
                    filterOptions: filterOptions?.installed_space.map((filterItem) => ({
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
                    filterOptions: filterOptions?.installed_space_type.map((filterItem) => ({
                        value: filterItem.space_type_id,
                        label: filterItem.space_type_name,
                    })),
                    onClose: (options) => filterHandler(setSpaceTypeTypeFilterString, options),
                    onDelete: () => setSpaceTypeTypeFilterString(''),
                },
                {
                    label: 'MAC Address',
                    value: 'macAddresses',
                    placeholder: 'All Mac addresses',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions?.mac_address.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setMacTypeFilterString, options),
                    onDelete: () => {
                        setMacTypeFilterString('');
                    },
                },
                {
                    label: 'Sensors',
                    value: 'sensor_count',
                    placeholder: 'All Sensors',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions?.sensor_count.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setSensorTypeFilterString, options),
                    onDelete: setSensorTypeFilterString(''),
                },
                {
                    label: 'Assigned rule',
                    value: 'assigned_rule',
                    placeholder: 'All assigned rule',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions?.assigned_rule.map((filterItem) => ({
                        value: filterItem.plug_rule_id,
                        label: filterItem.plug_rule_name,
                    })),
                    onClose: (options) => filterHandler(setAssignedRuleFilterString, options),
                    onDelete: setAssignedRuleFilterString(''),
                },
                {
                    label: 'Tags',
                    value: 'tags',
                    placeholder: 'All tags',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions?.tags.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setTagsFilterString, options),
                    onDelete: setTagsFilterString(''),
                },
                {
                    label: 'Last used data',
                    value: 'last_used_data',
                    placeholder: 'All last used data',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions?.last_used_data.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setLastUsedDataFilterString, options),
                    onDelete: setLastUsedDataFilterString(''),
                },
            ];
            setFilterOptions(filterOptionsFetched);
        });

        isLoadingRef.current = false;
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

    const RenderScheduleActionItem = ({ record }) => {
        const firstCondition = record.data[0];
        const secondCondition = record.data[1];
        if (!firstCondition.is_deleted && !secondCondition.is_deleted) {
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
                                    options={firstCondition.action_type == '2' ? [] : timepickerOption}
                                />
                            </div>
                            <div>on</div>
                            <div className="schedular-weekday-group">
                                {firstCondition.condition_group_id}
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
                                    options={timepickerOption}
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
        } else {
            return null;
        }
    };

    const getDateRange = () => {
        const minDate = moment().startOf('isoweek');
        const maxDate = moment().endOf('isoweek');
        maxDate.set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
        minDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        return {
            maxDate: maxDate.unix() * 1000,
            minDate: minDate.unix() * 1000,
        };
    };
    const calculateOffHoursPlots = () => {
        let weekWithSchedule = [];
        const copyOfPreparedScheduleData = [...preparedScheduleData];
        copyOfPreparedScheduleData.map((groupId) => {
            groupId.data.forEach((el) => {
                switch (el.action_type) {
                    case 0:
                        el.action_day.forEach((day) => {
                            weekWithSchedule[indexOfDay[day]] = {
                                ...weekWithSchedule[indexOfDay[day]],
                                turnOff: el.action_time,
                            };
                        });

                        break;
                    case 1:
                        el.action_day.forEach((day) => {
                            weekWithSchedule[indexOfDay[day]] = {
                                ...weekWithSchedule[indexOfDay[day]],
                                turnOn: el.action_time,
                            };
                        });
                        break;
                }
            });
        });

        let result = [];
        for (let i = 0; i < weekWithSchedule.length; i++) {
            let currentOff = weekWithSchedule[i]?.turnOff;
            let currentOffDay = i;

            let nextOn;
            let nextOnDay;
            if (i === weekWithSchedule.length - 1) {
                nextOn = weekWithSchedule[0]?.turnOn;
                nextOnDay = 0;
            } else {
                for (let j = i; j < weekWithSchedule.length; j++) {
                    if (weekWithSchedule[j]?.turnOn) {
                        if (weekWithSchedule[j]?.turnOn >= weekWithSchedule[j]?.turnOff) {
                            nextOnDay = j;
                            nextOn = weekWithSchedule[j]?.turnOn;
                            break;
                        } else {
                            nextOnDay = j + 1;
                            nextOn = weekWithSchedule[j + 1]?.turnOn;
                            break;
                        }
                    }
                }
            }
            if (!currentOff) {
                continue;
            }
            if (!nextOn) {
                if (i === weekWithSchedule.length - 1) {
                    nextOn = weekWithSchedule[0]?.turnOn;
                    nextOnDay = 0;
                } else {
                    nextOn = weekWithSchedule[i + 1]?.turnOn;
                    nextOnDay = i + 1;
                }
            }
            if (currentOff && nextOn) {
                result.push({
                    day: i,
                    currentOffDay,
                    nextOnDay,
                    currentOffTime: currentOff,
                    nextOnTime: nextOn,
                });
            }
        }
        getOffperiodsWithRealDate(result, getDateRange());
    };

    function getDatesInRange(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }
    const checkIfDayInOffRange = (day, result) => {
        let offDay = {};
        result.forEach((el) => {
            if (el.day == day) {
                offDay = el;
            }
        });
        return offDay;
    };

    const getOffperiodsWithRealDate = (result, dateRange) => {
        const maxdateString = new Date(dateRange.maxDate);
        const mindateString = new Date(dateRange.minDate);
        const rangeDates = getDatesInRange(mindateString, maxdateString);
        const offPeriods = [];
        rangeDates.forEach((day) => {
            const currentWeekDay = moment(day).weekday();
            const weekDayOffSchedule = checkIfDayInOffRange(currentWeekDay, result);
            if (!_.isEmpty(weekDayOffSchedule)) {
                let timeDiff;

                if (weekDayOffSchedule?.nextOnDay >= weekDayOffSchedule?.currentOffDay) {
                    timeDiff = weekDayOffSchedule?.nextOnDay - weekDayOffSchedule?.currentOffDay;
                } else if (weekDayOffSchedule?.nextOnDay < weekDayOffSchedule?.currentOffDay) {
                    timeDiff = 6 - weekDayOffSchedule?.currentOffDay + weekDayOffSchedule?.nextOnDay + 1;
                }
                const nextTurnOnDay = moment(day, 'YYYY-MM-DD').add(timeDiff, 'days').format('YYYY-MM-DD');
                const from = moment(day + ' ' + weekDayOffSchedule?.currentOffTime).unix();
                const to = moment(nextTurnOnDay + ' ' + weekDayOffSchedule?.nextOnTime).unix();
                offPeriods.push({
                    type: LineChart.PLOT_BANDS_TYPE.off_hours,
                    from: from * 1000,
                    to: to * 1000,
                });
            }
        });
        setOffHoursPlots(offPeriods);
    };
    const buildingIdProps = {
        label: 'Choose building',
        defaultValue: currentData.building_id || localStorage.getItem('buildingId'),
        onChange: (event) => {
            handleCurrentDataChange('building_id', event.value);
        },
        options: buildingListData,
    };
    const handleCloseSocketsModal = () => {
        setShowSocketsModal(false);
    };

    if (buildingError?.text?.length) {
        buildingIdProps.error = buildingError;
    }
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
                                checked={currentData.is_active}
                                onColor={'#2955E7'}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                className="react-switch"
                                height={20}
                                width={36}
                            />
                            <span className="ml-2 plug-rule-switch-font">Active</span>
                        </div>
                        <div className="cancel-and-save-flex">
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
                            <Button
                                disabled={isDisabledSaveButton}
                                size={Button.Sizes.md}
                                label="Save"
                                type={Button.Type.primary}
                                onClick={() => {
                                    handleSaveClicked();
                                }}
                            />
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
                                            error={nameError}
                                        />
                                        <div className="my-3">
                                            {isCreateRuleMode ? (
                                                <Select {...buildingIdProps} />
                                            ) : (
                                                <Select
                                                    label="Choose building"
                                                    defaultValue={currentData.building_id}
                                                    onChange={(event) => {
                                                        handleCurrentDataChange('building_id', event.value);
                                                    }}
                                                    isDisabled={true}
                                                    options={buildingListData}
                                                />
                                            )}
                                        </div>

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
                        <div className="total-eng-consumtn">
                            {lineChartData && (
                                <LineChart
                                    data={lineChartData.map((d) => ({
                                        ...d,
                                        fillColor: {
                                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                            stops: [[1, 'rgba(255,255,255,.01)']],
                                        },
                                    }))}
                                    dateRange={getDateRange()}
                                    height={200}
                                    plotBands={offHoursPlots}
                                    title={'Average Energy Demand'}
                                    subTitle={'Last 2 Weeks'}
                                    plotBandsLegends={[
                                        { label: 'Plug Rule Off-Hours', color: 'rgb(16 24 40 / 25%)' },
                                        {
                                            label: 'After-Hours',
                                            color: {
                                                background: 'rgba(180, 35, 24, 0.1)',
                                                borderColor: colors.error700,
                                            },
                                            onClick: () => {},
                                        },
                                    ]}
                                    unitInfo={{
                                        title: 'Estimated Energy Savings',
                                        unit: UNITS.KWH,
                                        value: estimatedEnergySavings,
                                    }}
                                    chartProps={{
                                        tooltip: {
                                            xDateFormat: is24Format ? '%A, %H:%M' : '%A, %I:%M %p',
                                        },
                                        xAxis: {
                                            labels: {
                                                formatter: function (val) {
                                                    return moment(val.value).format('ddd');
                                                },
                                                step: 1,
                                            },
                                        },
                                    }}
                                />
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
                    {currentData.building_id ? (
                        <DataTableWidget
                            isLoading={isLoadingRef.current}
                            isLoadingComponent={<SkeletonLoading />}
                            id="sockets-plug-rules"
                            onSearch={(query) => {
                                setPageNo(1);
                                setSearch(query);
                            }}
                            filterOptions={filterOptions}
                            buttonGroupFilterOptions={[
                                { label: 'All' },
                                { label: 'Selected' },
                                { label: 'Unselected' },
                            ]}
                            onDownload={() => handleDownloadCsv()}
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
                                    name: 'Location',
                                    accessor: 'equipment_link_location',
                                    callbackValue: renderLocation,
                                },
                                {
                                    name: 'Space Type',
                                    accessor: 'space_type',
                                    onSort: (method, name) => setSortBy({ method, name }),
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
                                    onChange={() => selectAllRowsSensors(!checkedAll)}
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
                    ) : (
                        <div className="sockets-no-selected-building">
                            <Typography.Subheader size={Typography.Sizes.md}>
                                Please choose building to see the list of sockets
                            </Typography.Subheader>
                        </div>
                    )}
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

            <Modal
                show={showSocketsModal}
                onHide={() => handleCloseSocketsModal()}
                centered
                backdrop="static"
                dialogClassName="sockets-modal-container-style"
                keyboard={false}>
                <Modal.Header>
                    <Modal.Title id="">Socket with existing rules</Modal.Title>
                    <Typography.Subheader size={Typography.Sizes.md} className="subtitle-sockets-modal">
                        These sockets are assigned to another rule. Please select the sockets you would like to unassign
                        from their current rule
                    </Typography.Subheader>
                </Modal.Header>
                <Modal.Body>
                    <DataTableWidget
                        isLoading={isLoadingRef.current}
                        isLoadingComponent={<SkeletonLoading />}
                        id="sockets-plug-rules-modal"
                        rows={dataToUnassign}
                        buttonGroupFilterOptions={[]}
                        headers={[
                            {
                                name: 'Equipment Type',
                                accessor: 'equipment_type_name',
                                callbackValue: renderEquipType,
                            },
                            {
                                name: 'Location',
                                accessor: 'equipment_link_location',
                                callbackValue: renderLocation,
                            },
                            {
                                name: 'Space Type',
                                accessor: 'space_type',
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
                        onCheckboxRow={() => {}}
                        customCheckAll={() => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="vehicle1"
                                name="vehicle1"
                                checked={checkedAllReassignSockets}
                                onChange={() => {
                                    setCheckedAllReassignSockets(!checkedAllReassignSockets);
                                }}
                            />
                        )}
                        customCheckboxForCell={(record) => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="socket_rule"
                                name="socket_rule"
                                checked={socketsToReassign.includes(record?.id) || checkedAllReassignSockets}
                                value={
                                    socketsToReassign.includes(record?.id) || checkedAllReassignSockets ? true : false
                                }
                                onChange={(e) => {
                                    handleReassignSocketsCheckboxClick(e.target.value, record);
                                }}
                            />
                        )}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        type={Button.Type.secondary}
                        size={Button.Sizes.md}
                        onClick={() => handleCloseSocketsModal()}>
                        Cancel
                    </Button>
                    {loadingSocketsUpdate ? (
                        <Button color="primary" disabled>
                            <Spinner size="sm">Loading...</Spinner>
                            <span> Loading</span>
                        </Button>
                    ) : (
                        <Button
                            label="Continue & Save"
                            type={Button.Type.primary}
                            size={Button.Sizes.md}
                            onClick={() => {
                                handleContinueAndSaveClick();
                            }}></Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PlugRule;
