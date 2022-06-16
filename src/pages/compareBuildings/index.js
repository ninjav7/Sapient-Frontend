import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Progress,
} from 'reactstrap';
import { ChevronDown, Search } from 'react-feather';
import { Line } from 'rc-progress';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseUrl, compareBuildings } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { percentageHandler } from '../../utils/helper';
import axios from 'axios';

import './style.css';

const BuildingTable = ({ buildingsData }) => {
    const records = [
        {
            name: '123 Main St. Portland OR',
            energyDensity: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            hvacConsumption: 0.8,
            hvacPerChg: '40',
            hvacPerChgStatus: 'down',
            totalConsumption: 25003,
            totalPerChg: '4',
            totalPerChgStatus: 'normal',
            sqFt: 46332,
            energyPer: 90,
            consumtnPer: 100,
        },
        {
            name: '123 Main St. Portland OR',
            energyDensity: 1.5,
            energyPerChg: '2',
            energyPerChgStatus: 'normal',
            hvacConsumption: 0.8,
            hvacPerChg: '40',
            hvacPerChgStatus: 'down',
            totalConsumption: 25003,
            totalPerChg: '40',
            totalPerChgStatus: 'up',
            sqFt: 46332,
            energyPer: 75,
            consumtnPer: 50,
        },
        {
            name: '123 Main St. Portland OR',
            energyDensity: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'down',
            hvacConsumption: 0.8,
            hvacPerChg: '40',
            hvacPerChgStatus: 'up',
            totalConsumption: 25003,
            totalPerChg: '4',
            totalPerChgStatus: 'normal',
            sqFt: 46332,
            energyPer: 50,
            consumtnPer: 20,
        },
    ];

    const [topEnergyDensity, setTopEnergyDensity] = useState(1);
    const [topHVACConsumption, setTopHVACConsumption] = useState(1);

    useEffect(() => {
        if (!buildingsData.length > 0) {
            return;
        }
        let topVal = buildingsData[0].energy_density;
        setTopEnergyDensity(topVal);
        let hvacVal = buildingsData[0].hvac_consumption.now;
        setTopHVACConsumption(hvacVal);
    }, [buildingsData]);

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered">
                    <thead>
                        <tr>
                            <th className="table-heading-style">Name</th>
                            <th className="table-heading-style">Energy Density</th>
                            <th className="table-heading-style">% Change</th>
                            <th className="table-heading-style">HVAC Consumption</th>
                            <th className="table-heading-style">% Change</th>
                            <th className="table-heading-style">Total Consumption</th>
                            <th className="table-heading-style">% Change</th>
                            <th className="table-heading-style">Sq. Ft.</th>
                            <th className="table-heading-style">Monitored Load</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buildingsData.map((record, index) => {
                            return (
                                <tr key={record.building_id}>
                                    <th scope="row">
                                        <Link
                                            to={{
                                                pathname: `/energy/building/overview/${record.building_id}`,
                                            }}>
                                            <a className="building-name">{record.building_name}</a>
                                        </Link>
                                        <span className="badge badge-soft-secondary mr-2">Office</span>
                                    </th>
                                    <td className="table-content-style">
                                        {(record.energy_density / 1000).toFixed(2)} kWh / sq. ft.sq. ft.
                                        <br />
                                        <div style={{ width: '100%', display: 'inline-block' }}>
                                            {index === 0 && record.energy_density === 0 && (
                                                <Line
                                                    percent={0}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#D14065`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 0 && record.energy_density > 0 && (
                                                <Line
                                                    percent={((record.energy_density / topEnergyDensity) * 100).toFixed(
                                                        2
                                                    )}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#D14065`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 1 && (
                                                <Line
                                                    percent={((record.energy_density / topEnergyDensity) * 100).toFixed(
                                                        2
                                                    )}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#DF5775`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 2 && (
                                                <Line
                                                    percent={((record.energy_density / topEnergyDensity) * 100).toFixed(
                                                        2
                                                    )}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#EB6E87`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 3 && (
                                                <Line
                                                    percent={((record.energy_density / topEnergyDensity) * 100).toFixed(
                                                        2
                                                    )}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#EB6E87`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 4 && (
                                                <Line
                                                    percent={((record.energy_density / topEnergyDensity) * 100).toFixed(
                                                        2
                                                    )}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#FC9EAC`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 5 && (
                                                <Line
                                                    percent={((record.energy_density / topEnergyDensity) * 100).toFixed(
                                                        2
                                                    )}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#FFCFD6`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                        </div>
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
                                    <td className="table-content-style">
                                        {(record.hvac_consumption.now / 1000).toFixed(2)} kWh / sq. ft.sq. ft.
                                        <br />
                                        <div style={{ width: '100%', display: 'inline-block' }}>
                                            {/* <Line
                                                percent={percentageHandler(
                                                    record.hvac_consumption.now,
                                                    record.hvac_consumption.old
                                                )}
                                                strokeWidth="4"
                                                trailWidth="4"
                                                strokeColor="#C64245"
                                                strokeLinecap="round"
                                            /> */}
                                            {index === 0 && record.hvac_consumption.now === 0 && (
                                                <Line
                                                    percent={0}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#D14065`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 0 && record.hvac_consumption.now > 0 && (
                                                <Line
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
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
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
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
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
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
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
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
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
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
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
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
                                        {record.hvac_consumption.now >= record.hvac_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.hvac_consumption.now,
                                                            record.hvac_consumption.old
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
                                                            record.hvac_consumption.now,
                                                            record.hvac_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    <td className="value-style">
                                        {(record.total_consumption / 1000).toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}
                                        kWh
                                    </td>
                                    <td>
                                        {record.total_consumption >= record.energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.total_consumption,
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
                                                            record.total_consumption,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    <td className="value-style">
                                        {record.sq_ft.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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

const CompareBuildings = () => {
    const [buildingsData, setBuildingsData] = useState([]);
    const daysCount = DateRangeStore.useState((s) => s.dateFilter);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Compare Buildings',
                        path: '/energy/compare-buildings',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        const compareBuildingsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };

                let count = parseInt(localStorage.getItem('dateFilter'));
                let params = `?days=${count}`;
                // count === 0 ? (params = `?days=1`) : (params = `?days=${count}`);
                // console.log('Sudhanshu => ', typeof count); // number
                await axios.post(`${BaseUrl}${compareBuildings}${params}`, {}, { headers }).then((res) => {
                    setBuildingsData(res.data);
                    console.log('setBuildingsData => ', res.data);
                });
            } catch (error) {
                console.log(error);
                alert('Failed to fetch Buildings Data');
            }
        };
        compareBuildingsData();
    }, [daysCount]);

    return (
        <React.Fragment>
            <Header title="Compare Buildings" />

            {/* <Row className="m-4">
                <div>
                    <FontAwesomeIcon icon={faHome} />
                </div>
            </Row> */}

            <Row className="mt-2">
                <Col xl={3}>
                    <div class="input-group rounded ml-4">
                        <input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                        />
                        <span class="input-group-text border-0" id="search-addon">
                            <Search className="icon-sm" />
                        </span>
                    </div>
                </Col>
                <Col xl={9}>
                    <button type="button" className="btn btn-white d-inline ml-2">
                        <i className="uil uil-plus mr-1"></i>Add Filter
                    </button>

                    {/* ---------------------------------------------------------------------- */}
                    <UncontrolledDropdown className="d-inline float-right">
                        <DropdownToggle color="white">
                            Columns
                            <i className="icon">
                                <ChevronDown></ChevronDown>
                            </i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Dropdown 1</DropdownItem>
                            <DropdownItem>Dropdown 2</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Col>
            </Row>
            <Row>
                <Col xl={12}>
                    <BuildingTable buildingsData={buildingsData} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CompareBuildings;
