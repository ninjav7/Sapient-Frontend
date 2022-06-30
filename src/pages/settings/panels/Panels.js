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
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { MultiSelect } from 'react-multi-select-component';
import '../style.css';

const PanelsTable = ({ generalPanelData, selectedOptions }) => {
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
                            {selectedOptions.some((record) => record.value === 'name') && <th>Name</th>}
                            {selectedOptions.some((record) => record.value === 'location') && <th>Location</th>}
                            {selectedOptions.some((record) => record.value === 'breakers') && <th>Breakers</th>}
                            {selectedOptions.some((record) => record.value === 'parent') && <th>Parent</th>}
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
                                    {selectedOptions.some((record) => record.value === 'name') && (
                                        <td className="font-weight-bold panel-name">
                                            <Link
                                                to={{
                                                    pathname: `/settings/panels/editPanel/${record.panel_id}`,
                                                }}>
                                                <a>{record.panel_name}</a>
                                            </Link>
                                        </td>
                                    )}

                                    {selectedOptions.some((record) => record.value === 'location') && (
                                        <td className="">{record.location}</td>
                                    )}
                                    {selectedOptions.some((record) => record.value === 'breakers') && (
                                        <td className="font-weight-bold">{record.breakers}</td>
                                    )}
                                    {selectedOptions.some((record) => record.value === 'parent') && (
                                        <>
                                            {record.parent === null ? (
                                                <td className="font-weight-bold">-</td>
                                            ) : (
                                                <td className="font-weight-bold">{record.parent}</td>
                                            )}
                                        </>
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
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const tableColumnOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Location', value: 'location' },
        { label: 'Breakers', value: 'breakers' },
        { label: 'Parent', value: 'parent' },
    ];
    const [selectedOptions, setSelectedOptions] = useState([]);

    // const [buildingId, setBuildingId] = useState(1);
    const [generalPanelData, setGeneralPanelData] = useState([]);

    useEffect(() => {
        const fetchPanelsData = async () => {
            try {
                let header = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${generalPanels}`, { headers: header }).then((res) => {
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
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();

        let arr = [
            { label: 'Name', value: 'name' },
            { label: 'Location', value: 'location' },
            { label: 'Breakers', value: 'breakers' },
            { label: 'Parent', value: 'parent' },
        ];
        setSelectedOptions(arr);
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
                            <Link to="/settings/panels/createPanel">
                                <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                    <FontAwesomeIcon icon={faPlus} size="md" color="#FFFFFF" className="mr-1" />
                                    Add Panel
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
                    {/* <div className="search-container mr-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                        <input className="search-box ml-2" type="search" name="search" placeholder="Search" />
                    </div> */}
                </Col>
                <Col xl={9}>
                    <button type="button" className="btn btn-white d-inline ml-2">
                        <FontAwesomeIcon icon={faPlus} size="md" color="#344054" className="mr-1" />
                        Add Filter
                    </button>

                    {/* ---------------------------------------------------------------------- */}
                    <div className="float-right">
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'Columns';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <PanelsTable generalPanelData={generalPanelData} selectedOptions={selectedOptions} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Panels;
