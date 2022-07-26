import React from 'react';
import BuildingSwitcher from './BuildingSwitcher';

import '../style.css';
import './PageTracker.scss'
import Breadcrumbs from './Breadcrumbs';


const PageTracker = () => {
    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                <>
                    <BuildingSwitcher />
                    <div className="vl"></div>
                </>
                <div className="route-tracker">
                    <Breadcrumbs />
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
