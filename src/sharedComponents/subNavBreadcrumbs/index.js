import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Select from '../form/select';

import './style.scss';

import { ReactComponent as AngleRight } from '../assets/icons/angle-right.svg';

const Control = ({ children, ...props }) => {
    return <div {...props}>{children[1]}</div>;
};

const DropdownIndicator = ({ listItem, ...props }) => {
    return (
        <div {...props} {...props.innerProps} className="drop-down-button">
            {listItem} <AngleRight className="drop-down-button-icon" />
        </div>
    );
};

const SubNavBreadCrumbs = ({ items = [] }) => {
    return (
        <Breadcrumb className="custom-breadcrumb-style subnav-breadcrumbs-wrapper">
            {items.map((item, index) => {
                if (!item.label) {
                    return null;
                }

                const renderItem = (props) => (
                    <BreadcrumbItem
                        {...props}
                        tag={item.dropDownMenu && 'div'}
                        active={item.active}
                        key={index}
                        onClick={item.onClick}>
                        {!item.active && item.path ? <Link to={item.path}>{item.label}</Link> : item.label}
                    </BreadcrumbItem>
                );

                return item.dropDownMenu ? (
                    <BreadcrumbItem>
                        <Select
                            options={item.dropDownMenu}
                            components={{
                                DropdownIndicator: (props) => <DropdownIndicator {...props} listItem={renderItem()} />,
                                Control,
                            }}
                        />
                    </BreadcrumbItem>
                ) : (
                    renderItem()
                );
            })}
        </Breadcrumb>
    );
};

Breadcrumb.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool,
            path: PropTypes.string,
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func,
            dropDownMenu: PropTypes.array,
        })
    ),
};

export default SubNavBreadCrumbs;
