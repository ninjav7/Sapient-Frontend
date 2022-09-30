import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildings } from '@fortawesome/pro-solid-svg-icons';
import { faBuilding } from '@fortawesome/pro-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ExploreBuildingStore } from '../../store/ExploreBuildingStore';
import { Cookies } from 'react-cookie';
import ExploreBuildingList from './ExploreBuildingList';
import Input from '../../sharedComponents/form/input/Input';
import SearchIcon from '../../assets/icon/search.svg';
import { ReactComponent as CheckIcon } from '../../assets/icon/check.svg';
import { buildingData } from '../../store/globalState';
import { useAtom } from 'jotai';

const PortfolioItem = ({ exploreBldName, exploreBldId }) => {
    const history = useHistory();
    return (
        <div>
            {exploreBldId === 'portfolio' ? (
                <Dropdown.Item className="selected">
                    <div className="filter-bld-style">
                        <div className="filter-name-style">
                            <FontAwesomeIcon icon={faBuildings} size="lg" className="mr-2" />
                            <span className="portfolio-txt-style">Portfolio</span>
                        </div>
                        <div className="dropdown-item-selected">
                            <CheckIcon />
                        </div>
                    </div>
                </Dropdown.Item>
            ) : (
                <Dropdown.Item
                    onClick={() => {
                        localStorage.setItem('exploreBldId', 'portfolio');
                        localStorage.setItem('exploreBldName', 'Portfolio');
                        ExploreBuildingStore.update((s) => {
                            s.exploreBldId = 'portfolio';
                            s.exploreBldName = 'Portfolio';
                        });
                        history.push({
                            pathname: `/explore-page/by-buildings`,
                        });
                    }}>
                    <FontAwesomeIcon icon={faBuildings} size="lg" className="mr-2" />
                    <span className="portfolio-txt-style">Portfolio</span>
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

const ExploreBuildingSwitcher = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [value, setValue] = useState('');
    const [buildingList, setBuildingList] = useState([]);
    const exploreBldId = ExploreBuildingStore.useState((s) => s.exploreBldId);
    const exploreBldName = ExploreBuildingStore.useState((s) => s.exploreBldName);

    const [buildingListData] = useAtom(buildingData);

    useEffect(() => {
        const getBuildingList = async () => {
            setBuildingList(buildingListData);
        };
        getBuildingList();
    }, [buildingListData]);

    const filteredBuildings = buildingList.filter(({ building_name }) => {
        return building_name.toLowerCase().includes(value.toLowerCase());
    });

    return (
        <div className="tracker-dropdown">
            <FontAwesomeIcon icon={exploreBldName === 'Portfolio' ? faBuildings : faBuilding} size="lg" />

            <Dropdown>
                <Dropdown.Toggle
                    id="bts-button-styling"
                    className="bts-btn-style page-tracker-dropdown-btn"
                    variant="secondary">
                    <div className="page-tracker-dropdown-text">{exploreBldName}</div>

                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <div className="content-font-style">
                        <FilterBuildings handleValueChange={setValue} value={value} />

                        <div className="tracker-dropdown-content">
                            <PortfolioItem exploreBldId={exploreBldId} exploreBldName={exploreBldName} />

                            <ExploreBuildingList buildingList={filteredBuildings} bldStoreId={exploreBldId} />
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default ExploreBuildingSwitcher;
