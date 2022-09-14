import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory, useLocation } from 'react-router-dom';
import { BuildingStore } from '../../store/BuildingStore';
import { ReactComponent as CheckIcon } from '../../assets/icon/check.svg';

const BuildingList = ({ buildingList = [], bldStoreId }) => {
    const location = useLocation();
    const history = useHistory();

    const handleBldgSwitchFrmPortfolioPage = (bldgData) => {
        BuildingStore.update((s) => {
            s.BldgId = bldgData?.building_id;
            s.BldgName = bldgData?.building_name;
            s.BldgTimeZone = bldgData?.timezone === '' ? 'US/Eastern' : bldgData?.timezone;
        });
        localStorage.setItem('buildingId', bldgData?.building_id);
        localStorage.setItem('buildingName', bldgData?.building_name);
        localStorage.setItem('buildingTimeZone', bldgData?.timezone === '' ? 'US/Eastern' : bldgData?.timezone);
        history.push({
            pathname: `/energy/building/overview/${bldgData?.building_id}`,
        });
    };

    const handleBldgChange = (bldgData) => {
        BuildingStore.update((s) => {
            s.BldgId = bldgData?.building_id;
            s.BldgName = bldgData?.building_name;
            s.BldgTimeZone = bldgData?.timezone === '' ? 'US/Eastern' : bldgData?.timezone;
        });
        localStorage.setItem('buildingId', bldgData?.building_id);
        localStorage.setItem('buildingName', bldgData?.building_name);
        localStorage.setItem('buildingTimeZone', bldgData?.timezone === '' ? 'US/Eastern' : bldgData?.timezone);
    };

    return (
        <div>
            <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
            {buildingList.length === 0 && 'No Buildings found.'}
            {buildingList.map((record) => {
                const activeItem =
                    // eslint-disable-next-line no-restricted-globals
                    location.pathname !== '/energy/portfolio/overview' &&
                    location.pathname !== '/energy/compare-buildings' &&
                    record.building_id === bldStoreId;

                return (
                    <div key={record.building_id}>
                        {location.pathname === '/energy/portfolio/overview' ? (
                            <Dropdown.Item
                                onClick={() => {
                                    handleBldgSwitchFrmPortfolioPage(record);
                                }}>
                                <div className="filter-bld-style">
                                    <div className="portfolio-txt-style">{record.building_name}</div>
                                    {location.pathname !== '/energy/portfolio/overview' &&
                                        record.building_id === bldStoreId && <CheckIcon />}
                                </div>
                            </Dropdown.Item>
                        ) : (
                            <Dropdown.Item
                                className={activeItem && 'selected'}
                                onClick={() => {
                                    handleBldgChange(record);
                                }}>
                                <div className="filter-bld-style">
                                    <div className="portfolio-txt-style">{record.building_name}</div>
                                    {activeItem && <CheckIcon />}
                                </div>
                            </Dropdown.Item>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BuildingList;
