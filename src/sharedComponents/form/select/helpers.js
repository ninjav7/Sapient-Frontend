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

export { conditionalClass, optionClasses, filterOutSelectAllOption };
