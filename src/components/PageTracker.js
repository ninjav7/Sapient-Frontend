import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { BaseUrl, portfolioBuilidings } from '../services/Network';
// import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import axios from 'axios';
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
            .post(
                `${BaseUrl}${portfolioBuilidings}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setBuildingRecord(res.data);
                console.log('setBuildingRecord => ', res.data);
            });
    }, []);

    return (
        <React.Fragment>
            <div className="page-tracker-container">
                <div className="tracker-dropdown">
                    <i className="uil uil-building ml-2"></i>
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
                                <Dropdown.Item href="#/action-1">123 Main St. Portland, O</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">15 University Bivd. Hartford, CT</Dropdown.Item>

                                <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
                                {buildingRecord.map((building, index) => (
                                    <>
                                        <Dropdown.Item onClick={() => setActiveBuildingName(building.buildingName)}>
                                            {building.buildingName}
                                        </Dropdown.Item>
                                        {/* <Dropdown.Item href="#/action-2">
                                            15 University Bivd. Hartford, CT
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/action-1">
                                            6223 Syncamore Ave. Pittsburgh, PA
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">
                                            246 Blackburn Rd. Philadelphia, PA
                                        </Dropdown.Item> */}
                                    </>
                                ))}
                            </div>
                        </div>
                    </DropdownButton>
                    <i className="uil uil-cog"></i>
                    <i className="uil uil-angle-down ml-1"></i>
                </div>
                <div class="vl"></div>
                <div className="route-tracker">
                    {/* <Breadcrumb className="custom-breadcrumb-style">
                        <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Profile</Breadcrumb.Item>
                        <Breadcrumb.Item active>Details</Breadcrumb.Item>
                    </Breadcrumb> */}

                    {/* <span className="font-weight-bold">Portfolio Overview</span> */}

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
