import React from 'react';
import PropTypes from 'prop-types';

const KPIBasic = ({ title, value, className = '', classNameBody = '' }) => {
    return (
        <div className={`KPI-component-wrapper ${className}`}>
            <div className={`KPI-component-body ${classNameBody}`}>
                <h5 className="KPI-component-title">{title}</h5>
                <p className="KPI-component-text">{value}</p>
            </div>
        </div>
    );
};

KPIBasic.propTypes = {
    title: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
}

export default KPIBasic;
