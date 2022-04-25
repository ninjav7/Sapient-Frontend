import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { BaseUrl, getBuilding } from '../services/Network';
// import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';

import './style.css';

const PageTracker = (props) => {
    const [value, setValue] = useState('');
    const [buildingRecord, setBuildingRecord] = useState([]);
    const [activeBuildingName, setActiveBuildingName] = useState(`123 Main St. Portland, O`);
    const items = props.breadCrumbItems || [];

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios
            .get(
                `${BaseUrl}${getBuilding}`,
                // {
                //     time_horizon: 0,
                //     custom_time_horizon: 0,
                // },
                { headers }
            )
            .then((res) => {
                setBuildingRecord(res.data);
                console.log('setBuildingRecord => ', res.data);
            });
    }, []);

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                <div className="tracker-dropdown">
                    {/* <i className="uil uil-building ml-2"></i> */}
                    {/* <FontAwesomeIcon icon={building} /> */}
                    {/* <i class="fa-solid fa-building"></i> */}

                    <FontAwesomeIcon icon={faBuilding} className="ml-2" />
                    <DropdownButton
                        id="bts-button-styling"
                        title={activeBuildingName}
                        className="bts-btn-style"
                        variant="secondary">
                        <div className="content-font-style">
                            <div>
                                <FormControl
                                    className="mx-3 my-2 w-auto"
                                    placeholder="Filter Buildings"
                                    onChange={(e) => setValue(e.target.value)}
                                    value={value}
                                />
                            </div>

                            <div>
                                <Dropdown.Item href="#/action-1">Portfolio</Dropdown.Item>
                            </div>

                            <div>
                                <Dropdown.Header style={{ fontSize: '11px' }}>RECENT</Dropdown.Header>
                                {buildingRecord.map((building, index) => (
                                    <Dropdown.Item onClick={() => setActiveBuildingName(building.buildingName)}>
                                        {building.building_name}
                                    </Dropdown.Item>
                                ))}
                                <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
                                {buildingRecord.map((building, index) => (
                                    <Dropdown.Item onClick={() => setActiveBuildingName(building.buildingName)}>
                                        {building.building_name}
                                    </Dropdown.Item>
                                ))}
                            </div>
                        </div>
                    </DropdownButton>
                    <FontAwesomeIcon icon={faGear} />
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                    {/* <i className="uil uil-cog"></i>
                    <i className="uil uil-angle-down ml-1"></i> */}
                </div>
                <div class="vl"></div>
                <div className="route-tracker">
                    {/* <Breadcrumb className="custom-breadcrumb-style">
                        <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Profile</Breadcrumb.Item>
                        <Breadcrumb.Item active>Details</Breadcrumb.Item>
                    </Breadcrumb> */}

                    <span className="font-weight-bold">Portfolio Overview</span>

                    <Breadcrumb className="custom-breadcrumb-style">
                        {items.map((item, index) => {
                            return item.active ? (
                                <BreadcrumbItem active key={index}>
                                    {item.label}
                                </BreadcrumbItem>
                            ) : (
                                <BreadcrumbItem key={index}>
                                    <Link to={item.path}>{item.label}</Link>
                                </BreadcrumbItem>
                            );
                        })}

                        {/* {items.map((item, index) => {
                            return item.active ? (
                                <BreadcrumbItem>
                                    <Link to="/" className="custom-breadcrumb-font-bold">
                                        Sapient
                                    </Link>
                                </BreadcrumbItem>
                            ) : (
                                <BreadcrumbItem>
                                    <Link to="/" className="custom-breadcrumb-font">
                                        Sapient
                                    </Link>
                                </BreadcrumbItem>
                            );
                        })} */}
                    </Breadcrumb>
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
