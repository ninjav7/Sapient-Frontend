import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Row, Col, Input, Card, CardBody, Table } from 'reactstrap';
import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { BaseUrl, getExploreByEquipment, getExploreEquipmentList, getExploreEquipmentChart, getFloors, equipmentType,getEndUseId} from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTableColumns, faDownload  } from '@fortawesome/pro-regular-svg-icons';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
import { MultiSelect } from 'react-multi-select-component';
import { Spinner } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Line } from 'rc-progress';
import { useParams } from 'react-router-dom';
import EquipChartModal from './EquipChartModal';
import Dropdown from 'react-bootstrap/Dropdown';
import ApexCharts from 'apexcharts';
import './style.css';
import { remove } from 'lodash';
import RangeSlider from './RangeSlider';

const ExploreEquipmentTable = ({
    exploreTableData,
    isExploreDataLoading,
    topEnergyConsumption,
    topPeakConsumption,
    handleChartOpen,
    setEquipmentFilter,
    selectedEquipmentId,
    setSelectedEquipmentId,
    removeEquipmentId,
    setRemovedEquipmentId,
    equipmentListArray,
    setEquipmentListArray
}) => {

    const handleSelectionAll = (e) => {
        var ischecked = document.getElementById("selection");
        if (ischecked.checked == true) {
            let arr = [];
            for (var i = 0; i < exploreTableData.length; i++) {
                arr.push(exploreTableData[i].equipment_id)
                console.log(arr);

                var checking = document.getElementById(exploreTableData[i].equipment_id);
                checking.checked = ischecked.checked;
            }
            setEquipmentListArray(arr)

        }
        else {
            for (var i = 0; i < exploreTableData.length; i++) {

                var checking = document.getElementById(exploreTableData[i].equipment_id);
                checking.checked = ischecked.checked;
            }
            ischecked.checked = ischecked.checked
        }

    }
    const handleSelection = (e, id) => {
        var isChecked = document.getElementById(id);
        if (isChecked.checked == true) {
            setSelectedEquipmentId(id)
        }
        else {
            setRemovedEquipmentId(id)
        }
    }

    return (
        <>
            <Card>
                <CardBody>
                    <Col md={8}>
                        <Table className="mb-0 bordered mouse-pointer">
                            <thead>
                                <tr>
                                    <th className="table-heading-style">
                                        <input type="checkbox" className="mr-4" id="selection" onClick={(e) => { handleSelectionAll(e) }} />
                                        Name
                                    </th>
                                    <th className="table-heading-style">Energy Consumption</th>
                                    <th className="table-heading-style">% Change</th>
                                    <th className="table-heading-style">Location</th>
                                    <th className="table-heading-style">Location Type</th>
                                    <th className="table-heading-style">Equipment Type</th>
                                    <th className="table-heading-style">End Use Category</th>
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
                                                        <input type="checkbox" className="mr-4" id={record?.equipment_id} value={record?.equipment_id} onClick={(e) => { handleSelection(e, record?.equipment_id) }} />
                                                        <a
                                                            className="building-name"
                                                            onClick={() => {
                                                                setEquipmentFilter({
                                                                    equipment_id: record?.equipment_id,
                                                                    equipment_name: record?.equipment_name,
                                                                });
                                                                localStorage.setItem(
                                                                    'exploreEquipName',
                                                                    record?.equipment_name
                                                                );
                                                                handleChartOpen();
                                                            }}>
                                                            {record?.equipment_name === ''
                                                                ? '-'
                                                                : record?.equipment_name}
                                                        </a>
                                                    </th>

                                                    <td className="table-content-style font-weight-bold">
                                                        {(record?.consumption?.now / 1000).toFixed(2)} kWh
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
                                                                        (record?.consumption?.now /
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
                                                    <td className='table-content-style font-weight-bold'>
                                                        {record?.location===""?"-":record?.location}
                                                    </td>
                                                    <td className='table-content-style font-weight-bold'>
                                                        {record?.location_type===""?"-":record?.location_type}
                                                    </td>
                                                    <td className='table-content-style font-weight-bold'>
                                                        {record?.equipments_type}
                                                    </td>
                                                    <td className='table-content-style font-weight-bold'>
                                                        {record?.end_user}
                                                    </td>

                                                    {/* <td className="table-content-style font-weight-bold">
                                                        {(record?.peak_power?.now / 1000).toFixed(2)} kWh
                                                        <br />
                                                        <div style={{ width: '100%', display: 'inline-block' }}>
                                                            {index === 0 && record?.peak_power?.now === 0 && (
                                                                <Line
                                                                    percent={0}
                                                                    strokeWidth="3"
                                                                    trailWidth="3"
                                                                    strokeColor={`#D14065`}
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                            {index === 0 && record?.peak_power?.now > 0 && (
                                                                <Line
                                                                    percent={parseFloat(
                                                                        (record?.peak_power?.now / topPeakConsumption) *
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
                                                                        (record?.peak_power?.now / topPeakConsumption) *
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
                                                                        (record?.peak_power?.now / topPeakConsumption) *
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
                                                                        (record?.peak_power?.now / topPeakConsumption) *
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
                                                                        (record?.peak_power?.now / topPeakConsumption) *
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
                                                                        (record?.peak_power?.now / topPeakConsumption) *
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
                                                        {record?.peak_power?.now <= record?.peak_power?.old && (
                                                            <button
                                                                className="button-success text-success btn-font-style"
                                                                style={{ width: 'auto' }}>
                                                                <i className="uil uil-chart-down">
                                                                    <strong>
                                                                        {percentageHandler(
                                                                            record?.peak_power?.now,
                                                                            record?.peak_power?.old
                                                                        )}
                                                                        %
                                                                    </strong>
                                                                </i>
                                                            </button>
                                                        )}
                                                        {record?.peak_power?.now > record?.peak_power?.old && (
                                                            <button
                                                                className="button-danger text-danger btn-font-style"
                                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                                <i className="uil uil-arrow-growth">
                                                                    <strong>
                                                                        {percentageHandler(
                                                                            record?.peak_power?.now,
                                                                            record?.peak_power?.old
                                                                        )}
                                                                        %
                                                                    </strong>
                                                                </i>
                                                            </button>
                                                        )}
                                                    </td> */}
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

const ExploreByEquipment = () => {
    const { bldgId } = useParams();

    let cookies = new Cookies();
    let userdata = cookies.get('user');

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

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [isExploreChartDataLoading, setIsExploreChartDataLoading] = useState(false);


    const dateValue = DateRangeStore.useState((s) => s.dateFilter);
    const [dateFilter, setDateFilter] = useState(dateValue);

    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    const [seriesData, setSeriesData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const tableColumnOptions = [
        { label: 'Energy Consumption', value: 'consumption' },
        { label: 'Change', value: 'change' },
        { label: 'Location', value: 'location' },
        { label: 'Location Type', value: 'location_type' },
        { label: 'Equipment Type', value: 'equip_type' },
        { label: 'End Use Category', value: 'endUse_category' },
    ];
    const [equipOptions,setEquipOptions]=useState([]);
    const [endUseOptions,setEndUseOptions]=useState([]);
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
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            tickAmount: 2,
        },
        legend: {
            show: false,
        },
    });

    const [APIFlag, setAPIFlag]=useState(false);
    const [APILocFlag, setAPILocFlag]=useState(false);
    const [showEquipmentChart, setShowEquipmentChart] = useState(false);
    const handleChartOpen = () => setShowEquipmentChart(true);
    const handleChartClose = () => setShowEquipmentChart(false);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
    const [removeEquipmentId, setRemovedEquipmentId] = useState('');
    const [equipmentListArray, setEquipmentListArray] = useState([]);
    const [allEquipmentData, setAllEquipmenData] = useState([]);

    const [exploreTableData, setExploreTableData] = useState([]);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState(1);
    const [topPeakConsumption, setTopPeakConsumption] = useState(1);
    const [floorListAPI, setFloorListAPI] = useState([]);
    const [selectedLocation,setSelectedLocation]=useState('');
    const [selectedEquipType,setSelectedEquipType]=useState([]);
    const [selectedEndUse,setSelectedEndUse]=useState([]);
    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [minConValue, set_minConValue] = useState(0);
    const [maxConValue, set_maxConValue] = useState(0);
    const [minPerValue, set_minPerValue] = useState(0);
    const [maxPerValue, set_maxPerValue] = useState(100);
    
    const handleSelectedEquip=(e)=>{
        let selection=document.getElementById(e.target.value);
        if(selection.checked===true)
            setSelectedEquipType([...selectedEquipType,e.target.value]);
        else
        {
            console.log(e.target.value);
            let arr = selectedEquipType.filter(function (item) {
                return item !== e.target.value
            })
            console.log(arr);
            setSelectedEquipType(arr)
        }
    }
    const handleSelectedEndUse=(e)=>{
        let selection=document.getElementById(e.target.value);
        if(selection.checked===true)
            setSelectedEndUse([...selectedEndUse,e.target.value]);
        else
        {
            console.log(e.target.value);
            let arr = selectedEndUse.filter(function (item) {
                return item !== e.target.value
            })
            console.log(arr);
            setSelectedEndUse(arr)
        }
    }
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

        const exploreFilterDataFetch = async (bodyVal) => {
            try {
                setIsExploreDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `?consumption=energy&building_id=${bldgId}`;

                await axios
                    .post(
                        `${BaseUrl}${getExploreEquipmentList}${params}`,
                       bodyVal,
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        if(responseData.data.length!==0){
                        setTopEnergyConsumption(responseData.data[0].consumption.now);
                        setTopPeakConsumption(responseData.data[0].peak_power.now);
                        set_minConValue(0);
                        set_maxConValue(responseData.data[0].consumption.now)
                        }
                        setExploreTableData(responseData.data);
                        

                        setIsExploreDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                setIsExploreDataLoading(false);
            }
        };
    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            const params = `?building_id=${bldgId}`;
            axios.get(`${BaseUrl}${getFloors}${params}`, { headers }).then((res) => {
                setFloorListAPI(res.data.data);
            });

            const fetchEquipTypeData = async () => {
                try {
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                        Authorization: `Bearer ${userdata.token}`,
                    };
                    let params = `?building_id=${bldgId}`;
                    await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                        let response = res.data.data;
                        let equipData=[];
                        for(var i=0;i<response.length;i++){
                            let rec={label:response[i].equipment_type, value:response[i].equipment_id}
                            equipData.push(rec);
                        }
                        console.log("equipData ",equipData)
                        setEquipOptions(equipData)
                        // response.sort((a, b) => {
                        //     return a.equipment_type.localeCompare(b.equipment_type);
                        // });
                        // setEquipmentTypeData(response);
                    });
                } catch (error) {
                    console.log(error);
                    console.log('Failed to fetch Equipment Type Data');
                }
            };
            const fetchEndUseData = async () => {
                try {
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                        Authorization: `Bearer ${userdata.token}`,
                    };
                    await axios.get(`${BaseUrl}${getEndUseId}`, { headers }).then((res) => {
                        let response = res.data;
                        let equipData=[];
                        for(var i=0;i<response.length;i++){
                            let rec={label:response[i].name, value:response[i].end_user_id}
                            equipData.push(rec);
                        }
                        console.log("equipData ",equipData)
                        setEndUseOptions(equipData)
                    });
                } catch (error) {
                    console.log(error);
                    console.log('Failed to fetch End Use Data');
                }
            };
        let arr= {
            date_from: startDate,
            date_to: endDate,
        }
        exploreFilterDataFetch(arr);
        fetchEquipTypeData();
        fetchEndUseData();
    }, [startDate, endDate, bldgId]);

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

    useEffect(() => {
        console.log("Entered selected Equipment id ", selectedEquipmentId);
        if (selectedEquipmentId === "") {
            return;
        }
        const fetchExploreChartData = async () => {
            try {
                // setIsExploreDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy&equipment_id=${selectedEquipmentId}`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreEquipmentChart}${params}`,
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
                            return item.equipment_id === selectedEquipmentId
                        })
                        console.log(arr);
                        let exploreData = [];

                        let recordToInsert = {
                            name: arr[0].equipment_name,
                            data: data,
                            id: arr[0].equipment_id
                        };
                        console.log(recordToInsert);

                        setSeriesData([...seriesData, recordToInsert]);
                        setSeriesLineData([...seriesLineData, recordToInsert]);
                        setSelectedEquipmentId('');

                        //setIsExploreDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                //setIsExploreDataLoading(false);
            }

        }
        fetchExploreChartData();
    }, [selectedEquipmentId])

    useEffect(() => {
        console.log("Entered Remove Equipment ", removeEquipmentId)
        if (removeEquipmentId === "") {
            return;
        }
        let arr1 = [];
        arr1 = seriesData.filter(function (item) {
            return item.id !== removeEquipmentId
        })
        console.log(arr1);
        setSeriesData(arr1);
        setSeriesLineData(arr1);
    }, [removeEquipmentId])

    const dataarr = [];

    const fetchExploreAllChartData = async (id) => {
        try {
            // setIsExploreDataLoading(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?consumption=energy&equipment_id=${id}`;
            await axios
                .post(
                    `${BaseUrl}${getExploreEquipmentChart}${params}`,
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
                        return item.equipment_id === id
                    })
                    console.log(arr);
                    let exploreData = [];
                    // data.forEach((record) => {
                    //     if (record.building_name !== null) {
                    let recordToInsert = {
                        name: arr[0].equipment_name,
                        data: data,
                        id: arr[0].equipment_id
                    };
                    console.log(recordToInsert);
                    dataarr.push(recordToInsert);
                    console.log(dataarr);
                    setAllEquipmenData(dataarr);

                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore Data');
            //setIsExploreDataLoading(false);
        }

    }
    useEffect(() => {
        console.log("building List Array ", equipmentListArray);
        if (equipmentListArray.length === 0) {
            return;
        }
        for (var i = 0; i < equipmentListArray.length; i++) {
            let arr1 = [];
            arr1 = seriesData.filter(function (item) {
                return item.id === equipmentListArray[i]
            })
            console.log("Arr 1 ", arr1)
            if (arr1.length === 0) {

                fetchExploreAllChartData(equipmentListArray[i]);
                console.log(dataarr)
            }
        }

    }, [equipmentListArray])
    useEffect(() => {
        if (allEquipmentData.length === 0) {
            return;
        }
        console.log("allEquipmentSData ", allEquipmentData);
        if (allEquipmentData.length === exploreTableData.length) {
            console.log("All equipment Data set")
            setSeriesData(allEquipmentData);
            setSeriesLineData(allEquipmentData);
        }
    }, [allEquipmentData])

    const handleCloseFilter=(e, val)=>{
        let arr=[];
        arr = selectedOptions.filter(function (item) {
            return item.value !== val
        })
        console.log(arr);
        setSelectedOptions(arr);
    }

    useEffect(()=>{
        if(minConValue===0 && maxConValue===0 || maxConValue===1){
            return;
        }
       let arr={
        date_from: startDate,
        date_to: endDate,
        consumption_range: {
            "gte": minConValue,
            "lte": maxConValue
          }
    }

        exploreFilterDataFetch(arr);

    },[APIFlag])
    useEffect(()=>{
        if(selectedLocation===""){
            return;
        }
       let arr={
        date_from: startDate,
        date_to: endDate,
        location: [
            selectedLocation
          ]
    }

        exploreFilterDataFetch(arr);

    },[APILocFlag])

    const clearFilterData=()=>{
        let arr= {
            date_from: startDate,
            date_to: endDate,
        }
        exploreFilterDataFetch(arr);
    }
    useEffect(()=>{
        console.log("Selected Equip ", selectedEquipType)
        if(selectedEquipType.length===0){
            return;
        }
        let arr= {
            date_from: startDate,
            date_to: endDate,
            equipment_types: selectedEquipType,
        }
        exploreFilterDataFetch(arr);

    },[selectedEquipType])
    useEffect(()=>{
        console.log("Selected Equip ", selectedEndUse)
        if(selectedEndUse.length===0){
            return;
        }
        let arr= {
            date_from: startDate,
            date_to: endDate,
            end_use: selectedEndUse,
        }
        exploreFilterDataFetch(arr);

    },[selectedEndUse])

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
                        if(el.value!=="consumption"){
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
                                <div style={{margin:"1rem"}}>
                                    <div>
                                    <a className='pop-text' onClick={(e)=>{setAPIFlag(!APIFlag)}}>kWh Used</a>
                                    <button style={{border:"none", backgroundColor:"white", marginLeft:"5rem"}} onClick={clearFilterData}><i className="uil uil-multiply"></i></button>
                                    </div>
                                    <div className='pop-inputbox-wrapper'>
                                        <input className='pop-inputbox' type="text" value={minConValue}/>  <input className='pop-inputbox' type="text" value={maxConValue}/>
                                    </div>
                                    <div style={{marginTop:"2rem"}}>
                                        <RangeSlider name='consumption' MIN={0} range={[minConValue, maxConValue]}  MAX={topEnergyConsumption+100} onSelectionChange={handleInput}/>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                        </>);
                    })}
                     {selectedOptions.map((el, index) => {
                        if(el.value!=="change"){
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
                                 <div style={{margin:"1rem"}}>
                                    <div>
                                    <a className='pop-text' onClick={(e)=>{setAPIFlag(!APIFlag)}}>Change Threshold</a>
                                    <button style={{border:"none", backgroundColor:"white", marginLeft:"5rem"}} onClick={exploreFilterDataFetch}><i className="uil uil-multiply"></i></button>
                                    </div>
                                    <div className='pop-inputbox-wrapper'>
                                        <input className='pop-inputbox' type="text" value={minPerValue}/>  <input className='pop-inputbox' type="text" value={maxPerValue}/>
                                    </div>
                                    <div style={{marginTop:"2rem"}}>
                                        <RangeSlider name='consumption' MIN={0} range={[minPerValue, maxPerValue]}  MAX={100} onSelectionChange={handleInputPer}/>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                        </>);
                    })}

                     {selectedOptions.map((el, index) => {
                        if(el.value!=="location"){
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
                            <Dropdown.Menu className="dropdown-xlg p-3">
                                <div>
                                    <div className='pop-inputbox-wrapper'>
                                    <div className="explore-search mr-2">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                        <input className="search-box ml-2" type="search" name="search" placeholder="Search Locations (floor, area,room)" />
                                    </div>
                                    <button className='btn btn-white d-inline' onClick={clearFilterData}>Cancel</button>
                                    <button className='btn btn-primary d-inline ml-2' onClick={(e)=>{setAPILocFlag(!APILocFlag)}}>Save</button>
                                    </div>
                                    <div className='pop-inputbox-wrapper mt-4 mb-2 p-1'><span className='pop-text'>{localStorage.getItem('exploreBldName')}</span></div>
                                    {floorListAPI.map((record)=>{
                                        
                                            return(
                                                <div className='floor-box'>
                                                    <div>
                                                    <input type="checkbox" className='mr-2' value={record.floor_id} onClick={(e)=>{setSelectedLocation(record.floor_id)}}/>
                                                    <span>{record.name}</span>
                                                    </div>
                                                    <div style={{display:"flex"}}>
                                                    <div className='room-box'> 12 Rooms </div>
                                                    <button style={{border:"none", backgroundColor:"white"}}><i className="uil uil-angle-right"></i></button>
                                                    </div>
                                                </div>
                                            )
                                            
                                    })}
                                    <div>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                        </>);
                    })}

                    {selectedOptions.map((el, index) => {
                        if(el.value!=="location_type"){
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
                           
                            </Dropdown.Menu>
                        </Dropdown>
                        </>);
                    })}
                     {selectedOptions.map((el, index) => {
                        if(el.value!=="equip_type"){
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
                                <div>
                                    <div className='m-1'>
                                        <div className="explore-search mr-2">
                                            <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                            <input className="search-box ml-2" type="search" name="search" placeholder="Search" />
                                        </div>
                                        <div style={{height:"250px",overflowY:"scroll"}}>
                                        {equipOptions.map((record)=>{
                                        
                                        return(
                                            <div className='floor-box'>
                                                <div>
                                                <input type="checkbox" className='mr-2' id={record.value} value={record.value} onClick={(e)=>{handleSelectedEquip(e)}}/>
                                                <span>{record.label}</span>
                                                </div>
                                            </div>
                                        )
                                        
                                      })}
                                      </div>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                        </>);
                    })}
                     {selectedOptions.map((el, index) => {
                        if(el.value!=="endUse_category"){
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
                            <div>
                                    <div className='m-1'>
                                        <div className="explore-search mr-2">
                                            <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                            <input className="search-box ml-2" type="search" name="search" placeholder="Search" />
                                        </div>
                                        <div style={{height:"250px",overflowY:"scroll"}}>
                                        {endUseOptions.map((record)=>{
                                        
                                        return(
                                            <div className='floor-box'>
                                                <div>
                                                <input type="checkbox" className='mr-2' id={record.value} value={record.value} onClick={(e)=>{handleSelectedEndUse(e)}}/>
                                                <span>{record.label}</span>
                                                </div>
                                            </div>
                                        )
                                        
                                      })}
                                      </div>
                                    </div>
                                </div>
                            </Dropdown.Menu>
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
                        <ExploreEquipmentTable
                            exploreTableData={exploreTableData}
                            isExploreDataLoading={isExploreDataLoading}
                            topEnergyConsumption={topEnergyConsumption}
                            topPeakConsumption={topPeakConsumption}
                            handleChartOpen={handleChartOpen}
                            setEquipmentFilter={setEquipmentFilter}
                            selectedEquipmentId={selectedEquipmentId}
                            setSelectedEquipmentId={setSelectedEquipmentId}
                            removeEquipmentId={removeEquipmentId}
                            setRemovedEquipmentId={setRemovedEquipmentId}
                            equipmentListArray={equipmentListArray}
                            setEquipmentListArray={setEquipmentListArray}
                        />
                    </Col>
                </div>
            </Row>

            <EquipChartModal
                showEquipmentChart={showEquipmentChart}
                handleChartOpen={handleChartOpen}
                handleChartClose={handleChartClose}
                equipmentFilter={equipmentFilter}
            />
        </>
    );
};

export default ExploreByEquipment;
