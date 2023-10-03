import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Input from '../../sharedComponents/form/input/Input';
import Textarea from '../../sharedComponents/form/textarea/Textarea';
import Switch from 'react-switch';
import { useAtom } from 'jotai';
import classNames from 'classnames';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ButtonGroup } from '../../sharedComponents/buttonGroup';
import { ComponentStore } from '../../store/ComponentStore';
import { UncontrolledTooltip } from 'reactstrap';
import Button from '../../sharedComponents/button/Button';
import { Spinner } from 'reactstrap';
import { fetchPlugRules, getEstimateSensorSavingsRequst } from '../../services/plugRules';
import { ReactComponent as DeleteIcon } from '../../sharedComponents/assets/icons/delete-distructive.svg';
import { ConditionGroup } from '../../sharedComponents/conditionGroup';
import { useNotification } from '../../sharedComponents/notification/useNotification';
import { Notification } from '../../sharedComponents/notification/Notification';
import colors from '../../assets/scss/_colors.scss';
import { UserStore } from '../../store/UserStore';
import { UNITS } from '../../constants/units';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { getSocketsForPlugRulePageTableCSVExport, getAverageEnergyDemandCSVExport } from '../../utils/tablesExport';
import { userPermissionData } from '../../store/globalState';
import 'react-datepicker/dist/react-datepicker.css';
import { useHistory, useParams } from 'react-router-dom';
import Select from '../../sharedComponents/form/select';
import { ReactComponent as CheckedSVG } from '../../assets/icon/circle-check.svg';
import { ReactComponent as CircleXmarkSVG } from '../../assets/icon/circle-xmark.svg';
import { ReactComponent as WarningSVG } from '../../assets/icon/warning.svg';
import _ from 'lodash';
import colorPalette from '../../assets/scss/_colors.scss';
import {
    timePicker15MinutesIntervalOption24HourFormat,
    timePicker15MinutesIntervalOption12HourFormat,
} from '../../constants/time';
import { daysOfWeekFull } from '../../constants/days';
import { buildingData } from '../../store/globalState';

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
    if (data.length) {
        data.forEach((el) => {
            const today = moment.utc(el.time_stamp);
            res.push({ x: today.unix() * 1000, y: el.consumption });
        });
    }

    return res;
};
const notificationCreateData = {
    title: 'Rule has been created',
};

const notificationUpdatedData = {
    title: 'Rule has been updated',
};
const notificationLinkedData = (count, name) => {
    return {
        title: `${count} ${count == 1 ? 'socket has' : 'sockets have'} been linked to ${name}`,
    };
};
const notificationUnlinkedData = (count, name) => {
    return {
        title: `${count} ${count == 1 ? 'socket has' : 'sockets have'} been unlinked from ${name} `,
    };
};

const PlugRule = () => {
    const isLoadingLinkedRef = useRef(false);
    const isLoadingUnlinkedRef = useRef(false);
    const isLoadingRef = useRef(false);
    const { ruleId } = useParams();
    const { download } = useCSVDownload();
    const [bldgTimeZone, setBldgTimeZone] = useState(null);
    const [buildingListData] = useAtom(buildingData);
    const [isCreateRuleMode, setIsCreateRuleMode] = useState(false);
    const [isChangedRuleDetails, setIsChangedRuleDetails] = useState(false);
    const [estimatedEnergySavings, setEstimatedEnergySavings] = useState(0);
    const [isChangedSocketsLinked, setIsChangedSocketsLinked] = useState(false);
    const [isChangedSocketsUnlinked, setIsChangedSocketsUnlinked] = useState(false);
    const [listSocketsIds, setListSocketsIds] = useState([]);
    const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);
    const [isDisabledSaveButton, setIsDisabledSaveButton] = useState(true);
    const [isFetchedPlugRulesData, setIsFetchedPlugRulesData] = useState(false);
    const [equipmentTypeFilterStringUnlinked, setEquipmentTypeFilterStringUnlinked] = useState('');
    const [equipmentTypeFilterStringLinked, setEquipmentTypeFilterStringLinked] = useState('');
    const searchTouchedRef = useRef(false);
    const [searchLinked, setSearchLinked] = useState('');
    const [searchUnlinked, setSearchUnlinked] = useState('');
    const [openSnackbar] = useNotification();
    const [rulesToUnLink, setRulesToUnLink] = useState({
        rule_id: '',
        sensor_id: [],
    });
    const [rulesToLink, setRulesToLink] = useState({
        rule_id: '',
        sensor_id: [],
    });
    const { timeFormat } = UserStore.useState((s) => ({
        timeFormat: s.timeFormat,
    }));
    const [userPermission] = useAtom(userPermissionData);
    const isViewer = userPermission?.user_role === 'member';

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
        current_job_log: [],
    };
    const [currentData, setCurrentData] = useState(initialCurrentData);
    const [activeBuildingId, setActiveBuildingId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [offHoursPlots, setOffHoursPlots] = useState([]);
    const [showDeleteConditionModal, setShowDeleteConditionModal] = useState(false);
    const [currentScheduleIdToDelete, setCurrentScheduleIdToDelete] = useState();

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
    const [socketsTab, setSocketsTab] = useState(0);
    const [linkedSocketsTabData, setLinkedSocketsTabData] = useState([]);
    const [unlinkedSocketsTabData, setUnlinkedSocketsTabData] = useState([]);

    const [isDeleting, setIsDeleting] = useState(false);
    const [allData, setAllData] = useState([]);
    const [allLinkedRuleData, setAllLinkedRuleData] = useState([]);
    const [pageSizeLinked, setPageSizeLinked] = useState(20);
    const [pageSizeUnlinked, setPageSizeUnlinked] = useState(20);
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [pageNoLinked, setPageNoLinked] = useState(1);
    const [pageNoUnlinked, setPageNoUnlinked] = useState(1);
    const [totalSocket, setTotalSocket] = useState(0);
    const [checkedAllToUnlink, setCheckedToUnlinkAll] = useState(false);
    const [checkedAllToLink, setCheckedAllToLink] = useState(false);
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
    const initialSortingState = { name: '', method: '' };
    const [hoursNew, setHoursNew] = useState([]);

    const [selectedInitialyIds, setSelectedInitialyIds] = useState([]);
    const [selectedIdsToUnlink, setSelectedIdsToUnlink] = useState([]);
    const [selectedIdsToLink, setSelectedIdsToLink] = useState([]);
    const [showConfirmSelectionToUnlink, setShowConfirmSelectionToUnlink] = useState(false);
    const [showConfirmSelectionToLink, setShowConfirmSelectionToLink] = useState(false);
    const [fetchedSelectedIds, setFetchedSelectedIds] = useState([]);
    const [dateRangeAverageData, setDateRangeAverageData] = useState({});
    const [sortByLinkedTab, setSortByLinkedTab] = useState(initialSortingState);
    const [sortByUnlinkedTab, setSortByUnlinkedTab] = useState(initialSortingState);

    const [allSearchData, setAllSearchData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalItemsLinked, setTotalItemsLinked] = useState(0);
    const [totalItemsUnlinked, setTotalItemsUnlinked] = useState(0);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    useEffect(() => {
        buildingListData.forEach((el) => {
            if (el.building_id === activeBuildingId) {
                setBldgTimeZone(el.timezone);
            }
        });
    }, [buildingListData, activeBuildingId]);
    const preparedBuildingListData = () => {
        const copyBuildingListData = [...buildingListData];
        const res = copyBuildingListData.map((el) => {
            return { label: el.building_name, value: el.building_id };
        });
        return res;
    };
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
        if (selectedInitialyIds.length) {
            fetchEstimateSensorSavings(selectedInitialyIds);
        }
    }, [preparedScheduleData]);

    useEffect(() => {
        const linkedIds = selectedInitialyIds.filter((item) => !selectedIdsToUnlink.includes(item));
        const res = [...selectedIdsToLink, ...linkedIds];
        fetchEstimateSensorSavings(res);
        getGraphData(res);
    }, [selectedIdsToUnlink, selectedIdsToLink, selectedInitialyIds.length]);

    useEffect(() => {
        const Is24HoursFormat = timeFormat == '24h';
        setIs24Format(Is24HoursFormat);
    }, [currentData, buildingListData]);

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
            console.log('res.data.data', res.data.data);
            setIsFetchedPlugRulesData(true);
            const plugRules = res.data.data;
            plugRules &&
                plugRules.forEach((plugRule) => {
                    if (plugRule.name == currentData.name) {
                        setActiveBuildingId(plugRule.buildings[0]?.building_id);
                    }
                });
        });
    };
    useEffect(() => {
        calculateOffHoursPlots();
    }, [preparedScheduleData, currentData, rawLineChartData, lineChartData, dateRangeAverageData]);
    useEffect(() => {
        generateHours();
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
    }, [isFetchedPlugRulesData]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, [currentData.name]);

    const fetchPlugRuleDetail = async () => {
        await fetchPlugRuleDetails(ruleId).then((res) => {
            if (res.status) {
                setSkeletonLoading(false);
            }
            let response = Object.assign({}, res.data.data[0]);
            response.building_id = response?.building[0]?.building_id;
            setActiveBuildingId(response.building_id);
            console.log('response765756756765', response);
            setCurrentData(response);
            const scheduleData = groupedCurrentDataById(response.action);
            setPreparedScheduleData(scheduleData);
        });
    };

    const deletePlugRule = async () => {
        setIsDeleting(true);
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
            for (let i = 0; i <= 23; i++) {
                const today = moment().utc();
                const from_date = today.startOf('week').startOf('isoWeek');
                let timeWithHours = '';
                if (el === 'Sunday') {
                    from_date.day(el).add(1, 'weeks');
                } else {
                    from_date.day(el);
                }
                timeWithHours = from_date.set({ hour: i, minute: 0 });
                res.push({ x: moment.utc(timeWithHours).unix() * 1000, y: 0 });
            }
        });
        let response = [{ name: `Average Energy demand`, data: res }];

        return response;
    };

    const [lineChartData, setLineChartData] = useState(initialLineChartData());
    useEffect(() => {
        if (currentData?.building_id?.length && currentData?.building_id !== 'create-plug-rule') {
            setActiveBuildingId(currentData.building_id);
        }
    }, [currentData.building_id]);

    const [macTypeFilterStringUnlinked, setMacTypeFilterStringUnlinked] = useState('');
    const [macTypeFilterStringLinked, setMacTypeFilterStringLinked] = useState('');
    const [rawLineChartData, setRawLineChartData] = useState([]);
    const [locationTypeFilterString, setLocationTypeFilterString] = useState('');

    const [floorTypeFilterStringUnlinked, setFloorTypeFilterStringUnlinked] = useState('');
    const [floorTypeFilterStringLinked, setFloorTypeFilterStringLinked] = useState('');
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
    const [spaceTypeFilterStringUnlinked, setSpaceTypeFilterStringUnlinked] = useState('');
    const [spaceTypeFilterStringLinked, setSpaceTypeFilterStringLinked] = useState('');

    const [spaceTypeTypeFilterStringUnlinked, setSpaceTypeTypeFilterStringUnlinked] = useState('');
    const [spaceTypeTypeFilterStringLinked, setSpaceTypeTypeFilterStringLinked] = useState('');

    const [sensorTypeFilterStringUnlinked, setSensorTypeFilterStringUnlinked] = useState('');
    const [sensorTypeFilterStringLinked, setSensorTypeFilterStringLinked] = useState('');
    const [countUnlinkedSockets, setCountUnlinkedSockets] = useState(null);
    const [countLinkedSockets, setCountLinkedSockets] = useState(0);
    const [isSetInitiallySocketsCountLinked, setIsSetInitiallySocketsCountLinked] = useState(false);
    const [isSetInitiallySocketsCountUnlinked, setIsSetInitiallySocketsCountUnlinked] = useState(false);
    const [assignedRuleFilterStringUnlinked, setAssignedRuleFilterStringUnlinked] = useState('');
    const [assignedRuleFilterStringLinked, setAssignedRuleFilterStringLinked] = useState('');
    const [tagsFilterStringUnlinked, setTagsFilterStringUnlinked] = useState('');
    const [tagsFilterStringLinked, setTagsFilterStringLinked] = useState('');
    const [lastUsedDataFilterStringUnlinked, setLastUsedDataFilterStringUnlinked] = useState('');
    const [lastUsedDataFilterStringLinked, setLastUsedDataFilterStringLinked] = useState('');

    const [sensorsIdNow, setSensorIdNow] = useState('');
    const [equpimentTypeAdded, setEqupimentTypeAdded] = useState([]);
    const [unlinkedSocketRuleSuccess, setUnlinkedSocketRuleSuccess] = useState(false);

    const getGraphData = async (ids) => {
        if (ids.length) {
            await getGraphDataRequest(ids, currentData.id).then((res) => {
                if (res && res?.data) {
                    const formattedData = formatAverageData(res.data);
                    setRawLineChartData(res.data);
                    let response;
                    if (!_.isEmpty(formattedData)) {
                        response = [{ name: `Average Energy demand`, data: formattedData }];
                    } else {
                        response = initialLineChartData();
                    }
                    if (res.data.length) {
                        getDateRange(res.data);
                    }
                    setLineChartData(response);
                }
            });
        } else {
            getDateRange(initialLineChartData()[0].data);
            const response = initialLineChartData();
            setLineChartData(response);
        }
    };

    useEffect(() => {
        if (selectedIdsToUnlink.length) {
            setShowConfirmSelectionToUnlink(true);
        }
    }, [selectedIdsToUnlink]);

    useEffect(() => {
        if (selectedIdsToLink.length) {
            setShowConfirmSelectionToLink(true);
        }
    }, [selectedIdsToLink]);
    const handleSwitchChange = () => {
        let obj = currentData;
        obj.is_active = !currentData.is_active;
        handleCurrentDataChange('is_active', obj.is_active);
        setIsChangedRuleDetails(true);
    };
    useEffect(() => {
        if (isChangedRuleDetails) {
            setIsDisabledSaveButton(false);
        } else {
            setIsDisabledSaveButton(true);
        }
    }, [isChangedRuleDetails, isChangedSocketsUnlinked, isChangedSocketsLinked]);

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
            listOfsocketsToReassign = [...rulesToLink.sensor_id, ...listSocketsIds];
        }
        listOfsocketsToReassign &&
            (await reassignSensorsToRuleRequest({
                rule_id: ruleId,
                building_id: activeBuildingId,
                sensor_id: listOfsocketsToReassign,
            }).then((res) => {
                setIsSetInitiallySocketsCountLinked(false);
                const snackbarTitle = notificationLinkedData(rulesToLink.sensor_id.length, currentData.name);
                openSnackbar({ ...snackbarTitle, type: Notification.Types.success, duration: 5000 });
                fetchUnLinkedSocketRules();
                fetchLinkedSocketRules();
                fetchLinkedSocketIds();
                setCheckedAllToLink(false);
                setSelectedIdsToLink([]);
            }));
    };

    const updateSocketUnlink = async () => {
        if (rulesToUnLink.sensor_id.length === 0) {
            return;
        }
        setIsProcessing(true);

        await unlinkSocketRequest(rulesToUnLink)
            .then((res) => {
                setSelectedIdsToUnlink([]);
                const snackbarTitle = notificationUnlinkedData(rulesToUnLink.sensor_id.length, currentData.name);

                openSnackbar({ ...snackbarTitle, type: Notification.Types.success, duration: 5000 });
                setIsSetInitiallySocketsCountLinked(false);
                fetchLinkedSocketRules();
                fetchLinkedSocketIds();
                fetchUnLinkedSocketRules();
            })
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

    const handleClickConfirmSelection = (tabId) => {
        if (tabId == 0) {
            isChangedSocketsLinked && updateSocketUnlink();
        } else {
            handleSaveClicked();
        }

        setIsUnsavedChanges(false);
    };
    const handleClickConfirmSelectionToUnlink = () => {
        handleSaveClicked();
        setIsUnsavedChanges(true);
        setShowConfirmSelectionToUnlink(false);
    };

    const handleClickConfirmSelectionToLink = () => {
        handleSaveClicked();
        setIsUnsavedChanges(true);
        setShowConfirmSelectionToLink(false);
    };

    const handleRuleLinkStateChange = (value, rule) => {
        if (value === 'false') {
            if (checkedAllToLink) {
                setCheckedToUnlinkAll(false);
            }
            let recordToLink = { ...rulesToLink };
            recordToLink.rule_id = currentData.id;
            recordToLink.sensor_id = [...recordToLink.sensor_id, rule.id];
            setRulesToLink(recordToLink);
            setTotalSocket((totalCount) => ++totalCount);
        }

        if (value === 'true') {
            if (allSensors.length - selectedInitialyIds.length == 0) {
                setCheckedToUnlinkAll(true);
            }

            let recordToLink = { ...rulesToLink };
            recordToLink.rule_id = currentData.id;
            recordToLink.sensor_id.filter((el) => el.id !== rule.id);

            setRulesToLink(recordToLink);

            setTotalSocket((totalCount) => --totalCount);
        }

        const isAdding = value === 'false';

        setSelectedIdsToLink((prevState) => {
            return isAdding ? [...prevState, rule.id] : prevState.filter((sensorId) => sensorId !== rule.id);
        });
        setIsChangedSocketsUnlinked(true);
    };
    const handleRuleStateChangeUnlink = (value, rule) => {
        if (value === 'true') {
            if (checkedAllToUnlink) {
                setCheckedToUnlinkAll(false);
            }
            let recordToUnLink = { ...rulesToUnLink };
            recordToUnLink.rule_id = currentData.id;
            recordToUnLink.sensor_id.push(rule.id);
            setRulesToUnLink(recordToUnLink);
            setTotalSocket((totalCount) => --totalCount);
        }

        if (value === 'false') {
            if (allSensors.length - selectedInitialyIds.length == 0) {
                setCheckedToUnlinkAll(true);
            }

            let recordToUnLink = rulesToUnLink;
            recordToUnLink.rule_id = currentData.id;
            recordToUnLink.sensor_id.push(rule.id);

            setRulesToUnLink(recordToUnLink);

            setTotalSocket((totalCount) => ++totalCount);
        }

        const isAdding = value === 'false';

        setSelectedIdsToUnlink((prevState) => {
            return isAdding ? prevState.filter((sensorId) => sensorId !== rule.id) : [...prevState, rule.id];
        });
        setIsChangedSocketsLinked(true);
    };

    const updatePlugRuleData = async () => {
        setIsProcessing(true);
        let currentDataCopy = Object.assign({}, currentData);

        const formattedSchedule = [];
        preparedScheduleData.forEach((currentCondition) => {
            currentCondition.data.forEach((currentRow) => {
                if (currentRow.action_day.length) {
                    formattedSchedule.push(currentRow);
                }
            });
        });
        currentDataCopy.action = formattedSchedule;
        currentDataCopy.building_id = [currentDataCopy.building_id];
        await updatePlugRuleRequest(currentDataCopy)
            .then((res) => {
                setIsProcessing(false);
                setPageRefresh(!pageRefresh);
                openSnackbar({ ...notificationUpdatedData, type: Notification.Types.success, duration: 5000 });
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };
    const fetchEstimateSensorSavings = async (ids) => {
        const res = [];
        preparedScheduleData.forEach((currentCondition) => {
            currentCondition.data.forEach((currentRow) => {
                if (currentRow.action_type !== 2) {
                    if (currentRow.action_day.length) {
                        const { action_day, ...rest } = currentRow;
                        const formattedActionDay = action_day.map((el) => {
                            return daysOfWeekFull[el];
                        });
                        res.push({ ...rest, action_days: formattedActionDay });
                    }
                }
            });
        });

        if (!_.isEmpty(res)) {
            await getEstimateSensorSavingsRequst(res, ids, ruleId).then((res) => {
                setEstimatedEnergySavings(res.data);
            });
        }
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

    const averageEnergyDemandExportHeader = [
        {
            name: 'Day of week',
            accessor: 'day_of_week',
        },
        {
            name: 'Hour',
            accessor: 'hour',
        },
        {
            name: 'Energy',
            accessor: 'consumption',
        },
    ];

    const headerPropsLinkedTab = [
        {
            name: 'Equipment Type',
            accessor: 'equipment_type_name',
            callbackValue: renderEquipType,
            onSort: (method, name) => setSortByLinkedTab({ method, name }),
        },
        {
            name: 'Location',
            accessor: 'equipment_link_location',
            callbackValue: renderLocation,
            onSort: (method, name) => setSortByLinkedTab({ method, name }),
        },
        {
            name: 'Space Type',
            accessor: 'space_type',
            onSort: (method, name) => setSortByLinkedTab({ method, name }),
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
    const headerPropsUnlinkedTab = [
        {
            name: 'Equipment Type',
            accessor: 'equipment_type_name',
            callbackValue: renderEquipType,
            onSort: (method, name) => setSortByUnlinkedTab({ method, name }),
        },
        {
            name: 'Location',
            accessor: 'equipment_link_location',
            callbackValue: renderLocation,
            onSort: (method, name) => setSortByUnlinkedTab({ method, name }),
        },
        {
            name: 'Space Type',
            accessor: 'space_type',
            onSort: (method, name) => setSortByUnlinkedTab({ method, name }),
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

    const fetchLinkedSocketIds = async () => {
        activeBuildingId &&
            listLinkSocketRulesRequest(ruleId, activeBuildingId).then((res) => {
                const { sensor_id } = res.data.data;
                setListSocketsIds(sensor_id || []);
            });
    };

    const fetchUnLinkedSocketRules = async () => {
        const sorting = sortByUnlinkedTab.method &&
            sortByUnlinkedTab.name && {
                order_by: sortByUnlinkedTab.name,
                sort_by: sortByUnlinkedTab.method,
            };

        isLoadingUnlinkedRef.current = true;

        activeBuildingId &&
            (await getUnlinkedSocketRules(
                pageSizeUnlinked,
                pageNoUnlinked,
                activeBuildingId,
                equipmentTypeFilterStringUnlinked,
                macTypeFilterStringUnlinked,
                locationTypeFilterString,
                sensorTypeFilterStringUnlinked,
                floorTypeFilterStringUnlinked,
                spaceTypeFilterStringUnlinked,
                spaceTypeTypeFilterStringUnlinked,
                assignedRuleFilterStringUnlinked,
                tagsFilterStringUnlinked,
                true,
                {
                    ...sorting,
                },
                false,
                ruleId,
                searchUnlinked
            ).then((res) => {
                isLoadingUnlinkedRef.current = false;

                let response = res.data;
                setAllSensors(response?.data);

                setUnlinkedSocketRuleSuccess(res.status);

                let unLinkedData = [];
                setCountUnlinkedSockets(response?.total_data);
                setIsSetInitiallySocketsCountUnlinked(true);

                setUnlinkedSocketsTabData(response?.data);
                setTotalItemsUnlinked(response?.total_data);
            }));
    };

    const handleDownloadCsvLinkedTab = async () => {
        const sorting = sortByLinkedTab.method &&
            sortByLinkedTab.name && {
                order_by: sortByLinkedTab.name,
                sort_by: sortByLinkedTab.method,
            };

        await getUnlinkedSocketRules(
            pageSizeLinked,
            pageNoLinked,
            activeBuildingId,
            equipmentTypeFilterStringLinked,
            macTypeFilterStringLinked,
            locationTypeFilterString,
            sensorTypeFilterStringLinked,
            floorTypeFilterStringLinked,
            spaceTypeFilterStringLinked,
            spaceTypeTypeFilterStringLinked,
            assignedRuleFilterStringLinked,
            tagsFilterStringLinked,
            false,
            {
                ...sorting,
            },
            true,
            ruleId,
            searchLinked
        )
            .then((res) => {
                let responseData = res?.data;
                download(
                    `Sockets${new Date().toISOString().split('T')[0]}`,
                    getSocketsForPlugRulePageTableCSVExport(responseData.data, headerPropsLinkedTab)
                );
            })
            .catch((error) => {});
    };

    const handleDownloadCsvUnlinkedTab = async () => {
        const sorting = sortByUnlinkedTab.method &&
            sortByUnlinkedTab.name && {
                order_by: sortByUnlinkedTab.name,
                sort_by: sortByUnlinkedTab.method,
            };

        await getUnlinkedSocketRules(
            pageSizeUnlinked,
            pageNoUnlinked,
            activeBuildingId,
            equipmentTypeFilterStringUnlinked,
            macTypeFilterStringUnlinked,
            locationTypeFilterString,
            sensorTypeFilterStringUnlinked,
            floorTypeFilterStringUnlinked,
            spaceTypeFilterStringUnlinked,
            spaceTypeTypeFilterStringUnlinked,
            assignedRuleFilterStringUnlinked,
            tagsFilterStringUnlinked,
            false,
            {
                ...sorting,
            },
            false,
            ruleId,
            searchUnlinked
        )
            .then((res) => {
                let responseData = res?.data;
                download(
                    `Sockets${new Date().toISOString().split('T')[0]}`,
                    getSocketsForPlugRulePageTableCSVExport(responseData.data, headerPropsUnlinkedTab)
                );
            })
            .catch((error) => {});
    };
    useEffect(() => {
        fetchLinkedSocketRules();
    }, [searchLinked]);
    useEffect(() => {
        fetchUnLinkedSocketRules();
    }, [searchUnlinked]);

    const fetchLinkedSocketRules = async () => {
        const sorting = sortByLinkedTab.method &&
            sortByLinkedTab.name && {
                order_by: sortByLinkedTab.name,
                sort_by: sortByLinkedTab.method,
            };
        isLoadingLinkedRef.current = true;
        activeBuildingId &&
            (await getUnlinkedSocketRules(
                pageSizeLinked,
                pageNoLinked,
                activeBuildingId,
                equipmentTypeFilterStringLinked,
                macTypeFilterStringLinked,
                locationTypeFilterString,
                sensorTypeFilterStringLinked,
                floorTypeFilterStringLinked,
                spaceTypeFilterStringLinked,
                spaceTypeTypeFilterStringLinked,
                assignedRuleFilterStringLinked,
                tagsFilterStringLinked,
                true,
                {
                    ...sorting,
                },
                true,
                ruleId,
                searchLinked
            )
                .then((res) => {
                    isLoadingLinkedRef.current = false;
                    let response = res.data;
                    let linkedIds = [];

                    if (res.success) {
                        setTotalSocket(response.total_data);
                    }

                    response.data.forEach((record) => {
                        linkedIds.push(record.id);
                    });
                    if (response.data.length > 0) {
                        setCheckedToUnlinkAll(true);
                    } else {
                        setCheckedToUnlinkAll(false);
                    }
                    if (!_.isEqual(selectedInitialyIds, linkedIds)) {
                        setSelectedInitialyIds(linkedIds || []);
                    }
                    setLinkedSocketsTabData(response.data);
                    // if (!isSetInitiallySocketsCountLinked) {
                    setCountLinkedSockets(response.total_data);
                    setIsSetInitiallySocketsCountLinked(true);
                    // }
                    setTotalItemsLinked(response?.total_data);
                })
                .catch((error) => {}));
    };

    useEffect(() => {
        unLinkedRuleData.length > 0 &&
            setUnLinkedRuleData((olState) => olState.filter((sensor) => !selectedInitialyIds.includes(sensor.id)));
    }, [selectedInitialyIds.length, selectedInitialyIds.length, unLinkedRuleData.length]);

    useEffect(() => {
        if (ruleId === null) {
            return;
        }
        if (activeBuildingId?.length) {
            fetchFiltersForSensorsUnlinked();
            fetchUnLinkedSocketRules();
            fetchLinkedSocketIds();
        }
    }, [
        activeBuildingId,
        equipmentTypeFilterStringUnlinked,
        macTypeFilterStringUnlinked,
        locationTypeFilterString,
        sensorTypeFilterStringUnlinked,
        floorTypeFilterStringUnlinked,
        spaceTypeFilterStringUnlinked,
        assignedRuleFilterStringUnlinked,
        tagsFilterStringUnlinked,
        spaceTypeTypeFilterStringUnlinked,
        sortByUnlinkedTab.method,
        sortByUnlinkedTab.name,
        pageNoUnlinked,
        pageNoUnlinked,
        pageSizeUnlinked,
    ]);
    useEffect(() => {
        if (ruleId === null) {
            return;
        }
        if (activeBuildingId?.length) {
            fetchFiltersForSensorsLinked();
            fetchLinkedSocketRules();
            fetchLinkedSocketIds();
        }
    }, [
        activeBuildingId,
        equipmentTypeFilterStringLinked,
        locationTypeFilterString,
        locationTypeFilterString,
        sensorTypeFilterStringLinked,
        macTypeFilterStringLinked,
        floorTypeFilterStringLinked,
        spaceTypeFilterStringLinked,
        assignedRuleFilterStringLinked,
        tagsFilterStringLinked,
        spaceTypeTypeFilterStringLinked,
        sortByLinkedTab.method,
        sortByLinkedTab.name,
        pageNoLinked,
        pageNoLinked,
        pageSizeLinked,
    ]);

    useEffect(() => {
        let arr1 = [];
        let arr2 = [];

        arr1 = linkedRuleData;
        arr2 = unLinkedRuleData;

        const allRuleData = arr1.concat(arr2);

        setAllLinkedRuleData(allRuleData);
    }, [linkedRuleData, unLinkedRuleData]);

    const selectAllRowsSensorsLinkedData = async (checkedAllToUnlink) => {
        const sorting = sortByLinkedTab.method &&
            sortByLinkedTab.name && {
                order_by: sortByLinkedTab.name,
                sort_by: sortByLinkedTab.method,
            };
        isLoadingLinkedRef.current = true;

        if (checkedAllToUnlink) {
            activeBuildingId &&
                (await getUnlinkedSocketRules(
                    pageSizeLinked,
                    pageNoLinked,
                    activeBuildingId,
                    equipmentTypeFilterStringLinked,
                    macTypeFilterStringLinked,
                    locationTypeFilterString,
                    sensorTypeFilterStringLinked,
                    floorTypeFilterStringLinked,
                    spaceTypeFilterStringLinked,
                    spaceTypeTypeFilterStringLinked,
                    assignedRuleFilterStringLinked,
                    tagsFilterStringLinked,
                    false,
                    {
                        ...sorting,
                    },
                    true,
                    ruleId,
                    searchLinked
                ).then((res) => {
                    isLoadingLinkedRef.current = false;

                    let response = res.data;
                    const preparedIdofSockets = [];
                    _.cloneDeep(_.uniqBy(response.data, 'id')).forEach((socket) => {
                        preparedIdofSockets.push(socket.id);
                    });
                    setRulesToUnLink((prevState) => ({
                        ...prevState,
                        sensor_id: preparedIdofSockets,
                    }));

                    setTotalSocket(response.total_data);
                }));
        } else {
            await getUnlinkedSocketRules(
                pageSizeLinked,
                pageNoLinked,
                activeBuildingId,
                equipmentTypeFilterStringLinked,
                macTypeFilterStringLinked,
                locationTypeFilterString,
                sensorTypeFilterStringLinked,
                floorTypeFilterStringLinked,
                spaceTypeFilterStringLinked,
                spaceTypeTypeFilterStringLinked,
                assignedRuleFilterStringLinked,
                tagsFilterStringLinked,
                false,
                {
                    ...sorting,
                },
                true,
                ruleId,
                searchLinked
            )
                .then((res) => {
                    isLoadingLinkedRef.current = false;

                    let responseData = res?.data;
                    const preparedIdsToUnlink = [];
                    responseData.data.forEach((el) => {
                        preparedIdsToUnlink.push(el.id);
                    });
                    setRulesToUnLink({ rule_id: ruleId, sensor_id: preparedIdsToUnlink });

                    setSelectedIdsToUnlink(preparedIdsToUnlink);
                    setTotalSocket(0);
                })
                .catch((error) => {});
        }
        setIsChangedSocketsLinked(true);
        setCheckedToUnlinkAll(checkedAllToUnlink);
        isLoadingLinkedRef.current = false;
    };
    const selectAllRowsSensors = async (checkedAllToLink) => {
        const sorting = sortByUnlinkedTab.method &&
            sortByUnlinkedTab.name && {
                order_by: sortByUnlinkedTab.name,
                sort_by: sortByUnlinkedTab.method,
            };
        if (checkedAllToLink) {
            activeBuildingId &&
                (await getUnlinkedSocketRules(
                    pageSizeUnlinked,
                    pageNoUnlinked,
                    activeBuildingId,
                    equipmentTypeFilterStringUnlinked,
                    macTypeFilterStringUnlinked,
                    locationTypeFilterString,
                    sensorTypeFilterStringUnlinked,
                    floorTypeFilterStringUnlinked,
                    spaceTypeFilterStringUnlinked,
                    spaceTypeTypeFilterStringUnlinked,
                    assignedRuleFilterStringUnlinked,
                    tagsFilterStringUnlinked,
                    false,
                    {
                        ...sorting,
                    },
                    false,
                    ruleId,
                    searchUnlinked
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
                    setSelectedIdsToLink(preparedIdofSockets);
                    setCheckedAllToLink(true);
                    setTotalSocket(response.total_data);
                }));
        } else {
            const idOfSelectedSockets = [];
            allSensors.filter((socket) => {
                idOfSelectedSockets.push(socket.id);
            });
            setRulesToLink({ rule_id: '', sensor_id: [] });
            setSelectedIdsToLink([]);
            setCheckedAllToLink(false);
            setSelectedInitialyIds([]);
            setTotalSocket(0);
        }
        setIsChangedSocketsUnlinked(true);
        setCheckedToUnlinkAll(checkedAllToUnlink);
    };

    const currentRowSearched = () => {
        if (selectedRuleFilter === 0) {
            return allSearchData;
        }
        if (selectedRuleFilter === 1) {
            //@TODO Here should be all the data, stored somewhere, const selectedItems = [{} .... {}];
            // and show when user selected but switched page
            return selectedInitialyIds.reduce((acc, id) => {
                const foundSelectedSensor = allSearchData.find((sensor) => sensor.id === id);
                if (foundSelectedSensor) {
                    acc.push(foundSelectedSensor);
                }
                return acc;
            }, []);
        }

        return allSearchData.filter(({ id }) => !selectedInitialyIds.find((sensorId) => sensorId === id));
    };

    const renderTagCell = (row) => {
        return (row.tag || []).map((tag, key) => <Badge text={tag} key={key} className="ml-1" />);
    };
    const renderScheduleStatus = (row) => {
        const time_format = is24Format ? `HH:mm:ss D MMM 'YY` : `hh:mm A D MMM 'YY`;
        let icon = '';
        if (row.scheduler_status == 'OK') {
            icon = <CheckedSVG />;
        } else if (row.scheduler_status == 'Partial') {
            icon = <WarningSVG />;
        } else if (row.scheduler_status == 'Failed') {
            icon = <CircleXmarkSVG />;
        }

        return (
            <div id={row.id}>
                <UncontrolledTooltip placement="top" target={`tooltip-${row.id}`}>
                    <div className="tooltip-for-sockets">
                        {row.current_job_log.map((el) => {
                            return (
                                <div className="tooltip-for-sockets-item" id={el.kasa_socket_condition_id}>
                                    <span className="flex" style={{ fontSize: '10px' }}>
                                        Condition ID: {el.kasa_socket_condition_id}
                                    </span>
                                    <span style={{ fontSize: '10px' }}>Err Code: {el.response.err_code}</span>
                                    <span style={{ fontSize: '10px' }}>
                                        Time Stamp: {moment(el.response.time_stamp).format(time_format)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </UncontrolledTooltip>

                <Typography.Subheader size={Typography.Sizes.sm} className="justify-content-center ">
                    <span className="cursor-pointer" id={`tooltip-${row.id}`}>
                        {icon}
                    </span>
                </Typography.Subheader>
            </div>
        );
    };
    const renderTimeStamp = (row) => {
        const sortedData = row.current_job_log.sort((x, y) => {
            return new Date(x.response.time_stamp) < new Date(y.response.time_stamp) ? 1 : -1;
        });
        const res = sortedData[0]?.response
            ? moment(sortedData[0].response?.time_stamp).format(is24Format ? `HH:mm:ss MM/DD 'YY` : `hh:mm A MM/DD 'YY`)
            : '';
        return res;
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
            isChangedSocketsUnlinked && reassignSensorsToRule(),
        ]).then((value) => {
            handleCloseSocketsModal(true);
            fetchUnLinkedSocketRules();
            fetchFiltersForSensorsUnlinked();
            fetchFiltersForSensorsLinked();
            fetchPlugRuleDetail();
            setIsChangedRuleDetails(false);
            setIsChangedSocketsUnlinked(false);
            setIsChangedSocketsLinked(false);
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
                // isChangedSockets && updateSocketUnlink(),
                isChangedSocketsUnlinked && reassignSensorsToRule(),
                isChangedRuleDetails && updatePlugRuleData(),
            ]).then((value) => {
                setRulesToLink({ ruleId: '', sensor_id: [] });
                setRulesToUnLink({ ruleId: '', sensor_id: [] });
                setIsChangedRuleDetails(false);
                setIsChangedSocketsUnlinked(false);
                setIsChangedSocketsLinked(false);
                fetchLinkedSocketIds();
                fetchFiltersForSensorsUnlinked();
                fetchFiltersForSensorsLinked();
                fetchPlugRuleDetail();
            });
        }
        setIsUnsavedChanges(false);
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

    const [filterOptionsUnlinked, setFilterOptionsUnlinked] = useState([]);
    const [filterOptionsLinked, setFilterOptionsLinked] = useState([]);
    const [isFilterFetching, setFetchingFilters] = useState(false);

    const fetchFiltersForSensorsUnlinked = async () => {
        isLoadingUnlinkedRef.current = true;
        setFetchingFilters(true);
        await getFiltersForSensorsRequest({
            activeBuildingId,
            macTypeFilterString: macTypeFilterStringUnlinked,
            equipmentTypeFilterString: equipmentTypeFilterStringUnlinked,
            sensorTypeFilterString: sensorTypeFilterStringUnlinked,
            floorTypeFilterString: floorTypeFilterStringUnlinked,
            spaceTypeFilterString: spaceTypeFilterStringUnlinked,
            spaceTypeTypeFilterString: spaceTypeTypeFilterStringUnlinked,
            isGetOnlyLinked: false,
            plugRuleId: ruleId,
        }).then((filters) => {
            const filterOptions = filters.data?.length ? filters.data[0] : filters.data;
            const filterOptionsFetched = !_.isEmpty(filterOptions)
                ? [
                      {
                          label: 'Equipment Type',
                          value: 'equipmentType',
                          placeholder: 'All Equipment Types',
                          filterType: FILTER_TYPES.MULTISELECT,
                          filterOptions: filterOptions?.equipment_type.map((filterItem) => ({
                              value: filterItem.equipment_type_id,
                              label: filterItem.equipment_type_name,
                          })),
                          onClose: (options) => filterHandler(setEquipmentTypeFilterStringUnlinked, options),
                          onDelete: () => {
                              setEquipmentTypeFilterStringUnlinked('');
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
                          onClose: (options) => filterHandler(setFloorTypeFilterStringUnlinked, options),
                          onDelete: () => setFloorTypeFilterStringUnlinked(''),
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
                          onClose: (options) => filterHandler(setSpaceTypeFilterStringUnlinked, options),
                          onDelete: () => setSpaceTypeFilterStringUnlinked(''),
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
                          onClose: (options) => filterHandler(setSpaceTypeTypeFilterStringUnlinked, options),
                          onDelete: () => setSpaceTypeTypeFilterStringUnlinked(''),
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
                          onClose: (options) => filterHandler(setMacTypeFilterStringUnlinked, options),
                          onDelete: () => {
                              setMacTypeFilterStringUnlinked('');
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
                          onClose: (options) => filterHandler(setSensorTypeFilterStringUnlinked, options),
                          onDelete: () => setSensorTypeFilterStringUnlinked(''),
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
                          onClose: (options) => filterHandler(setAssignedRuleFilterStringUnlinked, options),
                          onDelete: () => setAssignedRuleFilterStringUnlinked(''),
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
                          onClose: (options) => filterHandler(setTagsFilterStringUnlinked, options),
                          onDelete: () => setTagsFilterStringUnlinked(''),
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
                          onClose: (options) => filterHandler(setLastUsedDataFilterStringUnlinked, options),
                          onDelete: () => setLastUsedDataFilterStringUnlinked(''),
                      },
                  ]
                : [];
            setFilterOptionsUnlinked(filterOptionsFetched);
        });
        setFetchingFilters(false);
        isLoadingUnlinkedRef.current = false;
    };

    const fetchFiltersForSensorsLinked = async () => {
        isLoadingLinkedRef.current = true;
        setFetchingFilters(true);
        await getFiltersForSensorsRequest({
            activeBuildingId,
            macTypeFilterString: macTypeFilterStringLinked,
            equipmentTypeFilterString: equipmentTypeFilterStringLinked,
            sensorTypeFilterString: sensorTypeFilterStringLinked,
            floorTypeFilterString: floorTypeFilterStringLinked,
            spaceTypeFilterString: spaceTypeFilterStringLinked,
            spaceTypeTypeFilterString: spaceTypeTypeFilterStringLinked,
            isGetOnlyLinked: true,
            plugRuleId: ruleId,
        }).then((filters) => {
            const filterOptions = filters.data?.length ? filters.data[0] : filters.data;
            const filterOptionsFetched = !_.isEmpty(filterOptions)
                ? [
                      {
                          label: 'Equipment Type',
                          value: 'equipmentType',
                          placeholder: 'All Equipment Types',
                          filterType: FILTER_TYPES.MULTISELECT,
                          filterOptions: filterOptions?.equipment_type.map((filterItem) => ({
                              value: filterItem.equipment_type_id,
                              label: filterItem.equipment_type_name,
                          })),
                          onClose: (options) => filterHandler(setEquipmentTypeFilterStringLinked, options),
                          onDelete: () => {
                              setEquipmentTypeFilterStringLinked('');
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
                          onClose: (options) => filterHandler(setFloorTypeFilterStringLinked, options),
                          onDelete: () => setFloorTypeFilterStringLinked(''),
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
                          onClose: (options) => filterHandler(setSpaceTypeFilterStringLinked, options),
                          onDelete: () => setSpaceTypeFilterStringLinked(''),
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
                          onClose: (options) => filterHandler(setSpaceTypeTypeFilterStringLinked, options),
                          onDelete: () => setSpaceTypeTypeFilterStringLinked(''),
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
                          onClose: (options) => filterHandler(setMacTypeFilterStringLinked, options),
                          onDelete: () => {
                              setMacTypeFilterStringLinked('');
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
                          onClose: (options) => filterHandler(setSensorTypeFilterStringLinked, options),
                          onDelete: () => setSensorTypeFilterStringLinked(''),
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
                          onClose: (options) => filterHandler(setAssignedRuleFilterStringLinked, options),
                          onDelete: () => setAssignedRuleFilterStringLinked(''),
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
                          onClose: (options) => filterHandler(setTagsFilterStringLinked, options),
                          onDelete: () => setTagsFilterStringLinked(''),
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
                          onClose: (options) => filterHandler(setLastUsedDataFilterStringLinked, options),
                          onDelete: () => setLastUsedDataFilterStringLinked(''),
                      },
                  ]
                : [];
            setFilterOptionsLinked(filterOptionsFetched);
        });
        setFetchingFilters(false);
        isLoadingLinkedRef.current = false;
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
                                    isDisabled={isViewer}
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
                                    isDisabled={firstCondition.action_type == '2' || isViewer}
                                    options={firstCondition.action_type == '2' ? [] : timepickerOption}
                                />
                            </div>
                            <div>on</div>
                            <div className={classNames('schedular-weekday-group', { isDisabled: isViewer })}>
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
                                    isDisabled={isViewer}
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
                                    isDisabled={secondCondition.action_type == '2' || isViewer}
                                    options={timepickerOption}
                                />
                            </div>
                        </div>
                        {!isViewer && (
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
                        )}
                    </div>

                    <hr className="plug-rule-schedule-breaker" />
                </>
            );
        } else {
            return null;
        }
    };

    const handleDownloadCsvAverageEnergyDemand = () => {
        download(
            `Average Energy Demand-${new Date().toISOString().split('T')[0]}`,
            getAverageEnergyDemandCSVExport(rawLineChartData, averageEnergyDemandExportHeader)
        );
    };

    const getFirstLastOffPeriodDayAndTime = (week) => {
        let firstOnDay,
            firstOnTime,
            isLastOffAction = false,
            lastOffTime = '',
            lastOffDay = null;
        if (!_.isEmpty(week)) {
            const copyWeekReverse = [...week];
            copyWeekReverse.length = 7;
            const reverseWeek = copyWeekReverse.reverse();
            const copyWeek = [...week];
            copyWeek.length = 7;
            for (let i = 0; i < (reverseWeek || []).length; i++) {
                const currentDay = reverseWeek[i];
                if (currentDay?.turnOn && !isLastOffAction) {
                    if (currentDay?.turnOn < currentDay?.turnOff) {
                        isLastOffAction = true;
                        lastOffDay = reverseWeek.length - i - 1;
                        lastOffTime = currentDay.turnOff;
                    }
                    break;
                }
                if (currentDay?.turnOn && isLastOffAction) {
                    if (currentDay?.turnOn < currentDay?.turnOff) {
                        isLastOffAction = true;
                        lastOffDay = reverseWeek.length - i - 1;
                        lastOffTime = currentDay.turnOff;
                    }
                    break;
                }
                if (!currentDay || !currentDay?.turnOff) continue;
                if (currentDay?.turnOff) {
                    isLastOffAction = true;
                    lastOffDay = reverseWeek.length - i - 1;
                    lastOffTime = currentDay.turnOff;
                    const arrayToSearch = reverseWeek.slice(i + 1);
                    if (
                        arrayToSearch.findIndex((nextDay) => nextDay?.turnOn) <
                        arrayToSearch.findIndex((nextDay) => nextDay?.turnOff)
                    ) {
                        break;
                    }
                }
            }

            for (let i = 0; i < (copyWeek || []).length; i++) {
                const currentDay = copyWeek[i];

                if (!currentDay || !currentDay?.turnOn) continue;
                if (currentDay?.turnOn && !firstOnDay) {
                    firstOnDay = i;
                    firstOnTime = currentDay.turnOn;
                    break;
                }
            }

            if (typeof firstOnDay !== 'number') {
                firstOnDay = lastOffDay;
                firstOnTime = lastOffTime;
            }
        }
        return { isLastOffAction, lastOffDay, lastOffTime, firstOnDay, firstOnTime };
    };
    const getSoonestOnDateWithTime = (currentOff, week) => {
        let onDay = 0;
        let onTime = 0;
        let isSearchedDay = false;
        week.forEach((dayOfWeek, index) => {
            if (currentOff < index && dayOfWeek.turnOn && !isSearchedDay) {
                onDay = index;
                onTime = dayOfWeek.turnOn;
                isSearchedDay = true;
            }
        });
        return { isSearchedDay, onDay, onTime };
    };

    const getOffPeriodsForOffTimeLater = (week) => {
        const res = [];
        week?.length &&
            week.forEach((dayOfWeek, index) => {
                if (dayOfWeek.turnOn < dayOfWeek.turnOff) {
                    const { isSearchedDay, onDay, onTime } = getSoonestOnDateWithTime(index, week);
                    if (isSearchedDay) {
                        res.push({
                            day: index,
                            currentOffDay: index,
                            nextOnDay: onDay,
                            currentOffTime: dayOfWeek.turnOff,
                            nextOnTime: onTime,
                        });
                    }
                }
            });
        return res;
    };
    const getDateRange = (rawLineChartData) => {
        if (!_.isEmpty(rawLineChartData)) {
            const minDate = moment(rawLineChartData[0].time_stamp).utc(true).startOf('week');
            const maxDate = moment.utc(rawLineChartData[rawLineChartData.length - 1].time_stamp).endOf('isoweek');
            maxDate.set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
            setDateRangeAverageData({
                minDate: minDate.unix() * 1000,
                maxDate: maxDate.unix() * 1000,
            });
        } else {
            const minDate = moment().utc().startOf('isoweek');
            const maxDate = moment().utc().endOf('isoweek');
            maxDate.set({ hour: 23, minute: 59, second: 0, millisecond: 0 });
            minDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            minDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            setDateRangeAverageData({
                minDate: minDate.unix() * 1000,
                maxDate: maxDate.unix() * 1000,
            });
        }
    };
    const calculateOffHoursPlots = () => {
        let weekWithSchedule = [];
        const copyOfPreparedScheduleData = [...preparedScheduleData];
        copyOfPreparedScheduleData
            .filter(
                (el) =>
                    !el.data.find((groupId) => {
                        return groupId.is_deleted;
                    })
            )
            .map((groupId) => {
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
            if (weekWithSchedule[i] !== undefined) {
                if (i === weekWithSchedule.length - 1) {
                    nextOn = weekWithSchedule[0]?.turnOn;
                    nextOnDay = weekWithSchedule.length - 1;
                } else {
                    for (let j = i; j < weekWithSchedule.length; j++) {
                        if (weekWithSchedule[j]?.turnOn) {
                            if (weekWithSchedule[j]?.turnOn >= weekWithSchedule[j]?.turnOff) {
                                nextOnDay = j;
                                nextOn = weekWithSchedule[j]?.turnOn;
                                break;
                            } else {
                                if (weekWithSchedule[j + 1]?.turnOn) {
                                    nextOnDay = j + 1;
                                    if (weekWithSchedule[j + 1]) {
                                        nextOn = weekWithSchedule[j + 1]?.turnOn;
                                    }
                                }
                                break;
                            }
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
                    nextOnDay = i;
                } else {
                    nextOn = weekWithSchedule[i + 1]?.turnOn;
                    nextOnDay = i + 1;
                }
            }
            if (currentOff && nextOn) {
                if (currentOffDay < nextOnDay) {
                    result.push({
                        day: i,
                        currentOffDay,
                        nextOnDay,
                        currentOffTime: currentOff,
                        nextOnTime: nextOn,
                    });
                } else if (currentOffDay === nextOnDay && nextOn > currentOff) {
                    result.push({
                        day: i,
                        currentOffDay,
                        nextOnDay,
                        currentOffTime: currentOff,
                        nextOnTime: nextOn,
                    });
                }
            }
        }
        const { isLastOffAction, lastOffDay, lastOffTime, firstOnDay, firstOnTime } =
            getFirstLastOffPeriodDayAndTime(weekWithSchedule);
        if (isLastOffAction) {
            result.push({
                day: lastOffDay,
                currentOffDay: lastOffDay,
                nextOnDay: 6,
                currentOffTime: lastOffTime,
                nextOnTime: '23:59',
            });
            result.push({
                day: 0,
                currentOffDay: 0,
                nextOnDay: firstOnDay,
                currentOffTime: '00:00',
                nextOnTime: firstOnTime,
            });
        }
        const theSameDayOffLater = getOffPeriodsForOffTimeLater(weekWithSchedule);
        result.push(...theSameDayOffLater);
        getOffperiodsWithRealDate(result);
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
        let offDayArray = [];
        result.forEach((el) => {
            if (el.day == day) {
                offDayArray.push(el);
            }
        });
        return offDayArray;
    };

    const getOffperiodsWithRealDate = (result) => {
        const dateRange = dateRangeAverageData;
        const maxdateString = new Date(dateRange.maxDate);
        const mindateString = new Date(dateRange.minDate);
        const rangeDates = getDatesInRange(mindateString, maxdateString);
        const offPeriods = [];
        rangeDates.forEach((day) => {
            const currentWeekDay = moment(day).weekday();
            const weekDayOffScheduleArray = checkIfDayInOffRange(currentWeekDay, result);
            weekDayOffScheduleArray.forEach((weekDayOffSchedule) => {
                if (!_.isEmpty(weekDayOffSchedule)) {
                    let timeDiff;

                    if (weekDayOffSchedule?.nextOnDay >= weekDayOffSchedule?.currentOffDay) {
                        timeDiff = weekDayOffSchedule?.nextOnDay - weekDayOffSchedule?.currentOffDay;
                    } else if (weekDayOffSchedule?.nextOnDay < weekDayOffSchedule?.currentOffDay) {
                        timeDiff = 6 - weekDayOffSchedule?.currentOffDay + weekDayOffSchedule?.nextOnDay + 1;
                    }
                    const nextTurnOnDay = moment.utc(day, 'YYYY-MM-DD').add(timeDiff, 'days').format('YYYY-MM-DD');
                    const from = moment.utc(day + ' ' + weekDayOffSchedule?.currentOffTime).unix();
                    const to = moment.utc(nextTurnOnDay + ' ' + weekDayOffSchedule?.nextOnTime).unix();
                    offPeriods.push({
                        type: LineChart.PLOT_BANDS_TYPE.off_hours,
                        from: from * 1000,
                        to: to * 1000,
                    });
                }
            });
        });
        setOffHoursPlots(offPeriods);
    };

    const handlerClick = useCallback((id) => {
        setSocketsTab(id);
    }, []);

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
    const confirmButtonDisabledState = () => {
        let res = false;
        if (socketsTab == 0) {
            if (isChangedSocketsLinked) {
                res = false;
            } else {
                res = true;
            }
        } else if (socketsTab == 1) {
            if (isChangedSocketsUnlinked) {
                res = false;
            } else {
                res = true;
            }
        }
        setIsConfirmButtonDisabled(res);
    };

    useEffect(() => {
        confirmButtonDisabledState();
    }, [socketsTab, isChangedSocketsLinked, isChangedSocketsUnlinked]);

    const currentJobLog = currentData?.current_job_log?.sort((x, y) => {
        return new Date(x.response?.time_stamp) < new Date(y.response?.time_stamp) ? 1 : -1;
    });

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
                            <span className="plug-rule-device-timezone"> TimeZone- {bldgTimeZone}</span>
                        </div>
                    </div>
                    <div className="plug-rule-right-flex">
                        <div>
                            {!isViewer && (
                                <div className="plug-rule-switch-header">
                                    <Switch
                                        onChange={() => {
                                            handleSwitchChange();
                                        }}
                                        checked={currentData.is_active}
                                        onColor={colorPalette.datavizBlue600}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        className="react-switch"
                                        height={20}
                                        width={36}
                                    />
                                    <span className="ml-2 plug-rule-switch-font">Active</span>
                                </div>
                            )}
                            {currentData?.status && (
                                <>
                                    <UncontrolledTooltip placement="top" target={'tooltip-status'}>
                                        {currentJobLog[0]?.msg}
                                    </UncontrolledTooltip>
                                    <Typography.Subheader
                                        size={Typography.Sizes.sm}
                                        className="justify-content-center ">
                                        <span className="cursor-pointer" id={'tooltip-status'}>
                                            Status: {currentData?.status}
                                        </span>
                                    </Typography.Subheader>
                                </>
                            )}

                            {currentJobLog[0]?.time_stamp && (
                                <Typography.Subheader size={Typography.Sizes.sm}>
                                    Last Update:
                                    {moment(currentJobLog[0]?.time_stamp).format(
                                        is24Format ? `HH:mm:ss MM/DD 'YY` : `hh:mm A MM/DD 'YY`
                                    )}
                                </Typography.Subheader>
                            )}
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
                            {!isViewer && (
                                <Button
                                    disabled={isDisabledSaveButton}
                                    size={Button.Sizes.md}
                                    label="Save"
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        handleSaveClicked();
                                    }}
                                />
                            )}
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
                        Sockets ({countLinkedSockets})
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
                                            disabled={isViewer}
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
                                                    options={preparedBuildingListData()}
                                                />
                                            )}
                                        </div>

                                        <Textarea
                                            type="textarea"
                                            label="Description"
                                            name="text"
                                            id="description"
                                            rows="4"
                                            disabled={isViewer}
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
                                    {!isViewer && (
                                        <button
                                            type="button"
                                            className="btn btn-default add-condition"
                                            onClick={() => {
                                                createScheduleCondition();
                                            }}>
                                            Add Condition
                                        </button>
                                    )}
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
                                    dateRange={dateRangeAverageData}
                                    height={200}
                                    plotBands={offHoursPlots}
                                    customDownloadCsvHandler={() => {
                                        handleDownloadCsvAverageEnergyDemand();
                                    }}
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
                                        title: 'Estimated Annual Energy Savings',
                                        unit: UNITS.KWH,
                                        value: Math.round(estimatedEnergySavings) / 1000,
                                    }}
                                    chartProps={{
                                        tooltip: {
                                            xDateFormat: is24Format ? '%A, %H:%M' : '%A, %I:%M %p',
                                        },
                                        xAxis: {
                                            labels: {
                                                formatter: function (val) {
                                                    return moment.utc(val.value).format('ddd');
                                                },
                                                step: 2,
                                            },
                                        },
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {!isViewer && (
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
                    )}
                </>
            )}
            {selectedTab === 1 && (
                <div className="plug-rule-body">
                    <div className="plug-rule-body-header">
                        <ButtonGroup
                            noPadding={true}
                            currentButtonId={socketsTab}
                            buttons={[
                                { label: `Linked (${countLinkedSockets})` },
                                { label: `Unlinked (${countUnlinkedSockets && countUnlinkedSockets})` },
                            ]}
                            handleButtonClick={handlerClick}
                        />
                        {!isViewer && (
                            <Button
                                onClick={() => handleClickConfirmSelection(socketsTab)}
                                className="sub-button"
                                label={'Confirm selection'}
                                disabled={isConfirmButtonDisabled}
                                size={Button.Sizes.lg}
                                type={Button.Type.primary}>
                                Confirm selection
                            </Button>
                        )}
                    </div>
                    {currentData.building_id ? (
                        <div>
                            <div className={classNames({ isHide: socketsTab == 1 })}>
                                <DataTableWidget
                                    isLoading={isLoadingLinkedRef.current}
                                    isLoadingComponent={<SkeletonLoading />}
                                    isFilterLoading={isFilterFetching}
                                    id="sockets-plug-rules"
                                    onSearch={(query) => {
                                        setPageNoLinked(1);
                                        setSearchLinked(query);
                                    }}
                                    hideStatusFilter={true}
                                    filterOptions={filterOptionsLinked}
                                    buttonGroupFilterOptions={[
                                        { label: 'All' },
                                        { label: 'Selected' },
                                        { label: 'Unselected' },
                                    ]}
                                    onDownload={() => handleDownloadCsvLinkedTab()}
                                    onStatus={setSelectedRuleFilter}
                                    rows={linkedSocketsTabData}
                                    searchResultRows={linkedSocketsTabData}
                                    headers={[
                                        {
                                            name: 'Equipment Type',
                                            accessor: 'equipment_type_name',
                                            callbackValue: renderEquipType,
                                            onSort: (method, name) => setSortByLinkedTab({ method, name }),
                                        },
                                        {
                                            name: 'Location',
                                            accessor: 'equipment_link_location',
                                            callbackValue: renderLocation,
                                            onSort: (method, name) =>
                                                setSortByLinkedTab({ method, name: 'installed_floor' }),
                                        },
                                        {
                                            name: 'Space Type',
                                            accessor: 'space_type',
                                            onSort: (method, name) => setSortByLinkedTab({ method, name }),
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
                                            name: 'Schedule Status',
                                            accessor: 'status',
                                            callbackValue: renderScheduleStatus,
                                        },
                                        {
                                            name: 'Timestamp',
                                            accessor: 'Timestamp',
                                            callbackValue: renderTimeStamp,
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
                                            disabled={isViewer}
                                            type="checkbox"
                                            id="vehicle1"
                                            name="vehicle1"
                                            checked={checkedAllToUnlink}
                                            onChange={() => selectAllRowsSensorsLinkedData(!checkedAllToUnlink)}
                                        />
                                    )}
                                    customCheckboxForCell={(record) => (
                                        <Checkbox
                                            label=""
                                            type="checkbox"
                                            id="socket_rule"
                                            name="socket_rule"
                                            checked={!selectedIdsToUnlink.includes(record?.id) || checkedAllToUnlink}
                                            value={
                                                !selectedIdsToUnlink.includes(record?.id) || checkedAllToUnlink
                                                    ? true
                                                    : false
                                            }
                                            onChange={(e) => {
                                                setSensorIdNow(record?.id);
                                                handleRuleStateChangeUnlink(e.target.value, record);
                                            }}
                                            disabled={isViewer}
                                        />
                                    )}
                                    onPageSize={setPageSizeLinked}
                                    onChangePage={setPageNoLinked}
                                    pageSize={pageSizeLinked}
                                    currentPage={pageNoLinked}
                                    totalCount={(() => {
                                        if (searchLinked) {
                                            return totalItemsSearched;
                                        }
                                        if (selectedRuleFilter === 0) {
                                            return totalItemsLinked;
                                        }

                                        return 0;
                                    })()}
                                />
                            </div>
                            <div className={classNames({ isHide: socketsTab == 0 })}>
                                <DataTableWidget
                                    isLoading={isLoadingUnlinkedRef.current}
                                    isLoadingComponent={<SkeletonLoading />}
                                    isFilterLoading={isFilterFetching}
                                    id="sockets-plug-rules"
                                    onSearch={(query) => {
                                        setPageNoUnlinked(1);
                                        setSearchUnlinked(query);
                                    }}
                                    hideStatusFilter={true}
                                    filterOptions={filterOptionsUnlinked}
                                    buttonGroupFilterOptions={[
                                        { label: 'All' },
                                        { label: 'Selected' },
                                        { label: 'Unselected' },
                                    ]}
                                    onDownload={() => handleDownloadCsvUnlinkedTab()}
                                    onStatus={setSelectedRuleFilter}
                                    rows={unlinkedSocketsTabData}
                                    searchResultRows={unlinkedSocketsTabData}
                                    headers={[
                                        {
                                            name: 'Equipment Type',
                                            accessor: 'equipment_type_name',
                                            callbackValue: renderEquipType,
                                            onSort: (method, name) => setSortByUnlinkedTab({ method, name }),
                                        },
                                        {
                                            name: 'Location',
                                            accessor: 'equipment_link_location',
                                            callbackValue: renderLocation,
                                            onSort: (method, name) =>
                                                setSortByUnlinkedTab({ method, name: 'installed_floor' }),
                                        },
                                        {
                                            name: 'Space Type',
                                            accessor: 'space_type',
                                            onSort: (method, name) => setSortByUnlinkedTab({ method, name }),
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
                                            name: 'Schedule Status',
                                            accessor: 'status',
                                            callbackValue: renderScheduleStatus,
                                        },
                                        {
                                            name: 'Timestamp',
                                            accessor: 'Timestamp',
                                            callbackValue: renderTimeStamp,
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
                                            disabled={isViewer}
                                            name="vehicle1"
                                            checked={checkedAllToLink}
                                            onChange={() => selectAllRowsSensors(!checkedAllToLink)}
                                        />
                                    )}
                                    customCheckboxForCell={(record) => (
                                        <Checkbox
                                            label=""
                                            type="checkbox"
                                            id="socket_rule"
                                            name="socket_rule"
                                            checked={selectedIdsToLink.includes(record?.id) || checkedAllToLink}
                                            value={
                                                selectedIdsToLink.includes(record?.id) || checkedAllToLink
                                                    ? true
                                                    : false
                                            }
                                            onChange={(e) => {
                                                setSensorIdNow(record?.id);
                                                handleRuleLinkStateChange(e.target.value, record);
                                            }}
                                            disabled={isViewer}
                                        />
                                    )}
                                    onPageSize={setPageSizeUnlinked}
                                    onChangePage={setPageNoUnlinked}
                                    pageSize={pageSizeUnlinked}
                                    currentPage={pageNoUnlinked}
                                    totalCount={(() => {
                                        if (searchUnlinked) {
                                            return totalItemsSearched;
                                        }
                                        if (selectedRuleFilter === 0) {
                                            return totalItemsUnlinked;
                                        }

                                        return 0;
                                    })()}
                                />
                            </div>
                        </div>
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
                        label={isDeleting ? 'Deleting' : 'Delete'}
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
                        label={isDeleting ? 'Deleting' : 'Delete'}
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
                    <div className="sockets-modal-body">
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
                                        socketsToReassign.includes(record?.id) || checkedAllReassignSockets
                                            ? true
                                            : false
                                    }
                                    onChange={(e) => {
                                        handleReassignSocketsCheckboxClick(e.target.value, record);
                                    }}
                                />
                            )}
                        />
                    </div>
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
