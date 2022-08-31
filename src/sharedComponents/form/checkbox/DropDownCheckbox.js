import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from './index';

export const DropDownCheckbox = props => {
    return <Checkbox {...props} type={Checkbox.Types.dropDownCheckbox} className="w-100" classInput="mr-3" id={null} />;
};

DropDownCheckbox.arg = {
    label: PropTypes.string.isRequired,
};
