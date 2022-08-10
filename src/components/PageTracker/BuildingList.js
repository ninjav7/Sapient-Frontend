import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useLocation } from 'react-router-dom';
import { BuildingStore } from '../../store/BuildingStore';
import { ReactComponent as CheckIcon } from '../../assets/icon/check.svg';
import { ComponentStore, ROUTE_LEVELS } from '../../store/ComponentStore';

const BuildingList = ({ buildingList = [], bldStoreId }) => {
    const location = useLocation();
    const [currentParentRoute, levelRoute] = ComponentStore.useState((s) => [s.parent, s.level]);

    const handleClick = (record) => {
        BuildingStore.update((s) => {
            s.BldgId = record.building_id;
            s.BldgName = record.building_name;
        });
        localStorage.setItem('buildingId', record.building_id);
        localStorage.setItem('buildingName', record.building_name);

        localStorage.setItem('levelRoute', ROUTE_LEVELS.BUILDINGS);

        ComponentStore.update((s) => {
            s.parent = 'buildings';
            s.level = ROUTE_LEVELS.BUILDINGS;
        });
    };

    return (
        <div>
            <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
            {buildingList.length === 0 && 'No Buildings found.'}
            {buildingList.map((record) => {
                const activeItem =
                    // eslint-disable-next-line no-restricted-globals
                    location.pathname !== '/energy/portfolio/overview' &&
                    record.building_id === bldStoreId
                    && currentParentRoute !== 'portfolio'
                    && levelRoute === ROUTE_LEVELS.BUILDINGS;

                return (
                    <div key={record.building_id}>
                        {location.pathname === '/energy/portfolio/overview' ? (
                            <Dropdown.Item as="div">
                                <Link
                                    to={{
                                        pathname: `/energy/building/overview/${record.building_id}`,
                                    }}
                                    onClick={() => {
                                        handleClick(record);
                                    }}>
                                    <div className="filter-bld-style">
                                        <div className="portfolio-txt-style">{record.building_name}</div>
                                        {location.pathname !== '/energy/portfolio/overview' &&
                                            record.building_id === bldStoreId && <CheckIcon />}
                                    </div>
                                </Link>
                            </Dropdown.Item>
                        ) : (
                            <Dropdown.Item
                                className={activeItem && 'selected'}
                                onClick={() => {
                                    handleClick(record);
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
