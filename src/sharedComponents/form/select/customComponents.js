import React, { useCallback, useState } from 'react';
import { components } from 'react-select';
import cx from 'classnames';

import Typography from '../../typography';
import { TinyPieChart } from '../../tinyPieChart';
import { Checkbox } from '../checkbox';
import Input from '../input/Input';

import { selectAllOption } from './constants';
import { DROPDOWN_INPUT_TYPES } from './index';
import { conditionalClass, optionClasses } from './helpers';

import { ReactComponent as CheckedSVG } from '../../assets/icons/checked-big.svg';
import { ReactComponent as CaretDownIcon } from '../../assets/icons/caretDown.svg';
import { ReactComponent as CloseSVG } from '../../assets/icons/close-button.svg';
import SearchURL from '../../assets/icons/search.svg';

const OptionIcon = ({ type, icon, img }) =>
    type === DROPDOWN_INPUT_TYPES.Icon && (
        <>
            {icon && React.cloneElement(icon, { className: 'react-select-option-icon icon' })}
            {img && React.cloneElement(img, { className: 'react-select-option-icon img' })}
        </>
    );

const OptionTypo = ({ isOptionComponent, children, supportText }) => (
    <>
        <Typography.Body size={isOptionComponent ? Typography.Sizes.md : Typography.Sizes.lg} className="flex-grow-1">
            {children}
            {supportText && <span className="react-select-option-support-text">{supportText}</span>}
        </Typography.Body>
    </>
);

const OptionChartAndCheck = ({ percentChart, labelChart, isSelected, isOptionComponent, hideTick }) => {
    const className = cx('react-select-icon-chart-wrapper', { hideTick: hideTick });

    return (
        <div className={className}>
            <div>
                {percentChart && labelChart && isOptionComponent && (
                    <TinyPieChart percent={percentChart} label={labelChart} />
                )}
            </div>
            {isSelected && !hideTick && <CheckedSVG />}
        </div>
    );
};

//Single
const CustomOptionContent = ({ component: Component, className, ...props }) => {
    const { supportText } = props.data;
    const { type, customOption } = props.selectProps;

    const isOptionComponent = Object.is(Component, components.Option);

    const children = !!customOption ? React.cloneElement(customOption, { className }, props.children) : props.children;

    const IconProps = { ...props.selectProps, ...props.data };
    const TypoProps = { ...props, ...props.selectProps, ...{ children, isOptionComponent, supportText } };
    const ChartAndIconProps = {
        ...props,
        ...props.data,
        ...{ isOptionComponent, hideTick: props.selectProps.hideTick },
    };

    return (
        <Component {...props} className={className}>
            <div className="d-flex justify-content-between align-items-center">
                <OptionIcon {...IconProps} type={type} />

                <OptionTypo {...TypoProps} />

                <OptionChartAndCheck {...ChartAndIconProps} />
            </div>
        </Component>
    );
};

export const SingleValue = ({ children, ...props }) => {
    return (
        <CustomOptionContent
            {...props}
            className={cx(props.className, 'single-value-custom')}
            component={components.SingleValue}>
            {children}
        </CustomOptionContent>
    );
};

export const Option = props => {
    const { isDisabled, isSelected, isFocused } = props;
    const { customOption } = props.selectProps;

    const className = optionClasses({ isDisabled, isSelected, isFocused, customOption });

    return <CustomOptionContent {...props} className={className} component={components.Option} />;
};

//Multi
const BadgeSingleValue = ({ handleCloseBtn, ...props }) => (
    <div className="multi-single-value" {...props}>
        <Typography.Body size={Typography.Sizes.lg} className="d-flex align-items-center">
            {props.children}
        </Typography.Body>
        <button onClick={handleCloseBtn} type="button" className="multi-single-value-close-btn">
            <CloseSVG />
        </button>
    </div>
);

export const OptionMulti = props => {
    const { isDisabled, isSelected, isFocused, children } = props;
    const { customOption } = props.selectProps;

    const className = optionClasses({ isDisabled, isSelected, isFocused, customOption });
    const isSelectAllOption = props.value === selectAllOption.value;

    const IconProps = { ...props.selectProps, ...props.data };
    const TypoProps = {
        ...props,
        ...props.selectProps,
        ...{ children, isOptionComponent: true, supportText: props.data.supportText },
    };

    const ChartAndIconProps = {
        ...props,
        ...props.data,
        ...{ isOptionComponent: true, hideTick: props.selectProps.hideTick },
    };

    if (isSelectAllOption) {
        props.innerProps.onClick = props.selectProps.checkAllCheckboxes;
    }

    const isIndeterminate =
        (props.selectProps.value || []).length !== props.selectProps.options.length &&
        !!(props.selectProps.value || []).length;

    return (
        <>
            <components.Option {...props} className={cx(className, { selectAllOption: isSelectAllOption })}>
                <div className="d-flex justify-content-between align-items-center">
                    {isSelectAllOption ? (
                        <>
                            <Checkbox.DropDownCheckbox
                                label={''}
                                checked={props.isSelected}
                                readOnly
                                indeterminate={isIndeterminate}
                            />
                            <Typography.Body
                                className="flex-grow-1"
                                size={Typography.Sizes.lg}
                                fontWeight={Typography.Types.Medium}>
                                {TypoProps.children}
                            </Typography.Body>
                        </>
                    ) : (
                        <>
                            <Checkbox.DropDownCheckbox
                                label={''}
                                checked={props.isSelected}
                                disabled={props.data.isDisabled}
                                readOnly
                            />
                            <OptionIcon {...IconProps} />

                            <OptionTypo {...TypoProps} />
                            <OptionChartAndCheck {...ChartAndIconProps} />
                        </>
                    )}
                </div>
            </components.Option>
            {isSelectAllOption && <div className="horizontal-separator"></div>}
        </>
    );
};

// eslint-disable-next-line no-unused-vars
export const ValueContainerMulti = ({ children, ...props }) => {
    const { label, value } = props.selectProps;

    const selectedItems = Array.isArray(value) ? value.filter(option => option.value !== selectAllOption.value) : [];
    const isTitleShow = selectedItems.length > 1;

    const handleCloseBtn = useCallback(() => {
        props.clearValue();
    }, []);

    return (
        <components.ValueContainer {...props}>
            <components.Placeholder {...props} isFocused={props.isFocused}>
                {isTitleShow && (
                    <BadgeSingleValue handleCloseBtn={handleCloseBtn}>{selectedItems.length} selected</BadgeSingleValue>
                )}
                {selectedItems.length < 1 && (
                    <Typography.Body size={Typography.Sizes.lg} className="d-flex align-items-center">
                        <OptionIcon type={props.selectProps.type} icon={props.selectProps.icon} />
                        {label ? label : props.selectProps.placeholder}
                    </Typography.Body>
                )}
                {selectedItems.length === 1 && (
                    <BadgeSingleValue handleCloseBtn={handleCloseBtn}>
                        <OptionIcon type={props.selectProps.type} icon={props.selectProps.icon} />
                        {selectedItems[0].label} {selectedItems[0].supportText}
                    </BadgeSingleValue>
                )}
            </components.Placeholder>
            {/*{React.Children.map(children, child => (child && child.type !== Placeholder ? child : null))}*/}
        </components.ValueContainer>
    );
};

export const MenuList = ({ selectProps: { onMenuInputFocus }, ...props }) => {
    const [value, setValue] = useState('');

    const handleMouseDown = event => {
        event.stopPropagation();
        event.preventDefault();

        event.target.focus();
    };

    const handleChange = event => {
        event.stopPropagation();
        event.preventDefault();

        event.target.focus();
        setValue(event.target.value);
    };

    const filteredChildren = props.children.filter(({ props }) => props.data.label.includes(value));

    return (
        <>
            <div className="search-field-wrapper">
                <Input
                    onChange={handleChange}
                    iconUrl={SearchURL}
                    value={value}
                    onMouseDown={handleMouseDown}
                    onInput={() => {}}
                    onKeyDown={null}
                    onFocus={onMenuInputFocus}
                    placeholder="Search"
                />
            </div>

            <components.MenuList {...props}>
                {filteredChildren.length ? (
                    filteredChildren
                ) : (
                    <Typography.Body size={Typography.Sizes.xs} className="text-center p-2">
                        No options
                    </Typography.Body>
                )}
            </components.MenuList>
        </>
    );
};

export const Control = ({ children, ...props }) => (
    <components.Control {...props} className={conditionalClass(props)}>
        {children}
    </components.Control>
);

export const DropdownIndicator = props => (
    <components.DropdownIndicator {...props}>
        <CaretDownIcon className={conditionalClass(props)} />
    </components.DropdownIndicator>
);
