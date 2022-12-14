import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import { fetchExploreBuildingList, fetchExploreBuildingChart } from '../explore/services';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { fetchDateRange } from '../../helpers/formattedChartData';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { BuildingStore } from '../../store/BuildingStore';
import { selectedBuilding, totalSelectionBuildingId } from '../../store/globalState';
import { useAtom } from 'jotai';
import './style.css';
import 'moment-timezone';
import moment from 'moment';
import { timeZone } from '../../utils/helper';
import Header from '../../components/Header';
import { apiRequestBody } from '../../helpers/helpers';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../sharedComponents/form/checkbox';
import Brick from '../../sharedComponents/brick';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import Typography from '../../sharedComponents/typography';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import ExploreChart from '../../sharedComponents/exploreChart/ExploreChart';
import { getExploreByBuildingTableCSVExport } from '../../utils/tablesExport';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { getAverageValue } from '../../helpers/AveragePercent';

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
        </tr>
    </SkeletonTheme>
);

const ExploreByBuildings = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const isLoadingRef = useRef(false);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [allSearchData, setAllSearchData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    const [allBuildingList, setAllBuildingList] = useState([]);
    const [selectedBuildingFilter, setSelectedBuildingFilter] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);
    const { download } = useCSVDownload();
    const [checkedAll, setCheckedAll] = useState(false);
    const [buildIdNow, setBuildIdNow] = useState('');
    const history = useHistory();

    const [buildingIdSelection] = useAtom(selectedBuilding);
    const [totalBuildingId] = useAtom(totalSelectionBuildingId);

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));

    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);
    const [isExploreChartDataLoading, setIsExploreChartDataLoading] = useState(false);
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    const [seriesData, setSeriesData] = useState([]);
    const [allBuildingData, setAllBuildingData] = useState([]);

    let entryPoint = '';
    let top = '';
    let bottom = '';
    const [topEnergyConsumption, setTopEnergyConsumption] = useState(0);
    const [bottomEnergyConsumption, setBottomEnergyConsumption] = useState(0);
    const [topPerChange, setTopPerChange] = useState(0);
    const [bottomPerChange, setBottomPerChange] = useState(0);
    const [topSquareFootage, setTopSquareFootage] = useState(0);
    const [bottomSquareFootage, setBottomSquareFootage] = useState(0);
    const [selectedAllBuildingId, setSelectedAllBuildingId] = useState([]);

    const [minConValue, set_minConValue] = useState(0);
    const [maxConValue, set_maxConValue] = useState(0);
    const [minPerValue, set_minPerValue] = useState(0);
    const [maxPerValue, set_maxPerValue] = useState(0);
    const [minSqftValue, set_minSqftValue] = useState(0);
    const [maxSqftValue, set_maxSqftValue] = useState(0);
    const [conAPIFlag, setConAPIFlag] = useState('');
    const [perAPIFlag, setPerAPIFlag] = useState('');
    const [sqftAPIFlag, setSqftAPIFlag] = useState('');
    const [selectedBuildingType, setSelectedBuildingType] = useState([]);
    const [buildingTypeList, setBuildingTypeList] = useState([]);
    const [currentButtonId, setCurrentButtonId] = useState(0);
    const [isopened, setIsOpened] = useState(false);
    const [topVal, setTopVal] = useState(0);
    const [bottomVal, setBottomVal] = useState(0);

    useEffect(() => {
        entryPoint = 'entered';
    }, []);

    useEffect(() => {
        if (selectedIds?.length >= 1) {
            let arr = [];
            for (let i = 0; i < selectedIds?.length; i++) {
                arr.push(selectedIds[i]);
            }
            setSeriesData([]);
            setSelectedAllBuildingId(arr);
        } else {
            setSelectedBuildingId('');
        }
    }, [startDate, endDate]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Portfolio Level',
                        path: '/explore-page/by-buildings',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'explore';
            });

            localStorage.setItem('buildingId', 'portfolio');
            localStorage.setItem('buildingName', 'Portfolio');

            BuildingStore.update((s) => {
                s.BldgId = 'portfolio';
                s.BldgName = 'Portfolio';
            });
        };
        updateBreadcrumbStore();
        localStorage.removeItem('explorer');
    }, []);

    const exploreDataFetch = async () => {
        const ordered_by = sortBy.name === undefined ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;
        isLoadingRef.current = true;
        setIsExploreDataLoading(true);
        const value = apiRequestBody(startDate, endDate, timeZone);
        await fetchExploreBuildingList(
            value,
            search,
            ordered_by,
            sort_by,
            minConValue,
            maxConValue,
            minPerValue,
            maxPerValue,
            minSqftValue,
            maxSqftValue,
            selectedBuildingType,
            conAPIFlag,
            perAPIFlag,
            sqftAPIFlag
        )
            .then((res) => {
                if (entryPoint === 'entered') {
                    totalBuildingId.length = 0;
                    setSeriesData([]);
                }
                let responseData = res.data;
                setAllBuildingList(responseData);
                setTotalItems(responseData.length);
                const uniqueIds = [];
                const uniqueBuildingTypes = responseData.filter((element) => {
                    const isDuplicate = uniqueIds.includes(element.building_type);
                    if (!isDuplicate) {
                        uniqueIds.push(element.building_type);
                        return true;
                    }
                    return false;
                });
                setBuildingTypeList(uniqueBuildingTypes);
                let topConsumption = responseData[0].consumption.now;
                let bottomConsumption = responseData[0].consumption.now;
                let topChange = responseData[0].consumption.change;
                let bottomChange = responseData[0].consumption.change;
                let topSqft = responseData[0].square_footage;
                let bottomSqft = responseData[0].square_footage;
                responseData.map((ele) => {
                    if (Number(ele.consumption.now) > topConsumption) topConsumption = ele.consumption.now;
                    if (Number(ele.consumption.now) < bottomConsumption) bottomConsumption = ele.consumption.now;
                    if (Number(ele.consumption.change) > topChange) topChange = ele.consumption.change;
                    if (Number(ele.consumption.change) < bottomChange) bottomChange = ele.consumption.change;
                    if (Number(ele.square_footage) > topSqft) topSqft = ele.square_footage;
                    if (Number(ele.square_footage) < bottomSqft) bottomSqft = ele.square_footage;
                });
                top = topConsumption / 1000;
                bottom = bottomConsumption / 1000;
                if (top === bottom) {
                    bottom = 0;
                }
                set_minConValue(Math.abs(Math.round(bottomConsumption / 1000)));
                setBottomEnergyConsumption(Math.abs(Math.round(bottomConsumption / 1000)));
                set_maxConValue(
                    Math.abs(
                        topConsumption === bottomConsumption
                            ? Math.round(topConsumption / 1000) + 1
                            : Math.round(topConsumption / 1000)
                    )
                );
                setTopVal(Math.round(topChange));
                setBottomVal(Math.round(bottomChange));
                setTopEnergyConsumption(Math.abs(Math.round(topConsumption / 1000)));
                set_minPerValue(Math.round(bottomChange));
                setBottomPerChange(Math.round(bottomChange));
                set_maxPerValue(topChange === bottomChange ? Math.round(topChange) + 1 : Math.round(topChange));
                setTopPerChange(Math.round(topChange));
                set_minSqftValue(Math.abs(Math.round(bottomSqft)));
                setBottomSquareFootage(Math.abs(Math.round(bottomSqft)));
                setTopSquareFootage(Math.abs(Math.round(topSqft)));
                set_maxSqftValue(Math.abs(topSqft === bottomSqft ? Math.round(topSqft) + 1 : Math.round(topSqft)));

                isLoadingRef.current = false;
                setIsExploreDataLoading(false);
            })
            .catch((error) => {
                isLoadingRef.current = false;
                setIsExploreDataLoading(false);
            });
    };

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        if (conAPIFlag === '' && perAPIFlag === '' && sqftAPIFlag === '' && selectedBuildingType.length === 0)
            exploreDataFetch();
        else {
            filterexploreDataFetch();
        }
    }, [startDate, endDate, sortBy.method, sortBy.name, conAPIFlag, perAPIFlag, sqftAPIFlag, selectedBuildingType]);

    useEffect(() => {
        if (
            (minConValue !== maxConValue && maxConValue !== 0) ||
            (minPerValue !== maxPerValue && maxPerValue !== 0) ||
            (minSqftValue !== maxSqftValue && maxSqftValue !== 0)
        ) {
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
                        min: bottomEnergyConsumption,
                        max: topEnergyConsumption + 1,
                        range: [minConValue, maxConValue],
                        withTrendsFilter: false,
                    },
                    onClose: function onClose(options) {
                        set_minConValue(options[0]);
                        set_maxConValue(options[1]);
                        setConAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minConValue(bottomEnergyConsumption);
                        set_maxConValue(topEnergyConsumption);
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
                                    setBottomVal(bottomPerChange);
                                    setTopVal(topPerChange + 1);
                                    set_minPerValue(bottomPerChange);
                                    set_maxPerValue(topPerChange + 1);
                                }
                                if (args[0] === 1) {
                                    setIsOpened(true);
                                    setCurrentButtonId(1);
                                    if (bottomPerChange < 0) {
                                        setBottomVal(bottomPerChange);
                                        setTopVal(0);
                                        set_minPerValue(bottomPerChange);
                                        set_maxPerValue(0);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(0);
                                        setTopVal(1);
                                        set_minPerValue(0);
                                        set_maxPerValue(0);
                                    }
                                }
                                if (args[0] === 2) {
                                    setIsOpened(true);
                                    setCurrentButtonId(2);
                                    if (topPerChange > 0) {
                                        setBottomVal(0);
                                        setTopVal(topPerChange);
                                        set_minPerValue(0);
                                        set_maxPerValue(topPerChange);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(0);
                                        setTopVal(1);
                                        set_minPerValue(0);
                                        set_maxPerValue(0);
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
                        setPerAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minPerValue(bottomPerChange);
                        set_maxPerValue(topPerChange);
                        setPerAPIFlag('');
                    },
                },
                {
                    label: 'Square Footage',
                    value: 'square_footage',
                    placeholder: 'All Square Footage',
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minSqftValue, maxSqftValue],
                    componentProps: {
                        prefix: ' sq.ft.',
                        title: 'Square Footage',
                        min: bottomSquareFootage,
                        max: topSquareFootage + 1,
                        range: [minSqftValue, maxSqftValue],
                        withTrendsFilter: false,
                    },
                    onClose: function onClose(options) {
                        set_minSqftValue(options[0]);
                        set_maxSqftValue(options[1]);
                        setSqftAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minSqftValue(bottomSquareFootage);
                        set_maxSqftValue(topSquareFootage);
                        setSqftAPIFlag('');
                    },
                },
                {
                    label: 'Building Type',
                    value: 'building_type',
                    placeholder: 'All Building Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: buildingTypeList.map((filterItem) => ({
                        value: filterItem.building_type,
                        label: filterItem.building_type,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let buildingType = [];
                            for (let i = 0; i < opt.length; i++) {
                                buildingType.push(opt[i].value);
                            }
                            setSelectedBuildingType(buildingType);
                        }
                    },
                    onDelete: () => {
                        setSelectedBuildingType([]);
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        }
    }, [minConValue, maxConValue, minPerValue, maxPerValue, minSqftValue, maxSqftValue]);

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
                        min: bottomEnergyConsumption,
                        max: topEnergyConsumption + 1,
                        range: [minConValue, maxConValue],
                        withTrendsFilter: false,
                    },
                    onClose: function onClose(options) {
                        set_minConValue(options[0]);
                        set_maxConValue(options[1]);
                        setConAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minConValue(bottomEnergyConsumption);
                        set_maxConValue(topEnergyConsumption);
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
                                    setBottomVal(bottomPerChange);
                                    setTopVal(topPerChange + 1);
                                    set_minPerValue(bottomPerChange);
                                    set_maxPerValue(topPerChange + 1);
                                }
                                if (args[0] === 1) {
                                    setIsOpened(true);
                                    setCurrentButtonId(1);
                                    if (bottomPerChange < 0) {
                                        setBottomVal(bottomPerChange);
                                        setTopVal(0);
                                        set_minPerValue(bottomPerChange);
                                        set_maxPerValue(0);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(0);
                                        setTopVal(1);
                                        set_minPerValue(0);
                                        set_maxPerValue(0);
                                    }
                                }
                                if (args[0] === 2) {
                                    setIsOpened(true);
                                    setCurrentButtonId(2);
                                    if (topPerChange > 0) {
                                        setBottomVal(0);
                                        setTopVal(topPerChange);
                                        set_minPerValue(0);
                                        set_maxPerValue(topPerChange);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(0);
                                        setTopVal(1);
                                        set_minPerValue(0);
                                        set_maxPerValue(0);
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
                        setPerAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minPerValue(bottomPerChange);
                        set_maxPerValue(topPerChange);
                        setPerAPIFlag('');
                    },
                },
                {
                    label: 'Square Footage',
                    value: 'square_footage',
                    placeholder: 'All Square Footage',
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minSqftValue, maxSqftValue],
                    componentProps: {
                        prefix: ' sq.ft.',
                        title: 'Square Footage',
                        min: bottomSquareFootage,
                        max: topSquareFootage + 1,
                        range: [minSqftValue, maxSqftValue],
                        withTrendsFilter: false,
                    },
                    onClose: function onClose(options) {
                        set_minSqftValue(options[0]);
                        set_maxSqftValue(options[1]);
                        setSqftAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minSqftValue(bottomSquareFootage);
                        set_maxSqftValue(topSquareFootage);
                        setSqftAPIFlag('');
                    },
                },
                {
                    label: 'Building Type',
                    value: 'building_type',
                    placeholder: 'All Building Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: buildingTypeList.map((filterItem) => ({
                        value: filterItem.building_type,
                        label: filterItem.building_type,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let buildingType = [];
                            for (let i = 0; i < opt.length; i++) {
                                buildingType.push(opt[i].value);
                            }
                            setSelectedBuildingType(buildingType);
                        }
                    },
                    onDelete: () => {
                        setSelectedBuildingType([]);
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        }
    }, [perAPIFlag]);

    const filterexploreDataFetch = async () => {
        const ordered_by = sortBy.name === undefined ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;
        isLoadingRef.current = true;
        setIsExploreDataLoading(true);
        const value = apiRequestBody(startDate, endDate, timeZone);
        await fetchExploreBuildingList(
            value,
            search,
            ordered_by,
            sort_by,
            minConValue,
            maxConValue,
            minPerValue,
            maxPerValue,
            minSqftValue,
            maxSqftValue,
            selectedBuildingType,
            conAPIFlag,
            perAPIFlag,
            sqftAPIFlag
        )
            .then((res) => {
                let responseData = res.data;
                setAllBuildingList(responseData);
                setTotalItems(responseData.length);
                setTopEnergyConsumption(responseData[0].consumption.now);
                isLoadingRef.current = false;
                setIsExploreDataLoading(false);
            })
            .catch((error) => {
                isLoadingRef.current = false;
                setIsExploreDataLoading(false);
            });
    };

    const currentRow = () => {
        if (selectedBuildingFilter === 0) {
            return allBuildingList;
        }
        if (selectedBuildingFilter === 1) {
            return selectedIds.reduce((acc, id) => {
                const foundSelectedBuilding = allBuildingList.find((blgd) => blgd.building_id === id);
                if (foundSelectedBuilding) {
                    acc.push(foundSelectedBuilding);
                }
                return acc;
            }, []);
        }
        return allBuildingList.filter(({ building_id }) => !selectedIds.find((blgd) => blgd === building_id));
    };

    const currentRowSearched = () => {
        if (selectedBuildingFilter === 0) {
            return allSearchData;
        }
        if (selectedBuildingFilter === 1) {
            return selectedIds.reduce((acc, id) => {
                const foundSelectedBuilding = allSearchData.find((blgd) => blgd.building_id === id);
                if (foundSelectedBuilding) {
                    acc.push(foundSelectedBuilding);
                }
                return acc;
            }, []);
        }
        return allSearchData.filter(({ id }) => !selectedIds.find((blgd) => blgd === id));
    };

    const renderBuildingName = (row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <a
                    className="typography-wrapper link"
                    onClick={() => {
                        redirectToExploreEquipPage(row?.building_id, row?.building_name, row?.timezone);
                    }}>
                    {row.building_name}
                </a>
                <Brick sizeInPixels={3} />
            </div>
        );
    };

    const renderSquareFootage = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.square_footage} Sq.Ft.</Typography.Body>;
    };

    const renderConsumption = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {Math.round(row.consumption.now / 1000)} kWh
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={getAverageValue(row.consumption.now / 1000, bottom, top)} />
            </>
        );
    };

    const renderPerChange = (row) => {
        return (
            <TrendsBadge
                value={Math.abs(Math.round(row.consumption.change))}
                type={
                    row?.consumption?.now < row?.consumption?.old
                        ? TrendsBadge.Type.DOWNWARD_TREND
                        : TrendsBadge.Type.UPWARD_TREND
                }
            />
        );
    };

    const redirectToExploreEquipPage = (bldId, bldName, bldTimeZone) => {
        localStorage.setItem('buildingId', bldId);
        localStorage.setItem('buildingName', bldName);
        localStorage.setItem('buildingTimeZone', bldTimeZone === '' ? 'US/Eastern' : bldTimeZone);

        BuildingStore.update((s) => {
            s.BldgId = bldId;
            s.BldgName = bldName;
            s.BldgTimeZone = bldTimeZone === '' ? 'US/Eastern' : bldTimeZone;
        });

        history.push({
            pathname: `/explore-page/by-equipment/${bldId}`,
        });
    };

    useEffect(() => {
        setAllSearchData([]);

        const fetchAllData = async () => {
            const ordered_by = sortBy.name === undefined ? 'consumption' : sortBy.name;
            const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;

            isLoadingRef.current = true;
            setIsExploreDataLoading(true);
            const value = apiRequestBody(startDate, endDate, timeZone);
            await fetchExploreBuildingList(
                value,
                search,
                ordered_by,
                sort_by,
                minConValue,
                maxConValue,
                minPerValue,
                maxPerValue,
                minSqftValue,
                maxSqftValue,
                selectedBuildingType,
                conAPIFlag,
                perAPIFlag,
                sqftAPIFlag
            )
                .then((res) => {
                    if (entryPoint === 'entered') {
                        totalBuildingId.length = 0;
                        setSeriesData([]);
                    }
                    let responseData = res.data;
                    setTotalItemsSearched(responseData.length);
                    setAllSearchData(responseData);
                    isLoadingRef.current = false;
                    setIsExploreDataLoading(false);
                })
                .catch((error) => {
                    isLoadingRef.current = false;
                    setIsExploreDataLoading(false);
                });
        };
        search && fetchAllData();
    }, [search, startDate, endDate, sortBy.method, sortBy.name]);

    const handleDownloadCsv = async () => {
        const ordered_by = sortBy.name === undefined ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;
        const value = apiRequestBody(startDate, endDate, timeZone);

        await fetchExploreBuildingList(
            value,
            '',
            ordered_by,
            sort_by,
            minConValue,
            maxConValue,
            minPerValue,
            maxPerValue,
            minSqftValue,
            maxSqftValue,
            [],
            '',
            '',
            ''
        )
            .then((res) => {
                let responseData = res.data;
                download('Explore_By_Building', getExploreByBuildingTableCSVExport(responseData, headerProps));
            })
            .catch((error) => {});
    };

    const handleBuildingStateChange = (value, build) => {
        if (value === 'true') {
            let arr1 = seriesData.filter(function (item) {
                return item.id !== build?.building_id;
            });
            setSeriesData(arr1);
            setBuildIdNow('');
        }
        if (value === 'false') {
            setBuildIdNow(build?.building_id);
        }
        const isAdding = value === 'false';
        setSelectedIds((prevState) => {
            return isAdding
                ? [...prevState, build.building_id]
                : prevState.filter((buildId) => buildId !== build.building_id);
        });
    };

    useEffect(() => {
        if (buildIdNow) {
            fetchExploreChartData();
        }
    }, [buildIdNow]);

    const fetchExploreChartData = async (id) => {
        let value = apiRequestBody(startDate, endDate, timeZone);
        await fetchExploreBuildingChart(value, buildIdNow)
            .then((res) => {
                let responseData = res.data;
                let data = responseData.data;
                let arr = [];
                arr = allBuildingList.filter(function (item) {
                    return item.building_id === buildIdNow;
                });
                let NulledData = [];
                data.map((ele) => {
                    if (ele.consumption === '') {
                        NulledData.push({ x: new Date(ele.time_stamp).getTime(), y: null });
                    } else {
                        NulledData.push({ x: new Date(ele.time_stamp).getTime(), y: ele.consumption });
                    }
                });
                let recordToInsert = {
                    name: arr[0]?.building_name,
                    data: NulledData,
                    id: arr[0]?.building_id,
                };
                setSeriesData([...seriesData, recordToInsert]);
            })
            .catch((error) => {});
    };

    const dataarr = [];

    const fetchExploreAllChartData = async (id) => {
        let value = apiRequestBody(startDate, endDate, timeZone);
        await fetchExploreBuildingChart(value, id)
            .then((res) => {
                let responseData = res.data;
                let data = responseData.data;
                let arr = [];
                arr = allBuildingList.filter(function (item) {
                    return item.building_id === id;
                });
                let NulledData = [];
                data.map((ele) => {
                    if (ele.consumption === '') {
                        NulledData.push({ x: new Date(ele.time_stamp).getTime(), y: null });
                    } else {
                        NulledData.push({ x: new Date(ele.time_stamp).getTime(), y: ele.consumption });
                    }
                });
                let recordToInsert = {
                    name: arr[0]?.building_name,
                    data: NulledData,
                    id: arr[0]?.building_id,
                };
                dataarr.push(recordToInsert);
                if (selectedIds.length === dataarr.length) {
                    setSeriesData(dataarr);
                }
            })
            .catch((error) => {});
    };

    useEffect(() => {
        if (selectedAllBuildingId.length === 1) {
            fetchExploreAllChartData(selectedAllBuildingId[0]);
        } else {
            selectedAllBuildingId.map((ele) => {
                fetchExploreAllChartData(ele);
            });
        }
    }, [selectedAllBuildingId]);

    useEffect(() => {
        if (allBuildingData.length === 0) {
            return;
        }
        setSeriesData(allBuildingData);
    }, [allBuildingData]);

    const headerProps = [
        {
            name: 'Name',
            accessor: 'building_name',
            callbackValue: renderBuildingName,
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
            name: 'Square Footage',
            accessor: 'square_footage',
            callbackValue: renderSquareFootage,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Building Type',
            accessor: 'building_type',
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    return (
        <>
            <Row className="ml-2 mr-2 explore-filters-style">
                <Header title="" type="page" />
            </Row>

            <Row>
                <div className="explore-data-table-style p-2 mb-2">
                    {isExploreChartDataLoading ? (
                        <div className="loader-center-style" style={{ height: '25rem' }}></div>
                    ) : (
                        <>
                            <ExploreChart
                                title={''}
                                subTitle={''}
                                tooltipUnit="KWh"
                                tooltipLabel="Energy Consumption"
                                data={seriesData}
                                dateRange={fetchDateRange(startDate, endDate)}
                            />
                        </>
                    )}
                </div>
            </Row>

            <Row>
                <div className="explore-data-table-style">
                    <Col lg={12}>
                        <DataTableWidget
                            isLoading={isExploreDataLoading}
                            isLoadingComponent={<SkeletonLoading />}
                            id="explore-by-building"
                            onSearch={setSearch}
                            buttonGroupFilterOptions={[]}
                            onStatus={setSelectedBuildingFilter}
                            rows={currentRow()}
                            searchResultRows={currentRowSearched()}
                            filterOptions={filterOptions}
                            onDownload={() => handleDownloadCsv()}
                            headers={headerProps}
                            customCheckAll={() => (
                                <Checkbox
                                    label=""
                                    type="checkbox"
                                    id="building1"
                                    name="building1"
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
                                    id="building_check"
                                    name="building_check"
                                    checked={selectedIds.includes(record?.building_id) || checkedAll}
                                    value={selectedIds.includes(record?.building_id) || checkedAll ? true : false}
                                    onChange={(e) => {
                                        handleBuildingStateChange(e.target.value, record);
                                    }}
                                />
                            )}
                            totalCount={(() => {
                                if (search) {
                                    return totalItemsSearched;
                                }
                                if (selectedBuildingFilter === 0) {
                                    return totalItems;
                                }

                                return 0;
                            })()}
                        />
                    </Col>
                </div>
            </Row>
        </>
    );
};

export default ExploreByBuildings;
