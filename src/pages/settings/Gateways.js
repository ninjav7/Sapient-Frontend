import React, { useState, useEffect } from 'react';
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
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ChevronDown, Search } from 'react-feather';
import axios from 'axios';
import { BaseUrl, generalGateway } from '../../services/Network';
import './style.css';

const GatewaysTable = ({ generalGatewayData }) => {
    const records = [
        {
            status: 'Online',
            macAddress: 'D8:07:B6:88:D8:3B',
            model: 'AWS-1234',
            location: 'Floor 1 > Electrical Closet',
            deviceConnected: 4,
            deviceCount: 1,
        },
        {
            status: 'Online',
            macAddress: 'D8:07:B6:88:D8:3B',
            model: 'AWS-1234',
            location: 'Floor 1 > Electrical Closet',
            deviceConnected: 6,
            deviceCount: 5,
        },
    ];

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Gateways',
                        path: '/energy/gateways',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>MAC Address</th>
                            <th>Model</th>
                            <th>Location</th>
                            <th>Devices Connected</th>
                            <th>Unique Device Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generalGatewayData.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {record.status === 'Online' && (
                                            <span
                                                className="badge badge-success"
                                                style={{ backgroundColor: '#12b76a' }}>
                                                {record.status}
                                            </span>
                                        )}
                                        {record.status === 'Offline' && (
                                            <span
                                                className="badge badge-danger"
                                                style={{ backgroundColor: 'rgb(240, 28, 28)' }}>
                                                {record.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="font-weight-bold panel-name">{record.identifier}</td>
                                    <td className="font-weight-bold">{record.model}</td>
                                    <td className="">{record.location}</td>
                                    <td className="font-weight-bold">{record.devices_connected}</td>
                                    <td className="font-weight-bold">{record.unique_device_count}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const Gateways = () => {
    const [generalGatewayData, setGeneralGatewayData] = useState([]);

    useEffect(() => {
        const fetchGatewayData = async () => {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                // 'user-auth': '628f3144b712934f578be895',
            };
            await axios
                .get(`${BaseUrl}${generalGateway}`, {}, { headers })
                .then((res) => {
                    setGeneralGatewayData(res.data);
                    console.log(res.data);
                })
                .catch((error) => {
                    console.log(error);
                    console.log('Failed to fetch Gateway data');
                });
        };
        fetchGatewayData();
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Gateways
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                <i className="uil uil-plus mr-1"></i>Add Gateway
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={3}>
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
                <Col md={9}>
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
                            <DropdownItem active={true} className="bg-primary">
                                Olivia Rhye
                            </DropdownItem>
                            <DropdownItem>Lana Steiner</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <GatewaysTable generalGatewayData={generalGatewayData} />
                </Col>
            </Row>

            <Row>
                <span className="gateway-content-style">What about a KPI about unique devices</span>
            </Row>
        </React.Fragment>
    );
};

export default Gateways;
