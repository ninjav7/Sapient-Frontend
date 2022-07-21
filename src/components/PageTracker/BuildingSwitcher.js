import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { BaseUrl, getBuilding } from '../../services/Network';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildings } from '@fortawesome/pro-solid-svg-icons';
import { faBuilding } from '@fortawesome/pro-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import BuildingList from './BuildingList';
import Input from '../../sharedComponents/form/input/Input';
import SearchIcon from '../../assets/icon/search.svg';
import {ReactComponent as CheckIcon} from '../../assets/icon/check.svg';

const PortfolioItem = ({ handlePortfolioClick }) => {
    return (
        <div>
            {location.pathname === '/energy/portfolio/overview' ? (
                <Dropdown.Item className='selected'>
                    <div className="filter-bld-style">
                        <div className="filter-name-style">
                            <FontAwesomeIcon
                                icon={faBuildings}
                                size="lg"
                                className="mr-2"
                            />

                            <Link to="/energy/portfolio/overview">
                                <span
                                    className="portfolio-txt-style"
                                    onClick={() => {
                                        handlePortfolioClick && handlePortfolioClick('Portfolio');
                                    }}>
                                    Portfolio
                                </span>
                            </Link>
                        </div>
                        <div className='dropdown-item-selected'>
                            <CheckIcon />
                        </div>
                    </div>
                </Dropdown.Item>
            ) : (
                <Dropdown.Item>
                    <FontAwesomeIcon
                        icon={faBuildings}
                        size="lg"
                        className="mr-2"
                    />
                    <Link to="/energy/portfolio/overview">
                        <span
                            className="portfolio-txt-style"
                            onClick={() => {
                                handlePortfolioClick && handlePortfolioClick('Portfolio');
                            }}>
                            Portfolio
                        </span>
                    </Link>
                </Dropdown.Item>
            )}
        </div>
    );
};

const FilterBuildings = ({ handleValueChange, value }) => {
    const handleChange = (e) => handleValueChange && handleValueChange(e.target.value);

    return (
        <Input
            iconUrl={SearchIcon}
            placeholder="Filter Buildings"
            onChange={handleChange}
            value={value}
            className="tracker-dropdown-search"
        />
    );
};

const BuildingSwitcher = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const location = useLocation();

    const [value, setValue] = useState('');
    const [buildingList, setBuildingList] = useState([]);
    const bldStoreId = BuildingStore.useState((s) => s.BldgId);
    const bldStoreName = BuildingStore.useState((s) => s.BldgName);
    const [portfolioName, setPortfolioName] = useState('');
    
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

    const dropDownTitle = location.pathname === '/energy/portfolio/overview' ? 'Portfolio' : bldStoreName;
    const filteredBuildings = buildingList.filter(({building_name}) => {
        return building_name.toLowerCase().includes(value.toLowerCase())
    });

    return (
        <div className="tracker-dropdown">
            <FontAwesomeIcon icon={bldStoreName === 'Portfolio' ? faBuildings : faBuilding} size="lg" />

            <Dropdown>
                <Dropdown.Toggle
                    id="bts-button-styling"
                    className="bts-btn-style page-tracker-dropdown-btn"
                    variant="secondary">
                    <div className="page-tracker-dropdown-text">{dropDownTitle}</div>

                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <div className="content-font-style">
                        <FilterBuildings handleValueChange={setValue} value={value} />

                        <div className='tracker-dropdown-content'>
                            <PortfolioItem handlePortfolioClick={setPortfolioName} />

                            <BuildingList buildingList={filteredBuildings} bldStoreId={bldStoreId} />
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default BuildingSwitcher;
