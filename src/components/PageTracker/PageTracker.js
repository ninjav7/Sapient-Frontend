import React, { useEffect } from 'react';
import BuildingSwitcher from './BuildingSwitcher';
import ExploreBuildingSwitcher from './ExploreBuildingSwitcher';
import { Link, useLocation } from 'react-router-dom';
import '../style.css';
import './PageTracker.scss';
import { ExploreBuildingStore } from '../../store/ExploreBuildingStore';
import Breadcrumbs from './Breadcrumbs';

const PageTracker = () => {
    const exploreBldId = ExploreBuildingStore.useState((s) => s.exploreBldId);
    const exploreBldName = ExploreBuildingStore.useState((s) => s.exploreBldName);
    const location = useLocation();

    useEffect(() => {
        console.log('SSR exploreBldId => ', exploreBldId);
        console.log('SSR exploreBldName => ', exploreBldName);
    });

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                {location.pathname === '/explore/page' && (
                    <>
                        <ExploreBuildingSwitcher />
                        <div className="vl"></div>
                    </>
                )}

                {location.pathname !== '/explore/page' && (
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
