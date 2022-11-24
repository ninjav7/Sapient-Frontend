import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import BrushChart from '../charts/BrushChart';
import { fetchExploreBuildingList, fetchExploreBuildingChart } from '../explore/services';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { getFormattedTimeIntervalData } from '../../helpers/formattedChartData';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { BuildingStore } from '../../store/BuildingStore';
import { selectedBuilding, totalSelectionBuildingId } from '../../store/globalState';
import { useAtom } from 'jotai';
import './style.css';
import 'moment-timezone';
import { timeZone } from '../../utils/helper';
import Header from '../../components/Header';
import { xaxisFilters } from '../../helpers/explorehelpers';
import { options, optionsLines } from '../../helpers/ChartOption';
import { apiRequestBody } from '../../helpers/helpers';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../sharedComponents/form/checkbox';
import Brick from '../../sharedComponents/brick';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
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
        </tr>
    </SkeletonTheme>
);


const ExploreByBuildings = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    // New Refactor Declarations
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
    const [checkedAll, setCheckedAll] = useState(false);
    const [buildIdNow, setBuildIdNow] = useState('');
    const history = useHistory();

    const [buildingIdSelection] = useAtom(selectedBuilding);
    const [totalBuildingId] = useAtom(totalSelectionBuildingId);

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);
    const [isExploreChartDataLoading, setIsExploreChartDataLoading] = useState(false);
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    const [seriesData, setSeriesData] = useState([]);
    const [allBuildingData, setAllBuildingData] = useState([]);

    const [optionsData, setOptionsData] = useState(options);
    const [seriesLineData, setSeriesLineData] = useState([]);
    const [optionsLineData, setOptionsLineData] = useState(optionsLines);

    let entryPoint = '';
    const [topEnergyConsumption, setTopEnergyConsumption] = useState(1);
    const [buildingSearchTxt, setBuildingSearchTxt] = useState('');
    const [selectedAllBuildingId, setSelectedAllBuildingId] = useState([]);

    useEffect(() => {
        entryPoint = 'entered';
    }, []);


    useEffect(() => {
        if (buildingIdSelection && totalBuildingId?.length >= 1) {
            let arr = [];
            for (let i = 0; i < totalBuildingId?.length; i++) {
                arr.push(totalBuildingId[i]);
            }
            setSeriesData([]);
            setSeriesLineData([]);
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
        const ordered_by = sortBy.name === undefined ? "consumption" : sortBy.name;
        const sort_by = sortBy.method === undefined ? "dce" : sortBy.method;
        isLoadingRef.current = true;
        setIsExploreDataLoading(true);
        const value = apiRequestBody(startDate, endDate, timeZone);
        await fetchExploreBuildingList(value, search, ordered_by, sort_by)
            .then((res) => {
                if (entryPoint === 'entered') {
                    totalBuildingId.length = 0;
                    setSeriesData([]);
                    setSeriesLineData([]);
                }
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


    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        exploreDataFetch();
    }, [
        startDate,
        endDate,
        sortBy.method,
        sortBy.name,
    ]);


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
        return allBuildingList.filter(({ building_id }) => !selectedIds.find((blgd) => blgd === building_id
        ));
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
        return (<div style={{ fontSize: 0 }}>
            <a className="typography-wrapper link" onClick={() => {
                redirectToExploreEquipPage(
                    row?.building_id,
                    row?.building_name,
                    row?.timezone
                );
            }}>
                {row.building_name}
            </a>
            <Brick sizeInPixels={3} />
        </div>);
    }

    const renderSquareFootage = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row.square_footage} Sq.Ft.</Typography.Body>;
    };

    const renderConsumption = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>{Math.round(row.consumption.now / 1000)} kWh</Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={Math.round((row.consumption.now / topEnergyConsumption) * 100)} />
            </>);
    };

    const renderPerChange = (row) => {
        return <TrendsBadge value={Math.abs(Math.round(row.consumption.change))} type={row?.consumption?.now < row?.consumption?.old ? TrendsBadge.Type.DOWNWARD_TREND : TrendsBadge.Type.UPWARD_TREND} />;
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
            const ordered_by = sortBy.name === undefined ? "consumption" : sortBy.name;
            const sort_by = sortBy.method === undefined ? "dce" : sortBy.method;

            isLoadingRef.current = true;
            setIsExploreDataLoading(true);
            const value = apiRequestBody(startDate, endDate, timeZone);
            await fetchExploreBuildingList(value, search, ordered_by, sort_by)
                .then((res) => {
                    if (entryPoint === 'entered') {
                        totalBuildingId.length = 0;
                        setSeriesData([]);
                        setSeriesLineData([]);
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

    }, [
        search,
        startDate,
        endDate,
        sortBy.method,
        sortBy.name,
    ]);

    const handleBuildingStateChange = (value, build) => {
        if (value === 'true') {
            let arr1 = seriesData.filter(function (item) {
                return item.id !== build?.building_id;
            });
            setSeriesData(arr1);
            setSeriesLineData(arr1);
        }
        if (value === 'false') {
            setBuildIdNow(build?.building_id);
        }
        const isAdding = value === 'false';
        setSelectedIds((prevState) => {
            return isAdding ? [...prevState, build.building_id] : prevState.filter((buildId) => buildId !== build.building_id);
        });
    };

    useEffect(() => {
        if (buildIdNow) {
            fetchExploreChartData()
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
                const formattedData = getFormattedTimeIntervalData(data, startDate, endDate);
                let recordToInsert = {
                    name: arr[0].building_name,
                    data: formattedData,
                    id: arr[0].building_id,
                };
                setSeriesData([...seriesData, recordToInsert]);
                setSeriesLineData([...seriesLineData, recordToInsert]);
            })
            .catch((error) => { });
    };

    const dataarr = [];

    const fetchExploreAllChartData = async (id) => {
        let value = apiRequestBody(startDate, endDate, timeZone);
        await fetchExploreBuildingChart(value, id)
            .then((res) => {
                let responseData = res.data;
                let data = responseData.data;
                let arr = [];
                const formattedData = getFormattedTimeIntervalData(data, startDate, endDate);
                let recordToInsert = {
                    name: arr[0].building_name,
                    data: formattedData,
                    id: arr[0].building_id,
                };
                dataarr.push(recordToInsert);
                if (selectedAllBuildingId.length === dataarr.length) {
                    setSeriesData(dataarr);
                    setSeriesLineData(dataarr);
                }
                setAllBuildingData(dataarr);
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
        setSeriesLineData(allBuildingData);
    }, [allBuildingData]);

    useEffect(() => {
        let xaxisObj = xaxisFilters(daysCount, timeZone);
        let xaxisLineObj = {
            type: 'datetime',
            labels: {
                show:false,
            },
        }
        setOptionsData({ ...optionsData, xaxis: xaxisObj });
        setOptionsLineData({ ...optionsLineData, xaxis: xaxisLineObj });
    }, [daysCount]);

    const getCSVLinkData = () => {
    //     let sData = [];
    //     exploreTableData.map(function (obj) {
    //         let change = percentageHandler(obj.consumption.now, obj.consumption.old) + '%';
    //         sData.push([
    //             obj.building_name,
    //             (obj.consumption.now / 1000).toFixed(2) + 'kWh',
    //             change,
    //             obj.square_footage + ' sq.ft.',
    //             obj.building_type,
    //         ]);
    //     });
    //     let streamData = exploreTableData.length > 0 ? sData : [];
    //     return [['Name', 'Energy Consumption', '% Change', 'Square Footage', 'Building Type'], ...streamData];
    };

    useEffect(() => {
        if (buildingSearchTxt === '' && entryPoint !== 'entered') exploreDataFetch();
    }, [buildingSearchTxt]);
    return (
        <>
            <Row className="ml-2 mr-2 explore-filters-style">
                <Header title="" type="page" />
            </Row>

            <Row>
                <div className="explore-data-table-style">
                    {isExploreChartDataLoading ? (
                        <div className="loader-center-style" style={{ height: '25rem' }}>
                        </div>
                    ) : (
                        <>
                            <BrushChart
                                seriesData={seriesData}
                                optionsData={optionsData}
                                seriesLineData={seriesLineData}
                                optionsLineData={optionsLineData}
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
                            onSearch={(query) => {
                                setSearch(query);
                            }}
                            buttonGroupFilterOptions={[]}
                            onStatus={setSelectedBuildingFilter}
                            rows={currentRow()}
                            searchResultRows={currentRowSearched()}
                            filterOptions={[]}
                            onDownload={(query) => {
                                getCSVLinkData(query);
                            }}
                            headers={[
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
                            ]}
                            onCheckboxRow={alert}
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
