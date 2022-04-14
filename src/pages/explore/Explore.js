import React, { useState } from 'react';
import { List } from 'react-feather';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Row, Col, Input, Card, CardBody, Table } from 'reactstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import BrushChart from '../charts/BrushChart';

// const BuildingPeakTable = () => {
//     const records = [
//         {
//             name: 'AHU 1',
//             changePercent: 50,
//             changeKWH: 1.2,
//             changeValue: 22,
//             peakPower: 100,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'AHU 2',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'RTU 1',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'Front RTU',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'Chiller',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//     ];

//     return (
//         <React.Fragment>
//             <Row>
//                 <Card>
//                     <CardBody>
//                         <Table className="mb-0 bordered">
//                             <thead>
//                                 <tr className="explore-table-row">
//                                     <th>
//                                         <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
//                                     </th>
//                                     <th className="mr-4">Name</th>
//                                     <th>% Change</th>
//                                     <th></th>
//                                     <th>Peak Power</th>
//                                     <th>Peak Power Time</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {records.map((record, index) => {
//                                     return (
//                                         <tr key={index} className="explore-table-row">
//                                             <td>
//                                                 <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
//                                             </td>
//                                             <th scope="row">
//                                                 <Link to="/energy/building/overview">
//                                                     <a className="building-name">{record.name}</a>
//                                                 </Link>
//                                             </th>
//                                             <td>
//                                                 +{record.changePercent}% ({record.changeKWH} kWh)
//                                             </td>
//                                             <td>
//                                                 <progress
//                                                     id="file"
//                                                     value={record.changePercent}
//                                                     min={50}
//                                                     max={100}
//                                                     style={{ height: '30px' }}>
//                                                     {record.peakPower}%
//                                                 </progress>
//                                             </td>
//                                             <td>
//                                                 <div>
//                                                     <span>-</span>
//                                                     <br />
//                                                     <progress
//                                                         id="file"
//                                                         value={record.peakPower}
//                                                         min={50}
//                                                         max={100}></progress>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div>
//                                                     <span>-</span>
//                                                     <br />
//                                                     <progress
//                                                         id="file"
//                                                         value={record.peakPowerTime}
//                                                         min={50}
//                                                         max={100}></progress>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </Table>
//                     </CardBody>
//                 </Card>
//             </Row>
//         </React.Fragment>
//     );
// };

const BuildingPeakTable = () => {
    const records = [
        {
            name: 'AHU 1',
            changePercent: 50,
            changeKWH: 1.2,
            changeValue: 22,
            peakPower: 100,
            peakPowerTime: 0,
        },
        {
            name: 'AHU 2',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
        {
            name: 'RTU 1',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
        {
            name: 'Front RTU',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
        {
            name: 'Chiller',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
    ];

    return (
        <Card>
            <div className="table-container">
                <CardBody>
                    <Table className="mb-0 bordered">
                        <thead>
                            <tr className="explore-table-row">
                                <th>
                                    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                </th>
                                <th>Name</th>
                                <th></th>
                                <th>% Change</th>
                                <th></th>
                                <th>Peak Power</th>
                                <th>Peak Power Time</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => {
                                return (
                                    <tr key={index} className="explore-table-row">
                                        <td>
                                            <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                        </td>

                                        <th scope="row">
                                            <Link to="/energy/building/overview">
                                                <a className="building-name">{record.name}</a>
                                            </Link>
                                        </th>
                                        <td></td>
                                        <td>
                                            +{record.changePercent}% ({record.changeKWH} kWh)
                                        </td>
                                        <td>
                                            <progress
                                                id="file"
                                                value={record.changePercent}
                                                min={50}
                                                max={100}
                                                style={{ height: '30px' }}>
                                                {record.peakPower}%
                                            </progress>
                                        </td>
                                        <td>
                                            <div className="table-peak-power">
                                                <span>-</span>
                                                <br />
                                                <progress
                                                    id="file"
                                                    value={record.peakPower}
                                                    min={50}
                                                    max={100}></progress>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span>-</span>
                                                <br />
                                                <progress
                                                    id="file"
                                                    value={record.peakPowerTime}
                                                    min={50}
                                                    max={100}></progress>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </div>
        </Card>
    );
};

const Explore = () => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const TABS = {
        Tab1: '24 Hours',
        Tab2: '7 Days',
        Tab3: '30 Days',
        Tab4: 'Custom',
    };
    const [activeTab, setActiveTab] = useState(TABS.Tab3);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <DropdownButton id="dropdown-item-button" title="By Floor">
                        <Dropdown.ItemText>Group by</Dropdown.ItemText>
                        <Dropdown.Divider />
                        <Dropdown.Item as="button">No Grouping</Dropdown.Item>
                        <Dropdown.Item as="button">End Use</Dropdown.Item>
                        <Dropdown.Item as="button">Equipment Type</Dropdown.Item>
                        <Dropdown.Item as="button">Floor</Dropdown.Item>
                        <Dropdown.Item as="button">Location</Dropdown.Item>
                        <Dropdown.Item as="button">Location Type</Dropdown.Item>
                    </DropdownButton>
                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        {/* <DropdownButton id="dropdown-item-button" title="Energy (kWh)">
                            <Dropdown.ItemText>Primary Metric</Dropdown.ItemText>
                            <Dropdown.Divider />
                            <Dropdown.Item as="button">Energy (kWh)</Dropdown.Item>
                            <Dropdown.Item as="button">Peak Hour (kW)</Dropdown.Item>
                            <Dropdown.Item as="button">Carbon Emissions</Dropdown.Item>
                        </DropdownButton> */}
                        <div>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                style={{ color: 'black', fontWeight: 'bold' }}
                                className="select-button form-control form-control-md">
                                <option className="mb-0">Last 7 Days</option>
                                <option>Last 5 Days</option>
                                <option>Last 3 Days</option>
                                <option>Last 1 Day</option>
                            </Input>
                        </div>
                        <div className="mr-3">
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
                </Col>
            </Row>
            <BrushChart />
            <BuildingPeakTable />
        </React.Fragment>
    );
};

export default Explore;
