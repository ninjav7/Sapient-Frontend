import { useAtom } from 'jotai';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { allFlattenRoutes } from '../../routes';
import { ComponentStore } from '../../store/ComponentStore';
import { userPermissionData } from '../../store/globalState';

import './SideNav.scss';

const SideNav = () => {
    const [activeRoute, setActiveRoute] = useState([]);
    const parentRoute = ComponentStore.useState((s) => s.parent);
    const location = useLocation();
    console.log(parentRoute);

    const [userPermission] = useAtom(userPermissionData);
    const [userPermissionListBuildings, setUserPermissionListBuildings] = useState('');
    const [userPermissionListGeneral, setUserPermissionListGeneral] = useState('');
    const [userPermissionListUsers, setUserPermissionListUsers] = useState('');
    const [userPermissionListRoles, setUserPermissionListRoles] = useState('');

    const [buildingPermissionDetails, setBuildingPermissionDetails] = useState('');
    const [buildingPermissionEquipments, setBuildingPermissionEquipments] = useState('');
    const [buildingPermissionLayouts, setBuildingPermissionLayouts] = useState('');
    const [buildingPermissionPanels, setBuildingPermissionPanels] = useState('');

    // console.log('userPermissionListBuildings', userPermissionListBuildings);

    useEffect(() => {
        if (userPermission?.user_role !== 'admin') {
            if (!userPermission?.permissions?.permissions?.account_buildings_permission?.view) {
                setUserPermissionListBuildings('/settings/buildings');
            }
            if (!userPermission?.permissions?.permissions?.account_general_permission?.view) {
                setUserPermissionListGeneral('/settings/account');
            }
            if (!userPermission?.permissions?.permissions?.account_user_permission?.view) {
                setUserPermissionListUsers('/settings/users');
            }
            if (!userPermission?.permissions?.permissions?.account_roles_permission?.view) {
                setUserPermissionListRoles('/settings/roles');
            }
            if (!userPermission?.permissions?.permissions?.building_details_permission?.view) {
                setBuildingPermissionDetails('/settings/general');
            }
            if (!userPermission?.permissions?.permissions?.building_equipment_permission?.view) {
                setBuildingPermissionEquipments('/settings/equipment');
            }
            if (!userPermission?.permissions?.permissions?.building_layout_permission?.view) {
                setBuildingPermissionLayouts('/settings/layout');
            }
            if (!userPermission?.permissions?.permissions?.building_panels_permission?.view) {
                setBuildingPermissionPanels('/settings/panels');
            }

            if (userPermission?.permissions?.permissions?.account_buildings_permission?.view) {
                setUserPermissionListBuildings('');
            }
            if (userPermission?.permissions?.permissions?.account_general_permission?.view) {
                setUserPermissionListGeneral('');
            }
            if (userPermission?.permissions?.permissions?.account_user_permission?.view) {
                setUserPermissionListUsers('');
            }
            if (userPermission?.permissions?.permissions?.account_roles_permission?.view) {
                setUserPermissionListRoles('');
            }
            if (userPermission?.permissions?.permissions?.building_details_permission?.view) {
                setBuildingPermissionDetails('');
            }
            if (userPermission?.permissions?.permissions?.building_equipment_permission?.view) {
                setBuildingPermissionEquipments('');
            }
            if (userPermission?.permissions?.permissions?.building_layout_permission?.view) {
                setBuildingPermissionLayouts('');
            }
            if (userPermission?.permissions?.permissions?.building_panels_permission?.view) {
                setBuildingPermissionPanels('');
            }

            if (userPermission?.permissions?.permissions === 'All Permissions') {
                setUserPermissionListBuildings('');
                setUserPermissionListGeneral('');
                setUserPermissionListUsers('');
                setUserPermissionListRoles('');
                setBuildingPermissionDetails('');
                setBuildingPermissionEquipments('');
                setBuildingPermissionLayouts('');
                setBuildingPermissionPanels('');
            }
        }
        if (userPermission?.user_role === 'admin') {
            setUserPermissionListBuildings('');
            setUserPermissionListGeneral('');
            setUserPermissionListUsers('');
            setUserPermissionListRoles('');
            setBuildingPermissionDetails('');
            setBuildingPermissionEquipments('');
            setBuildingPermissionLayouts('');
            setBuildingPermissionPanels('');
        }
    }, [userPermission]);

    console.log('userPermissionListRoles', userPermissionListRoles);

    useEffect(() => {
        let activeSideRoutes = [];
        allFlattenRoutes
            .filter(
                (item) =>
                    item?.path !== userPermissionListBuildings &&
                    item?.path !== userPermissionListGeneral &&
                    item?.path !== userPermissionListUsers &&
                    item?.path !== userPermissionListRoles &&
                    item?.path !== buildingPermissionDetails &&
                    item?.path !== buildingPermissionEquipments &&
                    item?.path !== buildingPermissionLayouts &&
                    item?.path !== buildingPermissionPanels
            )
            .forEach((route) => {
                if (route.parent === parentRoute && route.visibility === true) {
                    activeSideRoutes.push(route);
                }
                console.log('router', route);
            });
        setActiveRoute(activeSideRoutes);
    }, [
        parentRoute,
        userPermission,
        userPermissionListBuildings,
        userPermissionListGeneral,
        userPermissionListUsers,
        userPermissionListRoles,
        buildingPermissionDetails,
        buildingPermissionEquipments,
        buildingPermissionLayouts,
        buildingPermissionPanels,
    ]);

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
