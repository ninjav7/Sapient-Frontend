import { useAtom } from 'jotai';
import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { allFlattenRoutes } from '../../routes';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import { buildingData, userPermissionData } from '../../store/globalState';

import './SideNav.scss';

const SideNav = () => {
    const location = useLocation();
    const history = useHistory();
    const [activeRoute, setActiveRoute] = useState([]);
    const parentRoute = ComponentStore.useState((s) => s.parent);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [buildingListData] = useAtom(buildingData);
    const [isPlugEnabled, setPlugEnabled] = useState(false);

    const [userPermission] = useAtom(userPermissionData);
    const [userPermissionListBuildings, setUserPermissionListBuildings] = useState('');
    const [userPermissionListGeneral, setUserPermissionListGeneral] = useState('');
    const [userPermissionListUsers, setUserPermissionListUsers] = useState('');
    const [userPermissionListRoles, setUserPermissionListRoles] = useState('');

    const [buildingPermissionDetails, setBuildingPermissionDetails] = useState('');
    const [buildingPermissionEquipments, setBuildingPermissionEquipments] = useState('');
    const [buildingPermissionLayouts, setBuildingPermissionLayouts] = useState('');
    const [buildingPermissionPanels, setBuildingPermissionPanels] = useState('');

    const handleRouteChange = (route) => {
        ComponentStore.update((s) => {
            s.parent = route.parent;
        });

        if (route.parent === 'buildings' || route.parent === 'building-settings') {
            let pathName = route.path.substr(0, route.path.lastIndexOf('/'));

            if (pathName.includes('/energy/end-uses') && buildingListData.length !== 0) {
                const bldgObj = buildingListData.find((record) => record?.building_id === bldgId);
                if (bldgObj?.plug_only) pathName = '/energy/end-uses/plug';
            }

            history.push({
                pathname: `${pathName}/${bldgId}`,
            });
            return;
        }

        history.push({
            pathname: `${route.path}`,
        });
    };

    useEffect(() => {
        const bldgObj = buildingListData.find((record) => record?.building_id === bldgId);
        setPlugEnabled(bldgObj?.plug_only ?? false);
    }, [buildingListData, bldgId]);

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
        <div className="side-nav">
            {activeRoute.map((item, index) => {
                if (item.path.includes('/energy/end-uses') && isPlugEnabled) return;
                if (item.path.includes(':bldgId')) {
                    item.path = item.path.split(':')[0].concat(bldgId);
                }
                if (item.path.includes('null') && item.parent === 'buildings') {
                    let splitPath = item.path.split('null')[0];
                    item.path = `${splitPath}${bldgId}`;
                }

                let str1 = item.path.split('/')[2];
                let str2 = location.pathname.split('/')[2];
                let active = str1.localeCompare(str2);
                let className = active === 0 ? 'active' : '';

                return (
                    <div
                        className={`side-nav-content mouse-pointer ${className}`}
                        key={index}
                        onClick={() => handleRouteChange(item)}>
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
};

export default SideNav;
