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

    const setOpen = () => {
        setIsOpen(true);
    };

    const setClose = () => {
        setIsOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const dropDownClasses = cx('drop-down-button-wrapper', {
        isOpen: isOpen,
    });

    const links = props.links
        .filter(({ label }) => label.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(({ link, label, active, className, icon, key }) => {
            return (
                <Link
                    key={_.uniqueId('drop-down-button-link')}
                    to={link}
                    className={cx('drop-down-button-list-item', {
                        active,
                        [className]: !!className,
                    })}>
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
                </Link>
            );
        });

    return (
        <div className={dropDownClasses}>
            <DropDown
                isOpen={isOpen}
                triggerButton={React.cloneElement(props.triggerButton, { ...props.triggerButton.props })}
                onOpen={setOpen}
                onClose={setClose}>
                <div className="drop-down-button-menu">
                    {props.header && (
                        <div className={cx('drop-down-button-menu-header', 'border-bottom', props.header.className)}>
                            {React.cloneElement(props.header, { ...props.header.props })}
                        </div>
                    )}
                    {props.withSearch && <SearchField onChange={handleSearchChange} value={searchQuery} />}
                    <nav>
                        {links.length ? (
                            links
                        ) : props.children ? (
                            props.children
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
    links: PropTypes.arrayOf(
        PropTypes.shape({
            link: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool,
            className: PropTypes.string,
            icon: PropTypes.node,
            key: PropTypes.string,
        }).isRequired
    ),
    withSearch: PropTypes.bool,
    header: PropTypes.node,
    triggerButton: PropTypes.node.isRequired,
};

DropDownBase.defaultProps = {
    withSearch: false,
    links: [],
};

export default DropDownBase;
