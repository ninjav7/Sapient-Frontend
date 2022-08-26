import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { ExploreBuildingStore } from '../../store/ExploreBuildingStore';
import { ReactComponent as CheckIcon } from '../../assets/icon/check.svg';

const ExploreBuildingList = ({ buildingList = [], bldStoreId }) => {
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
                                ExploreBuildingStore.update((s) => {
                                    s.exploreBldId = record.building_id;
                                    s.exploreBldName = record.building_name;
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
