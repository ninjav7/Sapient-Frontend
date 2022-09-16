import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { LocationBreadCrumbs } from './components/common/LocationBreadCrumbs';
import { useStateManager } from './hooks/useStateManager';
import { LOCATION_LEVEL } from './constants';
import { ListMenu } from './components/common/ListMenu';

import Brick from '../brick';
import { Button } from '../button';
import Input from '../form/input/Input';

import SearchURL from '../assets/icons/search.svg';

import './LocationSelector.scss';

export const LocationSelectorContext = React.createContext({});

const LocationSelector = ({ buildingName, ...props }) => {
    const {
        handleSelect,
        handleBreadCrumbsSelect,
        level,
        selectedLevels,
        selected,
        currentList,
        setCurrentList,

        selectedFloors,
        selectedSpaces,
        selectedRooms,
        selectedEquipments,

        setSelectedMap,
        selectedMap,
        selectAllSpaces,
        selectAllRooms,
        selectAllEquipments,
        selectEquipment,
        
        helpers,
    } = useStateManager(props);

    const [search, setSearch] = useState('');

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const isSearchActive = !!search;
    const isMulti = props.isMulti;

    return (
        <LocationSelectorContext.Provider
            value={{
                handleSelect,
                handleBreadCrumbsSelect,
                level,
                selectedLevels,
                selected,
                buildingName,
                isMulti,
                currentList,
                setCurrentList,

                selectedMap,
                setSelectedMap,
                selectedEquipments,

                selectedFloors,
                selectedSpaces,
                selectedRooms,
                selectEquipment,
                

                selectAllSpaces,
                selectAllRooms,
                selectAllEquipments,
                
                helpers,
            }}>
            <div className="location-selector-wrapper">
                <div className="location-selector-header d-flex">
                    <div className="flex-grow-1">
                        <Input
                            onChange={handleChangeSearch}
                            type="search"
                            iconUrl={SearchURL}
                            placeholder="Search Locations (Floor, Area, Rooms)"
                        />
                    </div>
                    <div className="location-selector-control d-flex">
                        <Button label="Cancel" type={Button.Type.SecondaryGrey} size={Button.Sizes.md} />
                        <Button label="Save" type={Button.Type.Primary} size={Button.Sizes.md} />
                    </div>
                </div>

                <Brick />
                {isSearchActive ? 'Search Results: 126' : <LocationBreadCrumbs />}
                <Brick />

                <div className="location-selector-list-wrapper">
                    <ListMenu level={level} />
                </div>
            </div>
        </LocationSelectorContext.Provider>
    );
};

LocationSelector.propTypes = {
    buildingName: PropTypes.string.isRequired,
    isMulti: PropTypes.bool.isRequired,
    level: PropTypes.oneOf(Object.values(LOCATION_LEVEL)),
};

export default LocationSelector;
