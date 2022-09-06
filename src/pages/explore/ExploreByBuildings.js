import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Row, Col, Input, Card, CardBody, Table, Collapse, UncontrolledPopover, PopoverBody, PopoverHeader } from 'reactstrap';
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
import ApexCharts from 'apexcharts';
import './style.css';
import { ConstructionOutlined } from '@mui/icons-material';

const ExploreBuildingsTable = ({ exploreTableData, isExploreDataLoading, topEnergyConsumption, selectedBuildingId, setSelectedBuildingId, removeBuildingId, setRemovedBuildingId, buildingListArray, setBuildingListArray, selectedOptions }) => {
    const history = useHistory();

    const redirectToExploreEquipPage = (bldId, bldName) => {
        history.push({
            pathname: `/explore-page/by-equipment/${bldId}`,
        });
        localStorage.setItem('exploreBldId', bldId);
        localStorage.setItem('exploreBldName', bldName);
        ExploreBuildingStore.update((s) => {
            s.exploreBldId = bldId;
            s.exploreBldName = bldName;
        });
    };
    const handleSelectionAll = (e) => {
        var ischecked = document.getElementById("selection");
        if (ischecked.checked == true) {
            let arr = [];
            for (var i = 0; i < exploreTableData.length; i++) {
                arr.push(exploreTableData[i].building_id)
                console.log(arr);

                var checking = document.getElementById(exploreTableData[i].building_id);
                checking.checked = ischecked.checked;
            }
            setBuildingListArray(arr);
        }
        else {
            for (var i = 0; i < exploreTableData.length; i++) {
                var checking = document.getElementById(exploreTableData[i].building_id);
                checking.checked = ischecked.checked;
            }
            ischecked.checked = ischecked.checked
        }

    }
    const handleSelection = (e, id) => {
        var isChecked = document.getElementById(id);
        if (isChecked.checked == true) {
            console.log(id);
            setSelectedBuildingId(id)
        }
        else {
            setRemovedBuildingId(id)
        }
    }
    return (
        <>
            <Card>
                <CardBody>
                    <Col md={6}>
                        <Table className="mb-0 bordered mouse-pointer">
                            <thead>
                                <tr>

                                    <th className="table-heading-style">
                                        <input type="checkbox" className="mr-4" id="selection" onClick={(e) => { handleSelectionAll(e) }} />
                                        Name
                                    </th>
                                    <th className="table-heading-style">Energy Consumption</th>
                                    <th className="table-heading-style">% Change</th>
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
                                                        <input type="checkbox" className="mr-4" id={record?.building_id} value={record?.building_id} onClick={(e) => { handleSelection(e, record?.building_id) }} />
                                                        <a
                                                            className="building-name"
                                                            onClick={() => {
                                                                redirectToExploreEquipPage(
                                                                    record?.building_id,
                                                                    record?.building_name
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
                                                        {record?.consumption?.now <=
                                                            record?.consumption?.old && (
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
                                                        {record?.consumption?.now >
                                                            record?.consumption?.old && (
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

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [exploreTableData, setExploreTableData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const tableColumnOptions = [
        { label: 'Energy Consumption', value: 'consumption' },
        { label: 'Change', value: 'change' },
        { label: 'Square Footage', value: 'sq_ft' },
        { label: 'Building Type', value: 'building_type' },
    ];

    const [selectedBuildingOptions, setSelectedBuildingOptions] = useState([]);
    
    const buildingTypeOptions = [
        { label: 'Office Building', value: 'office' },
        { label: 'Residential Building', value: 'residential' },
        
    ];
    const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

    const customDaySelect = [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last Day',
            value: 1,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Last 4 Weeks',
            value: 28,
        },
        {
            label: 'Last 3 Months',
            value: 90,
        },
        {
            label: 'Last 12 Months',
            value: 365,
        },
    ];

    const dateValue = DateRangeStore.useState((s) => s.dateFilter);
    const [dateFilter, setDateFilter] = useState(dateValue);

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
        xaxis: {
            type: 'datetime',
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
        colors: ['#008FFB'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.1,
            },
        },
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            tickAmount: 2,
        },
    });

    const [topEnergyConsumption, setTopEnergyConsumption] = useState(1);

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
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            //startCustomDate.setDate(startCustomDate.getDate() - date-1);
            startCustomDate.setDate(startCustomDate.getDate() - date);
            console.log(date);
            if (date !== '0') endCustomDate.setDate(endCustomDate.getDate() - 1);

            setDateRange([startCustomDate, endCustomDate]);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        let result = [];
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
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        setExploreTableData(responseData);
                        result = res.data;
                        setTopEnergyConsumption(responseData[0].consumption.now);


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

    useEffect(() => {

        console.log("entered in selected Building ", selectedBuildingId)
        if (selectedBuildingId === "") {
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
                        `${BaseUrl}${getExploreBuildingChart}${params}`,
                        {
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        console.log(responseData);
                        let data = responseData.data;
                        console.log(data)
                        let arr = [];
                        arr = exploreTableData.filter(function (item) {
                            return item.building_id === selectedBuildingId
                        })
                        console.log(arr);
                        let exploreData = [];
                        // data.forEach((record) => {
                        //     if (record.building_name !== null) {
                        let recordToInsert = {
                            name: arr[0].building_name,
                            data: data,
                            id: arr[0].building_id,
                        };
                        console.log(recordToInsert);


                        console.log(recordToInsert);
                        console.log(seriesData);
                        setSeriesData([...seriesData, recordToInsert]);
                        setSeriesLineData([...seriesLineData, recordToInsert]);
                        setSelectedBuildingId('');

                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                //setIsExploreDataLoading(false);
            }

        }

        fetchExploreChartData();
    }, [selectedBuildingId])

    useEffect(() => {
        console.log("Entered Removed building id ", removeBuildingId)
        if (removeBuildingId === "") {
            return;
        }
        let arr1 = [];
        arr1 = seriesData.filter(function (item) {
            return item.id !== removeBuildingId
        })
        console.log(arr1);
        setSeriesData(arr1);
        setSeriesLineData(arr1);

    }, [removeBuildingId])

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
                        date_from: startDate,
                        date_to: endDate,
                    },
                    { headers }
                )
                .then((res) => {
                    let responseData = res.data;
                    console.log(responseData);
                    let data = responseData.data;
                    console.log(data)
                    let arr = [];
                    arr = exploreTableData.filter(function (item) {
                        return item.building_id === id
                    })
                    console.log(arr);
                    let exploreData = [];
                    // data.forEach((record) => {
                    //     if (record.building_name !== null) {
                    let recordToInsert = {
                        name: arr[0].building_name,
                        data: data,
                        id: arr[0].building_id,
                    };
                    console.log(recordToInsert);
                    dataarr.push(recordToInsert);
                    console.log(dataarr);
                    setAllBuildingData(dataarr);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore Data');
            //setIsExploreDataLoading(false);
        }

    }

    useEffect(() => {
        console.log("building List Array ", buildingListArray);
        if (buildingListArray.length === 0) {
            return;
        }
        for (var i = 0; i < buildingListArray.length; i++) {
            fetchExploreAllChartData(buildingListArray[i]);
        }

    }, [buildingListArray])

    useEffect(() => {

        if (allBuildingData.length === 0) {
            return;
        }
        console.log("All Building Data ", allBuildingData);
        console.log(allBuildingData.length);
        console.log(exploreTableData.length);
        setSeriesData(allBuildingData);
        setSeriesLineData(allBuildingData);
    }, [allBuildingData])
    useEffect(() => {
        console.log("Selected Options ", selectedOptions);
    }, [selectedOptions])

    const handleCloseFilter=(e, val)=>{
        let arr=[];
        arr = selectedOptions.filter(function (item) {
            return item.value !== val
        })
        console.log(arr);
        setSelectedOptions(arr);
    }

    return (
        <>
            <Row className="ml-2 mt-2 mr-2 explore-filters-style">
                <div className="explore-filters-style">
                    <div>
                        <Input
                            type="select"
                            name="select"
                            id="exampleSelect"
                            style={{ color: 'black', fontWeight: 'bold', width: 'fit-content' }}
                            className="select-button form-control form-control-md"
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                            }}
                            defaultValue={dateFilter}>
                            {customDaySelect.map((el, index) => {
                                return <option value={el.value}>{el.label}</option>;
                            })}
                        </Input>
                    </div>
                    <div>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                            dateFormat="MMMM d"
                            className="select-button form-control form-control-md font-weight-bold"
                            placeholderText="Select Date Range"
                        />
                    </div>
                </div>
            </Row>

            <Row>
                <div className="explore-table-style">
                    {isExploreChartDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <BrushChart
                            seriesData={seriesData}
                            optionsData={optionsData}
                            seriesLineData={seriesLineData}
                            optionsLineData={optionsLineData}
                        />
                    )}
                </div>
            </Row>

            <Row className="mt-3 mb-1">
                <Col lg={11} style={{display:"flex",justifyContent:"flex-start"}}>
                <div className="explore-search-filter-style">
                    <div className="explore-search mr-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                        <input className="search-box ml-2" type="search" name="search" placeholder="Search..." />
                    </div>
                    <div>
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return <><i className="uil uil-plus mr-1 " style={{color:"black", fontSize:"1rem"}}></i> <b style={{color:"black", fontSize:"1rem"}}>Add Filter</b></>;
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>

                    {selectedOptions.map((el, index) => {
                        if(el.value!=="building_type"){
                            return
                        }
                        return (                        
                        <> 
                        <Dropdown className="mt-2 me-1 ml-2 btn btn-white d-inline btnHover" align="end">
                            <span
                            className=""
                            style={{ height: '36px', marginLeft: "1rem" }}>
                                <Dropdown.Toggle className='font-weight-bold' id="PopoverClick" type="button" style={{border:"none", backgroundColor:"white", color:"black"}}> All {el.label} </Dropdown.Toggle>
                                <button style={{border:"none", backgroundColor:"white"}} onClick={(e)=>{handleCloseFilter(e,el.value)}}><i className="uil uil-multiply"></i></button>
                            </span>
                            <Dropdown.Menu className="dropdown-lg p-3">
                            <MultiSelect
                            options={buildingTypeOptions}
                            value={selectedBuildingOptions}
                            onChange={setSelectedBuildingOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            // valueRenderer={() => {
                            //     return <><i className="uil uil-plus mr-1 " style={{color:"black", fontSize:"1rem"}}></i> <b style={{color:"black", fontSize:"1rem"}}>Add Filter</b></>;
                            // }}
                            ClearSelectedIcon={null}
                        />
                            </Dropdown.Menu>
                        </Dropdown>
                        </>);
                    })}
                    {selectedOptions.map((el, index) => {
                        if(el.value==="building_type"){
                            return
                        }
                        return (                        
                        <> 
                        <Dropdown className="mt-2 me-1 ml-2 btn btn-white d-inline btnHover">
                            <span
                            className=""
                            style={{ height: '36px', marginLeft: "1rem" }}>
                                <Dropdown.Toggle className='font-weight-bold' id="PopoverClick" type="button" style={{border:"none", backgroundColor:"white", color:"black"}}> All {el.label} </Dropdown.Toggle>
                                <button style={{border:"none", backgroundColor:"white"}} onClick={(e)=>{handleCloseFilter(e,el.value)}}><i className="uil uil-multiply"></i></button>
                            </span>
                            {/* <Dropdown.Menu className="dropdown-lg p-3">
                            <MultiSelect
                            options={buildingTypeOptions}
                            value={selectedBuildingOptions}
                            onChange={setSelectedBuildingOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            // valueRenderer={() => {
                            //     return <><i className="uil uil-plus mr-1 " style={{color:"black", fontSize:"1rem"}}></i> <b style={{color:"black", fontSize:"1rem"}}>Add Filter</b></>;
                            // }}
                            ClearSelectedIcon={null}
                        />
                        </Dropdown.Menu>*/}
                        </Dropdown>
                        </>);
                    })}

                </div>
                </Col>
                <Col lg={1} style={{display:"flex",justifyContent:"flex-end"}}>
                <button className='btn btn-white d-inline btnHover font-weight-bold mr-2'> <FontAwesomeIcon icon={faTableColumns} size="md" /></button>
                <button className='btn btn-white d-inline btnHover font-weight-bold'> <FontAwesomeIcon icon={faDownload} size="md" /></button>
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
