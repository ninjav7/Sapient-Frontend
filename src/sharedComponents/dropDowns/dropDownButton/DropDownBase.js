import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { DropDown } from '../dropDown';
import Typography from '../../typography';
import Input from '../../form/input/Input';

import SearchURL from '../../assets/icons/search.svg';

import './DropDownButton.scss';

const SearchField = (props) => {
    return (
        <div className="border-bottom search-field-wrapper">
            <Input iconUrl={SearchURL} {...props} />
        </div>
    );
};

const DropDownBase = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const {
        onOpen,
        onClose,
        options,
        withSearch,
        children,
        isLink,
        triggerButton,
        placement,
        header,
        classNameMenu,
        handleClick,
        closeOnSelect = true
    } = props 

    const setOpen = () => {
        setIsOpen(true);
        onOpen && onOpen();
    };

    const setClose = () => {
        setIsOpen(false);
        onClose && onClose();
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const dropDownClasses = cx('drop-down-button-wrapper', {
        isOpen: isOpen,
    });

    const dropdownItems = options
        .filter(({ label }) => label.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(({ link, name, label, active, className, icon, key }) => {
            const dropdownItemContent = (
                <>
                    {icon &&
                        React.cloneElement(icon, {
                            ...icon.props,
                            className: `${icon.props.className} drop-down-button-list-item-icon`,
                        })}
                    <Typography.Body size={Typography.Sizes.lg}>{label}</Typography.Body>
                    {key && (
                        <Typography.Body className="ml-auto mr-0 flex-shrink-0" size={Typography.Sizes.xs}>
                            {key}
                        </Typography.Body>
                    )}
                </>
            );

            const itemProps = {
                key: _.uniqueId('drop-down-button-link'),
                className: cx('drop-down-button-list-item', {
                    active,
                    [className]: !!className,
                }),
                onClick:
                    handleClick &&
                    ((event) => {
                        handleClick(name, event);
                        closeOnSelect && setClose();
                    }),
                to: link,
                name,
            };

            if (isLink) {
                return <Link {...itemProps}>{dropdownItemContent}</Link>;
            }

            return <div {...itemProps}>{dropdownItemContent}</div>;
        });
    
    const triggerButtonNode = typeof triggerButton === 'function' ? triggerButton({isOpen, searchQuery, setIsOpen, setSearchQuery, ...props}) : triggerButton;
    
    return (
        <div className={dropDownClasses}>
            <DropDown
                placement={placement}
                isOpen={isOpen}
                triggerButton={React.cloneElement(triggerButtonNode, { ...triggerButtonNode.props })}
                onOpen={setOpen}
                onClose={setClose}>
                <div className={cx('drop-down-button-menu', classNameMenu)}>
                    {header && (
                        <div className={cx('drop-down-button-menu-header', 'border-bottom', header.className)}>
                            {React.cloneElement(header, { ...header.props })}
                        </div>
                    )}
                    {withSearch && <SearchField onChange={handleSearchChange} value={searchQuery} />}
                    <nav>
                        {dropdownItems.length ? (
                            dropdownItems
                        ) : children ? (
                            children
                        ) : (
                            <Typography.Body size={Typography.Sizes.xs} className="p-2 text-center">
                                No options
                            </Typography.Body>
                        )}
                    </nav>
                </div>
            </DropDown>
        </div>
    );
};

DropDownBase.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            link: PropTypes.string,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool,
            className: PropTypes.string,
            icon: PropTypes.node,
            key: PropTypes.string,
            name: PropTypes.string,
        }).isRequired
    ),
    withSearch: PropTypes.bool,
    header: PropTypes.node,
    triggerButton: PropTypes.node.isRequired,
    classNameMenu: PropTypes.string,
    handleClick: PropTypes.func,
    closeOnSelect: PropTypes.bool,
};

DropDownBase.defaultProps = {
    withSearch: false,
    options: [],
};

export default DropDownBase;
