import React, { useCallback, useState } from 'react';
import { components } from 'react-select';
import cx from 'classnames';

import Typography from '../../typography';
import { TinyPieChart } from '../../tinyPieChart';
import { Checkbox } from '../checkbox';
import Input from '../input/Input';
import Brick from '../../brick';

import { selectAllOption } from './constants';
import { DROPDOWN_INPUT_TYPES } from './index';
import { conditionalClass, defaultSearch, optionClasses } from './helpers';

import { ReactComponent as CheckedSVG } from '../../assets/icons/checked-big.svg';
import { ReactComponent as CaretDownIcon } from '../../assets/icons/caretDown.svg';
import { ReactComponent as CloseSVG } from '../../assets/icons/close-button.svg';
import SearchURL from '../../assets/icons/search.svg';

const OptionIcon = ({ type, icon, img, iconForSelected, isSingleValueComponent }) => {
    if (iconForSelected && isSingleValueComponent) {
        return React.cloneElement(iconForSelected, {
            className: 'react-select-option-icon p-0 square icon flex-shrink-0',
        });
    }

    return (
        type === DROPDOWN_INPUT_TYPES.Icon && (
            <>
                {icon &&
                    React.cloneElement(icon, {
                        ...icon.props,
                        className: cx('react-select-option-icon icon', icon.props.className),
                    })}
                {img && React.cloneElement(img, { className: 'react-select-option-icon img' })}
            </>
        )
    );
};

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

    const isShownChart = percentChart && labelChart && isOptionComponent;

    if (!isShownChart && !isSelected) {
        return null;
    }

    return (
        <div className={className}>
            <div>{isShownChart && <TinyPieChart percent={percentChart} label={labelChart} />}</div>
            {isSelected && !hideTick && <CheckedSVG />}
        </div>
    );
};

//Single
const CustomOptionContent = ({ component: Component, className, ...props }) => {
    const { supportText } = props.data;
    const { type, customOption } = props.selectProps;

    const isOptionComponent = Object.is(Component, components.Option);
    const isSingleValueComponent = Object.is(Component, components.SingleValue);

    const children = !!customOption ? React.cloneElement(customOption, { className }, props.children) : props.children;

    const IconProps = { ...props.selectProps, ...props.data, isSingleValueComponent };
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

export const Option = (props) => {
    const { isDisabled, isSelected, isFocused } = props;
    const { customOption } = props.selectProps;

    const className = optionClasses({ isDisabled, isSelected, isFocused, customOption });

    return <CustomOptionContent {...props} className={className} component={components.Option} />;
};

export const ValueContainerSingle = ({ children, ...props }) => {
    // We do this because react-select automatically deletes selected value during search.
    const { label } = props.getValue()[0] || {};

    return (
        <components.ValueContainer {...props}>
            {!!props.selectProps.inputValue && (
                <>
                    <SingleValue {...props} data={{}} children={label} />
                </>
            )}

            {children}
        </components.ValueContainer>
    );
};

export const GroupHeading = ({ children, ...props }) => {
    if (!props.data.hasValue) {
        return null;
    }

    return <components.GroupHeading {...props}>{children}</components.GroupHeading>;
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

export const OptionMulti = (props) => {
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

    const selectedItems = Array.isArray(value) ? value.filter((option) => option.value !== selectAllOption.value) : [];
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

export const MenuList = ({
    selectProps: {
        onMenuInputFocus,
        closeMenu,
        onInputChange,
        inputValue,
        customSearchCallback,
        isMulti,
        searchFieldsProps,
        searchNoResults,
    },
    ...props
}) => {
    const [value, setValue] = useState('');

    const memoizedCallBack = useCallback((event) => {
        event.stopPropagation();
        event.target.focus();
    }, []);

    const memoizedChangeHandler = useCallback(
        (event) => {
            if (customSearchCallback) {
                return setValue(event.target.value);
            }

            onInputChange &&
                onInputChange(event.currentTarget.value, {
                    action: 'input-change',
                });
        },
        [customSearchCallback]
    );

    const memoizedKeyDownHandler = useCallback((event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    }, []);

    // Copied from source
    const ariaAttributes = {
        'aria-autocomplete': 'list',
        'aria-label': props['aria-label'],
        'aria-labelledby': props['aria-labelledby'],
    };

    const filteredChildren = (() => {
        if (customSearchCallback) {
            return customSearchCallback({
                data: React.Children.toArray(props.children),
                query: {
                    setValue,
                    value,
                },
                nativeSearch: {
                    inputValue,
                    memoizedChangeHandler,
                },
            });
        }

        return props.children;
    })();

    const isSearchNoResults = typeof searchNoResults === 'string';

    const renderNoResultsContent = () => {
        if (!isSearchNoResults && React.isValidElement(searchNoResults)) {
            return React.cloneElement(searchNoResults, { ...searchNoResults?.props });
        }

        return (
            <Typography.Body size={Typography.Sizes.xs} className="text-center p-2">
                {isSearchNoResults ? searchNoResults : 'No options'}
            </Typography.Body>
        );
    };

    return (
        <>
            <div
                {...searchFieldsProps?.wrapper}
                className={cx('search-field-wrapper', searchFieldsProps?.wrapper.className)}>
                <Input
                    placeholder="Search..."
                    {...ariaAttributes}
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck="false"
                    type="text"
                    iconUrl={SearchURL}
                    {...searchFieldsProps}
                    value={customSearchCallback ? value : inputValue}
                    onChange={memoizedChangeHandler}
                    onMouseDown={memoizedCallBack}
                    onTouchEnd={memoizedCallBack}
                    onFocus={onMenuInputFocus}
                    onKeyDown={memoizedKeyDownHandler}
                />

                {/* We need it because we don't have 'select all' with margin for single select */}
                {!isMulti && <Brick sizeInRem={0.625} />}
            </div>

            <components.MenuList {...props}>
                {filteredChildren.length ? filteredChildren : renderNoResultsContent()}
            </components.MenuList>
        </>
    );
};

export const Control = ({ children, ...props }) => (
    <components.Control {...props} className={conditionalClass(props)}>
        {children}
    </components.Control>
);

export const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <CaretDownIcon className={conditionalClass(props)} />
    </components.DropdownIndicator>
);
