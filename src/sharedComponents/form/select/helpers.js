import cx from 'classnames';
import { selectAllOption } from './constants';

const conditionalClass = (props) => (props.selectProps.menuIsOpen ? 'is-open' : 'is-closed');

const optionClasses = ({ isDisabled, isFocused, isSelected, customOption }) =>
    cx('react-select-option', {
        'react-select-option--is-disabled': isDisabled,
        'react-select-option--is-focused': isFocused,
        'react-select-option--is-selected': isSelected,
        customOption: !!customOption,
    });

const filterOutSelectAllOption = (options) => {
    return options.filter((el) => el?.value !== selectAllOption?.value);
};

const defaultDropdownSearch = (data, value) => {
    if (!value) {
        return data;
    }

    const lowerCaseValue = value.toLowerCase();
    const newFilteredList = data.filter((el) => {
        const { props: { data: { label } = {} } = {} } = el;
        return label && label.toLowerCase().includes(lowerCaseValue);
    });

    return newFilteredList;
};

export { conditionalClass, optionClasses, filterOutSelectAllOption, defaultDropdownSearch };
