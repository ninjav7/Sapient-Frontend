import React, { useContext } from 'react';

import SubNavBreadCrumbs from '../../../subNavBreadcrumbs';

import { LocationSelectorContext } from '../../LocationSelector';

import { LOCATION_LEVEL } from '../../constants';

const LocationBreadCrumbs = () => {
    const { handleSelect, handleBreadCrumbsSelect, selectedLevels, buildingName } = useContext(LocationSelectorContext);

    const items = [{ name: buildingName }, selectedLevels.floor, selectedLevels.space, selectedLevels.room];

    const handleClick = ({ level }) => {
        handleSelect({ level });
        handleBreadCrumbsSelect({ level });
    };

    const breadcrumbsItems = items.map((item, index) => {
        const level = Object.values(LOCATION_LEVEL)[index];

        return { label: item.name, onClick: () => handleClick({ level }) };
    });

    return <SubNavBreadCrumbs items={breadcrumbsItems} />;
};

export { LocationBreadCrumbs };
