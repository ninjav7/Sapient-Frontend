import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { BaseUrl, getBuilding } from '../services/Network';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildings } from '@fortawesome/pro-solid-svg-icons';
import { faBuilding } from '@fortawesome/pro-solid-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/pro-solid-svg-icons';
import { BreadcrumbStore } from '../store/BreadcrumbStore';
import { BuildingStore } from '../store/BuildingStore';
import { DateRangeStore } from '../store/DateRangeStore';
import { ComponentStore } from '../store/ComponentStore';
import { Cookies } from 'react-cookie';
import './style.css';

const PageTracker = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const location = useLocation();

    // const [currentURLPath, setCurrentURLPath] = useState(location.pathname);
    // const [currentPath, setCurrentPath] = useState('');

    const [value, setValue] = useState('');
    const [buildingList, setBuildingList] = useState([]);
    const bldStoreId = BuildingStore.useState((s) => s.BldgId);
    const bldStoreName = BuildingStore.useState((s) => s.BldgName);
    const [portfolioName, setPortfolioName] = useState('');
    const [buildingData, setBuildingData] = useState({});
    const breadcrumList = BreadcrumbStore.useState((bs) => bs.items);
    const items = breadcrumList || [];
    // console.log(items);
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
        const getBuildingList = async () => {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                let data = res.data;
                let activeBldgs = data.filter((bld) => bld.active === true);
                setBuildingList(activeBldgs);
            });
        };
        getBuildingList();
    }, []);

    useEffect(() => {
        ComponentStore.update((s) => {
            s.parent = 'portfolio';
        });
    }, [portfolioName]);

    // useEffect(() => {
    //     console.log('SSR location.pathname => ', location.pathname);
    //     let url = location.pathname;
    //     let splitUrl = url.split('/');
    //     splitUrl.pop();
    //     let joinedUrl = splitUrl.join('/');
    //     console.log('joinedUrl => ', joinedUrl);
    //     setCurrentPath(joinedUrl);
    // }, [location.pathname]);

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                {/* {breadcrumList[0].label !== 'Account Settings' && breadcrumList[0].label !== 'General' ? ( */}
                <>
                    <div className="tracker-dropdown">
                        {bldStoreName === 'Portfolio' ? (
                            <FontAwesomeIcon icon={faBuildings} size="lg" className="ml-2" />
                        ) : (
                            <FontAwesomeIcon icon={faBuilding} size="lg" className="ml-2" />
                        )}
                        <DropdownButton
                            id="bts-button-styling"
                            title={location.pathname === '/energy/portfolio/overview' ? 'Portfolio' : bldStoreName}
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
                                    {location.pathname === '/energy/portfolio/overview' ? (
                                        <Dropdown.Item>
                                            <div className="filter-bld-style">
                                                <div className="filter-name-style">
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
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    ) : (
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
                                    )}
                                </div>

                                <div>
                                    <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
                                    {buildingList.map((record, index) => (
                                        <>
                                            {location.pathname === '/energy/portfolio/overview' ? (
                                                <Dropdown.Item
                                                    onClick={() => {
                                                        BuildingStore.update((s) => {
                                                            s.BldgId = record.building_id;
                                                            s.BldgName = record.building_name;
                                                        });
                                                        localStorage.setItem('buildingId', record.building_id);
                                                        localStorage.setItem('buildingName', record.building_name);
                                                    }}>
                                                    <Link
                                                        to={{
                                                            pathname: `/energy/building/overview/${record.building_id}`,
                                                        }}>
                                                        <div className="filter-bld-style">
                                                            <div className="portfolio-txt-style">
                                                                {record.building_name}
                                                            </div>
                                                            {location.pathname !== '/energy/portfolio/overview' &&
                                                                record.building_id === bldStoreId && (
                                                                    <div>
                                                                        <FontAwesomeIcon
                                                                            icon={faCheck}
                                                                            className="mr-2"
                                                                        />
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </Link>
                                                </Dropdown.Item>
                                            ) : (
                                                <Dropdown.Item
                                                    onClick={() => {
                                                        BuildingStore.update((s) => {
                                                            s.BldgId = record.building_id;
                                                            s.BldgName = record.building_name;
                                                        });
                                                        localStorage.setItem('buildingId', record.building_id);
                                                        localStorage.setItem('buildingName', record.building_name);
                                                    }}>
                                                    <div className="filter-bld-style">
                                                        <div className="portfolio-txt-style">
                                                            {record.building_name}
                                                        </div>
                                                        {location.pathname !== '/energy/portfolio/overview' &&
                                                            record.building_id === bldStoreId && (
                                                                <div>
                                                                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                                </div>
                                                            )}
                                                    </div>
                                                </Dropdown.Item>
                                            )}
                                        </>
                                    ))}
                                </div>
                            </div>
                        </DropdownButton>
                        <FontAwesomeIcon icon={faGear} />
                        <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                    </div>
                    <div className="vl"></div>
                </>
                {/* ) : breadcrumList[0].label === 'Account Settings' ? (
                    <div className="account-setting-options">
                        <div className="account-option">Account</div>
                        <div className="general-option">General</div>
                    </div>
                ) : (
                    <div className="account-setting-options">
                        <Link to="/settings/account">
                            <div
                                className="account-option"
                                onClick={() => {
                                    setSideNavBar('account');
                                }}>
                                Account
                            </div>
                        </Link>

                        <div className="general-option">General</div>
                    </div>
                )} */}

                {/* {breadcrumList[0].label !== 'Account Settings' && breadcrumList[0].label !== 'General' ? ( */}
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
                {/* ) : ( */}
                {/* '' */}
                {/* )} */}
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
