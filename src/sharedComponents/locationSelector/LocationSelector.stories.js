import React from 'react';
import LocationSelector from './LocationSelector';
import '../assets/scss/stories.scss';

import { floorsMock } from './mock';

export default {
    title: 'Widgets/LocationSelector (Not Ready)',
    component: LocationSelector,
};

export const Default = () => (
    <LocationSelector floors={floorsMock.data} buildingName={'123 Main St. Portland, OR'} isMulti={true} />
);
