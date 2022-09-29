import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { percentageHandler } from '../../utils/helper';
import { BaseUrl, getExploreBuildingList, getExploreBuildingChart } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTableColumns, faDownload } from '@fortawesome/pro-regular-svg-icons';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
import { Spinner } from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Line } from 'rc-progress';
import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory } from 'react-router-dom';
import { ExploreBuildingStore } from '../../store/ExploreBuildingStore';
// import ApexCharts from 'apexcharts';
import RangeSlider from './RangeSlider';
import './style.css';
// import { ConstructionOutlined } from '@mui/icons-material';
import moment from 'moment';
import 'moment-timezone';
import { timeZone } from '../../utils/helper';
import { CSVLink } from 'react-csv';
import Header from '../../components/Header';

const ExploreBuildingsTable = ({
    exploreTableData,
    isExploreDataLoading,
    topEnergyConsumption,
    selectedBuildingId,
    setSelectedBuildingId,
    removeBuildingId,
    setRemovedBuildingId,
    buildingListArray,
    setBuildingListArray,
    selectedOptions,
}) => {
    const history = useHistory();

    const redirectToExploreEquipPage = (bldId, bldName, bldTimeZone) => {
        localStorage.setItem('exploreBldId', bldId);
        localStorage.setItem('exploreBldName', bldName);
        localStorage.setItem('exploreBldTimeZone', bldTimeZone);
        ExploreBuildingStore.update((s) => {
            s.exploreBldId = bldId;
            s.exploreBldName = bldName;
            s.exploreBldTimeZone = bldTimeZone;
        });
        history.push({
            pathname: `/explore-page/by-equipment/${bldId}`,
        });
    };

    const handleSelectionAll = (e) => {
        var ischecked = document.getElementById('selection');
        if (ischecked.checked == true) {
            let arr = [];
            for (var i = 0; i < exploreTableData.length; i++) {
                arr.push(exploreTableData[i].building_id);
                // console.log(arr);

                var checking = document.getElementById(exploreTableData[i].building_id);
                checking.checked = ischecked.checked;
            }
            setBuildingListArray(arr);
        } else {
            for (var i = 0; i < exploreTableData.length; i++) {
                var checking = document.getElementById(exploreTableData[i].building_id);
                checking.checked = ischecked.checked;
            }
            ischecked.checked = ischecked.checked;
        }
    };

    const handleSelection = (e, id) => {
        var isChecked = document.getElementById(id);
        if (isChecked.checked == true) {
            // console.log(id);
            setSelectedBuildingId(id);
        } else {
            setRemovedBuildingId(id);
        }
    };

    return (
        <>
            <Card>
                <CardBody>
                    <Col md={6}>
                        <Table className="mb-0 bordered mouse-pointer">
                            <thead>
                                <tr>
                                    <th className="table-heading-style">
                                        <input
                                            type="checkbox"
                                            className="mr-4"
                                            id="selection"
                                            onClick={(e) => {
                                                handleSelectionAll(e);
                                            }}
                                        />
                                        Name
                                    </th>
                                    <th className="table-heading-style">Energy Consumption</th>
                                    <th className="table-heading-style">% Change</th>
                                    <th className="table-heading-style">Square Footage</th>
                                    <th className="table-heading-style">Building Type</th>
                                </tr>
                            </thead>

                            {isExploreDataLoading ? (
                                <tbody>
                                    <SkeletonTheme color="#202020" height={35}>
                                        <tr>
                                            <td>
                                                <Skeleton count={5} />
                                            </td>

                                            <td>
                                                <Skeleton count={5} />
                                            </td>

                                            <td>
                                                <Skeleton count={5} />
                                            </td>
                                            <td>
                                                <Skeleton count={5} />
                                            </td>
                                            <td>
                                                <Skeleton count={5} />
                                            </td>
                                        </tr>
                                    </SkeletonTheme>
                                </tbody>
                            ) : (
                                <tbody>
                                    {!(exploreTableData?.length === 0) &&
                                        exploreTableData?.map((record, index) => {
                                            if (record?.eq_name === null) {
                                                return;
                                            }
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        <div>
                                                            <input
                                                                type="checkbox"
                                                                className="mr-4"
                                                                id={record?.building_id}
                                                                value={record?.building_id}
                                                                onClick={(e) => {
                                                                    handleSelection(e, record?.building_id);
                                                                }}
                                                            />
                                                            <a
                                                                className="building-name"
                                                                onClick={() => {
                                                                    redirectToExploreEquipPage(
                                                                        record?.building_id,
                                                                        record?.building_name,
                                                                        record?.timezone
                                                                    );
                                                                }}>
                                                                {record?.building_name}
                                                            </a>
                                                        </div>
                                                    </th>

                                                    <td className="table-content-style font-weight-bold">
                                                        {(record?.consumption.now / 1000).toFixed(2)} kWh
                                                        <br />
                                                        <div style={{ width: '100%', display: 'inline-block' }}>
                                                            {index === 0 && record?.consumption?.now === 0 && (
                                                                <Line
                                                                    percent={0}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#D14065`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                            {index === 0 && record?.consumption?.now > 0 && (
                                                                <Line
                                                                    percent={parseFloat(
                                                                        (record?.energy_consumption?.now /
                                                                            topEnergyConsumption) *
                                                                            100
                                                                    ).toFixed(2)}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#D14065`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                            {index === 1 && (
                                                                <Line
                                                                    percent={parseFloat(
                                                                        (record?.consumption?.now /
                                                                            topEnergyConsumption) *
                                                                            100
                                                                    ).toFixed(2)}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#DF5775`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                            {index === 2 && (
                                                                <Line
                                                                    percent={parseFloat(
                                                                        (record?.consumption?.now /
                                                                            topEnergyConsumption) *
                                                                            100
                                                                    ).toFixed(2)}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#EB6E87`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                            {index === 3 && (
                                                                <Line
                                                                    percent={parseFloat(
                                                                        (record?.consumption?.now /
                                                                            topEnergyConsumption) *
                                                                            100
                                                                    ).toFixed(2)}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#EB6E87`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                            {index === 4 && (
                                                                <Line
                                                                    percent={parseFloat(
                                                                        (record?.consumption?.now /
                                                                            topEnergyConsumption) *
                                                                            100
                                                                    ).toFixed(2)}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#FC9EAC`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                            {index === 5 && (
                                                                <Line
                                                                    percent={parseFloat(
                                                                        (record?.consumption?.now /
                                                                            topEnergyConsumption) *
                                                                            100
                                                                    ).toFixed(2)}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#FFCFD6`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {record?.consumption?.now <= record?.consumption?.old && (
                                                            <button
                                                                className="button-success text-success btn-font-style"
                                                                style={{ width: 'auto' }}>
                                                                <i className="uil uil-chart-down">
                                                                    <strong>
                                                                        {percentageHandler(
                                                                            record?.consumption?.now,
                                                                            record?.consumption?.old
                                                                        )}
                                                                        %
                                                                    </strong>
                                                                </i>
                                                            </button>
                                                        )}
                                                        {record?.consumption?.now > record?.consumption?.old && (
                                                            <button
                                                                className="button-danger text-danger btn-font-style"
                                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                                <i className="uil uil-arrow-growth">
                                                                    <strong>
                                                                        {percentageHandler(
                                                                            record?.consumption?.now,
                                                                            record?.consumption?.old
                                                                        )}
                                                                        %
                                                                    </strong>
                                                                </i>
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="table-content-style font-weight-bold">
                                                        {record?.square_footage} sq. ft.
                                                    </td>
                                                    <td className="table-content-style font-weight-bold">
                                                        {record?.building_type}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            )}
                        </Table>
                    </Col>
                </CardBody>
            </Card>
        </>
    );
};

const ExploreByBuildings = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));

    const [exploreTableData, setExploreTableData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const tableColumnOptions = [
        { label: 'Energy Consumption', value: 'consumption' },
        { label: 'Change', value: 'change' },
        { label: 'Square Footage', value: 'sq_ft' },
        { label: 'Building Type', value: 'building_type' },
    ];

    const [selectedBuildingOptions, setSelectedBuildingOptions] = useState([]);

    const [buildingTypeOptions, setBuildingTypeOptions] = useState([
        { label: 'Office Building', value: 'office' },
        { label: 'Residential Building', value: 'residential' },
    ]);
    const [buildingTypeOptionsCopy, setBuildingTypeOptionsCopy] = useState([
        { label: 'Office Building', value: 'office' },
        { label: 'Residential Building', value: 'residential' },
    ]);
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);
    const [isExploreChartDataLoading, setIsExploreChartDataLoading] = useState(false);
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    const [removeBuildingId, setRemovedBuildingId] = useState('');
    const [buildingListArray, setBuildingListArray] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [allBuildingData, setAllBuildingData] = useState([]);

    const [optionsData, setOptionsData] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: '1000px',
            toolbar: {
                autoSelected: 'pan',
                show: false,
            },

            animations: {
                enabled: false,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            showForSingleSeries: true,
            showForNullSeries: false,
            showForZeroSeries: true,
            fontSize: '18px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 600,
            itemMargin: {
                horizontal: 30,
                vertical: 20,
            },
        },
        colors: ['#546E7A'],
        stroke: {
            width: 3,
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#3C6DF5', '#12B76A', '#DC6803', '#088AB2', '#EF4444'],
        fill: {
            opacity: 1,
        },
        markers: {
            size: 0,
        },
        animations: {
            enabled: false,
        },
        tooltip: {
            //@TODO NEED?
            // enabled: false,
            shared: false,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            // x: {
            //     show: true,
            //     type: 'datetime',
            //     labels: {
            //         formatter: function ({ series, seriesIndex, dataPointIndex, w }) {
            //             const { seriesX } = w.globals;
            //             const timestamp = new Date(seriesX[0][dataPointIndex]);
            //             return moment(timestamp).tz(timeZone).format('DD/MM - HH:mm');
            //         },
            //     },
            // },
            // y: {
            //     formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
            //         return value ;
            //     },
            // },
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { seriesX } = w.globals;
                const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${series[seriesIndex][dataPointIndex].toFixed(
                            3
                        )} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment.utc(timestamp).format(
                            `MMM D 'YY @ HH:mm A`
                        )}</div>
                    </div>`;
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return moment.utc(timestamp).format('DD/MM - HH:mm');
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value.toFixed(3);
                },
            },
        },
    });

    const [seriesLineData, setSeriesLineData] = useState([]);
    const [optionsLineData, setOptionsLineData] = useState({
        chart: {
            id: 'chart1',
            height: '500px',
            toolbar: {
                show: false,
            },
            animations: {
                enabled: false,
            },
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                // xaxis: {
                //     min: new Date('01 June 2022').getTime(),
                //     max: new Date('02 June 2022').getTime(),
                // },
            },
        },
        legend: {
            show: false,
        },
        colors: ['#3C6DF5', '#12B76A', '#DC6803', '#088AB2', '#EF4444'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.1,
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return moment.utc(timestamp).format('DD/MM - HH:mm');
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value;
                },
            },
            tickAmount: 2,
        },
    });

    const [APIFlag, setAPIFlag] = useState(false);
    const [Sq_FtFlag, setSq_FtFlag] = useState(false);
    const [topEnergyConsumption, setTopEnergyConsumption] = useState(1);
    const [minConValue, set_minConValue] = useState(0.0);
    const [maxConValue, set_maxConValue] = useState(0.0);
    const [minSq_FtValue, set_minSq_FtValue] = useState(0);
    const [maxSq_FtValue, set_maxSq_FtValue] = useState(10);
    const [minPerValue, set_minPerValue] = useState(0);
    const [maxPerValue, set_maxPerValue] = useState(100);
    const [buildingSearchTxt, setBuildingSearchTxt] = useState('');
    const [buildingTypeTxt, setBuildingTypeTxt] = useState('');
    const [consumptionTxt, setConsumptionTxt] = useState('');
    const [sq_ftTxt, setSq_FtTxt] = useState('');

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
            localStorage.setItem('exploreBldId', 'portfolio');
            localStorage.setItem('exploreBldName', 'Portfolio');
            ExploreBuildingStore.update((s) => {
                s.exploreBldId = 'portfolio';
                s.exploreBldName = 'Portfolio';
            });
        };
        updateBreadcrumbStore();
        localStorage.removeItem('explorer');
        let arr = [
            { label: 'Energy Consumption', value: 'consumption' },
            { label: 'Change', value: 'change' },
            // { label: 'Total % change', value: 'total_per' },
            { label: 'Square Footage', value: 'sq_ft' },
            { label: 'Building Type', value: 'load' },
        ];
        // setSelectedOptions(arr);
    }, []);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        let result = [];
        setSeriesData([]);
        setSeriesLineData([]);
        const exploreDataFetch = async () => {
            try {
                setIsExploreDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreBuildingList}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        // console.log(responseData[0]);
                        setSeriesData([]);
                        setSeriesLineData([]);
                        setExploreTableData(responseData);
                        // console.log('Consumption ', (responseData[0].consumption.now / 1000).toFixed(3));
                        setTopEnergyConsumption(responseData[0].consumption.now);
                        set_minConValue(0.0);
                        set_maxConValue((responseData[0].consumption.now / 1000).toFixed(3));
                        setIsExploreDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                setIsExploreDataLoading(false);
            }
        };
        exploreDataFetch();
    }, [startDate, endDate]);

    const exploreFilterDataFetch = async (bodyVal) => {
        try {
            setIsExploreDataLoading(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?consumption=energy`;
            await axios.post(`${BaseUrl}${getExploreBuildingList}${params}`, bodyVal, { headers }).then((res) => {
                let responseData = res.data;
                setSeriesData([]);
                setSeriesLineData([]);
                setExploreTableData(responseData);
                setTopEnergyConsumption(responseData[0].consumption.now);
                setIsExploreDataLoading(false);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore Data');
            setIsExploreDataLoading(false);
        }
    };

    useEffect(() => {
        if (selectedBuildingId === '') {
            return;
        }

        const fetchExploreChartData = async (id) => {
            try {
                // setIsExploreDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy&building_id=${selectedBuildingId}`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreBuildingChart}${params}&divisible_by=1000`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        // console.log(responseData);
                        let data = responseData.data;
                        // console.log(data);
                        let arr = [];
                        arr = exploreTableData.filter(function (item) {
                            return item.building_id === selectedBuildingId;
                        });
                        // console.log(arr);
                        let exploreData = [];
                        // data.forEach((record) => {
                        //     if (record.building_name !== null) {
                        let recordToInsert = {
                            name: arr[0].building_name,
                            data: data,
                            id: arr[0].building_id,
                        };
                        // console.log(recordToInsert);

                        // console.log(recordToInsert);
                        // console.log(seriesData);
                        setSeriesData([...seriesData, recordToInsert]);
                        setSeriesLineData([...seriesLineData, recordToInsert]);
                        setSelectedBuildingId('');
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                //setIsExploreDataLoading(false);
            }
        };

        fetchExploreChartData();
    }, [selectedBuildingId]);

    useEffect(() => {
        if (removeBuildingId === '') {
            return;
        }
        let arr1 = [];
        arr1 = seriesData.filter(function (item) {
            return item.id !== removeBuildingId;
        });
        // console.log(arr1);
        setSeriesData(arr1);
        setSeriesLineData(arr1);
    }, [removeBuildingId]);

    const dataarr = [];

    const fetchExploreAllChartData = async (id) => {
        try {
            // setIsExploreDataLoading(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?consumption=energy&building_id=${id}`;
            await axios
                .post(
                    `${BaseUrl}${getExploreBuildingChart}${params}`,
                    {
                        date_from: startDate.toLocaleDateString(),
                        date_to: endDate.toLocaleDateString(),
                        tz_info: timeZone,
                    },
                    { headers }
                )
                .then((res) => {
                    let responseData = res.data;
                    // console.log(responseData);
                    let data = responseData.data;
                    // console.log(data);
                    let arr = [];
                    arr = exploreTableData.filter(function (item) {
                        return item.building_id === id;
                    });
                    // console.log(arr);
                    let exploreData = [];
                    // data.forEach((record) => {
                    //     if (record.building_name !== null) {
                    let recordToInsert = {
                        name: arr[0].building_name,
                        data: data,
                        id: arr[0].building_id,
                    };
                    // console.log(recordToInsert);
                    dataarr.push(recordToInsert);
                    // console.log(dataarr);
                    setAllBuildingData(dataarr);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore Data');
            //setIsExploreDataLoading(false);
        }
    };

    useEffect(() => {
        if (buildingListArray.length === 0) {
            return;
        }
        for (var i = 0; i < buildingListArray.length; i++) {
            fetchExploreAllChartData(buildingListArray[i]);
        }
    }, [buildingListArray]);

    useEffect(() => {
        if (allBuildingData.length === 0) {
            return;
        }
        // console.log('All Building Data ', allBuildingData);
        // console.log(allBuildingData.length);
        // console.log(exploreTableData.length);
        setSeriesData(allBuildingData);
        setSeriesLineData(allBuildingData);
    }, [allBuildingData]);

    useEffect(() => {
        if (selectedBuildingOptions.length === 0) {
            setBuildingTypeTxt('');
        }
        if (
            (maxConValue === 0.0 || maxConValue === 0.01) &&
            (maxSq_FtValue === 10 || minSq_FtValue === 0) &&
            selectedBuildingOptions.length === 0
        ) {
            return;
        }
        let arr = {};
        arr['date_from'] = startDate;
        arr['date_to'] = endDate;
        if (maxConValue > 0.01) {
            arr['consumption_range'] = {
                gte: minConValue * 1000,
                lte: maxConValue * 1000,
            };
        }
        if (maxSq_FtValue > 10) {
            arr['sq_ft_range'] = {
                gte: minSq_FtValue,
                lte: maxSq_FtValue,
            };
        }
        if (selectedBuildingOptions.length !== 0) {
            if (selectedBuildingOptions.length === 1) {
                setBuildingTypeTxt(`${selectedBuildingOptions[0]}`);
            } else {
                setBuildingTypeTxt(`${selectedBuildingOptions.length} Building Types`);
            }
            arr['building_type'] = selectedBuildingOptions;
        }
        exploreFilterDataFetch(arr);
    }, [APIFlag, Sq_FtFlag, selectedBuildingOptions]);

    const handleCloseFilter = (e, val) => {
        let arr = [];
        arr = selectedOptions.filter(function (item) {
            return item.value !== val;
        });
        // console.log(arr);
        setSelectedOptions(arr);
    };

    const handleInput = (values) => {
        //console.log("values ",values);
        set_minConValue(values[0]);
        set_maxConValue(values[1]);
    };

    const handleInputPer = (values) => {
        //console.log("values ",values);
        set_minPerValue(values[0]);
        set_maxPerValue(values[1]);
    };

    const handleSq_FtInput = (values) => {
        //console.log("values ",values);
        set_minSq_FtValue(values[0]);
        set_maxSq_FtValue(values[1]);
    };

    const clearFilterData = () => {
        let arr = {
            date_from: startDate.toLocaleDateString(),
            date_to: endDate.toLocaleDateString(),
            tz_info: timeZone,
        };
        exploreFilterDataFetch(arr);
    };

    const handleAllBuilgingType = (e) => {
        let slt = document.getElementById('buildingType');
        if (slt.checked === true) {
            let selectBuilding = [];
            for (let i = 0; i < buildingTypeOptions.length; i++) {
                selectBuilding.push(buildingTypeOptions[i].label);
                let check = document.getElementById(buildingTypeOptions[i].label);
                check.checked = slt.checked;
            }
            //console.log('selected Space Type ',selectSpace);
            setSelectedBuildingOptions(selectBuilding);
        } else {
            setSelectedBuildingOptions([]);
            for (let i = 0; i < buildingTypeOptions.length; i++) {
                let check = document.getElementById(buildingTypeOptions[i].label);
                check.checked = slt.checked;
            }
        }
    };

    const handleSelectedBuildingType = (e) => {
        let selection = document.getElementById(e.target.value);
        if (selection.checked === true) setSelectedBuildingOptions([...selectedBuildingOptions, e.target.value]);
        else {
            let slt = document.getElementById('buildingType');
            slt.checked = selection.checked;
            //console.log(e.target.value);
            let arr = selectedBuildingOptions.filter(function (item) {
                return item !== e.target.value;
            });
            //console.log(arr);
            setSelectedBuildingOptions(arr);
        }
    };

    const handleBuildingTypeSearch = (e) => {
        let txt = e.target.value;
        if (txt !== '') {
            var search = new RegExp(txt, 'i');
            let b = buildingTypeOptions.filter((item) => search.test(item.label));
            // console.log(b);
            setBuildingTypeOptions(b);
        } else {
            setBuildingTypeOptions(buildingTypeOptionsCopy);
        }
    };

    const handleBuildingSearch = (e) => {
        // console.log(buildingSearchTxt);

        const exploreDataFetch = async () => {
            try {
                setIsExploreDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy&search_by_name=${buildingSearchTxt}`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreBuildingList}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        // console.log(responseData[0]);
                        setExploreTableData(responseData);
                        // console.log('Consumption ', (responseData[0].consumption.now / 1000).toFixed(3));
                        setTopEnergyConsumption(responseData[0].consumption.now);
                        set_minConValue(0.0);
                        set_maxConValue((responseData[0].consumption.now / 1000).toFixed(3));
                        setIsExploreDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                setIsExploreDataLoading(false);
            }
        };
        exploreDataFetch();
    };

    const getCSVLinkData = () => {
        // console.log("csv entered");
        let sData = [];
        exploreTableData.map(function (obj) {
            let change = percentageHandler(obj.consumption.now, obj.consumption.old) + '%';
            sData.push([
                obj.building_name,
                (obj.consumption.now / 1000).toFixed(2) + 'kWh',
                change,
                obj.square_footage + ' sq.ft.',
                obj.building_type,
            ]);
        });
        //console.log(sData)
        //let arr = exploreTableData.length > 0 ? sData : [];
        //console.log(exploreTableData);
        //console.log([exploreTableData]);
        let streamData = exploreTableData.length > 0 ? sData : [];

        // streamData.unshift(['Timestamp', selectedConsumption])

        return [['Name', 'Energy Consumption', '% Change', 'Square Footage', 'Building Type'], ...streamData];
    };

    const getCSVLinkChartData = () => {
        // console.log("csv entered");
        let arr = seriesData.length > 0 ? seriesData[0].data : [];
        // console.log(arr);
        // console.log(sData);
        let streamData = seriesData.length > 0 ? seriesData[0].data : [];

        // streamData.unshift(['Timestamp', selectedConsumption])

        return [['timestamp', 'energy'], ...streamData];
    };

    return (
        <>
            <Row className="ml-2 mt-2 explore-filters-style">
                <Header title="" />
            </Row>

            <Row>
                <div className="explore-table-style">
                    {isExploreChartDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <>
                            <Row>
                                <Col lg={11}></Col>
                                <Col lg={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <CSVLink
                                        style={{ color: 'black' }}
                                        className="btn btn-white d-inline btnHover font-weight-bold"
                                        filename={`explore-building-energy-${new Date().toUTCString()}.csv`}
                                        target="_blank"
                                        data={getCSVLinkChartData()}>
                                        {' '}
                                        <FontAwesomeIcon icon={faDownload} size="md" />
                                    </CSVLink>
                                </Col>
                            </Row>
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

            <Row className="mt-3 mb-1">
                <Col lg={11} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div className="explore-search-filter-style">
                        <div className="explore-search mr-2">
                            <input
                                className="search-box ml-2"
                                type="search"
                                name="search"
                                placeholder="Search..."
                                onChange={(e) => {
                                    setBuildingSearchTxt(e.target.value);
                                }}
                            />
                            <button
                                style={{ border: 'none', backgroundColor: '#fff' }}
                                onClick={(e) => {
                                    handleBuildingSearch(e);
                                }}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                            </button>
                        </div>
                        <div>
                            <MultiSelect
                                options={tableColumnOptions}
                                value={selectedOptions}
                                onChange={setSelectedOptions}
                                labelledBy="Columns"
                                className="column-filter-styling"
                                valueRenderer={() => {
                                    return (
                                        <>
                                            <i
                                                className="uil uil-plus mr-1 "
                                                style={{ color: 'black', fontSize: '1rem' }}></i>{' '}
                                            <b style={{ color: 'black', fontSize: '1rem' }}>Add Filter</b>
                                        </>
                                    );
                                }}
                                ClearSelectedIcon={null}
                            />
                        </div>

                        {selectedOptions.map((el, index) => {
                            if (el.value !== 'consumption') {
                                return;
                            }
                            return (
                                <>
                                    <Dropdown className="mt-2 me-1 ml-2 btn btn-white d-inline btnHover" align="end">
                                        <span className="" style={{ height: '36px', marginLeft: '1rem' }}>
                                            <Dropdown.Toggle
                                                className="font-weight-bold"
                                                id="PopoverClick"
                                                type="button"
                                                style={{ border: 'none', backgroundColor: 'white', color: 'black' }}>
                                                {consumptionTxt === '' ? `All ${el.label}` : consumptionTxt}{' '}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                    setConsumptionTxt('');
                                                }}>
                                                <i className="uil uil-multiply"></i>
                                            </button>
                                        </span>
                                        <Dropdown.Menu className="dropdown-lg p-3">
                                            <div style={{ margin: '1rem' }}>
                                                <div>
                                                    <a
                                                        className="pop-text"
                                                        onClick={(e) => {
                                                            setAPIFlag(!APIFlag);
                                                            setConsumptionTxt(
                                                                `${minConValue} - ${maxConValue} kWh Used`
                                                            );
                                                        }}>
                                                        kWh Used
                                                    </a>
                                                </div>
                                                <div className="pop-inputbox-wrapper">
                                                    <input className="pop-inputbox" type="text" value={minConValue} />{' '}
                                                    <input className="pop-inputbox" type="text" value={maxConValue} />
                                                </div>
                                                <div style={{ marginTop: '2rem' }}>
                                                    <RangeSlider
                                                        name="consumption"
                                                        STEP={0.01}
                                                        MIN={0}
                                                        range={[minConValue, maxConValue]}
                                                        MAX={(topEnergyConsumption / 1000 + 0.5).toFixed(3)}
                                                        onSelectionChange={handleInput}
                                                    />
                                                </div>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            );
                        })}
                        {selectedOptions.map((el, index) => {
                            if (el.value !== 'change') {
                                return;
                            }
                            return (
                                <>
                                    <Dropdown className="mt-2 me-1 ml-2 btn btn-white d-inline btnHover" align="end">
                                        <span className="" style={{ height: '36px', marginLeft: '1rem' }}>
                                            <Dropdown.Toggle
                                                className="font-weight-bold"
                                                id="PopoverClick"
                                                type="button"
                                                style={{ border: 'none', backgroundColor: 'white', color: 'black' }}>
                                                {' '}
                                                All {el.label}{' '}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                }}>
                                                <i className="uil uil-multiply"></i>
                                            </button>
                                        </span>
                                        <Dropdown.Menu className="dropdown-lg p-3">
                                            <div style={{ margin: '1rem' }}>
                                                <div>
                                                    <a className="pop-text">Change Threshold</a>
                                                </div>
                                                <div className="pop-inputbox-wrapper">
                                                    <input className="pop-inputbox" type="text" value={minPerValue} />{' '}
                                                    <input className="pop-inputbox" type="text" value={maxPerValue} />
                                                </div>
                                                <div style={{ marginTop: '2rem' }}>
                                                    <RangeSlider
                                                        name="consumption"
                                                        STEP={1}
                                                        MIN={0}
                                                        range={[minPerValue, maxPerValue]}
                                                        MAX={100}
                                                        onSelectionChange={handleInputPer}
                                                    />
                                                </div>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            );
                        })}
                        {selectedOptions.map((el, index) => {
                            if (el.value !== 'sq_ft') {
                                return;
                            }
                            return (
                                <>
                                    <Dropdown className="mt-2 me-1 ml-2 btn btn-white d-inline btnHover" align="end">
                                        <span className="" style={{ height: '36px', marginLeft: '1rem' }}>
                                            <Dropdown.Toggle
                                                className="font-weight-bold"
                                                id="PopoverClick"
                                                type="button"
                                                style={{ border: 'none', backgroundColor: 'white', color: 'black' }}>
                                                {sq_ftTxt === '' ? `All ${el.label}` : sq_ftTxt}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                }}>
                                                <i className="uil uil-multiply"></i>
                                            </button>
                                        </span>
                                        <Dropdown.Menu className="dropdown-lg p-3">
                                            <div style={{ margin: '1rem' }}>
                                                <div>
                                                    <a
                                                        className="pop-text"
                                                        onClick={(e) => {
                                                            setSq_FtFlag(!Sq_FtFlag);
                                                            setSq_FtTxt(
                                                                `${minSq_FtValue} Sq.ft. - ${maxSq_FtValue} Sq.ft.`
                                                            );
                                                        }}>
                                                        Square Footage
                                                    </a>
                                                </div>
                                                <div className="pop-inputbox-wrapper">
                                                    <input className="pop-inputbox" type="text" value={minSq_FtValue} />{' '}
                                                    <input className="pop-inputbox" type="text" value={maxSq_FtValue} />
                                                </div>
                                                <div style={{ marginTop: '2rem' }}>
                                                    <RangeSlider
                                                        name="consumption"
                                                        STEP={1}
                                                        MIN={0}
                                                        range={[minSq_FtValue, maxSq_FtValue]}
                                                        MAX={10000}
                                                        onSelectionChange={handleSq_FtInput}
                                                    />
                                                </div>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            );
                        })}
                        {selectedOptions.map((el, index) => {
                            if (el.value !== 'building_type') {
                                return;
                            }
                            return (
                                <>
                                    <Dropdown className="mt-2 me-1 ml-2 btn btn-white d-inline btnHover" align="end">
                                        <span className="" style={{ height: '36px', marginLeft: '1rem' }}>
                                            <Dropdown.Toggle
                                                className="font-weight-bold"
                                                id="PopoverClick"
                                                type="button"
                                                style={{ border: 'none', backgroundColor: 'white', color: 'black' }}>
                                                {' '}
                                                {buildingTypeTxt === '' ? `All ${el.label}` : buildingTypeTxt}{' '}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                    setBuildingTypeTxt('');
                                                }}>
                                                <i className="uil uil-multiply"></i>
                                            </button>
                                        </span>
                                        <Dropdown.Menu className="dropdown-lg p-3">
                                            <div>
                                                <div className="m-1">
                                                    <div className="explore-search mr-2">
                                                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                                        <input
                                                            className="search-box ml-2"
                                                            type="search"
                                                            name="search"
                                                            placeholder="Search"
                                                            autocomplete="off"
                                                            onChange={(e) => {
                                                                handleBuildingTypeSearch(e);
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={
                                                            buildingTypeOptions.length > 4
                                                                ? `hScroll`
                                                                : `hHundredPercent`
                                                        }>
                                                        <div className="floor-box">
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2"
                                                                    id="buildingType"
                                                                    onClick={(e) => {
                                                                        handleAllBuilgingType(e);
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </div>
                                                        </div>
                                                        {buildingTypeOptions.map((record) => {
                                                            return (
                                                                <div className="floor-box">
                                                                    <div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-2"
                                                                            id={record.label}
                                                                            value={record.label}
                                                                            onClick={(e) => {
                                                                                handleSelectedBuildingType(e);
                                                                            }}
                                                                        />
                                                                        <span>{record.label}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            );
                        })}
                    </div>
                </Col>
                <Col lg={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-white d-inline btnHover font-weight-bold mr-2">
                        {' '}
                        <FontAwesomeIcon icon={faTableColumns} size="md" />
                    </button>
                    <CSVLink
                        style={{ color: 'black' }}
                        className="btn btn-white d-inline btnHover font-weight-bold"
                        filename={`explore-building-list-${new Date().toUTCString()}.csv`}
                        target="_blank"
                        data={getCSVLinkData()}>
                        {' '}
                        <FontAwesomeIcon icon={faDownload} size="md" />
                    </CSVLink>
                </Col>
            </Row>

            <Row>
                <div className="explore-table-style">
                    <Col lg={12} className="ml-2">
                        <ExploreBuildingsTable
                            exploreTableData={exploreTableData}
                            isExploreDataLoading={isExploreDataLoading}
                            topEnergyConsumption={topEnergyConsumption}
                            selectedBuildingId={selectedBuildingId}
                            setSelectedBuildingId={setSelectedBuildingId}
                            removeBuildingId={removeBuildingId}
                            setRemovedBuildingId={setRemovedBuildingId}
                            buildingListArray={buildingListArray}
                            setBuildingListArray={setBuildingListArray}
                            selectedOptions={selectedOptions}
                        />
                    </Col>
                </div>
            </Row>
        </>
    );
};

export default ExploreByBuildings;
