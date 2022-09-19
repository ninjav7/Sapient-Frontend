import React, { useContext } from 'react';
import { LocationSelectorContext } from '../../LocationSelector';
import { Checkbox } from '../../../form/checkbox';

const ListBase = (props) => {
    const { isMulti } = useContext(LocationSelectorContext);

    return <button {...props}>{props.children}</button>;
};

export { ListBase };
