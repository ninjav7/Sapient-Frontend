import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { allRoutes, authProtectedRoutes, allFlattenRoutes } from '../routes/index';
import { ComponentStore } from '../store/ComponentStore';
import { BuildingStore } from '../store/BuildingStore';

const SideNavbar = () => {
    const bldStoreId = BuildingStore.useState((s) => s.BldgId);
    // const [bldgId, setBldgId] = useState(bldStoreId);
    const { bldgId = localStorage.getItem('buildingId') } = useParams();
    const [activeRoute, setActiveRoute] = useState([]);
    const parentRoute = ComponentStore.useState((s) => s.parent);
    const location = useLocation();

    useEffect(() => {
        let activeSideRoutes = [];
        allFlattenRoutes.forEach((route) => {
            if (route.parent === parentRoute) {
                activeSideRoutes.push(route);
            }
        });
        setActiveRoute(activeSideRoutes);
    }, [parentRoute]);

    // useEffect(() => {
    //     let newBldStoreId = bldStoreId;
    //     setBldgId(newBldStoreId);
    // }, [BuildingStore]);

    useEffect(() => {
        console.log('localStorage.getItem => ', localStorage.getItem('buildingId'));
    });

    return (
        <>
            <div className="mt-3">
                {activeRoute.map((item, index) => {
                    if (item.path.includes(':bldgId')) {
                        item.path = item.path.split(':')[0].concat(localStorage.getItem('buildingId'));
                    }

                    let str1 = item.path.split('/')[2];
                    let str2 = location.pathname.split('/')[2];
                    let active = str1.localeCompare(str2);

                    return (
                        <Link to={item.path}>
                            {active === 0 ? (
                                <div
                                    // className="side-nav-content"
                                    className="side-nav-content-active"
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

export default SideNavbar;
