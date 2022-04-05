import React from 'react';
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
import { ChevronDown } from 'react-feather';

const BuildingTable = () => {
    const records = [
        {
            status: 'available',
            name: '-',
            equipType: 'Desktop PC',
            location: 'Floor 1 > 252',
            tags: 'FINANCE',
            sensorNo: 2,
            lastData: '5 min ago',
            deviceId: 'D8:07:B6:88:D8:3B',
        },
        {
            status: 'available',
            name: '-',
            equipType: 'Refrigerator',
            location: 'Floor 1 > W Kitchen',
            tags: 'None',
            sensorNo: '2',
            lastData: '2 min ago',
            deviceId: 'D8:07:B6:88:D8:3B',
        },
        {
            status: 'available',
            name: 'AHU 1',
            equipType: 'AHU',
            location: 'Floor 1 > Mech.',
            tags: 'None',
            sensorNo: '1,2',
            lastData: '2 min ago',
            deviceId: 'D8:07:B6:88:D8:3B',
        },
    ];

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Name</th>
                            <th>Equipment Type</th>
                            <th>Location</th>
                            <th>Tags</th>
                            <th>Sensor Number</th>
                            <th>Last Data</th>
                            <th>Device ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => {
                            return (
                                <tr key={index}>
                                    {/* <td scope="row">{record.status}</td> */}
                                    <td scope="row">
                                        {record.status === 'available' && <i className="uil uil-wifi mr-1"></i>}
                                    </td>
                                    <td className="font-weight-bold">{record.name}</td>
                                    <td className="font-weight-bold">{record.equipType}</td>
                                    <td>{record.location}</td>
                                    <td>
                                        {
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                {record.tags}
                                            </div>
                                        }
                                    </td>
                                    <td>{record.sensorNo}</td>
                                    <td>{record.lastData}</td>
                                    <td className="font-weight-bold">{record.deviceId}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const Equipment = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Equipment
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                <i className="uil uil-plus mr-1"></i>Add Equipment
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={12}>
                    <div style={{ marginLeft: '25px' }}>
                        <div style={{ display: 'inline-block', marginRight: '10px' }}>
                            <input type="text" className="search-style" placeholder="Search..." autoFocus />
                        </div>

                        <div className="btn-group" role="group" aria-label="Basic example">
                            <div>
                                <button type="button" className="btn btn-white d-inline">
                                    <i className="uil uil-plus mr-1"></i>All Statuses
                                </button>

                                <button type="button" className="btn btn-white d-inline">
                                    <i className="uil uil-wifi mr-1"></i>Online
                                </button>

                                <button type="button" className="btn btn-white d-inline">
                                    <i className="uil uil-wifi-slash mr-1"></i>Offline
                                </button>
                            </div>
                        </div>

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
                                <DropdownItem>Phoenix Baker</DropdownItem>
                                <DropdownItem>Olivia Rhye</DropdownItem>
                                <DropdownItem>Lana Steiner</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <BuildingTable />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Equipment;
