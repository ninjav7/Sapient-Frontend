import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col } from 'reactstrap';
import {
    fetchExploreEquipmentList,
    fetchExploreEquipmentChart,
    fetchExploreFilter,
    fetchWeatherData,
} from '../explore/services';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import EquipChartModal from '../chartModal/EquipChartModal';
import './style.css';
import 'moment-timezone';
import moment from 'moment';
import Header from '../../components/Header';
import { getExploreByEquipmentTableCSVExport } from '../../utils/tablesExport';
import { buildingData, selectedEquipment, totalSelectionEquipmentId } from '../../store/globalState';
import { useAtom } from 'jotai';
import { apiRequestBody } from '../../helpers/helpers';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../sharedComponents/form/checkbox';
import Brick from '../../sharedComponents/brick';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import Typography from '../../sharedComponents/typography';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import ExploreChart from '../../sharedComponents/exploreChart/ExploreChart';
import Button from '../../sharedComponents/button/Button';
import { fetchDateRange } from '../../helpers/formattedChartData';
import { getAverageValue } from '../../helpers/AveragePercent';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import Select from '../../sharedComponents/form/select';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { LOW_MED_HIGH } from '../../sharedComponents/common/charts/modules/contants';
import colors from '../../assets/scss/_colors.scss';
import { LOW_MED_HIGH_TYPES } from '../../sharedComponents/common/charts/modules/contants';

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
            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);

const ExploreByEquipment = () => {
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);
    const [chartLoading, setChartLoading] = useState(false);

    const [equpimentIdSelection] = useAtom(selectedEquipment);
    const [totalEquipmentId] = useAtom(totalSelectionEquipmentId);

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const { download } = useCSVDownload();

    // New Refactor Declarations
    const isLoadingRef = useRef(false);
    const [conAPIFlag, setConAPIFlag] = useState('');
    const [perAPIFlag, setPerAPIFlag] = useState('');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [allSearchData, setAllSearchData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    const [allEquipmentList, setAllEquipmentList] = useState([]);
    const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [equipIdNow, setEquipIdNow] = useState('');
    const [device_type, setDevice_type] = useState('');

    const bldgName = BuildingStore.useState((s) => s.BldgName);

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const [isExploreChartDataLoading, setIsExploreChartDataLoading] = useState(false);
    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);
    const [seriesData, setSeriesData] = useState([]);
    let entryPoint = '';
    let top = '';
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [filterData, setFilterData] = useState({});
    const [topConsumption, setTopConsumption] = useState(0);
    const [bottomConsumption, setBottomConsumption] = useState(0);
    const [topPerChange, setTopPerChange] = useState(0);
    const [neutralPerChange, setNeutralPerChange] = useState(0);
    const [bottomPerChange, setBottomPerChange] = useState(0);
    const [showEquipmentChart, setShowEquipmentChart] = useState(false);
    const handleChartOpen = () => setShowEquipmentChart(true);
    const handleChartClose = () => setShowEquipmentChart(false);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
    const [removeEquipmentId, setRemovedEquipmentId] = useState('');
    const [equipmentListArray, setEquipmentListArray] = useState([]);
    const [allEquipmentData, setAllEquipmenData] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedEquipType, setSelectedEquipType] = useState([]);
    const [selectedEndUse, setSelectedEndUse] = useState([]);
    const [selectedSpaceType, setSelectedSpaceType] = useState([]);
    const [minConValue, set_minConValue] = useState(0);
    const [maxConValue, set_maxConValue] = useState(0);
    const [minPerValue, set_minPerValue] = useState(0);
    const [maxPerValue, set_maxPerValue] = useState(0);
    const [topVal, setTopVal] = useState(0);
    const [bottomVal, setBottomVal] = useState(0);
    const [currentButtonId, setCurrentButtonId] = useState(0);
    const [isopened, setIsOpened] = useState(false);
    const [filtersValues, setFiltersValues] = useState({});
    const [weatherSeries, setWeatherSeries] = useState([]);
    const [exploreTableData, setExploreTableData] = useState([]);
    const [tempState, setTempState] = useState(false);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState(1);
    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [selectedModalTab, setSelectedModalTab] = useState(0);
    const [selectedAllEquipmentId, setSelectedAllEquipmentId] = useState([]);
    const [weatherStat, setWeatherStat] = useState({});
    const metric = [
        { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy Consumption' },
        { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power Consumption' },
        { value: 'rmsCurrentMilliAmps', label: 'Current (A)', unit: 'A', Consumption: 'Current Consumption' },
    ];
    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0].Consumption);
    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [weatherData, setWeatherData] = useState(null);
    const [isWeatherChartVisible, setWeatherChartVisibility] = useState(false);

    useEffect(() => {
        entryPoint = 'entered';
    }, []);
    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
    };
    const handleConsumptionChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedConsumptionLabel(obj.Consumption);
    };

    useEffect(() => {
        if (bldgId) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(bldgObj?.building_id, bldgObj?.building_name, bldgObj?.timezone);
        }
        if (entryPoint !== 'entered') {
            setFiltersValues({
                selectedFilters: [],
            });
            setSeriesData([]);
            setWeatherSeries([]);
            setConAPIFlag('');
            setPerAPIFlag('');
            setSelectedIds([]);
            setSelectedEndUse([]);
            setSelectedEquipType([]);
            setSelectedSpaceType([]);
            setConAPIFlag('');
            setPerAPIFlag('');
        }
    }, [bldgId]);

    const pageListSizes = [
        {
            label: '20 Rows',
            value: '20',
        },
        {
            label: '50 Rows',
            value: '50',
        },
        {
            label: '100 Rows',
            value: '100',
        },
    ];

    useEffect(() => {
        if (selectedIds?.length >= 1) {
            let arr = [];
            for (let i = 0; i < selectedIds?.length; i++) {
                arr.push(selectedIds[i]);
            }
            setSeriesData([]);
            setWeatherSeries([]);
            setSelectedAllEquipmentId(arr);
        } else {
            setSelectedEquipmentId('');
        }
    }, [startDate, endDate, selectedConsumption]);

    useEffect(() => {
        if (equipIdNow) {
            fetchExploreChartData(equipIdNow);
        }
    }, [equipIdNow]);

    const exploreDataFetch = async (bodyVal) => {
        const ordered_by = sortBy.name === undefined || sortBy.method === null ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;
        setIsExploreDataLoading(true);

        await fetchExploreEquipmentList(
            startDate,
            endDate,
            timeZone,
            bldgId,
            search,
            ordered_by,
            sort_by,
            pageSize,
            pageNo,
            minConValue,
            maxConValue,
            minPerValue,
            maxPerValue,
            selectedLocation,
            selectedEndUse,
            selectedEquipType,
            selectedSpaceType,
            conAPIFlag,
            perAPIFlag
        )
            .then((res) => {
                let responseData = res.data;
                if (responseData.data.length !== 0) {
                    if (entryPoint === 'entered') {
                        totalEquipmentId.length = 0;
                        setSeriesData([]);
                        setWeatherSeries([]);
                    }
                    setTopEnergyConsumption(responseData.data[0].consumption.now);
                    top = responseData.data[0].consumption.now;
                }
                setExploreTableData(responseData.data);
                setAllEquipmentList(responseData.data);
                setTotalItems(responseData.total_data);
                setTotalItemsSearched(responseData.data.length);
                setAllSearchData(responseData.data);
                setIsExploreDataLoading(false);
            })
            .catch((error) => {
                setIsExploreDataLoading(false);
            });
    };

    let arr = apiRequestBody(startDate, endDate, timeZone);

    const currentRow = () => {
        if (selectedEquipmentFilter === 0) {
            return allEquipmentList;
        }
        if (selectedEquipmentFilter === 1) {
            return selectedIds.reduce((acc, id) => {
                const foundSelectedEquipment = allEquipmentList.find((eqId) => eqId.equipment_id === id);
                if (foundSelectedEquipment) {
                    acc.push(foundSelectedEquipment);
                }
                return acc;
            }, []);
        }
        return allEquipmentList.filter(({ equipment_id }) => !selectedIds.find((eqID) => eqID === equipment_id));
    };

    const currentRowSearched = () => {
        if (selectedEquipmentFilter === 0) {
            return allSearchData;
        }
        if (selectedEquipmentFilter === 1) {
            return selectedIds.reduce((acc, id) => {
                const foundSelectedEquipment = allEquipmentList.find((eqId) => eqId.equipment_id === id);
                if (foundSelectedEquipment) {
                    acc.push(foundSelectedEquipment);
                }
                return acc;
            }, []);
        }
        return allEquipmentList.filter(({ id }) => !selectedIds.find((eqId) => eqId === id));
    };

    const renderConsumption = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {Math.round(row.consumption.now / 1000)} kWh
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={getAverageValue(row.consumption.now / 1000, bottomConsumption, top / 1000)} />
            </>
        );
    };

    const renderPerChange = (row) => {
        return (
            <TrendsBadge
                value={Math.abs(Math.round(row.consumption.change))}
                type={
                    row.consumption.change === 0
                        ? TrendsBadge.Type.NEUTRAL_TREND
                        : row.consumption.now < row.consumption.old
                        ? TrendsBadge.Type.DOWNWARD_TREND
                        : TrendsBadge.Type.UPWARD_TREND
                }
            />
        );
    };

    const renderEquipmentName = (row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <a
                    className="typography-wrapper link mouse-pointer"
                    onClick={() => {
                        setEquipmentFilter({
                            equipment_id: row?.equipment_id,
                            equipment_name: row?.equipment_name,
                        });
                        localStorage.setItem('exploreEquipName', row?.equipment_name);
                        handleChartOpen();
                    }}>
                    {row.equipment_name !== '' ? row.equipment_name : '-'}
                </a>
                <Brick sizeInPixels={3} />
            </div>
        );
    };
    const handleEquipStateChange = (value, equip) => {
        if (value === 'true') {
            let arr1 = seriesData.filter(function (item) {
                return item.id !== equip?.equipment_id;
            });
            setSeriesData(arr1);
            let arr2 = weatherSeries.filter(function (item) {
                return item.id !== equip?.equipment_id;
            });
            setWeatherSeries(arr2);
            setEquipIdNow('');
            setDevice_type('');
        }

        if (value === 'false') {
            setEquipIdNow(equip?.equipment_id);
            setDevice_type(equip?.device_type);
        }

        const isAdding = value === 'false';

        setSelectedIds((prevState) => {
            return isAdding
                ? [...prevState, equip.equipment_id]
                : prevState.filter((equipId) => equipId !== equip.equipment_id);
        });
    };
    const fetchAPI = useCallback(() => {
        exploreDataFetch();
    }, [
        startDate,
        endDate,
        search,
        sortBy,
        pageSize,
        pageNo,
        selectedEquipType,
        selectedEndUse,
        selectedSpaceType,
        conAPIFlag,
        perAPIFlag,
    ]);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        fetchAPI();
    }, [
        startDate,
        endDate,
        search,
        sortBy,
        pageSize,
        pageNo,
        selectedEquipType,
        selectedEndUse,
        selectedSpaceType,
        conAPIFlag,
        perAPIFlag,
    ]);

    useEffect(() => {}, [selectedEquipType, selectedEndUse, selectedSpaceType]);

    useEffect(() => {
        (async () => {
            setIsExploreDataLoading(true);
            const filters = await fetchExploreFilter(bldgId, startDate, endDate, timeZone, [], [], [], [], 0, 0, '');

            if (filters?.data?.data !== null) {
                setFilterData(filters.data.data);
                setTopVal(
                    Math.round(
                        filters.data.data.max_change === filters.data.data.min_change
                            ? filters.data.data.max_change
                            : filters.data.data.max_change
                    )
                );
                setBottomVal(Math.round(filters.data.data.min_change));
                setTopConsumption(Math.abs(Math.round(filters?.data?.data?.max_consumption / 1000)));
                setBottomConsumption(Math.abs(Math.round(filters?.data?.data?.min_consumption / 1000)));
                setTopPerChange(
                    Math.round(
                        filters.data.data.max_change === filters.data.data.min_change
                            ? filters.data.data.max_change
                            : filters.data.data.max_change
                    )
                );
                setNeutralPerChange(Math.round(filters.data.data.neutral_change));
                setBottomPerChange(Math.round(filters.data.data.min_change));
                set_minConValue(Math.abs(Math.round(filters.data.data.min_consumption / 1000)));
                set_maxConValue(Math.abs(Math.round(filters.data.data.max_consumption / 1000)));
                set_minPerValue(Math.round(filters.data.data.min_change));
                set_maxPerValue(
                    Math.round(
                        filters.data.data.max_change === filters.data.data.min_change
                            ? filters.data.data.max_change
                            : filters.data.data.max_change
                    )
                );
            } else {
                setFilterData({});
                setFilterOptions([]);
                set_minConValue(0);
                set_maxConValue(0);
                set_minPerValue(0);
                set_maxPerValue(0);
            }

            setIsExploreDataLoading(false);
        })();
    }, [startDate, endDate, bldgId]);

    useEffect(() => {
        if (conAPIFlag !== '' || selectedEndUse.length !== 0) {
            (async () => {
                const filters = await fetchExploreFilter(
                    bldgId,
                    startDate,
                    endDate,
                    timeZone,
                    selectedLocation,
                    selectedEquipType,
                    selectedEndUse,
                    selectedSpaceType,
                    minConValue,
                    maxConValue,
                    conAPIFlag
                );

                const filterOptionsFetched = [
                    {
                        label: 'Energy Consumption',
                        value: 'consumption',
                        placeholder: 'All Consumptions',
                        filterType: FILTER_TYPES.RANGE_SELECTOR,
                        filterOptions: [minConValue, maxConValue],
                        componentProps: {
                            prefix: ' kWh',
                            title: 'Consumption',
                            min: bottomConsumption,
                            max: topConsumption + 1,
                            range: [minConValue, maxConValue],
                            withTrendsFilter: false,
                        },
                        onClose: async function onClose(options) {
                            set_minConValue(options[0]);
                            set_maxConValue(options[1]);
                            setPageNo(1);
                            setConAPIFlag(options[0] + options[1]);
                        },
                        onDelete: () => {
                            set_minConValue(bottomConsumption);
                            set_maxConValue(topConsumption);
                            setConAPIFlag('');
                        },
                    },
                    {
                        label: '% Change',
                        value: 'change',
                        placeholder: 'All % Change',
                        filterType: FILTER_TYPES.RANGE_SELECTOR,
                        filterOptions: [minPerValue, maxPerValue],
                        componentProps: {
                            prefix: ' %',
                            title: '% Change',
                            min: bottomVal,
                            max: topVal + 1,
                            range: [minPerValue, maxPerValue],
                            withTrendsFilter: true,
                            currentButtonId: currentButtonId,
                            handleButtonClick: function handleButtonClick() {
                                for (
                                    var _len = arguments.length, args = new Array(_len), _key = 0;
                                    _key < _len;
                                    _key++
                                ) {
                                    args[_key] = arguments[_key];
                                    if (args[0] === 0) {
                                        setIsOpened(true);
                                        setCurrentButtonId(0);
                                        set_minPerValue(bottomPerChange);
                                        set_maxPerValue(topPerChange);
                                        setBottomVal(bottomPerChange);
                                        setTopVal(topPerChange);
                                    }
                                    if (args[0] === 1) {
                                        setIsOpened(true);
                                        setCurrentButtonId(1);
                                        if (bottomPerChange < 0) {
                                            setBottomVal(bottomPerChange);
                                            setTopVal(neutralPerChange);
                                            set_minPerValue(bottomPerChange);
                                            set_maxPerValue(neutralPerChange);
                                        } else if (bottomPerChange >= 0) {
                                            setBottomVal(neutralPerChange);
                                            setTopVal(neutralPerChange + 1);
                                            set_minPerValue(neutralPerChange);
                                            set_maxPerValue(neutralPerChange);
                                        }
                                    }
                                    if (args[0] === 2) {
                                        setIsOpened(true);
                                        setCurrentButtonId(2);
                                        if (topPerChange > 0) {
                                            setBottomVal(neutralPerChange);
                                            setTopVal(topPerChange);
                                            set_minPerValue(neutralPerChange);
                                            set_maxPerValue(topPerChange);
                                        } else if (bottomPerChange >= 0) {
                                            setBottomVal(neutralPerChange);
                                            setTopVal(neutralPerChange + 1);
                                            set_minPerValue(neutralPerChange);
                                            set_maxPerValue(neutralPerChange);
                                        }
                                    }
                                }
                            },
                        },
                        isOpened: isopened,
                        onClose: function onClose(options) {
                            setIsOpened(false);
                            set_minPerValue(options[0]);
                            set_maxPerValue(options[1]);
                            setPageNo(1);
                            setPerAPIFlag(options[0] + options[1]);
                        },
                        onDelete: () => {
                            set_minPerValue(bottomPerChange);
                            set_maxPerValue(topPerChange);
                            setPerAPIFlag('');
                        },
                    },
                    // {
                    //     label: 'Location',
                    //     value: 'spaces',
                    //     placeholder: 'All Locations',
                    //     filterType: FILTER_TYPES.MULTISELECT,
                    //     filterOptions: filters.data.data.spaces.map((filterItem) => ({
                    //         value: filterItem.space_id,
                    //         label: filterItem.space_name,
                    //     })),
                    //     onClose: (options) => {},
                    //     onDelete: () => {
                    //         setSelectedLocation([]);
                    //     },
                    // },
                    {
                        label: 'Equipment Type',
                        value: 'equipments_type',
                        placeholder: 'All Equipment Types',
                        filterType: FILTER_TYPES.MULTISELECT,
                        filterOptions: filters.data.data.equipments_type.map((filterItem) => ({
                            value: filterItem.equipment_type_id,
                            label: filterItem.equipment_type_name,
                        })),
                        onChange: function onChange(options) {},
                        onClose: (options) => {
                            let opt = options;
                            if (opt.length !== 0) {
                                let equipIds = [];
                                for (let i = 0; i < opt.length; i++) {
                                    equipIds.push(opt[i].value);
                                }
                                setPageNo(1);
                                setSelectedEquipType(equipIds);
                            }
                        },
                        onDelete: (options) => {
                            setSelectedEquipType([]);
                        },
                    },
                    {
                        label: 'End Uses',
                        value: 'end_users',
                        placeholder: 'All End Uses',
                        filterType: FILTER_TYPES.MULTISELECT,
                        filterOptions: filterData.end_users.map((filterItem) => ({
                            value: filterItem.end_use_id,
                            label: filterItem.end_use_name,
                        })),
                        onClose: (options) => {
                            let opt = options;
                            if (opt.length !== 0) {
                                let endUseIds = [];
                                for (let i = 0; i < opt.length; i++) {
                                    endUseIds.push(opt[i].value);
                                }
                                setPageNo(1);
                                setSelectedEndUse(endUseIds);
                            }
                        },
                        onDelete: () => {
                            setSelectedEndUse([]);
                        },
                    },
                    {
                        label: 'Space Type',
                        value: 'location_types',
                        placeholder: 'All Space Types',
                        filterType: FILTER_TYPES.MULTISELECT,
                        filterOptions: filters.data.data.location_types.map((filterItem) => ({
                            value: filterItem.location_type_id,
                            label: filterItem.location_types_name,
                        })),
                        onClose: (options) => {
                            let opt = options;
                            if (opt.length !== 0) {
                                let spaceIds = [];
                                for (let i = 0; i < opt.length; i++) {
                                    spaceIds.push(opt[i].value);
                                }
                                setPageNo(1);
                                setSelectedSpaceType(spaceIds);
                            }
                        },
                        onDelete: () => {
                            setSelectedSpaceType([]);
                        },
                    },
                ];
                setFilterOptions(filterOptionsFetched);
            })();
        }
    }, [conAPIFlag, selectedEndUse]);

    useEffect(() => {
        if (perAPIFlag !== '') {
            const filterOptionsFetched = [
                {
                    label: 'Energy Consumption',
                    value: 'consumption',
                    placeholder: 'All Consumptions',
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minConValue, maxConValue],
                    componentProps: {
                        prefix: ' kWh',
                        title: 'Consumption',
                        min: bottomConsumption,
                        max: topConsumption + 1,
                        range: [minConValue, maxConValue],
                        withTrendsFilter: false,
                    },
                    onClose: async function onClose(options) {
                        set_minConValue(options[0]);
                        set_maxConValue(options[1]);
                        setPageNo(1);
                        setConAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minConValue(bottomConsumption);
                        set_maxConValue(topConsumption);
                        setConAPIFlag('');
                    },
                },
                {
                    label: '% Change',
                    value: 'change',
                    placeholder: 'All % Change',
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minPerValue, maxPerValue],
                    componentProps: {
                        prefix: ' %',
                        title: '% Change',
                        min: bottomVal,
                        max: topVal + 1,
                        range: [minPerValue, maxPerValue],
                        withTrendsFilter: true,
                        currentButtonId: currentButtonId,
                        handleButtonClick: function handleButtonClick() {
                            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                                args[_key] = arguments[_key];
                                if (args[0] === 0) {
                                    setIsOpened(true);
                                    setCurrentButtonId(0);
                                    set_minPerValue(bottomPerChange);
                                    set_maxPerValue(topPerChange);
                                    setBottomVal(bottomPerChange);
                                    setTopVal(topPerChange);
                                }
                                if (args[0] === 1) {
                                    setIsOpened(true);
                                    setCurrentButtonId(1);
                                    if (bottomPerChange < 0) {
                                        setBottomVal(bottomPerChange);
                                        setTopVal(neutralPerChange);
                                        set_minPerValue(bottomPerChange);
                                        set_maxPerValue(neutralPerChange);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(neutralPerChange);
                                        setTopVal(neutralPerChange + 1);
                                        set_minPerValue(neutralPerChange);
                                        set_maxPerValue(neutralPerChange);
                                    }
                                }
                                if (args[0] === 2) {
                                    setIsOpened(true);
                                    setCurrentButtonId(2);
                                    if (topPerChange > 0) {
                                        setBottomVal(neutralPerChange);
                                        setTopVal(topPerChange);
                                        set_minPerValue(neutralPerChange);
                                        set_maxPerValue(topPerChange);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(neutralPerChange);
                                        setTopVal(neutralPerChange + 1);
                                        set_minPerValue(neutralPerChange);
                                        set_maxPerValue(neutralPerChange);
                                    }
                                }
                            }
                        },
                    },
                    isOpened: isopened,
                    onClose: function onClose(options) {
                        setIsOpened(false);
                        set_minPerValue(options[0]);
                        set_maxPerValue(options[1]);
                        setPageNo(1);
                        setPerAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minPerValue(bottomPerChange);
                        set_maxPerValue(topPerChange);
                        setPerAPIFlag('');
                    },
                },
                // {
                //     label: 'Location',
                //     value: 'spaces',
                //     placeholder: 'All Locations',
                //     filterType: FILTER_TYPES.MULTISELECT,
                //     filterOptions: filterData.spaces.map((filterItem) => ({
                //         value: filterItem.space_id,
                //         label: filterItem.space_name,
                //     })),
                //     onClose: (options) => {},
                //     onDelete: () => {
                //         setSelectedLocation([]);
                //     },
                // },
                {
                    label: 'Equipment Type',
                    value: 'equipments_type',
                    placeholder: 'All Equipment Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterData.equipments_type.map((filterItem) => ({
                        value: filterItem.equipment_type_id,
                        label: filterItem.equipment_type_name,
                    })),
                    onChange: function onChange(options) {},
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let equipIds = [];
                            for (let i = 0; i < opt.length; i++) {
                                equipIds.push(opt[i].value);
                            }
                            setPageNo(1);
                            setSelectedEquipType(equipIds);
                        }
                    },
                    onDelete: (options) => {
                        setSelectedEquipType([]);
                    },
                },
                {
                    label: 'End Uses',
                    value: 'end_users',
                    placeholder: 'All End Uses',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterData.end_users.map((filterItem) => ({
                        value: filterItem.end_use_id,
                        label: filterItem.end_use_name,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let endUseIds = [];
                            for (let i = 0; i < opt.length; i++) {
                                endUseIds.push(opt[i].value);
                            }
                            setPageNo(1);
                            setSelectedEndUse(endUseIds);
                        }
                    },
                    onDelete: () => {
                        setSelectedEndUse([]);
                    },
                },
                {
                    label: 'Space Type',
                    value: 'location_types',
                    placeholder: 'All Space Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterData.location_types.map((filterItem) => ({
                        value: filterItem.location_type_id,
                        label: filterItem.location_types_name,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let spaceIds = [];
                            for (let i = 0; i < opt.length; i++) {
                                spaceIds.push(opt[i].value);
                            }
                            setPageNo(1);
                            setSelectedSpaceType(spaceIds);
                        }
                    },
                    onDelete: () => {
                        setSelectedSpaceType([]);
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        }
    }, [perAPIFlag]);
    useEffect(() => {
        if ((minConValue !== maxConValue && maxConValue !== 0) || (minPerValue !== maxPerValue && maxPerValue !== 0)) {
            if (Object.keys(filterData).length !== 0) {
                const filterOptionsFetched = [
                    {
                        label: 'Energy Consumption',
                        value: 'consumption',
                        placeholder: 'All Consumptions',
                        filterType: FILTER_TYPES.RANGE_SELECTOR,
                        filterOptions: [minConValue, maxConValue],
                        componentProps: {
                            prefix: ' kWh',
                            title: 'Consumption',
                            min: bottomConsumption,
                            max: topConsumption + 1,
                            range: [minConValue, maxConValue],
                            withTrendsFilter: false,
                        },
                        onClose: function onClose(options) {
                            set_minConValue(options[0]);
                            set_maxConValue(options[1]);
                            setPageNo(1);
                            setConAPIFlag(options[0] + options[1]);
                        },
                        onDelete: () => {
                            set_minConValue(bottomConsumption);
                            set_maxConValue(topConsumption);
                            setConAPIFlag('');
                        },
                    },
                    {
                        label: '% Change',
                        value: 'change',
                        placeholder: 'All % Change',
                        filterType: FILTER_TYPES.RANGE_SELECTOR,
                        filterOptions: [minPerValue, maxPerValue],
                        componentProps: {
                            prefix: ' %',
                            title: '% Change',
                            min: bottomVal,
                            max: topVal + 1,
                            range: [minPerValue, maxPerValue],
                            withTrendsFilter: true,
                            currentButtonId: currentButtonId,
                            handleButtonClick: function handleButtonClick() {
                                for (
                                    var _len = arguments.length, args = new Array(_len), _key = 0;
                                    _key < _len;
                                    _key++
                                ) {
                                    args[_key] = arguments[_key];
                                    if (args[0] === 0) {
                                        setIsOpened(true);
                                        setCurrentButtonId(0);
                                        set_minPerValue(bottomPerChange);
                                        set_maxPerValue(topPerChange);
                                        setBottomVal(bottomPerChange);
                                        setTopVal(topPerChange);
                                    }
                                    if (args[0] === 1) {
                                        setIsOpened(true);
                                        setCurrentButtonId(1);
                                        if (bottomPerChange < 0) {
                                            setBottomVal(bottomPerChange);
                                            setTopVal(neutralPerChange);
                                            set_minPerValue(bottomPerChange);
                                            set_maxPerValue(neutralPerChange);
                                        } else if (bottomPerChange >= 0) {
                                            setBottomVal(neutralPerChange);
                                            setTopVal(neutralPerChange + 1);
                                            set_minPerValue(neutralPerChange);
                                            set_maxPerValue(neutralPerChange);
                                        }
                                    }
                                    if (args[0] === 2) {
                                        setIsOpened(true);
                                        setCurrentButtonId(2);
                                        if (topPerChange > 0) {
                                            setBottomVal(neutralPerChange);
                                            setTopVal(topPerChange);
                                            set_minPerValue(neutralPerChange);
                                            set_maxPerValue(topPerChange);
                                        } else if (bottomPerChange >= 0) {
                                            setBottomVal(neutralPerChange);
                                            setTopVal(neutralPerChange + 1);
                                            set_minPerValue(neutralPerChange);
                                            set_maxPerValue(neutralPerChange);
                                        }
                                    }
                                }
                            },
                        },
                        isOpened: isopened,
                        onClose: function onClose(options) {
                            setIsOpened(false);
                            set_minPerValue(options[0]);
                            set_maxPerValue(options[1]);
                            setPageNo(1);
                            setPerAPIFlag(options[0] + options[1]);
                        },
                        onDelete: () => {
                            set_minPerValue(bottomPerChange);
                            set_maxPerValue(topPerChange);
                            setPerAPIFlag('');
                        },
                    },
                    // {
                    //     label: 'Location',
                    //     value: 'spaces',
                    //     placeholder: 'All Locations',
                    //     filterType: FILTER_TYPES.MULTISELECT,
                    //     filterOptions: filterData.spaces.map((filterItem) => ({
                    //         value: filterItem.space_id,
                    //         label: filterItem.space_name,
                    //     })),
                    //     onClose: (options) => {},
                    //     onDelete: () => {
                    //         setSelectedLocation([]);
                    //     },
                    // },
                    {
                        label: 'Equipment Type',
                        value: 'equipments_type',
                        placeholder: 'All Equipment Types',
                        filterType: FILTER_TYPES.MULTISELECT,
                        filterOptions: filterData.equipments_type.map((filterItem) => ({
                            value: filterItem.equipment_type_id,
                            label: filterItem.equipment_type_name,
                        })),
                        onChange: function onChange(options) {},
                        onClose: (options) => {
                            let opt = options;
                            if (opt.length !== 0) {
                                let equipIds = [];
                                for (let i = 0; i < opt.length; i++) {
                                    equipIds.push(opt[i].value);
                                }
                                setPageNo(1);
                                setSelectedEquipType(equipIds);
                            }
                        },
                        onDelete: (options) => {
                            setSelectedEquipType([]);
                        },
                    },
                    {
                        label: 'End Uses',
                        value: 'end_users',
                        placeholder: 'All End Uses',
                        filterType: FILTER_TYPES.MULTISELECT,
                        filterOptions: filterData.end_users.map((filterItem) => ({
                            value: filterItem.end_use_id,
                            label: filterItem.end_use_name,
                        })),
                        onClose: (options) => {
                            let opt = options;
                            if (opt.length !== 0) {
                                let endUseIds = [];
                                for (let i = 0; i < opt.length; i++) {
                                    endUseIds.push(opt[i].value);
                                }
                                setPageNo(1);
                                setSelectedEndUse(endUseIds);
                            }
                        },
                        onDelete: () => {
                            setSelectedEndUse([]);
                        },
                    },
                    {
                        label: 'Space Type',
                        value: 'location_types',
                        placeholder: 'All Space Types',
                        filterType: FILTER_TYPES.MULTISELECT,
                        filterOptions: filterData.location_types.map((filterItem) => ({
                            value: filterItem.location_type_id,
                            label: filterItem.location_types_name,
                        })),
                        onClose: (options) => {
                            let opt = options;
                            if (opt.length !== 0) {
                                let spaceIds = [];
                                for (let i = 0; i < opt.length; i++) {
                                    spaceIds.push(opt[i].value);
                                }
                                setPageNo(1);
                                setSelectedSpaceType(spaceIds);
                            }
                        },
                        onDelete: () => {
                            setSelectedSpaceType([]);
                        },
                    },
                ];
                setFilterOptions(filterOptionsFetched);
            }
        }
    }, [minConValue, maxConValue, minPerValue, maxPerValue]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Building View',
                        path: '/explore-page/by-equipment',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'explore';
            });
        };
        updateBreadcrumbStore();
        localStorage.removeItem('explorer');
    }, []);

    const fetchExploreChartData = async () => {
        setChartLoading(true);
        let payload = apiRequestBody(startDate, endDate, timeZone);
        let params = `?building_id=${bldgId}&consumption=${
            selectedConsumption === 'rmsCurrentMilliAmps' && device_type === 'active' ? 'mAh' : selectedConsumption
        }&equipment_id=${equipIdNow}&divisible_by=1000${
            selectedConsumption === 'rmsCurrentMilliAmps' ? '&detailed=true' : ''
        }`;
        await fetchExploreEquipmentChart(payload, params)
            .then((res) => {
                let responseData = res.data;
                let data = responseData.data;

                let arr = [];
                arr = allEquipmentList.filter(function (item) {
                    return item.equipment_id === equipIdNow;
                });
                let sg = '';
                let legendName = '';
                sg = arr[0].location.substring(arr[0].location.indexOf('>') + 1);
                if (sg === '') {
                    legendName = arr[0].equipment_name;
                } else {
                    legendName = arr[0].equipment_name + ' - ' + sg;
                }
                let NulledData = [];
                let WeatherData = [];
                if (selectedConsumption === 'rmsCurrentMilliAmps') {
                    NulledData = seriesData;
                    WeatherData = weatherSeries;
                    for (let i = 0; i < data.length; i++) {
                        let sensorData = [];
                        data[i].data.map((ele) => {
                            if (ele.consumption === '') {
                                sensorData.push({ x: new Date(ele.time_stamp).getTime(), y: null });
                            } else {
                                sensorData.push({
                                    x: new Date(ele.time_stamp).getTime(),
                                    y: ele.consumption,
                                });
                            }
                        });
                        let recordToInsert = {
                            name: `${legendName} - Sensor ${data[i].sensor_name}`,
                            data: sensorData,
                            id: arr[0].equipment_id,
                        };
                        let rcdToIns = {
                            name: `${legendName} - Sensor ${data[i].sensor_name}`,
                            data: sensorData,
                            id: arr[0].equipment_id,
                            type: 'line',
                            lineWidth: 2,
                            showInLegend: true,
                        };
                        WeatherData.push(rcdToIns);
                        NulledData.push(recordToInsert);
                    }
                    setSeriesData(NulledData);
                    setWeatherSeries(WeatherData);
                } else {
                    data.map((ele) => {
                        if (ele?.consumption === '') {
                            NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: null });
                        } else {
                            NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: ele?.consumption });
                        }
                    });
                    let recordToInsert = {
                        name: legendName,
                        data: NulledData,
                        id: arr[0].equipment_id,
                    };
                    let rcdToIns = {
                        name: `${legendName}`,
                        data: NulledData,
                        id: arr[0].equipment_id,
                        type: 'line',
                        lineWidth: 2,
                        showInLegend: true,
                    };

                    setSeriesData([...seriesData, recordToInsert]);
                    setWeatherSeries([...weatherSeries, rcdToIns]);
                }

                setSelectedEquipmentId('');
                setChartLoading(false);
            })
            .catch((error) => {});
    };
    useEffect(() => {
        if (weatherSeries.length > 0) {
            let check = weatherSeries.filter((serie) => serie.type === LOW_MED_HIGH);
            if (check.length === 0) weatherSeries.push(weatherStat);
        }
    }, [weatherSeries]);
    useEffect(() => {
        if (selectedEquipmentId === '') {
            return;
        }

        fetchExploreChartData();
    }, [selectedEquipmentId, equpimentIdSelection]);

    useEffect(() => {
        if (selectedAllEquipmentId.length === 1) {
            fetchExploreAllChartData(selectedAllEquipmentId[0]);
        } else {
            selectedAllEquipmentId.map((ele) => {
                fetchExploreAllChartData(ele);
            });
        }
    }, [selectedAllEquipmentId]);

    useEffect(() => {
        if (removeEquipmentId === '') {
            return;
        }
        let arr1 = [];
        arr1 = seriesData.filter(function (item) {
            return item.id !== removeEquipmentId;
        });
        let arr2 = [];
        arr2 = weatherSeries.filter(function (item) {
            return item.id !== removeEquipmentId;
        });
        setSeriesData(arr1);
        setWeatherSeries(arr2);
    }, [removeEquipmentId]);

    const dataarr = [];
    const weatherdataarr = [];
    let ct = 0;

    const fetchExploreAllChartData = async (id) => {
        let payload = apiRequestBody(startDate, endDate, timeZone);
        let params = `?building_id=${bldgId}&consumption=${
            selectedConsumption === 'rmsCurrentMilliAmps' && device_type === 'active' ? 'mAh' : selectedConsumption
        }&equipment_id=${id}&divisible_by=1000${selectedConsumption === 'rmsCurrentMilliAmps' ? '&detailed=true' : ''}`;
        await fetchExploreEquipmentChart(payload, params)
            .then((res) => {
                let responseData = res.data;
                let data = responseData.data;
                let arr = [];

                arr = allEquipmentList.filter(function (item) {
                    return item.equipment_id === id;
                });
                let sg = '';
                let legendName = '';
                sg = arr[0].location.substring(arr[0].location.indexOf('>') + 1);
                if (sg === '') {
                    legendName = arr[0].equipment_name;
                } else {
                    legendName = arr[0].equipment_name + ' - ' + sg;
                }
                let NulledData = [];

                if (selectedConsumption === 'rmsCurrentMilliAmps') {
                    ct++;
                    for (let i = 0; i < data.length; i++) {
                        let sensorData = [];
                        data[i].data.map((ele) => {
                            if (ele.consumption === '') {
                                sensorData.push({ x: new Date(ele.time_stamp).getTime(), y: null });
                            } else {
                                sensorData.push({
                                    x: new Date(ele.time_stamp).getTime(),
                                    y: ele.consumption,
                                });
                            }
                        });
                        let recordToInsert = {
                            name: `${legendName} - Sensor ${data[i].sensor_name}`,
                            data: sensorData,
                            id: arr[0].equipment_id,
                        };
                        let rcdToIns = {
                            name: `${legendName} - Sensor ${data[i].sensor_name}`,
                            data: sensorData,
                            id: arr[0].equipment_id,
                            type: 'line',
                            lineWidth: 2,
                            showInLegend: true,
                        };
                        dataarr.push(recordToInsert);
                        weatherdataarr.push(rcdToIns);
                    }

                    if (selectedIds.length === ct) {
                        setSeriesData(dataarr);
                        setWeatherSeries(weatherdataarr);
                        ct = 0;
                    }
                } else {
                    data.map((ele) => {
                        if (ele?.consumption === '') {
                            NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: null });
                        } else {
                            NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: ele?.consumption });
                        }
                    });
                    let recordToInsert = {
                        name: legendName,
                        data: NulledData,
                        id: arr[0].equipment_id,
                        type: 'line',
                    };
                    let rcdToIns = {
                        name: `${legendName}`,
                        data: NulledData,
                        id: arr[0].equipment_id,
                        type: 'line',
                        lineWidth: 2,
                        showInLegend: true,
                    };
                    dataarr.push(recordToInsert);
                    weatherdataarr.push(rcdToIns);
                    if (selectedIds.length === dataarr.length) {
                        setSeriesData(dataarr);
                        setWeatherSeries(weatherdataarr);
                    }
                }
            })
            .catch((error) => {});
    };

    useEffect(() => {
        if (equipmentListArray.length === 0) {
            return;
        }
        for (var i = 0; i < equipmentListArray.length; i++) {
            let arr1 = [];
            arr1 = seriesData.filter(function (item) {
                return item.id === equipmentListArray[i];
            });
            if (arr1.length === 0) {
                fetchExploreAllChartData(equipmentListArray[i]);
            }
        }
    }, [equipmentListArray]);

    useEffect(() => {
        if (allEquipmentData.length === 0) {
            return;
        }
        if (allEquipmentData.length === exploreTableData.length) {
            setSeriesData(allEquipmentData);
            setWeatherSeries(allEquipmentData);
        }
    }, [allEquipmentData]);

    const handleDownloadCsv = async () => {
        const ordered_by = sortBy.name === undefined ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;

        await fetchExploreEquipmentList(
            startDate,
            endDate,
            timeZone,
            bldgId,
            '',
            ordered_by,
            sort_by,
            0,
            0,
            minConValue,
            maxConValue,
            minPerValue,
            maxPerValue,
            [],
            [],
            [],
            [],
            '',
            ''
        )
            .then((res) => {
                let responseData = res.data;
                download(
                    `${bldgName}_Explore_By_Equipment_${new Date().toISOString().split('T')[0]}`,
                    getExploreByEquipmentTableCSVExport(responseData.data, headerProps)
                );
            })
            .catch((error) => {});
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'equipment_name',
            callbackValue: renderEquipmentName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Energy Consumption',
            accessor: 'consumption',
            callbackValue: renderConsumption,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: '% Change',
            accessor: 'change',
            callbackValue: renderPerChange,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Location',
            accessor: 'location',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Space Type',
            accessor: 'location_type',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Equipment Type',
            accessor: 'equipments_type',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'End Use Category',
            accessor: 'end_user',
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (isWeatherChartVisible && bldgId) {
            handleWeatherChart();
        }
    }, [isWeatherChartVisible]);

    const handleWeatherChart = async () => {
        // let params = `?building_id=${bldgId}&consumption=${selectedConsumption}&timezone=${timeZone}&date_from=${encodeURIComponent(
        //     new Date(startDate).toISOString()
        // )}&date_to=${encodeURIComponent(new Date(endDate).toISOString())}`;
        // await fetchWeatherData(params)
        //     .then((res) => {
        //         console.log('Weather ', res);
        //         let responseData = res.data;

        let response = [
            {
                datetime: '2023-01-01T00:00:00+00:00',
                clouds: 40,
                dewpt: 5.1,
                max_temp: 13.3,
                min_temp: 4.4,
                rh: 77.8,
                solar_rad: 101,
                t_solar_rad: 2423.3,
                temp: 9.2,
            },
            {
                datetime: '2023-01-02T00:00:00+00:00',
                clouds: 73,
                dewpt: 5.5,
                max_temp: 13.3,
                min_temp: 3.9,
                rh: 82.2,
                solar_rad: 90.3,
                t_solar_rad: 2167.6,
                temp: 8.4,
            },
            {
                datetime: '2023-01-03T00:00:00+00:00',
                clouds: 100,
                dewpt: 9.7,
                max_temp: 16.1,
                min_temp: 8.9,
                rh: 84.8,
                solar_rad: 12.6,
                t_solar_rad: 301.4,
                temp: 12.3,
            },
            {
                datetime: '2023-01-04T00:00:00+00:00',
                clouds: 100,
                dewpt: 12.3,
                max_temp: 18.3,
                min_temp: 11.7,
                rh: 84.8,
                solar_rad: 23.6,
                t_solar_rad: 566.4,
                temp: 14.9,
            },
            {
                datetime: '2023-01-05T00:00:00+00:00',
                clouds: 77,
                dewpt: 9.4,
                max_temp: 16.7,
                min_temp: 8.3,
                rh: 80,
                solar_rad: 42.2,
                t_solar_rad: 1013.1,
                temp: 13.3,
            },
            {
                datetime: '2023-01-06T00:00:00+00:00',
                clouds: 57,
                dewpt: 2.5,
                max_temp: 9.4,
                min_temp: 5,
                rh: 70.7,
                solar_rad: 75,
                t_solar_rad: 1800.2,
                temp: 7.8,
            },
            {
                datetime: '2023-01-07T00:00:00+00:00',
                clouds: 41,
                dewpt: -1.7,
                max_temp: 7.8,
                min_temp: 3.9,
                rh: 57.3,
                solar_rad: 85.8,
                t_solar_rad: 2058.3,
                temp: 6.1,
            },
            {
                datetime: '2023-01-08T00:00:00+00:00',
                clouds: 54,
                dewpt: -2,
                max_temp: 6.1,
                min_temp: 0.6,
                rh: 65.2,
                solar_rad: 51.3,
                t_solar_rad: 1231.1,
                temp: 4,
            },
            {
                datetime: '2023-01-09T00:00:00+00:00',
                clouds: 50,
                dewpt: -0.7,
                max_temp: 6.7,
                min_temp: 3.3,
                rh: 71,
                solar_rad: 91.9,
                t_solar_rad: 2205.9,
                temp: 4.5,
            },
            {
                datetime: '2023-01-10T00:00:00+00:00',
                clouds: 63,
                dewpt: -3.3,
                max_temp: 6.7,
                min_temp: 0.6,
                rh: 60.8,
                solar_rad: 36.7,
                t_solar_rad: 881.9,
                temp: 3.7,
            },
            {
                datetime: '2023-01-11T00:00:00+00:00',
                clouds: 64,
                dewpt: -1.6,
                max_temp: 7.2,
                min_temp: -1.1,
                rh: 70.4,
                solar_rad: 35.6,
                t_solar_rad: 855.1,
                temp: 3.5,
            },
            {
                datetime: '2023-01-12T00:00:00+00:00',
                clouds: 100,
                dewpt: 5.4,
                max_temp: 15,
                min_temp: 3,
                rh: 79.2,
                solar_rad: 24.1,
                t_solar_rad: 578.1,
                temp: 8.9,
            },
            {
                datetime: '2023-01-13T00:00:00+00:00',
                clouds: 89,
                dewpt: 4.2,
                max_temp: 14.4,
                min_temp: 2.8,
                rh: 70,
                solar_rad: 35,
                t_solar_rad: 840.7,
                temp: 9.5,
            },
            {
                datetime: '2023-01-14T00:00:00+00:00',
                clouds: 82,
                dewpt: -6.5,
                max_temp: 2.5,
                min_temp: -1.1,
                rh: 58.7,
                solar_rad: 44.1,
                t_solar_rad: 1058.9,
                temp: 0.6,
            },
            {
                datetime: '2023-01-15T00:00:00+00:00',
                clouds: 26,
                dewpt: -7.4,
                max_temp: 6.1,
                min_temp: -2.2,
                rh: 52.9,
                solar_rad: 114.3,
                t_solar_rad: 2742.3,
                temp: 1.4,
            },
            {
                datetime: '2023-01-16T00:00:00+00:00',
                clouds: 15,
                dewpt: -10.5,
                max_temp: 10,
                min_temp: -1.7,
                rh: 36.3,
                solar_rad: 115.4,
                t_solar_rad: 2769.2,
                temp: 3.8,
            },
            {
                datetime: '2023-01-17T00:00:00+00:00',
                clouds: 71,
                dewpt: -2.9,
                max_temp: 7.8,
                min_temp: 1.7,
                rh: 57.5,
                solar_rad: 41.6,
                t_solar_rad: 997.6,
                temp: 5.2,
            },
            {
                datetime: '2023-01-18T00:00:00+00:00',
                clouds: 66,
                dewpt: 3.5,
                max_temp: 12.2,
                min_temp: 5.6,
                rh: 72.7,
                solar_rad: 103.3,
                t_solar_rad: 2479.8,
                temp: 8.7,
            },
            {
                datetime: '2023-01-19T00:00:00+00:00',
                clouds: 100,
                dewpt: 3.9,
                max_temp: 7.2,
                min_temp: 2.8,
                rh: 87.6,
                solar_rad: 22.6,
                t_solar_rad: 541.8,
                temp: 5.8,
            },
            {
                datetime: '2023-01-20T00:00:00+00:00',
                clouds: 48,
                dewpt: 0.8,
                max_temp: 8.9,
                min_temp: 3.9,
                rh: 66,
                solar_rad: 105.1,
                t_solar_rad: 2523.5,
                temp: 7.1,
            },
            {
                datetime: '2023-01-21T00:00:00+00:00',
                clouds: 85,
                dewpt: -3,
                max_temp: 5.6,
                min_temp: 3.3,
                rh: 58.5,
                solar_rad: 31.6,
                t_solar_rad: 757.3,
                temp: 4.5,
            },
            {
                datetime: '2023-01-22T00:00:00+00:00',
                clouds: 97,
                dewpt: -0.8,
                max_temp: 6.1,
                min_temp: 1.1,
                rh: 74.2,
                solar_rad: 33.5,
                t_solar_rad: 803.8,
                temp: 3.5,
            },
            {
                datetime: '2023-01-23T00:00:00+00:00',
                clouds: 92,
                dewpt: 1.2,
                max_temp: 5.6,
                min_temp: 3.3,
                rh: 80.8,
                solar_rad: 36.7,
                t_solar_rad: 880.7,
                temp: 4.4,
            },
            {
                datetime: '2023-01-24T00:00:00+00:00',
                clouds: 41,
                dewpt: -3.3,
                max_temp: 8.9,
                min_temp: 1.1,
                rh: 57.6,
                solar_rad: 112.2,
                t_solar_rad: 2693.1,
                temp: 4.6,
            },
            {
                datetime: '2023-01-25T00:00:00+00:00',
                clouds: 100,
                dewpt: 1.8,
                max_temp: 14.4,
                min_temp: -1.1,
                rh: 79.6,
                solar_rad: 29.5,
                t_solar_rad: 708.9,
                temp: 5,
            },
            {
                datetime: '2023-01-26T00:00:00+00:00',
                clouds: 42,
                dewpt: 1.2,
                max_temp: 14.4,
                min_temp: 2.2,
                rh: 63.6,
                solar_rad: 103.5,
                t_solar_rad: 2484.5,
                temp: 8,
            },
            {
                datetime: '2023-01-27T00:00:00+00:00',
                clouds: 22,
                dewpt: -5.4,
                max_temp: 8.9,
                min_temp: 0.6,
                rh: 53.7,
                solar_rad: 106.8,
                t_solar_rad: 2562.8,
                temp: 3.3,
            },
            {
                datetime: '2023-01-28T00:00:00+00:00',
                clouds: 44,
                dewpt: -2.9,
                max_temp: 11.1,
                min_temp: 0,
                rh: 53.5,
                solar_rad: 101.4,
                t_solar_rad: 2433.5,
                temp: 6.1,
            },
            {
                datetime: '2023-01-29T00:00:00+00:00',
                clouds: 88,
                dewpt: 0.9,
                max_temp: 11.1,
                min_temp: 1.1,
                rh: 69.8,
                solar_rad: 33.1,
                t_solar_rad: 793.5,
                temp: 6.4,
            },
            {
                datetime: '2023-01-30T00:00:00+00:00',
                clouds: 63,
                dewpt: 3.5,
                max_temp: 12.2,
                min_temp: 2.8,
                rh: 79,
                solar_rad: 125.9,
                t_solar_rad: 3021.9,
                temp: 7.1,
            },
            {
                datetime: '2023-01-31T00:00:00+00:00',
                clouds: 93,
                dewpt: 0.3,
                max_temp: 12.8,
                min_temp: 1.7,
                rh: 79.1,
                solar_rad: 36.1,
                t_solar_rad: 866.1,
                temp: 3.6,
            },
            {
                datetime: '2023-02-01T00:00:00+00:00',
                clouds: 69,
                dewpt: -7.2,
                max_temp: 3.9,
                min_temp: -0.6,
                rh: 56.2,
                solar_rad: 85.6,
                t_solar_rad: 2053.8,
                temp: 1.3,
            },
            {
                datetime: '2023-02-02T00:00:00+00:00',
                clouds: 83,
                dewpt: -9.4,
                max_temp: 5,
                min_temp: -2.2,
                rh: 46,
                solar_rad: 100.9,
                t_solar_rad: 2420.8,
                temp: 1.1,
            },
        ];
        // let arr = weatherSeries;
        // let datapoints = [];
        // const response = res?.data;
        // if (response?.success) {
        const tempData = [];
        const highTemp = {
            type: LOW_MED_HIGH_TYPES.HIGH,
            data: [],
            color: colors.datavizRed500,
        };
        const avgTemp = {
            type: LOW_MED_HIGH_TYPES.MED,
            data: [],
            color: colors.primaryGray450,
        };
        const lowTemp = {
            type: LOW_MED_HIGH_TYPES.LOW,
            data: [],
            color: colors.datavizBlue400,
        };
        response.forEach((record) => {
            tempData.push([record?.min_temp, record?.temp, record?.max_temp]);
            // if (record.hasOwnProperty('temp')) avgTemp.data.push(record?.temp);
            // if (record.hasOwnProperty('max_temp')) highTemp.data.push(record?.max_temp);
            // if (record.hasOwnProperty('min_temp')) lowTemp.data.push(record?.min_temp);
        });
        // if (avgTemp?.data.length !== 0) tempData.push(avgTemp);
        // if (highTemp?.data.length !== 0) tempData.push(highTemp);
        // if (lowTemp?.data.length !== 0) tempData.push(lowTemp);
        if (tempData.length !== 0) {
            let obj = {};

            obj['pointStart'] = new Date(startDate).getTime();
            obj['pointInterval'] = 16 * 3600 * 1000;
            obj['data'] = tempData;

            setWeatherData(obj);
        }
        console.log(tempData);
        // } else {
        //     setWeatherData(null);
        // }
        // })
        // .catch((error) => {
        //     setWeatherData(null);
        // });
    };
    useEffect(() => {
        console.log(weatherData);
    }, [weatherData]);
    const args = {
        temperatureSeries: weatherData,
    };
    return (
        <>
            <Row className="ml-2 mr-2 explore-filters-style">
                <div className="mr-2">
                    <Select
                        defaultValue={selectedConsumption}
                        options={metric}
                        onChange={(e) => {
                            setConsumption(e.value);
                            handleUnitChange(e.value);
                            handleConsumptionChange(e.value);
                        }}
                    />
                </div>
                <Header title="" type="page" />
            </Row>

            <Row>
                <div className="explore-data-table-style p-2 mb-2">
                    {/* {isExploreChartDataLoading ? (
                        <></>
                    ) : (
                        <> */}

                    <ExploreChart
                        title={''}
                        subTitle={''}
                        {...args}
                        isLoadingData={isExploreChartDataLoading}
                        tooltipUnit={selectedUnit}
                        tooltipLabel={selectedConsumptionLabel}
                        data={seriesData}
                        series={weatherSeries}
                        withTemp={isWeatherChartVisible}
                        dateRange={fetchDateRange(startDate, endDate)}
                        upperLegendsProps={{
                            weather: {
                                onClick: ({ withTemp }) => {
                                    setWeatherChartVisibility(withTemp);
                                },
                                isAlwaysShown: true,
                            },
                        }}
                        chartProps={{
                            navigator: {
                                outlineWidth: 0,
                            },
                            plotOptions: {
                                series: {
                                    states: {
                                        inactive: {
                                            opacity: 1,
                                        },
                                    },
                                },
                            },
                            xAxis: {
                                gridLineWidth: 0,
                            },
                            yAxis: [
                                {
                                    gridLineWidth: 1,
                                    lineWidth: 1,
                                    opposite: false,
                                    lineColor: null,
                                },
                                {
                                    opposite: true,
                                    title: false,
                                    max: 120,
                                    postFix: '23',
                                    gridLineWidth: 0,
                                },
                            ],
                        }}
                    />
                    {/* </>
                    )} */}
                </div>
            </Row>

            <Row>
                <div className="explore-data-table-style">
                    <Col lg={12}>
                        <DataTableWidget
                            isLoading={isExploreDataLoading}
                            isLoadingComponent={<SkeletonLoading />}
                            id="explore-by-equipment"
                            onSearch={setSearch}
                            buttonGroupFilterOptions={[]}
                            onStatus={setSelectedEquipmentFilter}
                            rows={currentRow()}
                            searchResultRows={currentRowSearched()}
                            filterOptions={filterOptions}
                            onDownload={() => handleDownloadCsv()}
                            headers={headerProps}
                            customCheckAll={() => (
                                <Checkbox
                                    label=""
                                    type="checkbox"
                                    id="equipment1"
                                    name="equipment1"
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
                                    id="equip"
                                    name="equip"
                                    checked={selectedIds.includes(record?.equipment_id) || checkedAll}
                                    value={selectedIds.includes(record?.equipment_id) || checkedAll}
                                    onChange={(e) => {
                                        handleEquipStateChange(e.target.value, record);
                                    }}
                                />
                            )}
                            onPageSize={setPageSize}
                            onChangePage={setPageNo}
                            pageSize={pageSize}
                            currentPage={pageNo}
                            pageListSizes={pageListSizes}
                            filters={filtersValues}
                            totalCount={(() => {
                                if (search) {
                                    return totalItemsSearched;
                                }
                                if (selectedEquipmentFilter === 0) {
                                    return totalItems;
                                }

                                return 0;
                            })()}
                        />
                    </Col>
                </div>
            </Row>

            <EquipChartModal
                showEquipmentChart={showEquipmentChart}
                handleChartClose={handleChartClose}
                equipmentFilter={equipmentFilter}
                fetchEquipmentData={exploreDataFetch}
                selectedTab={selectedModalTab}
                setSelectedTab={setSelectedModalTab}
                activePage="explore"
            />
        </>
    );
};

export default ExploreByEquipment;
