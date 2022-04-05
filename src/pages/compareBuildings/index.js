import React from 'react';
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
} from 'reactstrap';
// import ProgressBar from './ProgressBar';
import { Search, ChevronDown, ChevronLeft, ChevronUp, ChevronRight } from 'react-feather';

import './style.css';

const BuildingTable = () => {
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
        },
    ];

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Energy Density</th>
                            <th>% Change</th>
                            <th>HVAC Consumption</th>
                            <th>% Change</th>
                            <th>Total Consumption</th>
                            <th>% Change</th>
                            <th>Sq. Ft.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        <Link to="/energy/building/overview">
                                            <a className="building-name">{record.name}</a>
                                        </Link>
                                        <span className="badge badge-soft-secondary mr-2">Office</span>
                                    </th>
                                    <td>
                                        {record.energyDensity} kWh / sq. ft.sq. ft.
                                        <br />
                                        <progress id="file" value={72} min={50} max={100}>
                                            32%
                                        </progress>
                                    </td>
                                    <td>
                                        {record.energyPerChgStatus === 'up' && (
                                            <button
                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                style={{ width: '100%' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                        {record.energyPerChgStatus === 'down' && (
                                            <button
                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                style={{ width: '100%' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                        {record.energyPerChgStatus === 'normal' && (
                                            <button
                                                className="button text-muted font-weight-bold font-size-5"
                                                style={{ width: '100%', border: 'none' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    <td>{record.hvacConsumption} kWh / sq. ft.sq. ft.</td>
                                    {/* <td>{record.hvacPerChg} %</td> */}
                                    <td>
                                        {record.hvacPerChgStatus === 'up' && (
                                            <button
                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                style={{ width: '100%' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                        {record.hvacPerChgStatus === 'down' && (
                                            <button
                                                className="button-success text-success font-weight-bold font-size-5"
                                                style={{ width: '100%' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                        {record.hvacPerChgStatus === 'normal' && (
                                            <button
                                                className="button text-muted font-weight-bold font-size-5"
                                                style={{ width: '100%', border: 'none' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    <td className="text-muted font-weight-bold">
                                        {record.totalConsumption.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}
                                        kWh
                                    </td>
                                    {/* <td>{record.totalPerChg} %</td> */}
                                    <td>
                                        {record.totalPerChgStatus === 'up' && (
                                            <button
                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                style={{ width: '100%' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                        {record.totalPerChgStatus === 'down' && (
                                            <button
                                                className="button-success text-success font-weight-bold font-size-5"
                                                style={{ width: '100%' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                        {record.totalPerChgStatus === 'normal' && (
                                            <button
                                                className="button text-muted font-weight-bold font-size-5"
                                                style={{ width: '100%', border: 'none' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>{record.energyPerChg} %</strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    <td className="text-muted font-weight-bold">
                                        {record.sqFt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
    return (
        <React.Fragment>
            <Header title="Compare Buildings" />
            <Row className="mt-2">
                <Col xl={12}>
                    <div style={{ marginLeft: '25px' }}>
                        <div style={{ display: 'inline-block', marginRight: '10px' }}>
                            <input type="text" className="search-style" placeholder="Search..." autoFocus />
                        </div>
                        <button type="button" className="btn btn-white d-inline">
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
                                {/* <DropdownItem header>Dropdown 1</DropdownItem>
                                    <DropdownItem header>Dropdown 2</DropdownItem> */}
                                {/* <DropdownItem divider /> */}
                                <DropdownItem>Dropdown 1</DropdownItem>
                                <DropdownItem>Dropdown 2</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <BuildingTable />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CompareBuildings;
