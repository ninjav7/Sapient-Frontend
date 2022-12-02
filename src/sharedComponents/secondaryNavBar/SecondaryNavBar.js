import React from 'react';
import PropTypes from 'prop-types';

import { BuildingSwitcher } from '../buildingSwitcher';
import SubNavBreadCrumbs from '../subNavBreadcrumbs';

import { stringOrNumberPropTypes } from '../helpers/helper';

import './SecondaryNavBar.scss';

const SecondaryNavBar = (props) => {
    return (
        <div className="secondary-nav-bar-wrapper d-flex align-items-center borders-bottom">
            <BuildingSwitcher
                onChange={props.onChangeBuilding}
                options={props.buildings}
                currentValue={props.selectedBuilding}
                {...props}
            />
            <div className="secondary-nav-bar-vertical-line" />
            <SubNavBreadCrumbs items={props.breadCrumbsItems} />
        </div>
    );
};

SecondaryNavBar.propTypes = {
    buildings: PropTypes.arrayOf(
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
    selectedBuilding: PropTypes.shape({
        icon: PropTypes.node,
        label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
        value: stringOrNumberPropTypes.isRequired,
    }).isRequired,
    onChangeBuilding: PropTypes.func.isRequired,
    breadCrumbsItems: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool,
            path: PropTypes.string,
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func,
            dropDownMenu: PropTypes.array,
        })
    ),
};

export default SecondaryNavBar;
