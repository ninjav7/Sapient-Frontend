import React from 'react';
import PropTypes from 'prop-types';

import Select, { DROPDOWN_INPUT_TYPES } from '../form/select';
import Typography from '../typography';

import { removeProps, stringOrNumberPropTypes } from '../helpers/helper';

import './BuildingSwitcher.scss';

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
        options: options,
    };
};

const BuildingSwitcher = (props) => {
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

    const filteredProps = removeProps(props, 'options', 'defaultMenuIsOpen');

    return (
        <div className="building-switcher-wrapper" {...filteredProps}>
            <Select {...props} options={options} type={DROPDOWN_INPUT_TYPES.Icon} />
        </div>
    );
};

BuildingSwitcher.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            group: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.node,
                    label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
                    value: stringOrNumberPropTypes.isRequired,
                })
            ),
        })
    ).isRequired,
    defaultValue: PropTypes.number.isRequired,
};

export default BuildingSwitcher;
