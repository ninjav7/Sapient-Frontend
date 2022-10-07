import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory } from 'react-router-dom';
import { BuildingStore } from '../../store/BuildingStore';
import { ReactComponent as CheckIcon } from '../../assets/icon/check.svg';

const ExploreBuildingList = ({ buildingList = [], bldStoreId }) => {
    const history = useHistory();
    return (
        <div>
            <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
            {buildingList.length === 0 && 'No Buildings found.'}
            {buildingList.map((record) => {
                const activeItem = record.building_id === bldStoreId;

                return (
                    <div key={record.building_id}>
                        <Dropdown.Item
                            className={activeItem && 'selected'}
                            onClick={() => {
                                localStorage.setItem('buildingId', record.building_id);
                                localStorage.setItem('buildingName', record.building_name);
                                localStorage.setItem(
                                    'buildingTimeZone',
                                    record.timezone === '' ? 'US/Eastern' : record.timezone
                                );
                                BuildingStore.update((s) => {
                                    s.BldgId = record.building_id;
                                    s.BldgName = record.building_name;
                                    s.BldgTimeZone = record.timezone === '' ? 'US/Eastern' : record.timezonee;
                                });
                                history.push({
                                    pathname: `/explore-page/by-equipment/${record.building_id}`,
                                });
                            }}>
                            <div className="filter-bld-style">
                                <div className="portfolio-txt-style">{record.building_name}</div>
                                {activeItem && <CheckIcon />}
                            </div>
                        </Dropdown.Item>
                    </div>
                );
            })}
        </div>
    );
};

export default ExploreBuildingList;
