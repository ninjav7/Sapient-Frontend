import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { BaseUrl, getBuilding } from '../services/Network';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildings } from '@fortawesome/pro-solid-svg-icons';
import { faBuilding } from '@fortawesome/pro-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/pro-solid-svg-icons';
import { BreadcrumbStore } from '../store/BreadcrumbStore';
import { BuildingStore } from '../store/BuildingStore';
import { DateRangeStore } from '../store/DateRangeStore';
import { ComponentStore } from '../store/ComponentStore';
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
    console.log(items);
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const setSideNavBar = (componentName) => {
        if (componentName === 'account') {
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        }
        if (componentName === 'building-settings') {
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        } else {
            return;
        }
    };


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
                'user-auth': '628f3144b712934f578be895',
            };
            await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                let data = res.data;
                console.log('Dropdown Buildings => ', data);
                let activeBldgs = data.filter((bld) => bld.active === true);
                console.log('Building List => ', activeBldgs);
                setBuildingList(activeBldgs);
            });
        };
        getBuildingList();
    }, []);

    useEffect(() => {
        BuildingStore.update((s) => {
            s.BldgId = 1;
            s.BldgName = 'Portfolio';
        });
        ComponentStore.update((s) => {
            s.parent = 'portfolio';
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
                {breadcrumList[0].label!=="Account Settings" && breadcrumList[0].label!=="General"?
                <>
                <div className="tracker-dropdown">
                    {bldStoreName === 'Portfolio' ? (
                        <FontAwesomeIcon icon={faBuildings} size="lg" className="ml-2" />
                    ) : (
                        <FontAwesomeIcon icon={faBuilding} size="lg" className="ml-2" />
                    )}
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
                                        icon={faBuildings}
                                        size="lg"
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
                </div>
                <div className="vl"></div>
                </>:breadcrumList[0].label==="Account Settings"?
                <div className='account-setting-options'>
                    <div className='account-option'>Account</div>
                    <div className='general-option'>General</div>                    
                </div>:
                <div className='account-setting-options'>
                <Link to="/settings/account">
                <div className='account-option' onClick={() => {
                                    setSideNavBar('account');
                                }}>Account</div></Link>
                
                <div className='general-option'>General</div>                    
            </div>
                }
                
                <div className="route-tracker">
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
                    </Breadcrumb>
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
