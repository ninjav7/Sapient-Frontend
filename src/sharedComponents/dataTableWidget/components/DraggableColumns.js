import React, { useContext, useEffect, useState } from 'react';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

import { DropDownIcon } from '../../dropDowns/dropDownButton';
import { Checkbox } from '../../form/checkbox';
import { DataTableWidgetContext } from '../DataTableWidget';

import DropDownMenuBase from '../../others/dropDownMenuBase/DropDownMenuBase';
import { DropDownListItem } from '../../others/dropDownListItem';
import Typography from '../../typography';

import { ReactComponent as GripLinesSVG } from '../../assets/icons/grip-lines.svg';
import { ReactComponent as ColumnsSVG } from '../../assets/icons/columns.svg';

const DragHandle = sortableHandle((props) => (
    <span {...props}>
        <GripLinesSVG />
    </span>
));

const SortableItem = sortableElement(({ value }) => {
    const { excludedHeaders, setExcludedHeaders } = useContext(DataTableWidgetContext);
    const [checked, setChecked] = useState(!excludedHeaders.includes(value));

    const handleCheckboxChange = (event) => {
        setChecked(!checked);
        setExcludedHeaders((oldState) =>
            !checked ? oldState.filter((header) => header !== value) : [...oldState, value]
        );
    };

    const typographyProps = {
        size: Typography.Sizes.lg,
    };

    return (
        <DropDownListItem className="d-flex" noDefinedContent={true}>
            <Checkbox
                typographyProps={typographyProps}
                label={value}
                onChange={handleCheckboxChange}
                checked={checked}
            />
            <DragHandle className="ml-auto mr-0 mt-n1 mb-n1 data-table-widget-drag-handle" />
        </DropDownListItem>
    );
});

const SortableContainer = sortableContainer(({ children }) => {
    return <DropDownMenuBase>{children}</DropDownMenuBase>;
});

export const DraggableColumns = ({ headers, onSortEnd }) => (
    <DropDownIcon triggerButtonIcon={<ColumnsSVG />} classNameButton="data-table-widget-action-button">
        <SortableContainer onSortEnd={onSortEnd} useDragHandle>
            {headers.map(({ name }, index) => (
                <SortableItem key={`item-${name}`} index={index} value={name} />
            ))}
        </SortableContainer>
    </DropDownIcon>
);
