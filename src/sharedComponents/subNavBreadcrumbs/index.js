import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import './style.scss';
import PropTypes from 'prop-types';

const SubNavBreadCrumbs = ({ items = [] }) => {
    return (
        <Breadcrumb className="custom-breadcrumb-style subnav-breadcrumbs-wrapper">
            {items.map((item, index) => {
                return item.active ? (
                    <BreadcrumbItem active key={index}>
                        {item.label}
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem key={index}>
                        <Link to={item.path}>{item.label}</Link>
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );
};

Breadcrumb.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool,
            path: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
};

export default SubNavBreadCrumbs;
