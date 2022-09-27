import React from 'react';
import BuildingSwitcher from './BuildingSwitcher';
import ExploreBuildingSwitcher from './ExploreBuildingSwitcher';
import { useLocation } from 'react-router-dom';
import '../style.css';
import './PageTracker.scss';
import Breadcrumbs from './Breadcrumbs';

const PageTracker = () => {
    const location = useLocation();

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                {location.pathname.includes('/explore-page/') && (
                    <>
                        <ExploreBuildingSwitcher />
                        <div className="vl"></div>
                    </>
                )}

                {!location.pathname.includes('/explore-page/') && (
                    <>
                        <BuildingSwitcher />
                        <div className="vl"></div>
                    </>
                )}

                <div className="route-tracker">
                    <Breadcrumbs />
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
