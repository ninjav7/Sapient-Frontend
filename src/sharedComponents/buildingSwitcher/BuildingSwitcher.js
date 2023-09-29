import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import Select, { DROPDOWN_INPUT_TYPES } from '../form/select';
import Typography from '../typography';
import { Option } from '../form/select/customComponents';

import { removeProps, stringOrNumberPropTypes } from '../helpers/helper';
import './BuildingSwitcher.scss';
import SelectNavBar from '../form/select-navbar';

const createGroup = (groupName, options, setValue) => {
    return {
        label: (() => {
            return (
                <div
                    onClick={() =>
                        setValue((value) => value.concat(options.filter((grpOpt) => !value.includes(grpOpt))))
                    }>
                    {groupName}
                </div>
            );
        })(),
        hasValue: !!groupName,
        options: options,
    };
};

//@TODO Revise an approach
const extractValueForOption = (data) => {
    if (typeof data === 'string') {
        return data;
    }
    if (data.props && data.props.children && data.props.children && typeof data.props.children === 'string') {
        return data.props.children;
    }
};

//@TODO Rewrite it, need to preserve an hierarchy!!!
const defaultSearch = (data, value) => {
    if (!value) {
        return data;
    }

    return (Array.isArray(data) ? data : []).reduce((acc, item) => {
        const { props } = item;

        if (Option === item.type) {
            const found = String(extractValueForOption(props.data?.label)).toLowerCase().includes(value.toLowerCase());

            if (found) {
                acc.push(item);
            }

            return acc;
        } else {
            const result = defaultSearch(props.children, value);

            if (result.length === 0) {
                return acc;
            } else {
                acc.push(result);
            }

            return acc.flat();
        }
    }, []);
};

const BuildingSwitcher = (props) => {
    const { listType = 'building' } = props;

    const options = props.options.map(({ group, options }) =>
        createGroup(
            group,
            options.map(({ label, ...props }) => ({
                label: <Typography.Body size={Typography.Sizes.lg}>{label}</Typography.Body>,
                ...props,
            })),
            () => {}
        )
    );

    const filteredProps = removeProps(props, 'wrapperProps');
    const filterOption = useCallback(() => true, []);

    return (
        <>
            {listType === 'building' ? (
                <div className="building-switcher-wrapper" {...props?.wrapperProps}>
                    <Select
                        {...filteredProps}
                        options={options}
                        isSearchable={true}
                        type={DROPDOWN_INPUT_TYPES.Icon}
                        customSearchCallback={({ data, query }) => defaultSearch(data, query.value)}
                        searchFieldsProps={{
                            placeholder: 'Filter Buildings',
                            wrapper: {
                                className: 'building-switcher-search-field',
                            },
                        }}
                        searchNoResults={'No buildings found'}
                        filterOption={filterOption}
                    />
                </div>
            ) : (
                <div className="building-switcher-wrapper" {...props?.wrapperProps}>
                    <SelectNavBar
                        {...filteredProps}
                        options={options}
                        isSearchable={true}
                        type={DROPDOWN_INPUT_TYPES.Icon}
                        customSearchCallback={({ data, query }) => defaultSearch(data, query.value)}
                        searchFieldsProps={{
                            placeholder: 'Filter Clients',
                            wrapper: {
                                className: 'building-switcher-search-field',
                            },
                        }}
                        searchNoResults={'No clients found'}
                        filterOption={filterOption}
                    />
                </div>
            )}
        </>
    );
};

BuildingSwitcher.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            group: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.node,
                    label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
                    value: stringOrNumberPropTypes,
                })
            ),
        })
    ).isRequired,
    defaultValue: PropTypes.shape({
        icon: PropTypes.node,
        label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        value: stringOrNumberPropTypes,
    }).isRequired,

    // The difference between default and current values, is currentValue allows to change current value dynamically
    currentValue: PropTypes.shape({
        icon: PropTypes.node,
        label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        value: stringOrNumberPropTypes,
    }),
    wrapperProps: PropTypes.any,
    listType: PropTypes.string,
};

export default BuildingSwitcher;
