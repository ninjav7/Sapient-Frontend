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
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
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
                        </tr>
                    </thead>
                    <tbody>
                        {buildingsData.map((record, index) => {
                            return (
                                <tr key={record.building_id}>
                                    <th scope="row">
                                        <Link to="/energy/building/overview">
                                            <a className="building-name">{record.building_name}</a>
                                        </Link>
                                        <span className="badge badge-soft-secondary mr-2">Office</span>
                                    </th>
                                    <td className="table-content-style">
                                        {record.energy_density.toFixed(2)} kWh / sq. ft.sq. ft.
                                        <br />
                                        <div style={{ width: '50%', display: 'inline-block' }}>
                                            <Line
                                                percent="100"
                                                strokeWidth="7"
                                                trailWidth="7"
                                                strokeColor="#F0F2F5"
                                                // strokeColor="#00FF00"
                                                strokeLinecap="round"
                                            />
                                        </div>
                                        {/* <div style={{ width: '50%', display: 'inline-block' }}>
                                            {record.consumtnPer >= 90 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#D23C35"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer < 90 && record.consumtnPer > 75 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#C64245"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 75 && record.consumtnPer > 50 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#B04D66"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 50 && record.consumtnPer > 40 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#9B5985"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 40 && record.consumtnPer > 30 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#935C91"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 30 && record.consumtnPer > 20 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#8763BF"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 20 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#766CCE"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                        </div> */}
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
                                        {record.hvac_consumption.now.toFixed(2)} kWh / sq. ft.sq. ft.
                                        <br />
                                        <div style={{ width: '50%', display: 'inline-block' }}>
                                            <Line
                                                percent="100"
                                                strokeWidth="7"
                                                trailWidth="7"
                                                strokeColor="#F0F2F5"
                                                // strokeColor="#00FF00"
                                                strokeLinecap="round"
                                            />
                                        </div>
                                        {/* <div style={{ width: '50%', display: 'inline-block' }}>
                                            {record.consumtnPer >= 90 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#D23C35"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer < 90 && record.consumtnPer > 75 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#C64245"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 75 && record.consumtnPer > 50 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#B04D66"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 50 && record.consumtnPer > 40 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#9B5985"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 40 && record.consumtnPer > 30 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#935C91"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 30 && record.consumtnPer > 20 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#8763BF"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                            {record.consumtnPer <= 20 && (
                                                <Line
                                                    percent={record.consumtnPer}
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#766CCE"
                                                    strokeLinecap="square"
                                                />
                                            )}
                                        </div> */}
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
                                        {record.total_consumption.toLocaleString(undefined, {
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
                };
                let params = `?days=30`;
                await axios.post(`${BaseUrl}${compareBuildings}${params}`, { headers }).then((res) => {
                    setBuildingsData(res.data);
                    console.log('setBuildingsData => ', res.data);
                });
            } catch (error) {
                console.log(error);
                alert('Failed to fetch Buildings Data');
            }
        };
        compareBuildingsData();
    }, []);

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
