import React, { useContext } from 'react';
import { Checkbox } from '../../../form/checkbox';
import Typography from '../../../typography';
import { LocationSelectorContext } from '../../LocationSelector';
import { LocationBadgeRooms } from './LocationBadgeRooms';
import { LOCATION_LEVEL } from '../../constants';

const MenuListHeader = ({ title, badge }) => {
    const {
        isMulti,
        selectedLevels,
        level,
        selectAllSpaces,
        selectedFloors,
        selectedSpaces,
        selectedRooms,
        selectedEquipments,
        selectAllRooms,
    } = useContext(LocationSelectorContext);

    let checkboxState = { isIndeterminate: false, isChecked: false };

    if (LOCATION_LEVEL.FLOOR === level) {
        checkboxState = selectedFloors({ floor_id: selectedLevels.floor.id });
    }

    if (LOCATION_LEVEL.SPACE === level) {
        checkboxState = selectedSpaces({ floor_id: selectedLevels.floor.id, space_id: selectedLevels.space.id });
    }

    if (LOCATION_LEVEL.SPACE === level) {
        checkboxState = selectedRooms({ floor_id: selectedLevels.floor.id, space_id: selectedLevels.space.id });
    }

    if (LOCATION_LEVEL.ROOM === level) {
    }

    const handleSelectAll = () => {
        if (LOCATION_LEVEL.FLOOR === level) {
            selectAllSpaces({ floor_id: selectedLevels.floor.id, isIndeterminate: checkboxState.isIndeterminate });
        }

        if (LOCATION_LEVEL.SPACE === level) {
            selectAllRooms({ floorId: selectedLevels.floor.id, spaceId: selectedLevels.space.id });
        }
    };

    const { isIndeterminate, isChecked } = checkboxState;

    return (
        <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
                {isMulti && (
                    <Checkbox
                        readOnly
                        label={''}
                        indeterminate={isIndeterminate}
                        checked={isChecked}
                        onClick={handleSelectAll}
                    />
                )}
                <Typography.Header size={Typography.Sizes.xs}>{title}</Typography.Header>
            </div>
            <LocationBadgeRooms rooms={badge} />
        </div>
    );
};

export { MenuListHeader };
