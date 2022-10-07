import React, { useState, useEffect } from 'react';
//import DatePicker from 'react-datepicker';
import { Row, Col, Input, Card, CardBody, Table } from 'reactstrap';
import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { xaxisFilters } from '../../helpers/explorehelpers';
import {
    BaseUrl,
    getExploreEquipmentList,
    getExploreEquipmentChart,
    getFloors,
    equipmentType,
    getEndUseId,
    getSpaceTypes,
    getSpaces,
} from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTableColumns, faDownload } from '@fortawesome/pro-regular-svg-icons';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
import { MultiSelect } from 'react-multi-select-component';
import { Spinner } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Line } from 'rc-progress';
import { useParams } from 'react-router-dom';
import EquipChartModal from './EquipChartModal';
import Dropdown from 'react-bootstrap/Dropdown';
//import ApexCharts from 'apexcharts';
import './style.css';
//import { forEach, remove } from 'lodash';
import RangeSlider from './RangeSlider';
//import { FilterList, FilterListSharp } from '@mui/icons-material';
import moment from 'moment';
import 'moment-timezone';
import { CSVLink } from 'react-csv';
import Header from '../../components/Header';
import { set } from 'lodash';
import { selectedEquipment, totalSelectionEquipmentId } from '../../store/globalState';
import { useAtom } from 'jotai';
import Enumerable from 'linq';
import './Linq';

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
    setEquipmentListArray,
    nextPageData,
    previousPageData,
    paginationData,
    pageSize,
    setPageSize,
}) => {
    const [equpimentIdSelection, setEqupimentIdSelection] = useAtom(selectedEquipment);
    const [totalEquipmentId, setTotalEquipmentId] = useAtom(totalSelectionEquipmentId);

    const handleSelectionAll = (e) => {
        var ischecked = document.getElementById('selection');
        if (ischecked.checked == true) {
            let arr = [];
            for (var i = 0; i < exploreTableData.length; i++) {
                arr.push(exploreTableData[i].equipment_id);
                var checking = document.getElementById(exploreTableData[i].equipment_id);
                checking.checked = ischecked.checked;
            }
            setEquipmentListArray(arr);
        } else {
            for (var i = 0; i < exploreTableData.length; i++) {
                var checking = document.getElementById(exploreTableData[i].equipment_id);
                checking.checked = ischecked.checked;
            }
            ischecked.checked = ischecked.checked;
        }
    };

    const handleSelection = (id) => {
        var isChecked = document.getElementById(id);
        if (isChecked.checked == true) {
            setSelectedEquipmentId(id);
        } else {
            setRemovedEquipmentId(id);
        }
    };

    useEffect(() => {
        if (equpimentIdSelection) {
            setSelectedEquipmentId(equpimentIdSelection);
        }
    }, [equpimentIdSelection?.length > 0]);

    return (
        <>
            <Card>
                <CardBody>
                    <Col md={8}>
                        <Table className="mb-0 bordered mouse-pointer">
                            <thead>
                                <tr>
                                    <th className="table-heading-style">
                                        <input
                                            type="checkbox"
                                            className="mr-4"
                                            id="selection"
                                            disabled
                                            onClick={(e) => {
                                                handleSelectionAll(e);
                                            }}
                                        />
                                        Name
                                    </th>
                                    <th className="table-heading-style">Energy Consumption</th>
                                    <th className="table-heading-style">% Change</th>
                                    <th className="table-heading-style">Location</th>
                                    <th className="table-heading-style">Space Type</th>
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
                                                        <input
                                                            type="checkbox"
                                                            className="mr-4"
                                                            id={record?.equipment_id}
                                                            value={record?.equipment_id}
                                                            checked={totalEquipmentId.includes(record?.equipment_id)}
                                                            onClick={(e) => {
                                                                handleSelection(record?.equipment_id);
                                                                setEqupimentIdSelection(record?.equipment_id);
                                                                if (e.target.checked) {
                                                                    setTotalEquipmentId((el) => [
                                                                        ...el,
                                                                        record?.equipment_id,
                                                                    ]);
                                                                }
                                                                if (!e.target.checked) {
                                                                    setTotalEquipmentId((el) =>
                                                                        el.filter((item) => {
                                                                            return item !== record?.equipment_id;
                                                                        })
                                                                    );
                                                                }
                                                            }}
                                                        />
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
                                                        {record?.location === '' ? '-' : record?.location}
                                                    </td>
                                                    <td className="table-content-style font-weight-bold">
                                                        {record?.location_type === '' ? '-' : record?.location_type}
                                                    </td>
                                                    <td className="table-content-style font-weight-bold">
                                                        {record?.equipments_type}
                                                    </td>
                                                    <td className="table-content-style font-weight-bold">
                                                        {record?.end_user}
                                                    </td>

                                                    {/* <td className="table-content-style font-weight-bold">
                                                        {(record?.peak_power?.now / 100000).toFixed(3)} kW
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
                        {/* <div className="page-button-style">
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold mt-4"
                                disabled={
                                    paginationData.pagination !== undefined
                                        ? paginationData.pagination.previous === null
                                            ? true
                                            : false
                                        : false
                                }
                                onClick={() => {
                                    previousPageData(paginationData.pagination.previous);
                                }}>
                                Previous
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold mt-4"
                                disabled={true}
                                onClick={() => {
                                    nextPageData(paginationData.pagination.next);
                                }}>
                                Next
                            </button>
                            <div>
                                <select
                                    value={pageSize}
                                    className="btn btn-md btn-light font-weight-bold mt-4"
                                    onChange={(e) => {
                                        setPageSize(parseInt(e.target.value));
                                    }}>
                                    {[20, 50, 100].map((pageSize) => (
                                        <option key={pageSize} value={pageSize} className="align-options-center">
                                            Show {pageSize} devices
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div> */}
                    </Col>
                </CardBody>
            </Card>
        </>
    );
};

const ExploreByEquipment = () => {
    const { bldgId } = useParams();

    const [chartLoading, setChartLoading] = useState(false);

    const [equpimentIdSelection] = useAtom(selectedEquipment);
    const [totalEquipmentId] = useAtom(totalSelectionEquipmentId);

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const [isExploreChartDataLoading, setIsExploreChartDataLoading] = useState(false);

    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    const [seriesData, setSeriesData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const tableColumnOptions = [
        { label: 'Energy Consumption', value: 'consumption' },
        { label: 'Change', value: 'change' },
        { label: 'Location', value: 'location' },
        { label: 'Space Type', value: 'location_type' },
        { label: 'Equipment Type', value: 'equip_type' },
        { label: 'End Use Category', value: 'endUse_category' },
    ];
    const [equipOptions, setEquipOptions] = useState([]);
    const [endUseOptions, setEndUseOptions] = useState([]);
    const [paginationData, setPaginationData] = useState({});
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
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
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true,
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
        colors: [
            '#3C6DF5',
            '#12B76A',
            '#DC6803',
            '#088AB2',
            '#EF4444',
            '#800000',
            '#FFA500',
            '#0AFFFF',
            '#033E3E',
            '#E2F516',
        ],
        fill: {
            opacity: 1,
            colors: [
                '#3C6DF5',
                '#12B76A',
                '#DC6803',
                '#088AB2',
                '#EF4444',
                '#800000',
                '#FFA500',
                '#0AFFFF',
                '#033E3E',
                '#E2F516',
            ],
        },
        markers: {
            size: 0,
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
            //         formatter: function (val, timestamp) {
            //             return moment(timestamp).format('DD/MM - HH:mm');
            //         },
            //     },
            // },
            // y: {
            //     formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
            //         return value;
            //     },
            // },
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { colors } = w.globals;
                console.log(colors);
                const { seriesX } = w.globals;
                const { seriesNames } = w.globals;
                const timestamp = seriesX[seriesIndex][dataPointIndex];
                let ch = '';
                ch =
                    ch +
                    `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">${moment
                        .utc(seriesX[0][dataPointIndex])
                        .format(`MMM D 'YY @ hh:mm A`)}</div><table style="border:none;">`;
                for (let i = 0; i < series.length; i++) {
                    ch =
                        ch +
                        `<tr style="style="border:none;"><td><span class="tooltipclass" style="background-color:${
                            colors[i]
                        };"></span> &nbsp;${seriesNames[i]} </td><td> &nbsp;${series[i][dataPointIndex].toFixed(
                            3
                        )} kWh </td></tr>`;
                }

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title" style="font-weight:bold;">Energy Consumption</h6>
                        ${ch}
                    </table></div>`;
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return moment.utc(timestamp).format('DD/MM HH:00');
                    // return `${moment(timestamp).format('DD/MMM')} ${moment(timestamp).format('LT')}`;
                },
            },
            tickAmount: 24,
            tickPlacement: 'between',
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
        colors: [
            '#3C6DF5',
            '#12B76A',
            '#DC6803',
            '#088AB2',
            '#EF4444',
            '#800000',
            '#FFA500',
            '#0AFFFF',
            '#033E3E',
            '#E2F516',
        ],
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
                    return moment.utc(timestamp).format('DD/MM');
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
        legend: {
            show: false,
        },
    });

    const [APIFlag, setAPIFlag] = useState(false);
    const [APILocFlag, setAPILocFlag] = useState(false);
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
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedEquipType, setSelectedEquipType] = useState([]);
    const [selectedEndUse, setSelectedEndUse] = useState([]);
    const [selectedSpaceType, setSelectedSpaceType] = useState([]);
    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [selectedModalTab, setSelectedModalTab] = useState(0);
    const [minConValue, set_minConValue] = useState(0.0);
    const [maxConValue, set_maxConValue] = useState(0.0);
    const [minPerValue, set_minPerValue] = useState(0);
    const [maxPerValue, set_maxPerValue] = useState(100);
    const [spaceType, setSpaceType] = useState([]);
    const [removeDuplicateFlag, setRemoveDuplicateFlag] = useState(false);
    const [equipmentSearchTxt, setEquipmentSearchTxt] = useState('');

    const [consumptionTxt, setConsumptionTxt] = useState('');
    const [locationTxt, setLocationTxt] = useState('');
    const [spaceTxt, setSpaceTxt] = useState('');
    const [equipmentTxt, setEquipmentTxt] = useState('');
    const [endUseTxt, setEndUseTxt] = useState('');
    const [removeDuplicateTxt, setRemoveDuplicateTxt] = useState('');
    const [selectedAllEquipmentId, setSelectedAllEquipmentId] = useState([]);
    const [objectExplore, setObjectExplore] = useState([]);
    const [showSpace, setShowSpace] = useState(false);
    const [spaceListAPI, setSpaceListAPI] = useState([]);
    const [selectedLoc, setSelectedLoc] = useState({});

    useEffect(() => {
        let xaxisObj = xaxisFilters(daysCount, timeZone);
        setOptionsData({ ...optionsData, xaxis: xaxisObj });
        setOptionsLineData({ ...optionsLineData, xaxis: xaxisObj });
    }, [daysCount]);

    useEffect(() => {
        if (equpimentIdSelection && totalEquipmentId?.length >= 1) {
            let arr = [];
            for (let i = 0; i < totalEquipmentId?.length; i++) {
                arr.push(totalEquipmentId[i]);
            }
            setSelectedAllEquipmentId(arr);
        } else {
            setSelectedEquipmentId('');
        }
    }, [startDate, endDate]);

    const [showDropdown, setShowDropdown] = useState(false);
    const setDropdown = () => {
        setShowDropdown(!showDropdown);
        if (minConValue !== 0 && maxConValue !== topEnergyConsumption && !showDropdown !== true) {
            setAPIFlag(!APIFlag);
            setConsumptionTxt(`${minConValue} - ${maxConValue} kWh Used`);
        }
    };

    const handleAllEquip = (e) => {
        let slt = document.getElementById('allEquipType');
        if (slt.checked === true) {
            let selectEquip = [];
            for (let i = 0; i < filteredEquipOptions.length; i++) {
                selectEquip.push(filteredEquipOptions[i].value);
                let check = document.getElementById(filteredEquipOptions[i].value);
                check.checked = slt.checked;
            }
            if (filteredEquipOptions.length === 1) {
                setEquipmentTxt(`${filteredEquipOptions[0].label}`);
            } else if (filteredEquipOptions.length === 0) {
                setEquipmentTxt('');
            } else {
                setEquipmentTxt(`${filteredEquipOptions.length} Equipment Types`);
            }
            setSelectedEquipType(selectEquip);
        } else {
            setSelectedEquipType([]);
            for (let i = 0; i < filteredEquipOptions.length; i++) {
                let check = document.getElementById(filteredEquipOptions[i].value);
                check.checked = slt.checked;
            }
            setEquipmentTxt('');
        }
    };

    const handleSelectedEquip = (e, equipName) => {
        let selection = document.getElementById(e.target.value);
        if (selection.checked === true) {
            if (selectedEquipType.length === 0) {
                setEquipmentTxt(`${equipName}`);
            } else {
                setEquipmentTxt(`${selectedEquipType.length + 1} Equipment Types`);
            }
            setSelectedEquipType([...selectedEquipType, e.target.value]);
        } else {
            let slt = document.getElementById('allEquipType');
            slt.checked = selection.checked;
            if (selectedEquipType.length === 1) {
                setEquipmentTxt('');
            } else if (selectedEquipType.length === 2) {
                let arr = selectedEquipType.filter(function (item) {
                    return item !== e.target.value;
                });
                let arr1 = filteredEquipOptions.filter(function (item) {
                    return item.value === arr[0];
                });

                setEquipmentTxt(`${arr1[0].label}`);
            } else {
                setEquipmentTxt(`${selectedEquipType.length - 1} Equipment Types`);
            }
            let arr = selectedEquipType.filter(function (item) {
                return item !== e.target.value;
            });
            setSelectedEquipType(arr);
        }
    };

    const handleAllEndUse = (e) => {
        let slt = document.getElementById('allEndUse');
        if (slt.checked === true) {
            let selectEndUse = [];
            for (let i = 0; i < filteredEndUseOptions.length; i++) {
                selectEndUse.push(filteredEndUseOptions[i].value);
                let check = document.getElementById(filteredEndUseOptions[i].value);
                check.checked = slt.checked;
            }

            if (filteredEndUseOptions.length === 1) {
                setEndUseTxt(`${filteredEndUseOptions[0].label}`);
            } else if (filteredEndUseOptions.length === 0) {
                setEndUseTxt('');
            } else {
                setEndUseTxt(`${filteredEndUseOptions.length} End Use Category`);
            }
            setSelectedEndUse(selectEndUse);
        } else {
            setSelectedEndUse([]);
            for (let i = 0; i < filteredEndUseOptions.length; i++) {
                let check = document.getElementById(filteredEndUseOptions[i].value);
                check.checked = slt.checked;
            }
            setEndUseTxt('');
        }
    };

    const handleSelectedEndUse = (e, endUseName) => {
        let selection = document.getElementById(e.target.value);
        if (selection.checked === true) {
            if (selectedEndUse.length === 0) {
                setEndUseTxt(`${endUseName}`);
            } else {
                setEndUseTxt(`${selectedEndUse.length + 1} End Use Category`);
            }
            setSelectedEndUse([...selectedEndUse, e.target.value]);
        } else {
            let slt = document.getElementById('allEndUse');
            slt.checked = selection.checked;
            if (selectedEndUse.length === 1) {
                setEndUseTxt('');
            } else if (selectedEndUse.length === 2) {
                let arr = selectedEndUse.filter(function (item) {
                    return item !== e.target.value;
                });
                let arr1 = filteredEndUseOptions.filter(function (item) {
                    return item.value === arr[0];
                });

                setEndUseTxt(`${arr1[0].label}`);
            } else {
                setEndUseTxt(`${selectedEndUse.length - 1} End Use category`);
            }
            let arr = selectedEndUse.filter(function (item) {
                return item !== e.target.value;
            });
            setSelectedEndUse(arr);
        }
    };

    const handleAllLocation = async (e) => {
        let slt = document.getElementById('allLocation');
        let spacedata = [];
        let sp = [];
        if (slt.checked === true) {
            let selectLoc = [];
            for (let i = 0; i < filteredLocationOptions.length; i++) {
                //selectLoc.push(filteredLocationOptions[i].floor_id);
                let check = document.getElementById(filteredLocationOptions[i].floor_id);
                check.checked = slt.checked;
                const headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let spc = [];
                const params = `?floor_id=${filteredLocationOptions[i].floor_id}&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {
                    spc = res.data.data;
                    spc.map((ele) => {
                        spacedata.push(ele);
                    });
                });
                console.log(spacedata);
            }
            console.log(spacedata);
            let rvmsp = [];
            for (var i = 0; i < removeLocationDuplication.length; i++) {
                for (var j = 0; j < spacedata.length; j++) {
                    if (removeLocationDuplication[i].location.includes(spacedata[j].name)) {
                        let arr = rvmsp.filter(function (item) {
                            return item.name === spacedata[j].name;
                        });
                        if (arr.length === 0) rvmsp.push(spacedata[j]);
                    }
                }
            }
            console.log(rvmsp);
            selectedLocation.map((ele) => {
                sp.push(ele);
            });
            rvmsp.map((el) => {
                sp.push(el?._id);
            });
            console.log(sp);
            // if (filteredLocationOptions.length === 1) {
            //     setLocationTxt(`${filteredLocationOptions[0].name}`);
            // } else if (filteredLocationOptions.length === 0) {
            //     setLocationTxt('');
            // } else {
            //     setLocationTxt(`${floorListAPI.length} Locations`);
            // }
            setSelectedLocation(sp);
        } else {
            setSelectedLocation([]);
            for (let i = 0; i < filteredLocationOptions.length; i++) {
                let check = document.getElementById(filteredLocationOptions[i].floor_id);
                check.checked = slt.checked;
            }
            setLocationTxt('');
        }
    };

    const handleSelectedLocation = async (e, locName) => {
        let spacedata = [];
        let sp = [];
        let selection = document.getElementById(e.target.value);
        if (selection.checked === true) {
            // if (selectedLocation.length === 0) {
            //     setLocationTxt(`${locName}`);
            // } else {
            //     setLocationTxt(`${selectedLocation.length + 1} Locations`);
            // }

            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            const params = `?floor_id=${e.target.value}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {
                spacedata = res.data.data;
                console.log(res.data.data);
            });
            let rvmsp = [];
            for (var i = 0; i < removeLocationDuplication.length; i++) {
                for (var j = 0; j < spacedata.length; j++) {
                    if (removeLocationDuplication[i].location.includes(spacedata[j].name)) {
                        let arr = rvmsp.filter(function (item) {
                            return item.name === spacedata[j].name;
                        });
                        if (arr.length === 0) {
                            rvmsp.push(spacedata[j]);
                        }
                    }
                }
            }
            console.log(rvmsp);
            selectedLocation.map((ele) => {
                sp.push(ele);
            });
            rvmsp.map((el) => {
                sp.push(el?._id);
            });
            console.log(sp);
            setSelectedLocation(sp);
        } else {
            // if (selectedLocation.length === 1) {
            //     setLocationTxt('');
            // } else if (selectedLocation.length === 2) {
            // let arr = selectedLocation.filter(function (item) {
            //     return item !== e.target.value;
            // });
            // let arr1 = floorListAPI.filter(function (item) {
            //     return item.floor_id === arr[0];
            // });

            //     setLocationTxt(`${arr1[0].name}`);
            // } else {
            //     setLocationTxt(`${selectedLocation.length - 1} Locations`);
            // }
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            const params = `?floor_id=${e.target.value}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {
                spacedata = res.data.data;
            });
            let arr = selectedLocation;
            spacedata.map((el) => {
                arr = arr.filter(function (item) {
                    return item !== el?._id;
                });
            });
            console.log(arr);
            setSelectedLocation(arr);
        }
    };

    const handleAllSpaceType = (e) => {
        let slt = document.getElementById('allSpaceType');
        if (slt.checked === true) {
            let selectSpace = [];
            for (let i = 0; i < filteredSpaceTypeOptions.length; i++) {
                selectSpace.push(filteredSpaceTypeOptions[i].value);
                let check = document.getElementById(filteredSpaceTypeOptions[i].value);
                check.checked = slt.checked;
            }
            if (filteredSpaceTypeOptions.length === 1) {
                setSpaceTxt(`${filteredSpaceTypeOptions[0].label}`);
            } else if (filteredSpaceTypeOptions.length === 0) {
                setSpaceTxt('');
            } else {
                setSpaceTxt(`${filteredSpaceTypeOptions.length} Space Types`);
            }
            setSelectedSpaceType(selectSpace);
        } else {
            setSelectedSpaceType([]);
            for (let i = 0; i < filteredSpaceTypeOptions.length; i++) {
                let check = document.getElementById(filteredSpaceTypeOptions[i].value);
                check.checked = slt.checked;
            }
            setSpaceTxt('');
        }
    };

    const handleSelectedSpaceType = (e, spaceName) => {
        let selection = document.getElementById(e.target.value);
        if (selection.checked === true) {
            if (selectedSpaceType.length === 0) {
                setSpaceTxt(`${spaceName}`);
            } else {
                setSpaceTxt(`${selectedSpaceType.length + 1} Space Types`);
            }
            setSelectedSpaceType([...selectedSpaceType, e.target.value]);
        } else {
            let slt = document.getElementById('allSpaceType');
            slt.checked = selection.checked;
            if (selectedSpaceType.length === 1) {
                setSpaceTxt('');
            } else if (selectedSpaceType.length === 2) {
                let arr = selectedSpaceType.filter(function (item) {
                    return item !== e.target.value;
                });
                let arr1 = filteredSpaceTypeOptions.filter(function (item) {
                    return item.value === arr[0];
                });

                setSpaceTxt(`${arr1[0].label}`);
            } else {
                setSpaceTxt(`${selectedSpaceType.length - 1} Space Types`);
            }
            let arr = selectedSpaceType.filter(function (item) {
                return item !== e.target.value;
            });
            setSelectedSpaceType(arr);
        }
    };

    const handleInput = (values) => {
        set_minConValue(values[0]);
        set_maxConValue(values[1]);
    };

    const handleInputPer = (values) => {
        set_minPerValue(values[0]);
        set_maxPerValue(values[1]);
    };

    const exploreFilterDataFetch = async (bodyVal, txt) => {
        try {
            setIsExploreDataLoading(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?consumption=energy&building_id=${bldgId}`;

            await axios.post(`${BaseUrl}${getExploreEquipmentList}${params}`, bodyVal, { headers }).then((res) => {
                let responseData = res.data;
                setPaginationData(res.data);
                setSeriesData([]);
                setSeriesLineData([]);
                if (txt === 'consumption' || txt === 'endUse') removeDuplicatesEndUse(txt, responseData.data);
                if (responseData.data.length !== 0) {
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

    const uniqueIds = [];
    const [removeEqupimentTypesDuplication, setRemoveEqupimentTypesDuplication] = useState();

    const uniqueEndUseIds = [];
    const [removeEndUseDuplication, setRemoveEndUseDuplication] = useState();

    const uniqueLocationIds = [];
    const [removeLocationDuplication, setRemoveLocationDuplication] = useState();
    const uniqueSpaceTypeIds = [];
    const [removeSpaceTypeDuplication, setRemoveSpaceTyepDuplication] = useState();

    const removeDuplicates = () => {
        const uniqueEqupimentTypes = exploreTableData.filter((element) => {
            const isDuplicate = uniqueIds.includes(element.equipments_type);
            if (!isDuplicate) {
                uniqueIds.push(element.equipments_type);
                return true;
            }
            return false;
        });
        const uniqueEndUse = exploreTableData.filter((element) => {
            const isDuplicate = uniqueEndUseIds.includes(element?.end_user);

            if (!isDuplicate) {
                uniqueEndUseIds.push(element?.end_user);
                return true;
            }
            return false;
        });
        const uniqueLocation = exploreTableData.filter((element) => {
            const isDuplicate = uniqueLocationIds.includes(element?.location);

            if (!isDuplicate) {
                uniqueLocationIds.push(element?.location);
                return true;
            }
            return false;
        });
        const uniqueSpaceType = exploreTableData.filter((element) => {
            const isDuplicate = uniqueSpaceTypeIds.includes(element?.location_type);

            if (!isDuplicate) {
                uniqueSpaceTypeIds.push(element?.location_type);
                return true;
            }
            return false;
        });

        console.log('loc ', uniqueLocation);
        setRemoveEndUseDuplication(uniqueEndUse);

        setRemoveEqupimentTypesDuplication(uniqueEqupimentTypes);
        setRemoveLocationDuplication(uniqueLocation);
        setRemoveSpaceTyepDuplication(uniqueSpaceType);
    };

    useEffect(() => {
        if (exploreTableData.length === 0) {
            setRemoveEndUseDuplication([]);
            setRemoveEqupimentTypesDuplication([]);
            setRemoveLocationDuplication([]);
            setRemoveSpaceTyepDuplication([]);
        } else removeDuplicates();
    }, [removeDuplicateFlag]);

    // const bldgId = BuildingStore.useState((s) => s.BldgId);
    const exploreDataFetch = async (bodyVal) => {
        try {
            setIsExploreDataLoading(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?consumption=energy&building_id=${bldgId}`;

            await axios.post(`${BaseUrl}${getExploreEquipmentList}${params}`, bodyVal, { headers }).then((res) => {
                let responseData = res.data;
                setPaginationData(res.data);
                if (responseData.data.length !== 0) {
                    setTopEnergyConsumption(responseData.data[0].consumption.now);
                    setTopPeakConsumption((responseData.data[0].peak_power.now / 100000).toFixed(2));
                    set_minConValue(0.0);
                    set_maxConValue((responseData.data[0].consumption.now / 1000).toFixed(2));
                }
                setExploreTableData(responseData.data);
                setRemoveDuplicateFlag(!removeDuplicateFlag);
                setIsExploreDataLoading(false);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore Data');
            setIsExploreDataLoading(false);
        }
    };
    let arr = {
        date_from: startDate.toLocaleDateString(),
        date_to: endDate.toLocaleDateString(),
        tz_info: timeZone,
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
        const fetchSpacetypes = async () => {
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?building_id=${bldgId}`;
            axios.get(`${BaseUrl}${getSpaceTypes}${params}`, { headers }).then((res) => {
                let response = res?.data?.data?.[0]?.generic_spacetypes;
                setSpaceType(response);
            });
        };
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
                    let equipData = [];
                    for (var i = 0; i < response.length; i++) {
                        let rec = { label: response[i].equipment_type, value: response[i].equipment_id };
                        equipData.push(rec);
                    }
                    setEquipOptions(equipData);
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
                    let equipData = [];
                    for (var i = 0; i < response.length; i++) {
                        let rec = { label: response[i].name, value: response[i].end_user_id };
                        equipData.push(rec);
                    }
                    setEndUseOptions(equipData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch End Use Data');
            }
        };

        exploreDataFetch(arr);
        fetchEquipTypeData();
        fetchEndUseData();
        fetchSpacetypes();
    }, [startDate, endDate, bldgId]);

    const nextPageData = async (path) => {
        try {
            setIsExploreDataLoading(true);
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let arr = {
                date_from: startDate.toLocaleDateString(),
                date_to: endDate.toLocaleDateString(),
                tz_info: timeZone,
            };
            let params = `?consumption=energy&building_id=${bldgId}`;
            await axios.post(`${BaseUrl}${path}`, arr, { headers }).then((res) => {
                let responseData = res.data;
                setPaginationData(res.data);
                if (responseData.data.length !== 0) {
                    setSeriesData([]);
                    setSeriesLineData([]);
                    setTopEnergyConsumption(responseData.data[0].consumption.now);
                    setTopPeakConsumption((responseData.data[0].peak_power.now / 100000).toFixed(2));
                    set_minConValue(0.0);
                    set_maxConValue((responseData.data[0].consumption.now / 1000).toFixed(2));
                }
                setExploreTableData(responseData.data);
                setRemoveDuplicateFlag(!removeDuplicateFlag);
                setIsExploreDataLoading(false);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore by equipment');
            setIsExploreDataLoading(false);
        }
    };

    const previousPageData = async (path) => {
        try {
            setIsExploreDataLoading(true);
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let arr = {
                date_from: startDate.toLocaleDateString(),
                date_to: endDate.toLocaleDateString(),
                tz_info: timeZone,
            };
            let params = `?consumption=energy&building_id=${bldgId}`;
            await axios.post(`${BaseUrl}${path}`, arr, { headers }).then((res) => {
                let responseData = res.data;
                setPaginationData(res.data);
                if (responseData.data.length !== 0) {
                    setSeriesData([]);
                    setSeriesLineData([]);
                    setTopEnergyConsumption(responseData.data[0].consumption.now);
                    setTopPeakConsumption((responseData.data[0].peak_power.now / 100000).toFixed(2));
                    set_minConValue(0.0);
                    set_maxConValue((responseData.data[0].consumption.now / 1000).toFixed(2));
                }
                setExploreTableData(responseData.data);
                setRemoveDuplicateFlag(!removeDuplicateFlag);
                setIsExploreDataLoading(false);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore by equipment');
            setIsExploreDataLoading(false);
        }
    };

    const [filteredEquipOptions, setFilteredEquipOptions] = useState([]);
    const [filteredEquipOptionsCopy, setFilteredEquipOptionsCopy] = useState([]);
    useEffect(() => {
        if (equipOptions.length === 0 || removeEqupimentTypesDuplication.length === 0) {
            setFilteredEquipOptions([]);
            setFilteredEquipOptionsCopy([]);
            return;
        }
        let rvmEquip = [];
        for (var i = 0; i < removeEqupimentTypesDuplication.length; i++) {
            let arr = equipOptions.filter(function (item) {
                return item.label === removeEqupimentTypesDuplication[i].equipments_type;
            });
            let rec = { label: arr[0].label, value: arr[0].value };
            rvmEquip.push(rec);
        }
        setFilteredEquipOptions(rvmEquip);
        setFilteredEquipOptionsCopy(rvmEquip);
    }, [equipOptions, removeEqupimentTypesDuplication]);

    const [filteredEndUseOptions, setFilteredEndUseOptions] = useState([]);
    const [filteredEndUseOptionsCopy, setFilteredEndUseOptionsCopy] = useState([]);

    useEffect(() => {
        if (endUseOptions.length === 0 || removeEndUseDuplication.length === 0) {
            setFilteredEndUseOptions([]);
            setFilteredEndUseOptionsCopy([]);
            return;
        }
        let rvmEndUse = [];
        for (var i = 0; i < removeEndUseDuplication.length; i++) {
            let arr = endUseOptions.filter(function (item) {
                return item.label === removeEndUseDuplication[i].end_user;
            });
            let rec = { label: arr[0].label, value: arr[0].value };
            rvmEndUse.push(rec);
        }
        setFilteredEndUseOptions(rvmEndUse);
        setFilteredEndUseOptionsCopy(rvmEndUse);
    }, [endUseOptions, removeEndUseDuplication]);

    const [filteredLocationOptions, setFilteredLocationOptions] = useState([]);
    const [filteredLocationOptionsCopy, setFilteredLocationOptionsCopy] = useState([]);
    useEffect(() => {
        if (floorListAPI.length === 0 || removeLocationDuplication.length === 0) {
            setFilteredLocationOptions([]);
            setFilteredLocationOptionsCopy([]);
            return;
        }
        let rvmLocation = [];
        for (var i = 0; i < removeLocationDuplication.length; i++) {
            for (var j = 0; j < floorListAPI.length; j++) {
                if (removeLocationDuplication[i].location.includes(floorListAPI[j].name)) {
                    let arr = rvmLocation.filter(function (item) {
                        return item.name === floorListAPI[j].name;
                    });
                    if (arr.length === 0) rvmLocation.push(floorListAPI[j]);
                }
            }
        }
        console.log('loc ', rvmLocation);
        setFilteredLocationOptions(rvmLocation);
        setFilteredLocationOptionsCopy(rvmLocation);
    }, [floorListAPI, removeLocationDuplication]);

    const [filteredSpaceTypeOptions, setFilteredSpaceTypeOptions] = useState([]);
    const [filteredSpaceTypeOptionsCopy, setFilteredSpaceTypeOptionsCopy] = useState([]);

    useEffect(() => {
        if (spaceType.length === 0 || removeSpaceTypeDuplication.length === 0) {
            setFilteredSpaceTypeOptions([]);
            setFilteredSpaceTypeOptionsCopy([]);
            return;
        }
        let rvmSpaceType = [];
        for (var i = 0; i < removeSpaceTypeDuplication.length; i++) {
            let arr = spaceType.filter(function (item) {
                return item.name === removeSpaceTypeDuplication[i].location_type;
            });
            if (arr.length > 0) {
                let rec = { label: arr[0].name, value: arr[0].id };
                rvmSpaceType.push(rec);
            }
        }
        setFilteredSpaceTypeOptions(rvmSpaceType);
        setFilteredSpaceTypeOptionsCopy(rvmSpaceType);
    }, [spaceType, removeSpaceTypeDuplication]);

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
        if (selectedEquipmentId === '') {
            return;
        }
        const fetchExploreChartData = async () => {
            setChartLoading(true);
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy&equipment_id=${selectedEquipmentId}&divisible_by=1000`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreEquipmentChart}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        let data = responseData.data;
                        let arr = [];
                        arr = exploreTableData.filter(function (item) {
                            return item.equipment_id === selectedEquipmentId;
                        });
                        let exploreData = [];
                        let sg = '';
                        let legendName = '';
                        sg = arr[0].location.substring(arr[0].location.indexOf('>') + 1);
                        if (sg === '') {
                            legendName = arr[0].equipment_name;
                        } else {
                            legendName = arr[0].equipment_name + ' - ' + sg;
                        }

                        let recordToInsert = {
                            name: legendName,
                            data: data,
                            id: arr[0].equipment_id,
                        };
                        let coll = [];
                        let sname = arr[0].equipment_name;
                        data.map((el) => {
                            let ab = {};
                            ab['timestamp'] = el[0];
                            ab[sname] = el[1];
                            coll.push(ab);
                        });
                        if (objectExplore.length === 0) {
                            setObjectExplore(coll);
                        } else {
                            console.log(objectExplore);
                            const result = Enumerable.from(objectExplore)
                                .fullOuterJoin(
                                    Enumerable.from(coll),
                                    (pk) => pk.timestamp,
                                    (fk) => fk.timestamp,
                                    (left, right) => ({ ...left, ...right })
                                )
                                .toArray();
                            console.log('join Result ', result);
                            setObjectExplore(result);
                            // var s = new Set();
                            // var result = [];
                            // objectExplore.forEach(function (e) {
                            //     result.push(Object.assign({}, e));
                            //     s.add(e.timestamp);
                            // });
                            // coll.forEach(function (e) {
                            //     if (!s.has(e.timestamp)) {
                            //         var temp = Object.assign({}, e);
                            //         temp[sname] = null;
                            //         result.push(temp);
                            //     }
                            // });
                        }

                        setSeriesData([...seriesData, recordToInsert]);
                        setSeriesLineData([...seriesLineData, recordToInsert]);
                        setSelectedEquipmentId('');
                        setChartLoading(false);
                        //setIsExploreDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                //setIsExploreDataLoading(false);
            }
        };
        fetchExploreChartData();
    }, [selectedEquipmentId, equpimentIdSelection]);

    useEffect(() => {
        if (selectedAllEquipmentId.length === 1) {
            const myTimeout = setTimeout(fetchExploreAllChartData(selectedAllEquipmentId[0]), 100000);
        } else {
            selectedAllEquipmentId.map((ele) => {
                const myTimeout = setTimeout(fetchExploreAllChartData(ele), 100000);
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
        setSeriesData(arr1);
        setSeriesLineData(arr1);
    }, [removeEquipmentId]);

    const dataarr = [];

    const fetchExploreAllChartData = async (id) => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?consumption=energy&equipment_id=${id}&divisible_by=1000`;
            await axios
                .post(
                    `${BaseUrl}${getExploreEquipmentChart}${params}`,
                    {
                        date_from: startDate.toLocaleDateString(),
                        date_to: endDate.toLocaleDateString(),
                        tz_info: timeZone,
                    },
                    { headers }
                )
                .then((res) => {
                    let responseData = res.data;
                    let data = responseData.data;
                    let arr = [];
                    arr = exploreTableData.filter(function (item) {
                        return item.equipment_id === id;
                    });
                    let exploreData = [];
                    let sg = '';
                    let legendName = '';
                    sg = arr[0].location.substring(arr[0].location.indexOf('>') + 1);
                    if (sg === '') {
                        legendName = arr[0].equipment_name;
                    } else {
                        legendName = arr[0].equipment_name + ' - ' + sg;
                    }

                    let recordToInsert = {
                        name: legendName,
                        data: data,
                        id: arr[0].equipment_id,
                    };
                    dataarr.push(recordToInsert);
                    if (totalEquipmentId.length === dataarr.length) {
                        setSeriesData(dataarr);
                        setSeriesLineData(dataarr);
                    }
                    setAllEquipmenData(dataarr);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore Data');
            //setIsExploreDataLoading(false);
        }
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
            setSeriesLineData(allEquipmentData);
        }
    }, [allEquipmentData]);

    const handleCloseFilter = (e, val) => {
        let arr = [];
        arr = selectedOptions.filter(function (item) {
            return item.value !== val;
        });
        setSelectedOptions(arr);
        let txt = '';
        let arr1 = {};
        arr1['date_from'] = startDate;
        arr1['date_to'] = endDate;
        let topVal = (topEnergyConsumption / 1000).toFixed(3);
        switch (val) {
            case 'consumption':
                if (selectedLocation.length !== 0) {
                    arr1['location'] = selectedLocation;
                }
                if (selectedEquipType.length !== 0) {
                    arr1['equipment_types'] = selectedEquipType;
                }
                if (selectedEndUse.length !== 0) {
                    arr1['end_use'] = selectedEndUse;
                }
                if (selectedSpaceType.length !== 0) {
                    arr1['space_type'] = selectedSpaceType;
                }
                txt = 'consumption';
                set_minConValue(0.0);
                set_maxConValue(topVal);
                break;
            case 'location':
                setSelectedLocation([]);
                if (maxConValue > 0.01 && (maxConValue !== topVal || minConValue !== 0.0)) {
                    arr1['consumption_range'] = {
                        gte: minConValue * 1000,
                        lte: maxConValue * 1000,
                    };
                }
                if (selectedEquipType.length !== 0) {
                    arr1['equipment_types'] = selectedEquipType;
                }
                if (selectedEndUse.length !== 0) {
                    arr1['end_use'] = selectedEndUse;
                }
                if (selectedSpaceType.length !== 0) {
                    arr1['space_type'] = selectedSpaceType;
                }
                break;
            case 'equip_type':
                setSelectedEquipType([]);
                if (maxConValue > 0.01 && (maxConValue !== topVal || minConValue !== 0.0)) {
                    arr1['consumption_range'] = {
                        gte: minConValue * 1000,
                        lte: maxConValue * 1000,
                    };
                }
                if (selectedEndUse.length !== 0) {
                    arr1['end_use'] = selectedEndUse;
                }
                if (selectedLocation.length !== 0) {
                    arr1['location'] = selectedLocation;
                }
                if (selectedSpaceType.length !== 0) {
                    arr1['space_type'] = selectedSpaceType;
                }
                break;
            case 'endUse_category':
                setSelectedEndUse([]);
                if (maxConValue > 0.01 && (maxConValue !== topVal || minConValue !== 0.0)) {
                    arr1['consumption_range'] = {
                        gte: minConValue * 1000,
                        lte: maxConValue * 1000,
                    };
                }
                if (selectedEquipType.length !== 0) {
                    arr1['equipment_types'] = selectedEquipType;
                }
                if (selectedLocation.length !== 0) {
                    arr1['location'] = selectedLocation;
                }
                if (selectedSpaceType.length !== 0) {
                    arr1['space_type'] = selectedSpaceType;
                }
                txt = 'endUse';
                break;
            case 'location_type':
                setSelectedSpaceType([]);
                if (maxConValue > 0.01 && (maxConValue !== topVal || minConValue !== 0.0)) {
                    arr1['consumption_range'] = {
                        gte: minConValue * 1000,
                        lte: maxConValue * 1000,
                    };
                }
                if (selectedEquipType.length !== 0) {
                    arr1['equipment_types'] = selectedEquipType;
                }
                if (selectedLocation.length !== 0) {
                    arr1['location'] = selectedLocation;
                }
                if (selectedEndUse.length !== 0) {
                    arr1['end_use'] = selectedEndUse;
                }
                break;
        }
        exploreFilterDataFetch(arr1, txt);
    };

    useEffect(() => {
        if (
            selectedLocation.length === 0 &&
            (maxConValue === 0.0 || maxConValue === 0.01) &&
            selectedEquipType.length === 0 &&
            selectedEndUse.length === 0 &&
            selectedSpaceType.length === 0
        ) {
            return;
        }
        let arr = {};
        let txt = '';
        arr['date_from'] = startDate;
        arr['date_to'] = endDate;
        if (maxConValue > 0.01) {
            arr['consumption_range'] = {
                gte: minConValue * 1000,
                lte: maxConValue * 1000,
            };
            txt = 'consumption';
        }
        if (selectedLocation.length !== 0) {
            arr['location'] = selectedLocation;
        }
        if (selectedEquipType.length !== 0) {
            arr['equipment_types'] = selectedEquipType;
        }
        if (selectedEndUse.length !== 0) {
            arr['end_use'] = selectedEndUse;
            txt = 'endUse';
        }
        if (selectedSpaceType.length !== 0) {
            arr['space_type'] = selectedSpaceType;
        }
        exploreFilterDataFetch(arr, txt);
    }, [APIFlag, APILocFlag, selectedEquipType, selectedEndUse, selectedSpaceType]);

    const clearFilterData = () => {
        setSelectedLocation([]);
        let arr = {
            date_from: startDate.toLocaleDateString(),
            date_to: endDate.toLocaleDateString(),
            tz_info: timeZone,
        };
        exploreDataFetch(arr);
    };
    const handleEndUseSearch = (e) => {
        let txt = e.target.value;
        if (txt !== '') {
            var search = new RegExp(txt, 'i');
            let b = filteredEndUseOptions.filter((item) => search.test(item.label));
            setFilteredEndUseOptions(b);
        } else {
            setFilteredEndUseOptions(filteredEndUseOptionsCopy);
        }
    };
    const handleSpaceTypeSearch = (e) => {
        let txt = e.target.value;
        if (txt !== '') {
            var search = new RegExp(txt, 'i');
            let b = filteredSpaceTypeOptions.filter((item) => search.test(item.label));
            setFilteredSpaceTypeOptions(b);
        } else {
            setFilteredSpaceTypeOptions(filteredSpaceTypeOptionsCopy);
        }
    };
    const handleEquipTypeSearch = (e) => {
        let txt = e.target.value;
        if (txt !== '') {
            var search = new RegExp(txt, 'i');
            let b = filteredEquipOptions.filter((item) => search.test(item.label));
            setFilteredEquipOptions(b);
        } else {
            setFilteredEquipOptions(filteredEquipOptionsCopy);
        }
    };

    const handleLocationSearch = (e) => {
        let txt = e.target.value;
        if (txt !== '') {
            var search = new RegExp(txt, 'i');
            let b = filteredLocationOptions.filter((item) => search.test(item.name));
            setFilteredLocationOptions(b);
        } else {
            setFilteredLocationOptions(filteredLocationOptionsCopy);
        }
    };

    const handleEquipmentSearch = (e) => {
        const exploreDataFetch = async () => {
            try {
                setIsExploreDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy&search_by_name=${equipmentSearchTxt}&building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreEquipmentList}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        if (responseData.data.length !== 0) {
                            setTopEnergyConsumption(responseData.data[0].consumption.now);
                            setTopPeakConsumption((responseData.data[0].peak_power.now / 100000).toFixed(3));
                            set_minConValue(0.0);
                            set_maxConValue((responseData.data[0].consumption.now / 1000).toFixed(3));
                        }
                        setExploreTableData(responseData.data);
                        setRemoveDuplicateFlag(!removeDuplicateFlag);
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
        let sData = [];
        exploreTableData.map(function (obj) {
            let change = percentageHandler(obj.consumption.now, obj.consumption.old) + '%';
            sData.push([
                obj.equipment_name,
                (obj.consumption.now / 1000).toFixed(2) + 'kWh',
                change,
                obj.location,
                obj.location_type,
                obj.equipments_type,
                obj.end_user,
            ]);
        });
        let streamData = exploreTableData.length > 0 ? sData : [];

        return [
            [
                'Name',
                'Energy Consumption',
                '% Change',
                'Location',
                'Location Type',
                'Equipment Type',
                'End Use Category',
            ],
            ...streamData,
        ];
    };

    const getCSVLinkChartData = () => {
        let abc = [];
        let val = [];
        if (objectExplore.length !== 0) {
            val = Object.keys(objectExplore[0]);

            objectExplore.map(function (obj) {
                let acd = [];
                for (let i = 0; i < val.length; i++) {
                    if (val[i] === 'timestamp') {
                        acd.push(moment.utc(obj[val[i]]).format(`MMM D 'YY @ HH:mm A`));
                    } else {
                        acd.push(obj[val[i]]?.toFixed(2));
                    }
                }
                abc.push(acd);
            });
            console.log(abc);
        }

        let streamData = objectExplore.length > 0 ? abc : [];

        return [val, ...streamData];
    };

    useEffect(() => {}, [showDropdown]);

    const removeDuplicatesEndUse = (txt, tabledata) => {
        uniqueIds.length = 0;
        uniqueLocationIds.length = 0;
        uniqueSpaceTypeIds.length = 0;
        if (txt === 'consumption') uniqueEndUseIds.length = 0;
        const uniqueEqupimentTypes = tabledata.filter((element) => {
            const isDuplicate = uniqueIds.includes(element.equipments_type);
            if (!isDuplicate) {
                uniqueIds.push(element.equipments_type);
                return true;
            }
            return false;
        });
        const uniqueLocation = tabledata.filter((element) => {
            const isDuplicate = uniqueLocationIds.includes(element?.location);

            if (!isDuplicate) {
                uniqueLocationIds.push(element?.location);
                return true;
            }
            return false;
        });
        const uniqueSpaceType = tabledata.filter((element) => {
            const isDuplicate = uniqueSpaceTypeIds.includes(element?.location_type);

            if (!isDuplicate) {
                uniqueSpaceTypeIds.push(element?.location_type);
                return true;
            }
            return false;
        });
        if (txt === 'consumption') {
            const uniqueEndUse = tabledata.filter((element) => {
                const isDuplicate = uniqueEndUseIds.includes(element?.end_user);

                if (!isDuplicate) {
                    uniqueEndUseIds.push(element?.end_user);
                    return true;
                }
                return false;
            });

            setRemoveEndUseDuplication(uniqueEndUse);
        }

        setRemoveEqupimentTypesDuplication(uniqueEqupimentTypes);
        setRemoveLocationDuplication(uniqueLocation);
        setRemoveSpaceTyepDuplication(uniqueSpaceType);
    };
    useEffect(() => {
        if (equipmentSearchTxt === '') exploreDataFetch(arr);
    }, [equipmentSearchTxt]);
    const handleGetSpaceByLocation = (e, item) => {
        console.log(item);
        setSelectedLoc(item);
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const params = `?floor_id=${item?.floor_id}&building_id=${bldgId}`;
        axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {
            let spacedata = res.data.data;
            let rvmsp = [];
            for (var i = 0; i < removeLocationDuplication.length; i++) {
                for (var j = 0; j < spacedata.length; j++) {
                    if (removeLocationDuplication[i].location.includes(spacedata[j].name)) {
                        let arr = rvmsp.filter(function (item) {
                            return item.name === spacedata[j].name;
                        });
                        if (arr.length === 0) rvmsp.push(spacedata[j]);
                    }
                }
            }
            console.log(rvmsp);
            setSpaceListAPI(rvmsp);
            setShowSpace(true);
        });
    };
    const handleSelectedSpaces = (e, txt) => {
        let selection = document.getElementById(e.target.value);
        if (selection.checked === true) {
            let arr = selectedLocation.filter(function (item) {
                return item === e.target.value;
            });
            if (arr.length === 0) {
                setSelectedLocation([...selectedLocation, e.target.value]);
            }
        } else {
            let arr = selectedLocation.filter(function (item) {
                return item !== e.target.value;
            });
            setSelectedLocation(arr);
        }
    };
    const handleAllSelectedSpaces = (e, txt) => {
        let selection = document.getElementById('allSpaces');
        if (selection.checked === true) {
            let selectLoc = [];
            for (let i = 0; i < spaceListAPI.length; i++) {
                let check = document.getElementById(spaceListAPI[i]._id);
                check.checked = selection.checked;
                let arr = selectedLocation.filter(function (item) {
                    return item === spaceListAPI[i]._id;
                });
                if (arr.length === 0) {
                    selectLoc.push(spaceListAPI[i]._id);
                }
            }
            selectedLocation.map((ele) => {
                selectLoc.push(ele);
            });
            setSelectedLocation(selectLoc);
        } else {
            for (let i = 0; i < spaceListAPI.length; i++) {
                let check = document.getElementById(spaceListAPI[i]._id);
                check.checked = selection.checked;
            }
            setSelectedLocation([]);
        }
    };

    return (
        <>
            <Row className="ml-2 mt-2 explore-filters-style">
                <Header title="" />
                {chartLoading && <Spinner>Loading...</Spinner>}
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
                                // onCommit={() => {
                                //     exploreDataFetch(arr);
                                // }}
                                onChange={(e) => {
                                    setEquipmentSearchTxt(e.target.value);
                                }}
                            />
                            <button
                                style={{ border: 'none', backgroundColor: '#fff' }}
                                onClick={(e) => {
                                    handleEquipmentSearch(e);
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
                                disabled={isExploreDataLoading}
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
                                    <Dropdown
                                        className="mt-2 me-1 ml-2 btn btn-white d-inline btnHover"
                                        align="end"
                                        onToggle={setDropdown}>
                                        <span className="" style={{ height: '36px', marginLeft: '1rem' }}>
                                            <Dropdown.Toggle
                                                className="font-weight-bold"
                                                id="PopoverClick"
                                                type="button"
                                                style={{ border: 'none', backgroundColor: 'white', color: 'black' }}>
                                                {consumptionTxt === '' ? `All ${el.label}` : consumptionTxt}
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
                                                    <a className="pop-text">kWh Used</a>
                                                </div>
                                                <div className="pop-inputbox-wrapper">
                                                    <input className="pop-inputbox" type="text" value={minConValue} />{' '}
                                                    <input className="pop-inputbox" type="text" value={maxConValue} />
                                                </div>
                                                <div style={{ marginTop: '2rem' }}>
                                                    <RangeSlider
                                                        name="consumption"
                                                        STEP={1}
                                                        MIN={0}
                                                        range={[minConValue, maxConValue]}
                                                        MAX={(topEnergyConsumption / 1000 + 0.5).toFixed(2)}
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
                                                    <a
                                                        className="pop-text"
                                                        onClick={(e) => {
                                                            setAPIFlag(!APIFlag);
                                                        }}>
                                                        Change Threshold
                                                    </a>
                                                    <button
                                                        style={{
                                                            border: 'none',
                                                            backgroundColor: 'white',
                                                            marginLeft: '5rem',
                                                        }}
                                                        onClick={exploreFilterDataFetch}>
                                                        <i className="uil uil-multiply"></i>
                                                    </button>
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
                            if (el.value !== 'location') {
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
                                                {locationTxt === '' ? `All ${el.label}` : locationTxt}{' '}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                    setLocationTxt('');
                                                }}>
                                                <i className="uil uil-multiply"></i>
                                            </button>
                                        </span>
                                        <Dropdown.Menu className="dropdown-xlg p-3">
                                            <div>
                                                <div className="pop-inputbox-wrapper">
                                                    <div className="explore-search mr-2">
                                                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                                        <input
                                                            className="search-box ml-2"
                                                            type="search"
                                                            name="search"
                                                            placeholder="Search Locations (floor, area,room)"
                                                            onChange={(e) => {
                                                                handleLocationSearch(e);
                                                            }}
                                                        />
                                                    </div>
                                                    <button
                                                        className="btn btn-white d-inline"
                                                        onClick={clearFilterData}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-primary d-inline ml-2"
                                                        onClick={(e) => {
                                                            setAPILocFlag(!APILocFlag);
                                                        }}>
                                                        Save
                                                    </button>
                                                </div>
                                                <div className="pop-inputbox-wrapper mt-4 mb-2 p-1">
                                                    <span className="pop-text">
                                                        <button
                                                            style={{ border: 'none', backgroundColor: 'white' }}
                                                            onClick={(e) => {
                                                                setShowSpace(false);
                                                            }}>
                                                            {localStorage.getItem('buildingName')}
                                                        </button>{' '}
                                                        {showSpace ? <>&nbsp;&gt;&nbsp;{selectedLoc?.name}</> : ''}
                                                    </span>
                                                </div>
                                                {showSpace === false ? (
                                                    <div
                                                        className={
                                                            floorListAPI.length > 4 ? `hScroll` : `hHundredPercent`
                                                        }>
                                                        <div className="floor-box">
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2"
                                                                    id="allLocation"
                                                                    onClick={(e) => {
                                                                        handleAllLocation(e);
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </div>
                                                        </div>
                                                        {filteredLocationOptions.map((record) => {
                                                            return (
                                                                <div className="floor-box">
                                                                    <div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-2"
                                                                            id={record.floor_id}
                                                                            value={record.floor_id}
                                                                            onClick={(e) => {
                                                                                handleSelectedLocation(e, record.name);
                                                                            }}
                                                                        />
                                                                        <button
                                                                            style={{
                                                                                backgroundColor: 'white',
                                                                                border: 'none',
                                                                            }}
                                                                            onClick={(e) => {
                                                                                handleGetSpaceByLocation(e, record);
                                                                            }}>
                                                                            {record.name}
                                                                        </button>
                                                                    </div>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <button
                                                                            style={{
                                                                                border: 'none',
                                                                                backgroundColor: 'white',
                                                                            }}
                                                                            onClick={(e) => {
                                                                                handleGetSpaceByLocation(e, record);
                                                                            }}>
                                                                            <i className="uil uil-angle-right"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div
                                                            className={
                                                                spaceListAPI.length > 4 ? `hScroll` : `hHundredPercent`
                                                            }>
                                                            <div className="floor-box">
                                                                <div>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mr-2"
                                                                        id="allSpaces"
                                                                        onClick={(e) => {
                                                                            handleAllSelectedSpaces(e);
                                                                        }}
                                                                    />
                                                                    <span>Select All</span>
                                                                </div>
                                                            </div>
                                                            {spaceListAPI.map((record) => {
                                                                return (
                                                                    <div className="floor-box">
                                                                        <div>
                                                                            <input
                                                                                type="checkbox"
                                                                                className="mr-2"
                                                                                id={record._id}
                                                                                value={record._id}
                                                                                onClick={(e) => {
                                                                                    handleSelectedSpaces(
                                                                                        e,
                                                                                        record.name
                                                                                    );
                                                                                }}
                                                                            />
                                                                            <span>{record.name}</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex' }}>
                                                                            <button
                                                                                style={{
                                                                                    border: 'none',
                                                                                    backgroundColor: 'white',
                                                                                }}>
                                                                                <i className="uil uil-angle-right"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                                <div></div>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            );
                        })}

                        {selectedOptions.map((el, index) => {
                            if (el.value !== 'location_type') {
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
                                                {spaceTxt === '' ? `All ${el.label}` : spaceTxt}{' '}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                    setSpaceTxt('');
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
                                                            onChange={(e) => {
                                                                handleSpaceTypeSearch(e);
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={
                                                            filteredSpaceTypeOptions.length > 4
                                                                ? `hScroll`
                                                                : `hHundredPercent`
                                                        }>
                                                        <div className="floor-box">
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2"
                                                                    id="allSpaceType"
                                                                    onClick={(e) => {
                                                                        handleAllSpaceType(e);
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </div>
                                                        </div>
                                                        {filteredSpaceTypeOptions.map((record) => {
                                                            return (
                                                                <div className="floor-box">
                                                                    <div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-2"
                                                                            id={record.value}
                                                                            value={record.value}
                                                                            onClick={(e) => {
                                                                                handleSelectedSpaceType(
                                                                                    e,
                                                                                    record.label
                                                                                );
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
                        {selectedOptions.map((el, index) => {
                            if (el.value !== 'equip_type') {
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
                                                {equipmentTxt === '' ? `All ${el.label}` : equipmentTxt}{' '}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                    setEquipmentTxt('');
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
                                                            onChange={(e) => {
                                                                handleEquipTypeSearch(e);
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={
                                                            filteredEquipOptions.length > 4
                                                                ? `hScroll`
                                                                : `hHundredPercent`
                                                        }>
                                                        <div className="floor-box">
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2"
                                                                    id="allEquipType"
                                                                    onClick={(e) => {
                                                                        handleAllEquip(e);
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </div>
                                                        </div>
                                                        {filteredEquipOptions.map((record) => {
                                                            return (
                                                                <div className="floor-box">
                                                                    <div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-2"
                                                                            id={record.value}
                                                                            value={record.value}
                                                                            onClick={(e) => {
                                                                                handleSelectedEquip(e, record.label);
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
                        {selectedOptions.map((el, index) => {
                            if (el.value !== 'endUse_category') {
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
                                                {endUseTxt === '' ? `All ${el.label}` : endUseTxt}{' '}
                                            </Dropdown.Toggle>
                                            <button
                                                style={{ border: 'none', backgroundColor: 'white' }}
                                                onClick={(e) => {
                                                    handleCloseFilter(e, el.value);
                                                    setEndUseTxt('');
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
                                                            onChange={(e) => {
                                                                handleEndUseSearch(e);
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={
                                                            filteredEndUseOptions.length > 4
                                                                ? `hScroll`
                                                                : `hHundredPercent`
                                                        }>
                                                        <div className="floor-box">
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="mr-2"
                                                                    id="allEndUse"
                                                                    onClick={(e) => {
                                                                        handleAllEndUse(e);
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </div>
                                                        </div>
                                                        {filteredEndUseOptions.map((record) => {
                                                            return (
                                                                <div className="floor-box">
                                                                    <div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-2"
                                                                            id={record.value}
                                                                            value={record.value}
                                                                            onClick={(e) => {
                                                                                handleSelectedEndUse(e, record.label);
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
                    {/* <button className="btn btn-white d-inline btnHover font-weight-bold mr-2">
                        {' '}
                        <FontAwesomeIcon icon={faTableColumns} size="md" />
                    </button> */}
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
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            paginationData={paginationData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
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
