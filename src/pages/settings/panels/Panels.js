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
import { Link } from 'react-router-dom';
import { ChevronDown, Search } from 'react-feather';
import axios from 'axios';
import { BaseUrl, generalPanels } from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import '../style.css';

const PanelsTable = ({ generalPanelData }) => {
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
                        {generalPanelData.map((record, index) => {
                            return (
                                <tr key={record.panel_id}>
                                    <td className="font-weight-bold panel-name">
                                        <Link to="/settings/editPanel">
                                            <a href="#">{record.panel_name}</a>
                                        </Link>
                                    </td>

                                    <td className="">{record.location}</td>
                                    <td className="font-weight-bold">{record.breakers}</td>
                                    {record.parent === null ? (
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
    // const [buildingId, setBuildingId] = useState(1);
    const [generalPanelData, setGeneralPanelData] = useState([]);

    useEffect(() => {
        const fetchPanelsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                await axios.get(`${BaseUrl}${generalPanels}`, { headers }).then((res) => {
                    setGeneralPanelData(res.data);
                    console.log(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Panels Data List');
            }
        };
        fetchPanelsData();
    }, []);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Panels',
                        path: '/settings/panels',
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
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Panels
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <Link to="/settings/createPanel">
                                <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                    <i className="uil uil-plus mr-1"></i>Add Panel
                                </button>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>

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
                            <DropdownItem>Phoenix Baker</DropdownItem>
                            <DropdownItem>Olivia Rhye</DropdownItem>
                            <DropdownItem>Lana Steiner</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <PanelsTable generalPanelData={generalPanelData} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Panels;
