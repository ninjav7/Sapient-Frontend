import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import Header from '../../components/Header';
import { Link, useParams } from 'react-router-dom';
import { BaseUrl, builidingPeak, peakDemandTrendChart, peakDemandYearlyPeak } from '../../services/Network';
import DetailedButton from '../buildings/DetailedButton';
import LineAnnotationChart from '../charts/LineAnnotationChart';
import exploreBuildingPeak from './ExploreBuildingPeak';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../utils/helper';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import moment from 'moment';

// const BuildingPeakButton = (props) => {
//     return (
//         <>
//             <h5 className="card-title card-title-style">{props.title}&nbsp;&nbsp;</h5>
//             <p className="card-text card-content-style">
//                 {props.description}
//                 <span className="card-unit-style">
//                     &nbsp;&nbsp;{props.unit}&nbsp;&nbsp;&nbsp;
//                     {props.consumptionNormal && (
//                         <button
//                             className="button-success text-success font-weight-bold font-size-5"
//                             style={{ width: '100%' }}>
//                             <i className="uil uil-chart-down">
//                                 <strong>{props.value} %</strong>
//                             </i>
//                         </button>
//                     )}
//                     {!props.consumptionNormal && (
//                         <button
//                             className="button-danger text-danger font-weight-bold font-size-5"
//                             style={{ width: '100%' }}>
//                             <i className="uil uil-arrow-growth">
//                                 <strong>{props.value} %</strong>
//                             </i>
//                         </button>
//                     )}
//                 </span>
//             </p>
//         </>
//     );
// };

const BuildingPeakButton = ({ buildingPeakData, recordDate, recordTime }) => {
    return (
        <>
            {/* <h5 className="card-title card-title-style">{`March 3rd @ 3:20 PM`}&nbsp;&nbsp;</h5> */}
            <h5 className="card-title card-title-style">
                {`${moment(recordDate).format('MMMM Do')} @ ${recordTime}`}&nbsp;&nbsp;
            </h5>
            <p className="card-text card-content-style">
                {buildingPeakData.overall_energy_consumption.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                })}
                <span className="card-unit-style">
                    &nbsp;&nbsp;{`kW`}&nbsp;&nbsp;&nbsp;
                    {/* {props.consumptionNormal && ( */}
                    {/* <button
                        className="button-success text-success font-weight-bold font-size-5"
                        style={{ width: '100%' }}>
                        <i className="uil uil-chart-down">
                            <strong>{`12`} %</strong>
                        </i>
                    </button> */}
                    {/* )} */}
                    {/* {!props.consumptionNormal && (*/}
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5"
                        style={{ width: '100%' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{`100`} %</strong>
                        </i>
                    </button>
                    {/* )}  */}
                </span>
            </p>
        </>
    );
};

const EquipmentTypePeaks = ({ energyConsumption, title, subtitle }) => {
    return (
        <Card>
            <CardBody className="pb-0 pt-2">
                <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                    {title}
                </h6>
                <Link to="/energy/building-peak-explore">
                    <div className="float-right ml-2">
                        <Link to="/energy/building-peak-explore">
                            <button type="button" className="btn btn-sm btn-outline-primary font-weight-bold">
                                <i className="uil uil-pen mr-1"></i>Explore
                            </button>
                        </Link>
                    </div>
                </Link>
                <h6 className="card-subtitle mb-2 custom-subtitle-style">{subtitle}</h6>
                <Table className="mb-0" borderless hover>
                    <thead>
                        <tr>
                            <th scope="col">Equipment</th>
                            <th scope="col">Power</th>
                            <th scope="col">Change from Previous Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {energyConsumption.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td className="custom-equip-style" style={{ color: '#2955e7' }}>
                                        {record.equipment_name}
                                    </td>
                                    <td className="custom-usage-style muted">
                                        {record.energy_consumption.now.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td>
                                        {record.energy_consumption.now >= record.energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const IndividualEquipmentPeaks = ({ energyConsumption, title, subtitle }) => {
    return (
        <Card>
            <CardBody className="pb-0 pt-2">
                <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                    {title}
                </h6>
                <Link to="/energy/building-peak-explore">
                    <div className="float-right ml-2">
                        <Link to="/energy/building-peak-explore">
                            <button type="button" className="btn btn-sm btn-outline-primary font-weight-bold">
                                <i className="uil uil-pen mr-1"></i>Explore
                            </button>
                        </Link>
                    </div>
                </Link>
                <h6 className="card-subtitle mb-2 custom-subtitle-style">{subtitle}</h6>
                <Table className="mb-0" borderless hover>
                    <thead>
                        <tr>
                            <th scope="col">Equipment</th>
                            <th scope="col">Power</th>
                            <th scope="col">Change from Previous Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {energyConsumption.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td className="custom-equip-style" style={{ color: '#2955e7' }}>
                                        {record.equipment_name}
                                    </td>
                                    <td className="custom-usage-style muted">
                                        {record.energy_consumption.now.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td>
                                        {record.energy_consumption.now >= record.energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const PeakDemand = () => {
    const { bldgId } = useParams();
    const [selectedTab, setSelectedTab] = useState(0);

    const [topBuildingPeaks, setTopBuildingPeaks] = useState([]);

    const [peakDemandTrendOptions, setPeakDemandTrendOptions] = useState({
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        annotations: {
            yaxis: [
                {
                    y: 8200,
                    borderColor: '#0acf97',
                    label: {
                        borderColor: '#0acf97',
                        style: {
                            color: '#fff',
                            background: '#0acf97',
                        },
                    },
                },
            ],
            xaxis: [
                {
                    x: new Date('23 Nov 2017').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        borderColor: '#775DD0',
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                    },
                },
                {
                    x: new Date('03 Dec 2017').getTime(),
                    borderColor: '#ffbc00',
                    label: {
                        borderColor: '#ffbc00',
                        style: {
                            color: '#fff',
                            background: '#ffbc00',
                        },
                        orientation: 'horizontal',
                    },
                },
            ],
        },
        chart: {
            type: 'line',
            toolbar: {
                show: true,
            },
        },
        labels: [],
        colors: ['#39afd1'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [3, 3],
            curve: 'smooth',
        },
        xaxis: {
            // type: 'datetime',
            labels: {
                labels: {
                    format: 'ddd',
                },
            },
            // categories: ['Week 1', 'Week 3', 'Week 5'],
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val + 'K';
                },
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#e9ecef',
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    });

    const [peakDemandTrendData, setPeakDemandTrendData] = useState([
        {
            name: 'Peak for Time Period',
            data: [],
        },
    ]);

    const [yearlyPeakData, setYearlyPeakData] = useState(null);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState([
        {
            equipment: 'AHU 1',
            power: 25.3,
            change: 22,
        },
        {
            equipment: 'AHU 2',
            power: 21.3,
            change: 3,
        },
        {
            equipment: 'RTU 1',
            power: 2.3,
            change: 6,
        },
        {
            equipment: 'Front RTU',
            power: 25.3,
            change: 2,
        },
    ]);

    const [energyConsumption, setEnergyConsumption] = useState([
        {
            equipName: 'AHUs',
            usage: '25.3 kW',
            percentage: 25,
        },
        {
            equipName: 'CRACs',
            usage: '21.3 kW',
            percentage: 8,
        },
        {
            equipName: 'Refrigerators',
            usage: '5.3 kW',
            percentage: 6,
        },
        {
            equipName: 'Desktop PCs',
            usage: '2.3 kW',
            percentage: 2,
        },
        {
            equipName: 'Laptop PCs',
            usage: '1.2 kW',
            percentage: 1,
        },
        {
            equipName: 'Space Heaters',
            usage: '0.2 kW',
            percentage: 2,
        },
    ]);

    const [singleEquipPeak, setSingleEquipPeak] = useState([
        {
            equipName: 'AHU 1',
            usage: '25.3 kW',
            percentage: 25,
        },
        {
            equipName: 'AHU 2',
            usage: '21.3 kW',
            percentage: 8,
        },
        {
            equipName: 'RTU 1',
            usage: '5.3 kW',
            percentage: 6,
        },
        {
            equipName: 'Front RTU',
            usage: '2.3 kW',
            percentage: 2,
        },
        {
            equipName: 'Chiller',
            usage: '1.2 kW',
            percentage: 1,
        },
        {
            equipName: 'Chiller',
            usage: '0.2 kW',
            percentage: 2,
        },
    ]);

    const [singleEquipPeakOne, setSingleEquipPeakOne] = useState([]);
    const [singleEquipPeakTwo, setSingleEquipPeakTwo] = useState([]);
    const [singleEquipPeakThree, setSingleEquipPeakThree] = useState([]);
    const [equipTypePeakOne, setEquipTypePeakOne] = useState([]);
    const [equipTypePeakTwo, setEquipTypePeakTwo] = useState([]);
    const [equipTypePeakThree, setEquipTypePeakThree] = useState([]);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const buildingPeaksData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingPeak}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setTopBuildingPeaks([]);
                        setSingleEquipPeakOne([]);
                        setSingleEquipPeakTwo([]);
                        setSingleEquipPeakThree([]);
                        setEquipTypePeakOne([]);
                        setEquipTypePeakTwo([]);
                        setEquipTypePeakThree([]);
                        let responseData = res.data;
                        setTopBuildingPeaks(responseData);
                        setSingleEquipPeakOne(responseData[0].top_contributors);
                        setSingleEquipPeakTwo(responseData[1].top_contributors);
                        setSingleEquipPeakThree(responseData[2].top_contributors);
                        setEquipTypePeakOne(responseData[0].top_eq_type_contributors);
                        setEquipTypePeakTwo(responseData[1].top_eq_type_contributors);
                        setEquipTypePeakThree(responseData[2].top_eq_type_contributors);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Peak Data');
            }
        };

        const peakDemandTrendFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemandTrendChart}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        let newPeakData = [
                            {
                                name: 'Peak for Time Period',
                                data: [],
                            },
                        ];
                        let newData = [];
                        let newDateLabels = [];
                        responseData.map((record) => {
                            newData.push(record.energy_consumption);
                            newDateLabels.push(moment(record.date).format('LL'));
                        });
                        newPeakData[0].data = newData;
                        setPeakDemandTrendData(newPeakData);
                        setPeakDemandTrendOptions({ ...peakDemandTrendOptions, labels: newDateLabels });
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Peak-Demand Trend Data');
            }
        };

        const peakDemandYearlyData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemandYearlyPeak}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        setYearlyPeakData(responseData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Peak-Demand Yearly Peak Data');
            }
        };

        buildingPeaksData();
        peakDemandTrendFetch();
        peakDemandYearlyData();
    }, [startDate, endDate, bldgId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Peak Demand',
                        path: '/energy/peak-demand',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Header title="Peak Demand" />

            <Row>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card card-box-style button-style">
                        {yearlyPeakData && (
                            <div className="card-body card-box-style">
                                <h5 className="card-title custom-date-time-style">Current 12 Mo. Peak&nbsp;&nbsp;</h5>
                                <p className="card-text card-content-style custom-kw-style">
                                    {yearlyPeakData.energy_consumption.now}
                                    <span className="card-unit-style">
                                        &nbsp;&nbsp;kW&nbsp;&nbsp;&nbsp;
                                        {yearlyPeakData.energy_consumption.now <=
                                            yearlyPeakData.energy_consumption.old && (
                                            <button
                                                className="button-success text-success font-weight-bold font-size-5"
                                                style={{ width: '100px' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            yearlyPeakData.energy_consumption.now,
                                                            yearlyPeakData.energy_consumption.old
                                                        )}{' '}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        {yearlyPeakData.energy_consumption.now >
                                            yearlyPeakData.energy_consumption.old && (
                                            <button
                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                style={{ width: '100px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            yearlyPeakData.energy_consumption.now,
                                                            yearlyPeakData.energy_consumption.old
                                                        )}{' '}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="card card-box-style button-style">
                        {yearlyPeakData && (
                            <div className="card-body" style={{ marginTop: '6px' }}>
                                <h5 className="card-title custom-date-time-style">
                                    {moment(yearlyPeakData.timestamp).format('MMMM D , h:mm A')}&nbsp;&nbsp;
                                </h5>
                                <p className="card-text custom-time-style">
                                    {moment(yearlyPeakData.timestamp).format('h:mm A')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Row>

            <Row style={{ marginLeft: '0.5px' }}>
                <div className="card-body">
                    <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                        Top 5 Building Peaks
                    </h6>

                    <Row className="mt-2">
                        <div className="button-style" style={{ marginLeft: '10px' }}>
                            {topBuildingPeaks.map((record, index) => {
                                return (
                                    <>
                                        {selectedTab === index ? (
                                            <div
                                                onClick={() => setSelectedTab(index)}
                                                className="card peak-card-box-style-selected button-style">
                                                <div className="card-body">
                                                    <BuildingPeakButton
                                                        buildingPeakData={record}
                                                        recordDate={record.timeRange.to.split(' ')[0]}
                                                        recordTime={convert24hourTo12HourFormat(
                                                            record.timeRange.to.split(' ')[1].split('.')[0]
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => setSelectedTab(index)}
                                                className="card peak-card-box-style button-style">
                                                <div className="card-body">
                                                    <BuildingPeakButton
                                                        buildingPeakData={record}
                                                        recordDate={record.timeRange.to.split(' ')[0]}
                                                        recordTime={convert24hourTo12HourFormat(
                                                            record.timeRange.to.split(' ')[1].split('.')[0]
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    </Row>

                    {selectedTab === 0 && (
                        <Row className="equip-peak-container">
                            <Col xl={6}>
                                <EquipmentTypePeaks
                                    energyConsumption={equipTypePeakOne}
                                    title="Equipment Type Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                            <Col xl={6}>
                                <IndividualEquipmentPeaks
                                    energyConsumption={singleEquipPeakOne}
                                    title="Individual Equipment Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                        </Row>
                    )}

                    {selectedTab === 1 && (
                        <Row className="equip-peak-container">
                            <Col xl={6}>
                                <EquipmentTypePeaks
                                    energyConsumption={equipTypePeakTwo}
                                    title="Equipment Type Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                            <Col xl={6}>
                                <IndividualEquipmentPeaks
                                    energyConsumption={singleEquipPeakTwo}
                                    title="Individual Equipment Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                        </Row>
                    )}

                    {selectedTab === 2 && (
                        <Row className="equip-peak-container">
                            <Col xl={6}>
                                <EquipmentTypePeaks
                                    energyConsumption={equipTypePeakThree}
                                    title="Equipment Type Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                            <Col xl={6}>
                                <IndividualEquipmentPeaks
                                    energyConsumption={singleEquipPeakThree}
                                    title="Individual Equipment Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                        </Row>
                    )}

                    {selectedTab === 3 && (
                        <Row className="equip-peak-container">
                            <Col xl={6}>
                                <EquipmentTypePeaks
                                    energyConsumption={equipTypePeakThree}
                                    title="Equipment Type Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                            <Col xl={6}>
                                <IndividualEquipmentPeaks
                                    energyConsumption={singleEquipPeakThree}
                                    title="Individual Equipment Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                        </Row>
                    )}

                    {selectedTab === 4 && (
                        <Row className="equip-peak-container">
                            <Col xl={6}>
                                <EquipmentTypePeaks
                                    energyConsumption={equipTypePeakThree}
                                    title="Equipment Type Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                            <Col xl={6}>
                                <IndividualEquipmentPeaks
                                    energyConsumption={singleEquipPeakThree}
                                    title="Individual Equipment Peaks"
                                    subtitle="At building peak time"
                                />
                            </Col>
                        </Row>
                    )}
                </div>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody className="pt-2 pb-3">
                            <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                                Building 15-Minute Demand Peaks Trend
                            </h6>
                            <Button
                                className="button-success text-success font-weight-bold font-size-5 float-right"
                                size={'sm'}
                                color="primary"
                                style={{ width: 'auto' }}>
                                <i className="uil uil-chart-down">
                                    <strong>5 %</strong>
                                </i>
                            </Button>
                            <h6 className="card-subtitle mb-2 custom-subtitle-style">
                                Max power draw (15 minute period)
                            </h6>
                            <LineAnnotationChart
                                title=""
                                height={350}
                                peakDemandTrendOptions={peakDemandTrendOptions}
                                peakDemandTrendData={peakDemandTrendData}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PeakDemand;
