import React, { useContext, useState } from 'react';
import _ from 'lodash';

import Input from '../../form/input/Input';
import Select from '../../form/select';
import { Button } from '../../button';
import { FilterHeaderButton } from './FilterHeaderButton';
import DropDownBase from '../../dropDowns/dropDownButton/DropDownBase';
import { generateID } from '../../helpers/helper';

import { RangeSlider } from '../../rangeSlider';
import { LastUpdated } from '../../lastUpdated';
import { DataTableWidgetContext } from '../DataTableWidget';
import { StatusFilter } from './StatusFilter';

import { FILTER_TYPES } from '../constants';
import SearchSVG from '../../assets/icons/search.svg';
import { ReactComponent as PlusSVG } from '../../assets/icons/plus.svg';

const mapFilters = {
    [FILTER_TYPES.RANGE_SELECTOR]: (props) => {
        let filterValue = props.filterOptions;
        let currentValue = filterValue;

        const handleChange = () => {
            props.onClose && props.onClose(currentValue);
        };

        const handleRangeSliderChange = (value) => {
            filterValue = value;
            currentValue = value;
            props.onChange && props.onChange(value);
        };

        const buttonLabel = () => {
            return `${filterValue[0]} - ${filterValue[1]} ${props.componentProps.prefix}`;
        };

        return (
            <DropDownBase
                isOpened={props.isOpened}
                key={generateID()}
                placement="bottom-start"
                onClose={handleChange}
                triggerButton={(pp) => {
                    return (
                        <div>
                            <FilterHeaderButton
                                buttonLabel={buttonLabel()}
                                {...props}
                                isOpen={pp.isOpen}
                                onDeleteFilter={props.onDeleteFilter}
                            />
                        </div>
                    );
                }}>
                <RangeSlider
                    min={0}
                    max={100}
                    range={filterValue}
                    prefix="%"
                    onSelectionChange={handleRangeSliderChange}
                    {...props.componentProps}
                />
            </DropDownBase>
        );
    },

    [FILTER_TYPES.MULTISELECT]: (props) => {
        const [selectedOptions, setSelectedOptions] = useState([]);

        const handleChange = (options) => {
            props.onChange && props.onChange(options);
            setSelectedOptions(options);
        };

        return (
            <Select.Multi
                options={props.filterOptions}
                onChange={handleChange}
                isSelectAll={true}
                onMenuClose={() => props?.onClose && props.onClose(selectedOptions)}
                components={{
                    Control: (controlProps) => (
                        <div {...controlProps} onBlur={() => {}}>
                            <FilterHeaderButton
                                isOpen={controlProps.menuIsOpen}
                                {...props}
                                onBlur={() => {}}
                                buttonLabel={
                                    selectedOptions.length > 1
                                        ? `${selectedOptions.length} List items`
                                        : selectedOptions[0]?.label
                                }
                                onDeleteFilter={props.onDeleteFilter}
                            />
                        </div>
                    ),
                }}
                isSearchable
                {...props.componentProps}
            />
        );
    },

    [FILTER_TYPES.LAST_UPDATED_SELECTOR]: (props) => {
        const { selectedFiltersValues, setSelectedFiltersValues } = useContext(DataTableWidgetContext);

        let filterValue = { ...selectedFiltersValues[FILTER_TYPES.LAST_UPDATED_SELECTOR] };
        const activeVariant = selectedFiltersValues[FILTER_TYPES.LAST_UPDATED_SELECTOR].active;

        const handleChange = (value) => {
            filterValue = { ...filterValue, ...value };
        };

        const handleClose = () => {
            setSelectedFiltersValues((oldState) => {
                return { ...oldState, [FILTER_TYPES.LAST_UPDATED_SELECTOR]: filterValue };
            });
        };

        const buttonLabel = () => {
            if (activeVariant === 'date-range') {
                try {
                    const startDate = filterValue[activeVariant]?.rangeDate[0];
                    const endDate = filterValue[activeVariant]?.rangeDate[1];
                    const isTheSameYear = startDate.isSame(endDate, 'year');

                    return `${filterValue[activeVariant]?.rangeDate[0].format(
                        `MMM D ${!isTheSameYear ? 'YYYY' : ''}`
                    )} - ${filterValue[activeVariant]?.rangeDate[1].format(`MMM D ${!isTheSameYear ? 'YYYY' : ''}`)}`;
                } catch (e) {}
            }

            if (+filterValue[activeVariant]?.value === 0) {
                return;
            }

            if (activeVariant === 'more-than') {
                return `More than ${filterValue[activeVariant].value} ${filterValue[activeVariant].period}`;
            }

            if (activeVariant === 'within-the-last') {
                return `Within the last ${filterValue[activeVariant].value} ${filterValue[activeVariant].period}`;
            }
        };

        return (
            <DropDownBase
                onClose={handleClose}
                classNameMenu="data-table-widget-last-updated"
                key={generateID()}
                placement="bottom-start"
                triggerButton={(pp) => {
                    return (
                        <div>
                            <FilterHeaderButton
                                {...props}
                                buttonLabel={buttonLabel()}
                                isOpen={pp.isOpen}
                                onDeleteFilter={props.onDeleteFilter}
                            />
                        </div>
                    );
                }}>
                <LastUpdated
                    onChange={handleChange}
                    initialValues={selectedFiltersValues[FILTER_TYPES.LAST_UPDATED_SELECTOR]}
                    {...props.componentProps}
                />
            </DropDownBase>
        );
    },
};

export const Filters = ({
    filterOptions,
    onChange,
    onChangeFilterValue,
    selectedFilters,
    onDeleteFilter,
    hideStatusFilter = false,
}) => {
    const { widgetProps, setSearch } = useContext(DataTableWidgetContext);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div className="data-table-widget-filters">
            {widgetProps.onSearch && <Input iconUrl={SearchSVG} onChange={handleSearchChange} placeHolder="Search" />}

            {filterOptions && (
                <Select.Multi
                    onChange={onChange}
                    options={filterOptions}
                    value={selectedFilters}
                    components={{
                        Control: (props) => (
                            <div {...props}>
                                <Button
                                    label="Add Filter"
                                    type={Button.Type.secondaryGrey}
                                    size={Button.Sizes.md}
                                    icon={<PlusSVG />}
                                />
                            </div>
                        ),
                    }}
                />
            )}
            {!hideStatusFilter && <StatusFilter />}

            {selectedFilters.map((filter) => {
                const Component = mapFilters[filter.filterType];

                const handleDeleteFilter = (args) => {
                    onDeleteFilter(args);
                    filter.onDelete && filter.onDelete(args);
                };

                //@TODO Delete on change filter carefully
                return (
                    // putting here any other content, can execute re-render even if it is necessary
                    // it will force to rerender the component per each change a list of filters
                    <Component
                        // Here we try to use id or value as uniq id, to avoid mixing up between different filters
                        // We can't use generateID() here, because per iteration the list will be re-rendered again with losing selected items.
                        // Using predefined IDs resolves that issue, allows to not re-render all children.
                        key={filter.id || filter.value}
                        {...filter}
                        onDeleteFilter={handleDeleteFilter}
                        onChangeFilterValue={onChangeFilterValue}
                    />
                );
            })}
        </div>
    );
};
