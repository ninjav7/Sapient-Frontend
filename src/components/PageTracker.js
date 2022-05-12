import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { BaseUrl, getBuilding } from '../services/Network';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { BreadcrumbStore } from './BreadcrumbStore';
import { BuildingStore } from './BuildingStore';
import { DateRangeStore } from './DateRangeStore';
import './style.css';

const PageTracker = () => {
    const [value, setValue] = useState('');
    const [buildingList, setBuildingList] = useState([]);
    const bldStoreId = BuildingStore.useState((s) => s.BldgId);
    const bldStoreName = BuildingStore.useState((s) => s.BldgName);
    const [portfolioName, setPortfolioName] = useState('');
    const [buildingData, setBuildingData] = useState({});
    const breadcrumList = BreadcrumbStore.useState((bs) => bs.items);
    const items = breadcrumList || [];
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    useEffect(() => {
        // if (startDate === null) {
        //     return;
        // }
        // if (endDate === null) {
        //     return;
        // }
        const getBuildingList = async () => {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
            };
            await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                setBuildingList(res.data);
            });
        };
        getBuildingList();
    }, []);

    // useEffect(() => {
    //     console.log('bldStoreId => ', bldStoreId);
    //     console.log('bldStoreName => ', bldStoreName);
    // }, [bldStoreId]);

    useEffect(() => {
        BuildingStore.update((s) => {
            s.BldgId = 1;
            s.BldgName = 'Portfolio';
        });
    }, [portfolioName]);

    useEffect(() => {
        // BuildingStore.update((s) => {
        //     s.BldgId = 1;
        //     s.BldgName = 'Portfolio';
        // });
    }, [buildingData]);

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                <div className="tracker-dropdown">
                    <FontAwesomeIcon icon={faBuilding} className="ml-2" />
                    <DropdownButton
                        id="bts-button-styling"
                        title={bldStoreName}
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
                                <Dropdown.Item style={{ display: 'inline-block' }}>
                                    <FontAwesomeIcon
                                        icon={faBuilding}
                                        className="mr-2"
                                        style={{ display: 'inline-block' }}
                                    />
                                    <Link to="/energy/portfolio/overview">
                                        <span
                                            className="portfolio-txt-style"
                                            onClick={() => {
                                                setPortfolioName('Portfolio');
                                            }}>
                                            Portfolio
                                        </span>
                                    </Link>
                                </Dropdown.Item>
                            </div>

                            <div>
                                <Dropdown.Header style={{ fontSize: '11px' }}>RECENT</Dropdown.Header>
                                {/* {buildingRecord.map((building, index) => (
                                    <Dropdown.Item onClick={() => setActiveBuildingName(building.buildingName)}>
                                        {building.building_name}
                                    </Dropdown.Item>
                                ))} */}
                                <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
                                {buildingList.map((record, index) => (
                                    <Dropdown.Item
                                        onClick={() => {
                                            // setActiveBuildingName(building.building_name);
                                            BuildingStore.update((s) => {
                                                s.BldgId = record.building_id;
                                                s.BldgName = record.building_name;
                                            });
                                            // setBuildingData(record);
                                        }}>
                                        {/* <Link
                                            to={{
                                                pathname: `/energy/building/overview/${record.building_id}`,
                                            }}> */}
                                            <span className="portfolio-txt-style">{record.building_name}</span>
                                        {/* </Link> */}
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
                <div className="vl"></div>
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

const mapStateToProps = (state) => {
    return {
        ID: state.counterState.ID,
    };
};

// export default connect(mapStateToProps, { buildingId })(PageTracker);
// export { breadCrumbItems };

// export default (connect(mapStateToProps, {  buildingId })(PageTracker));
export default PageTracker;
