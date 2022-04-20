import React, { useState } from 'react';

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
    Button,
    Input,
    FormGroup,
    Label,
} from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Search } from 'react-feather';
import '../pages/settings/style.css';

const SearchModal = () => {
    const [searchModalShow, setSearchModalShow] = useState(false);
    const searchModalClose = () => setSearchModalShow(false);
    const searchModalOpen = () => setSearchModalShow(true);

    const [buildings, setBuildings] = useState([
        { value: 'Building 1', label: '123 Main St. Portland, OR' },
        { value: 'Building 2', label: '15 University Bivd. Hartford, CT' },
        { value: 'Building 3', label: '6223 Syncamore Ave. Pittsburgh, PA' },
        { value: 'Building 4', label: '246 Blackburn Rd. Philadelphia, PA' },
    ]);

    return (
        <>
            <button className="btn btn-sm btn-link nav-link right-bar-toggle float-right">
                <Search className="icon-sm" onClick={() => searchModalOpen()} />
            </button>

            {/* Search Modal  */}
            <Modal show={searchModalShow} onHide={searchModalClose} size={'lg'}>
                <Modal.Body
                    style={{
                        backgroundColor: 'snowwhite',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Form>
                        <FormGroup>
                            <div>
                                {/* <i className="uil uil-building" style={{ display: 'inline-block' }}></i> */}
                                <Input
                                    type="select"
                                    name="select"
                                    id="exampleSelect"
                                    placeholder="Select Buildings"
                                    className="all-building-btn"
                                    style={{ display: 'inline-block' }}>
                                    <option value={0} selected>
                                        All Buildings
                                    </option>
                                    {buildings.map((building, index) => {
                                        return <option value={building.value}>{building.label}</option>;
                                    })}
                                </Input>
                            </div>
                        </FormGroup>

                        <FormGroup className="mt-2">
                            <Input
                                type="text"
                                name="text"
                                id="text1"
                                placeholder="Search for pages, users, equipment, and more..."
                                className="search-box"
                            />
                        </FormGroup>

                        <FormGroup>
                            <div className="search-result-body">
                                <div className="recent-btn-grp">
                                    <div className="recent-btn">
                                        <div>All Results</div>
                                        <div className="recent-search-nmbr ml-2">3</div>
                                    </div>
                                    <div className="recent-btn">
                                        <div>Pages</div>
                                        <div className="recent-search-nmbr ml-2">1</div>
                                    </div>
                                    <div className="recent-btn">
                                        <div>Explore</div>
                                        <div className="recent-search-nmbr ml-2">1</div>
                                    </div>
                                    <div className="recent-btn">
                                        <div>Equipment</div>
                                        <div className="recent-search-nmbr ml-2">1</div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="search-filter search-content-style p-2">
                                        <div className="search-border"></div>
                                        <div className="search-icon-style" style={{ fontSize: '18px' }}>
                                            <i className="uil uil-clipboard-alt"></i>
                                        </div>
                                        <div className="search-result-header">
                                            <div className="search-result-title">{'End Uses > HVAC'}</div>
                                            <div className="search-result-subtitle">
                                                View summary data from your HVAC usage in a building.
                                            </div>
                                        </div>
                                        <div className="search-icon-style icon-display">
                                            <i className="uil uil-angle-right-b"></i>
                                        </div>
                                    </div>

                                    <div className="search-filter search-content-style p-2">
                                        <div className="search-border"></div>
                                        <div className="search-icon-style" style={{ fontSize: '18px' }}>
                                            <i className="uil uil-clipboard-alt"></i>
                                        </div>
                                        <div className="search-result-header">
                                            <div className="search-result-title">Explore HVAC</div>
                                            <div className="search-result-subtitle">
                                                View HVAC energy usage historical charts.
                                            </div>
                                        </div>
                                        <div className="search-icon-style icon-display">
                                            <i className="uil uil-angle-right-b"></i>
                                        </div>
                                    </div>

                                    <div className="search-filter search-content-style p-2">
                                        <div className="search-border"></div>
                                        <div className="search-icon-style" style={{ fontSize: '18px' }}>
                                            <i className="uil uil-clipboard-alt"></i>
                                        </div>
                                        <div className="search-result-header">
                                            <div className="search-result-title">HVAC Equipment List</div>
                                            <div className="search-result-subtitle">View all HVAC equipment.</div>
                                        </div>
                                        <div className="search-icon-style icon-display">
                                            <i className="uil uil-angle-right-b"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SearchModal;
