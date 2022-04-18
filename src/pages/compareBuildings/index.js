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
    Progress,
} from 'reactstrap';
import { ChevronDown, Search } from 'react-feather';
import { Line } from 'rc-progress';

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
                                        <div style={{ width: '50%', display: 'inline-block' }}>
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
                                        </div>
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
                                    <td>
                                        {record.hvacConsumption} kWh / sq. ft.sq. ft.
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
                                        <div style={{ width: '50%', display: 'inline-block' }}>
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
                                        </div>
                                    </td>
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
                    <BuildingTable />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CompareBuildings;
