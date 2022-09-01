import cx from 'classnames';

const conditionalClass = (props) => (props.selectProps.menuIsOpen ? 'is-open' : 'is-closed');

const optionClasses = ({ isDisabled, isFocused, isSelected, customOption }) =>
    cx('react-select-option', {
        'react-select-option--is-disabled': isDisabled,
        'react-select-option--is-focused': isFocused,
        'react-select-option--is-selected': isSelected,
        customOption: !!customOption,
    });

export { conditionalClass, optionClasses };
