import React from 'react';
import pluralize from 'pluralize';

import { Badge } from '../../../badge';

const LocationBadgeRooms = ({ rooms }) =>
    Number.isInteger(rooms) ? <Badge text={pluralize('Room', rooms, true)} /> : null;

export { LocationBadgeRooms };
