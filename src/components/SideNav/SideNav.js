import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import { allRoutes, authProtectedRoutes, allFlattenRoutes } from '../../routes';
import { ComponentStore, ROUTE_LEVELS } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';

import './SideNav.scss';

export const SETTINGS_ROUTE_MAP = Object.freeze({
    [ROUTE_LEVELS.PORTFOLIO]: 'account',
    [ROUTE_LEVELS.BUILDINGS]: 'building-settings',
});

const hiddenPages = ['Utility Bills', 'Gateways', 'Users', 'Roles'];

const SideNav = () => {
    const bldStoreId = BuildingStore.useState((s) => s.BldgId);
    // const [bldgId, setBldgId] = useState(bldStoreId);
    const { bldgId = localStorage.getItem('buildingId') } = useParams();
    const [activeRoute, setActiveRoute] = useState([]);
    const [parentRoute, levelRoute] = ComponentStore.useState(({parent, level}) => [parent, level]);
    const location = useLocation();

    const history = useHistory();
    

    useEffect(() => {
        //@TODO Need to refactor ans use as HOC a whole app
        let activeSideRoutes = [];
        allFlattenRoutes.forEach((route) => {
            if(location.pathname.startsWith('/settings')) {
                if (route.parent === SETTINGS_ROUTE_MAP[levelRoute] && route.visibility === true) {
                    !hiddenPages.find((page) => page === route.name) && activeSideRoutes.push(route);
                }
                return;
            }

            if(location.pathname.startsWith('/control')) {
                if (route.parent === 'control' && route.visibility === true) {
                    !hiddenPages.find((page) => page === route.name) && activeSideRoutes.push(route);
                }
                return;
            }

            
            if (route.parent === parentRoute && route.visibility === true) {
                !hiddenPages.find((page) => page === route.name) && activeSideRoutes.push(route);
            }
            
        });
        setActiveRoute(activeSideRoutes);
    }, [levelRoute, parentRoute]);


    useEffect(() => {
        //@TODO Need to refactor ans use as HOC a whole app
        let activeSideRoutes = [];
        allFlattenRoutes.forEach((route) => {
            if(location.pathname.startsWith('/settings')) {
                if (route.parent === SETTINGS_ROUTE_MAP[levelRoute] && route.visibility === true) {
                    !hiddenPages.find((page) => page === route.name) && activeSideRoutes.push(route);
                }
                return;
            }

            if(location.pathname.startsWith('/control')) {
                if (route.parent === 'control' && route.visibility === true && route.visibility === true) {
                    !hiddenPages.find((page) => page === route.name) && activeSideRoutes.push(route);
                }
                return;
            }

            if(location.pathname.startsWith('/energy')) {

                if (route.parent === 'energy' && route.visibility === true && route.visibility === true) {
                    !hiddenPages.find((page) => page === route.name) && activeSideRoutes.push(route);
                }
                return;
            }

            if (route.parent === parentRoute && route.visibility === true && route.visibility === true) {
                !hiddenPages.find((page) => page === route.name) && activeSideRoutes.push(route);
            }

        });
        
        const path = activeSideRoutes[0]?.path;

        console.log(path, levelRoute, parentRoute, 'path, levelRoute, parentRoute');

        path && history.push(path)
    }, [levelRoute, parentRoute]);
    
    
    

    return (
        <>
            <div className="side-nav">
                {activeRoute.map((item, index) => {
                    if (item.path.includes(':bldgId')) {
                        item.path = item.path.split(':')[0].concat(localStorage.getItem('buildingId'));
                    }

                    let str1 = item.path.split('/')[2];
                    let str2 = location.pathname.split('/')[2];
                    let active = str1.localeCompare(str2);

                    return (
                        <Link to={item.path} key={index}>
                            {active === 0 ? (
                                <div
                                    // className="side-nav-content"
                                    className="side-nav-content active"
                                    key={index}
                                    onClick={() => {
                                        ComponentStore.update((s) => {
                                            s.parent = item.parent;
                                        });
                                    }}>
                                    {item.name}
                                </div>
                            ) : (
                                <div
                                    className="side-nav-content"
                                    // className="side-nav-content-active"
                                    key={index}
                                    onClick={() => {
                                        ComponentStore.update((s) => {
                                            s.parent = item.parent;
                                        });
                                    }}>
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </>
    );
};

export default SideNav;
