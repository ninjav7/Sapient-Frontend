import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import { fetchExploreEquipmentList, fetchExploreEquipmentChart, fetchExploreFilter } from '../explore/services';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import EquipChartModal from '../chartModal/EquipChartModal';
import Header from '../../components/Header';
import { getExploreByEquipmentTableCSVExport } from '../../utils/tablesExport';
import { buildingData, selectedEquipment, totalSelectionEquipmentId } from '../../store/globalState';
import { useAtom } from 'jotai';
import {
    apiRequestBody,
    dateTimeFormatForHighChart,
    formatXaxisForHighCharts,
    pageListSizes,
} from '../../helpers/helpers';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../sharedComponents/form/checkbox';
import Brick from '../../sharedComponents/brick';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import Typography from '../../sharedComponents/typography';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import ExploreChart from '../../sharedComponents/exploreChart/ExploreChart';
import { getAverageValue } from '../../helpers/AveragePercent';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import Select from '../../sharedComponents/form/select';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { UserStore } from '../../store/UserStore';
import { Badge } from '../../sharedComponents/badge';
import { isEmptyObject } from './utils';
import './style.css';

const SkeletonLoading = ({ noofRows }) => {
    const rowArray = Array.from({ length: noofRows });

    return (
        <SkeletonTheme color="$primary-gray-1000" height={35}>
            <tr>
                {rowArray.map((_, index) => (
                    <th key={index}>
                        <Skeleton count={5} />
                    </th>
                ))}
            </tr>
        </SkeletonTheme>
    );
};

const ExploreByEquipment = () => {
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);

    const [equpimentIdSelection] = useAtom(selectedEquipment);
    const [totalEquipmentId] = useAtom(totalSelectionEquipmentId);

    const { download } = useCSVDownload();
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
    const topCon = useRef('');

    const bldgName = BuildingStore.useState((s) => s.BldgName);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [isFilterFetching, setFetchingFilters] = useState(false);
    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    const [seriesData, setSeriesData] = useState([]);
    let entryPoint = '';
    let top = '';

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

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

    const [conAPIFlag, setConAPIFlag] = useState('');
    const [minConValue, set_minConValue] = useState(0);
    const [maxConValue, set_maxConValue] = useState(0);

    const [perAPIFlag, setPerAPIFlag] = useState('');
    const [minPerValue, set_minPerValue] = useState(0);
    const [maxPerValue, set_maxPerValue] = useState(0);

    const [selectedEquipType, setSelectedEquipType] = useState([]);
    const [selectedEndUse, setSelectedEndUse] = useState([]);
    const [selectedSpaceType, setSelectedSpaceType] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedPanels, setSelectedPanels] = useState([]);
    const [selectedBreakers, setSelectedBreakers] = useState([]);
    const [selectedNotes, setSelectedNotes] = useState([]);

    const [topVal, setTopVal] = useState(0);
    const [bottomVal, setBottomVal] = useState(0);
    const [currentButtonId, setCurrentButtonId] = useState(0);
    const [isopened, setIsOpened] = useState(false);
    const [filtersValues, setFiltersValues] = useState({});

    const [exploreTableData, setExploreTableData] = useState([]);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState(1);
    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [selectedModalTab, setSelectedModalTab] = useState(0);
    const [selectedAllEquipmentId, setSelectedAllEquipmentId] = useState([]);

    const metric = [
        { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy Consumption' },
        { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power Consumption' },
        { value: 'rmsCurrentMilliAmps', label: 'Current (A)', unit: 'A', Consumption: 'Current Consumption' },
    ];
    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0].Consumption);
    const [selectedConsumption, setConsumption] = useState(metric[0].value);

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
    };

    const handleConsumptionChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedConsumptionLabel(obj.Consumption);
    };

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

    const fetchAveragePercentage = (con) => {
        return getAverageValue(con / 1000, bottomConsumption, topCon.current / 1000);
    };

    const renderConsumption = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {Math.round(row.consumption.now / 1000)} kWh
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={fetchAveragePercentage(row.consumption.now)} />
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

    const renderBreakers = useCallback((row) => {
        return (
            <div className="breakers-row-content">
                {row?.breaker_number.length === 0 ? (
                    <Typography.Body>-</Typography.Body>
                ) : (
                    <Badge text={<span className="gray-950">{row?.breaker_number.join(', ')}</span>} />
                )}
            </div>
        );
    });

    const renderTags = useCallback((row) => {
        const slicedArr = row?.tags.slice(1);
        return (
            <div className="tags-row-content">
                <Badge text={<span className="gray-950">{row?.tags[0] ? row?.tags[0] : 'none'}</span>} />
                {slicedArr?.length > 0 ? (
                    <>
                        <Badge
                            text={
                                <span className="gray-950" id={`tags-badge-${row?.equipments_id}`}>
                                    +{slicedArr.length} more
                                </span>
                            }
                        />
                        <UncontrolledTooltip
                            placement="top"
                            target={`tags-badge-${row.equipments_id}`}
                            className="tags-tooltip">
                            {slicedArr.map((el) => {
                                return <Badge text={<span className="gray-950">{el}</span>} />;
                            })}
                        </UncontrolledTooltip>
                    </>
                ) : null}
            </div>
        );
    });

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

    const fetchExploreChartData = async () => {
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
                if (selectedConsumption === 'rmsCurrentMilliAmps') {
                    NulledData = seriesData;
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

                        NulledData.push(recordToInsert);
                    }

                    setSeriesData(NulledData);
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
                    setSeriesData([...seriesData, recordToInsert]);
                }

                setSelectedEquipmentId('');
            })
            .catch((error) => {});
    };

    const dataarr = [];
    let ct = 0;

    const fetchExploreAllChartData = async (id) => {
        const payload = apiRequestBody(startDate, endDate, timeZone);
        const params = `?building_id=${bldgId}&consumption=${
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

                        dataarr.push(recordToInsert);
                    }

                    if (selectedIds.length === ct) {
                        setSeriesData(dataarr);
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
                    };
                    dataarr.push(recordToInsert);
                    if (selectedIds.length === dataarr.length) {
                        setSeriesData(dataarr);
                    }
                }
            })
            .catch((error) => {});
    };

    const handleDownloadCsv = async () => {
        const ordered_by = sortBy.name === undefined ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;

        await fetchExploreEquipmentList(startDate, endDate, timeZone, bldgId, ordered_by, sort_by)
            .then((res) => {
                const { data } = res?.data;
                if (data.length !== 0) {
                    download(
                        `${bldgName}_Explore_By_Equipment_${new Date().toISOString().split('T')[0]}`,
                        getExploreByEquipmentTableCSVExport(data, headerProps)
                    );
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'CSV export completed successfully.';
                        s.notificationType = 'success';
                    });
                }
            })
            .catch((error) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Data failed to export in CSV.';
                    s.notificationType = 'error';
                });
            });
    };

    const fetchExploreEquipDataOnPageLoad = async () => {
        setIsExploreDataLoading(true);
        const ordered_by = sortBy.name === undefined || sortBy.method === null ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;
        setAllEquipmentList([]);

        await fetchExploreEquipmentList(
            startDate,
            endDate,
            timeZone,
            bldgId,
            ordered_by,
            sort_by,
            pageSize,
            pageNo,
            search,
            selectedEquipType,
            selectedEndUse,
            selectedSpaceType,
            selectedTags,
            selectedPanels,
            selectedBreakers,
            selectedNotes,
            conAPIFlag,
            minConValue,
            maxConValue,
            perAPIFlag,
            minPerValue,
            maxPerValue
        )
            .then((res) => {
                const { data, total_data } = res?.data;
                if (data) {
                    if (data.length !== 0) {
                        if (entryPoint === 'entered') {
                            totalEquipmentId.length = 0;
                            setSeriesData([]);
                        }
                        setTopEnergyConsumption(data[0]?.consumption?.now);
                        topCon.current = data[0]?.consumption?.now;
                        top = data[0]?.consumption?.now;
                    }
                    setExploreTableData(data);
                    setAllEquipmentList(data);
                    if (total_data) setTotalItems(total_data);
                    setTotalItemsSearched(data.length);
                    setAllSearchData(data);
                }
            })
            .catch((error) => {})
            .finally(() => {
                setIsExploreDataLoading(false);
            });
    };

    const fetchFilterDataOnPageLoad = async () => {
        setFetchingFilters(true);
        await fetchExploreFilter(
            startDate,
            endDate,
            timeZone,
            bldgId,
            selectedEquipType,
            selectedEndUse,
            selectedSpaceType,
            selectedTags,
            selectedPanels,
            selectedBreakers,
            selectedNotes,
            conAPIFlag,
            minConValue,
            maxConValue,
            perAPIFlag,
            minPerValue,
            maxPerValue
        )
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    const { data } = response;
                    setTopVal(Math.round(data?.max_change === data?.min_change ? data?.max_change : data?.max_change));
                    setBottomVal(Math.round(data?.min_change));
                    setTopConsumption(Math.abs(Math.round(data?.max_consumption / 1000)));
                    setBottomConsumption(Math.abs(Math.round(data?.min_consumption / 1000)));
                    setTopPerChange(
                        Math.round(data?.max_change === data?.min_change ? data?.max_change : data?.max_change)
                    );
                    setNeutralPerChange(Math.round(data?.neutral_change));
                    setBottomPerChange(Math.round(data?.min_change));
                    set_minConValue(Math.abs(Math.round(data?.min_consumption / 1000)));
                    set_maxConValue(Math.abs(Math.round(data?.max_consumption / 1000)));
                    set_minPerValue(Math.round(data?.min_change));
                    set_maxPerValue(
                        Math.round(data?.max_change === data?.min_change ? data?.max_change : data?.max_change)
                    );
                    if (data) setFilterData(data);
                } else {
                    setFilterData({});
                    setFilterOptions([]);
                    set_minConValue(0);
                    set_maxConValue(0);
                    set_minPerValue(0);
                    set_maxPerValue(0);
                }
            })
            .catch((e) => {
                setFilterData({});
                setFilterOptions([]);
                set_minConValue(0);
                set_maxConValue(0);
                set_minPerValue(0);
                set_maxPerValue(0);
            })
            .finally(() => {
                setFetchingFilters(false);
            });
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
        {
            name: 'Tags',
            accessor: 'tags',
            callbackValue: renderTags,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Panel Name',
            accessor: 'panel',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Breakers',
            accessor: 'breaker_number',
            callbackValue: renderBreakers,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Notes',
            accessor: 'note',
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    useEffect(() => {
        entryPoint = 'entered';
        updateBreadcrumbStore();
        localStorage.removeItem('explorer');
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (bldgId) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
        }
        if (entryPoint !== 'entered') {
            setFiltersValues({
                selectedFilters: [],
            });
            setSeriesData([]);
            setConAPIFlag('');
            setPerAPIFlag('');
            setSelectedIds([]);
            setSelectedEndUse([]);
            setSelectedEquipType([]);
            setSelectedSpaceType([]);
            setSelectedTags([]);
            setSelectedPanels([]);
            setSelectedBreakers([]);
            setSelectedNotes([]);
        }
    }, [bldgId]);

    useEffect(() => {
        if (!bldgId || startDate === null || endDate === null) return;

        fetchExploreEquipDataOnPageLoad();
    }, [
        startDate,
        endDate,
        bldgId,
        search,
        sortBy,
        pageSize,
        pageNo,
        selectedEquipType,
        selectedEndUse,
        selectedSpaceType,
        selectedTags,
        selectedPanels,
        selectedBreakers,
        selectedNotes,
        conAPIFlag,
        // minConValue,
        // maxConValue,
        perAPIFlag,
        // minPerValue,
        // maxPerValue,
    ]);

    useEffect(() => {
        if (!bldgId || startDate === null || endDate === null) return;

        fetchFilterDataOnPageLoad();
    }, [
        startDate,
        endDate,
        bldgId,
        selectedEquipType,
        selectedEndUse,
        selectedSpaceType,
        selectedTags,
        selectedPanels,
        selectedBreakers,
        selectedNotes,
        conAPIFlag,
        // minConValue,
        // maxConValue,
        perAPIFlag,
        // minPerValue,
        // maxPerValue,
    ]);

    useEffect(() => {
        if (!isEmptyObject(filterData)) {
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
                {
                    label: 'Equipment Type',
                    value: 'equipments_type',
                    placeholder: 'All Equipment Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterData?.equipments_type.map((filterItem) => ({
                        value: filterItem?.equipment_type_id,
                        label: filterItem?.equipment_type_name,
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
                    filterOptions: filterData?.end_users.map((filterItem) => ({
                        value: filterItem?.end_use_id,
                        label: filterItem?.end_use_name,
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
                    filterOptions: filterData?.location_types.map((filterItem) => ({
                        value: filterItem?.location_type_id,
                        label: filterItem?.location_types_name,
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
                {
                    label: 'Tags',
                    value: 'tags',
                    placeholder: 'All tags',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterData?.tags.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let tags = [];
                            for (let i = 0; i < opt.length; i++) {
                                tags.push(opt[i].value);
                            }
                            setSelectedTags(tags);
                        }
                    },
                    onDelete: () => {
                        setSelectedTags([]);
                    },
                },
                {
                    label: 'Panel Name',
                    value: 'panel',
                    placeholder: 'All Panels',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterData?.panel.map((filterItem) => ({
                        value: filterItem?.panel_id,
                        label: filterItem?.panel_name,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let panels = [];
                            for (let i = 0; i < opt.length; i++) {
                                panels.push(opt[i].value);
                            }
                            setSelectedPanels(panels);
                        }
                    },
                    onDelete: () => {
                        setSelectedPanels([]);
                    },
                },
                {
                    label: 'Breakers',
                    value: 'breaker_number',
                    placeholder: 'All Breakers',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterData?.breaker_number.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let breakers_count = [];
                            for (let i = 0; i < opt.length; i++) {
                                breakers_count.push(opt[i].value);
                            }
                            setSelectedBreakers(breakers_count);
                        }
                    },
                    onDelete: () => {
                        setSelectedBreakers([]);
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        }
    }, [filterData]);

    useEffect(() => {
        top = '';
        topCon.current = '';
        if (selectedIds?.length >= 1) {
            let arr = [];
            for (let i = 0; i < selectedIds?.length; i++) {
                arr.push(selectedIds[i]);
            }
            setSeriesData([]);
            setSelectedAllEquipmentId(arr);
        } else {
            setSelectedEquipmentId('');
        }
    }, [startDate, endDate, selectedConsumption]);

    useEffect(() => {
        if (equipIdNow) fetchExploreChartData(equipIdNow);
    }, [equipIdNow]);

    // useEffect(() => {
    //     if (
    //         conAPIFlag !== '' ||
    //         perAPIFlag !== '' ||
    //         (minConValue !== maxConValue && maxConValue !== 0) ||
    //         (minPerValue !== maxPerValue && maxPerValue !== 0)
    //     ) {
    //         (async () => {
    //             setFetchingFilters(true);
    //             const filters = await fetchExploreFilter(
    //                 bldgId,
    //                 startDate,
    //                 endDate,
    //                 timeZone,
    //                 selectedLocation,
    //                 selectedEquipType,
    //                 selectedEndUse,
    //                 selectedSpaceType,
    //                 minConValue,
    //                 maxConValue,
    //                 conAPIFlag,
    //                 selectedTags,
    //                 selectedPanels,
    //                 selectedBreakers,
    //                 selectedNotes
    //             );

    //             const filterOptionsFetched = [
    //                 {
    //                     label: 'Energy Consumption',
    //                     value: 'consumption',
    //                     placeholder: 'All Consumptions',
    //                     filterType: FILTER_TYPES.RANGE_SELECTOR,
    //                     filterOptions: [minConValue, maxConValue],
    //                     componentProps: {
    //                         prefix: ' kWh',
    //                         title: 'Consumption',
    //                         min: bottomConsumption,
    //                         max: topConsumption + 1,
    //                         range: [minConValue, maxConValue],
    //                         withTrendsFilter: false,
    //                     },
    //                     onClose: async function onClose(options) {
    //                         set_minConValue(options[0]);
    //                         set_maxConValue(options[1]);
    //                         setPageNo(1);
    //                         setConAPIFlag(options[0] + options[1]);
    //                     },
    //                     onDelete: () => {
    //                         set_minConValue(bottomConsumption);
    //                         set_maxConValue(topConsumption);
    //                         setConAPIFlag('');
    //                     },
    //                 },
    //                 {
    //                     label: '% Change',
    //                     value: 'change',
    //                     placeholder: 'All % Change',
    //                     filterType: FILTER_TYPES.RANGE_SELECTOR,
    //                     filterOptions: [minPerValue, maxPerValue],
    //                     componentProps: {
    //                         prefix: ' %',
    //                         title: '% Change',
    //                         min: bottomVal,
    //                         max: topVal + 1,
    //                         range: [minPerValue, maxPerValue],
    //                         withTrendsFilter: true,
    //                         currentButtonId: currentButtonId,
    //                         handleButtonClick: function handleButtonClick() {
    //                             for (
    //                                 var _len = arguments.length, args = new Array(_len), _key = 0;
    //                                 _key < _len;
    //                                 _key++
    //                             ) {
    //                                 args[_key] = arguments[_key];
    //                                 if (args[0] === 0) {
    //                                     setIsOpened(true);
    //                                     setCurrentButtonId(0);
    //                                     set_minPerValue(bottomPerChange);
    //                                     set_maxPerValue(topPerChange);
    //                                     setBottomVal(bottomPerChange);
    //                                     setTopVal(topPerChange);
    //                                 }
    //                                 if (args[0] === 1) {
    //                                     setIsOpened(true);
    //                                     setCurrentButtonId(1);
    //                                     if (bottomPerChange < 0) {
    //                                         setBottomVal(bottomPerChange);
    //                                         setTopVal(neutralPerChange);
    //                                         set_minPerValue(bottomPerChange);
    //                                         set_maxPerValue(neutralPerChange);
    //                                     } else if (bottomPerChange >= 0) {
    //                                         setBottomVal(neutralPerChange);
    //                                         setTopVal(neutralPerChange + 1);
    //                                         set_minPerValue(neutralPerChange);
    //                                         set_maxPerValue(neutralPerChange);
    //                                     }
    //                                 }
    //                                 if (args[0] === 2) {
    //                                     setIsOpened(true);
    //                                     setCurrentButtonId(2);
    //                                     if (topPerChange > 0) {
    //                                         setBottomVal(neutralPerChange);
    //                                         setTopVal(topPerChange);
    //                                         set_minPerValue(neutralPerChange);
    //                                         set_maxPerValue(topPerChange);
    //                                     } else if (bottomPerChange >= 0) {
    //                                         setBottomVal(neutralPerChange);
    //                                         setTopVal(neutralPerChange + 1);
    //                                         set_minPerValue(neutralPerChange);
    //                                         set_maxPerValue(neutralPerChange);
    //                                     }
    //                                 }
    //                             }
    //                         },
    //                     },
    //                     isOpened: isopened,
    //                     onClose: function onClose(options) {
    //                         setIsOpened(false);
    //                         set_minPerValue(options[0]);
    //                         set_maxPerValue(options[1]);
    //                         setPageNo(1);
    //                         setPerAPIFlag(options[0] + options[1]);
    //                     },
    //                     onDelete: () => {
    //                         set_minPerValue(bottomPerChange);
    //                         set_maxPerValue(topPerChange);
    //                         setPerAPIFlag('');
    //                     },
    //                 },
    //                 {
    //                     label: 'Equipment Type',
    //                     value: 'equipments_type',
    //                     placeholder: 'All Equipment Types',
    //                     filterType: FILTER_TYPES.MULTISELECT,
    //                     filterOptions: filters.data.data.equipments_type.map((filterItem) => ({
    //                         value: filterItem.equipment_type_id,
    //                         label: filterItem.equipment_type_name,
    //                     })),
    //                     onChange: function onChange(options) {},
    //                     onClose: (options) => {
    //                         let opt = options;
    //                         if (opt.length !== 0) {
    //                             let equipIds = [];
    //                             for (let i = 0; i < opt.length; i++) {
    //                                 equipIds.push(opt[i].value);
    //                             }
    //                             setPageNo(1);
    //                             setSelectedEquipType(equipIds);
    //                         }
    //                     },
    //                     onDelete: (options) => {
    //                         setSelectedEquipType([]);
    //                     },
    //                 },
    //                 {
    //                     label: 'End Uses',
    //                     value: 'end_users',
    //                     placeholder: 'All End Uses',
    //                     filterType: FILTER_TYPES.MULTISELECT,
    //                     filterOptions: filterData.end_users.map((filterItem) => ({
    //                         value: filterItem.end_use_id,
    //                         label: filterItem.end_use_name,
    //                     })),
    //                     onClose: (options) => {
    //                         let opt = options;
    //                         if (opt.length !== 0) {
    //                             let endUseIds = [];
    //                             for (let i = 0; i < opt.length; i++) {
    //                                 endUseIds.push(opt[i].value);
    //                             }
    //                             setPageNo(1);
    //                             setSelectedEndUse(endUseIds);
    //                         }
    //                     },
    //                     onDelete: () => {
    //                         setSelectedEndUse([]);
    //                     },
    //                 },
    //                 {
    //                     label: 'Space Type',
    //                     value: 'location_types',
    //                     placeholder: 'All Space Types',
    //                     filterType: FILTER_TYPES.MULTISELECT,
    //                     filterOptions: filters?.data?.data?.location_types.map((filterItem) => ({
    //                         value: filterItem?.location_type_id,
    //                         label: filterItem?.location_types_name,
    //                     })),
    //                     onClose: (options) => {
    //                         let opt = options;
    //                         if (opt.length !== 0) {
    //                             let spaceIds = [];
    //                             for (let i = 0; i < opt.length; i++) {
    //                                 spaceIds.push(opt[i].value);
    //                             }
    //                             setPageNo(1);
    //                             setSelectedSpaceType(spaceIds);
    //                         }
    //                     },
    //                     onDelete: () => {
    //                         setSelectedSpaceType([]);
    //                     },
    //                 },
    //                 {
    //                     label: 'Tags',
    //                     value: 'tags',
    //                     placeholder: 'All tags',
    //                     filterType: FILTER_TYPES.MULTISELECT,
    //                     filterOptions: filters?.data?.data?.tags.map((filterItem) => ({
    //                         value: filterItem,
    //                         label: filterItem,
    //                     })),
    //                     onClose: (options) => {
    //                         let opt = options;
    //                         if (opt.length !== 0) {
    //                             let tags = [];
    //                             for (let i = 0; i < opt.length; i++) {
    //                                 tags.push(opt[i].value);
    //                             }
    //                             setSelectedTags(tags);
    //                         }
    //                     },
    //                     onDelete: () => {
    //                         setSelectedTags([]);
    //                     },
    //                 },
    //                 {
    //                     label: 'Panel Name',
    //                     value: 'panel',
    //                     placeholder: 'All Panels',
    //                     filterType: FILTER_TYPES.MULTISELECT,
    //                     filterOptions: filters?.data?.data?.panel.map((filterItem) => ({
    //                         value: filterItem?.panel_id,
    //                         label: filterItem?.panel_name,
    //                     })),
    //                     onClose: (options) => {
    //                         let opt = options;
    //                         if (opt.length !== 0) {
    //                             let panels = [];
    //                             for (let i = 0; i < opt.length; i++) {
    //                                 panels.push(opt[i].value);
    //                             }
    //                             setSelectedPanels(panels);
    //                         }
    //                     },
    //                     onDelete: () => {
    //                         setSelectedPanels([]);
    //                     },
    //                 },
    //                 {
    //                     label: 'Breakers',
    //                     value: 'breaker_number',
    //                     placeholder: 'All Breakers',
    //                     filterType: FILTER_TYPES.MULTISELECT,
    //                     filterOptions: filterData?.breaker_number.map((filterItem) => ({
    //                         value: filterItem,
    //                         label: filterItem,
    //                     })),
    //                     onClose: (options) => {
    //                         let opt = options;
    //                         if (opt.length !== 0) {
    //                             let breakers_count = [];
    //                             for (let i = 0; i < opt.length; i++) {
    //                                 breakers_count.push(opt[i].value);
    //                             }
    //                             setSelectedBreakers(breakers_count);
    //                         }
    //                     },
    //                     onDelete: () => {
    //                         setSelectedBreakers([]);
    //                     },
    //                 },
    //                 // {
    //                 //     label: 'Notes',
    //                 //     value: 'note',
    //                 //     placeholder: 'All Notes',
    //                 //     filterType: FILTER_TYPES.MULTISELECT,
    //                 //     filterOptions: filterData?.notes.map((filterItem) => ({
    //                 //         value: filterItem,
    //                 //         label: filterItem,
    //                 //     })),
    //                 //     onClose: (options) => {
    //                 //         let opt = options;
    //                 //         if (opt.length !== 0) {
    //                 //             let notes = [];
    //                 //             for (let i = 0; i < opt.length; i++) {
    //                 //                 notes.push(opt[i].value);
    //                 //             }
    //                 //             setSelectedNotes(notes);
    //                 //         }
    //                 //     },
    //                 //     onDelete: () => {
    //                 //         setSelectedNotes([]);
    //                 //     },
    //                 // },
    //             ];
    //             setFilterOptions(filterOptionsFetched);
    //             setFetchingFilters(false);
    //         })();
    //     }
    // }, [minConValue, maxConValue, minPerValue, maxPerValue, conAPIFlag, perAPIFlag]);

    useEffect(() => {
        if (selectedEquipmentId !== '') fetchExploreChartData();
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
        if (removeEquipmentId === '') return;
        let arr1 = [];
        arr1 = seriesData.filter(function (item) {
            return item.id !== removeEquipmentId;
        });
        setSeriesData(arr1);
    }, [removeEquipmentId]);

    useEffect(() => {
        if (equipmentListArray.length === 0) return;
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
        if (allEquipmentData.length === 0) return;
        if (allEquipmentData.length === exploreTableData.length) setSeriesData(allEquipmentData);
    }, [allEquipmentData]);

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
                    <ExploreChart
                        title={''}
                        subTitle={''}
                        isLoadingData={false}
                        disableDefaultPlotBands={true}
                        tooltipValuesKey={'{point.y:.1f}'}
                        tooltipUnit={selectedUnit}
                        tooltipLabel={selectedConsumptionLabel}
                        data={seriesData}
                        // dateRange={fetchDateRange(startDate, endDate)}
                        chartProps={{
                            navigator: {
                                outlineWidth: 0,
                                adaptToUpdatedData: false,
                                stickToMax: true,
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
                                type: 'datetime',
                                labels: {
                                    format: formatXaxisForHighCharts(daysCount, userPrefDateFormat, userPrefTimeFormat),
                                },
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
                            tooltip: {
                                xDateFormat: dateTimeFormatForHighChart(userPrefDateFormat, userPrefTimeFormat),
                            },
                        }}
                    />
                </div>
            </Row>

            <Row>
                <div className="explore-data-table-style">
                    <Col lg={12}>
                        <DataTableWidget
                            isLoading={isExploreDataLoading}
                            isLoadingComponent={<SkeletonLoading noofRows={headerProps.length + 1} />}
                            isFilterLoading={isFilterFetching}
                            id="explore-by-equipment"
                            onSearch={setSearch}
                            buttonGroupFilterOptions={[]}
                            onStatus={setSelectedEquipmentFilter}
                            rows={currentRow()}
                            searchResultRows={currentRowSearched()}
                            filterOptions={filterOptions}
                            onDownload={() => handleDownloadCsv()}
                            headers={headerProps}
                            // customExcludedHeaders={['Panel Name', 'Breakers', 'Notes']}
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
                fetchEquipmentData={fetchExploreEquipDataOnPageLoad}
                selectedTab={selectedModalTab}
                setSelectedTab={setSelectedModalTab}
                activePage="explore"
            />
        </>
    );
};

export default ExploreByEquipment;
