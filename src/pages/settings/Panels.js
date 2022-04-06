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
import './style.css';

const PanelsTable = () => {
    const records = [
        {
            name: 'Panel 1',
            location: 'Floor 1 > Electrical Closet',
            breakers: '40/48',
            parent: '',
        },
        {
            name: 'Panel 2',
            location: 'Floor 1 > Electrical Closet',
            breakers: '20/24',
            parent: 'Panel 1',
        },
    ];

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Breakers</th>
                            <th>Parent</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td className="font-weight-bold panel-name">
                                        <a href="#">{record.name}</a>
                                    </td>
                                    <td className="font-weight-bold">{record.location}</td>
                                    <td className="font-weight-bold">{record.breakers}</td>
                                    {record.parent === '' ? (
                                        <td className="font-weight-bold">-</td>
                                    ) : (
                                        <td className="font-weight-bold">{record.parent}</td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const Panels = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Panels
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                <i className="uil uil-plus mr-1"></i>Add Panel
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
                    <PanelsTable />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Panels;
