import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useLocation } from 'react-router-dom';

import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';

import { buildingData, userPermissionData } from '../../store/globalState';
import { BuildingListStore, BuildingStore } from '../../store/BuildingStore';
import { fetchBuildingsList } from '../../services/buildings';
import { fetchPermissions } from '../../services/permissions';

import {
    accountChildRoutes,
    accountRoutes,
    configChildRoutes,
    configRoutes,
    isPathInSettingsRoutes,
} from '../SecondaryTopNavBar/utils';

import '../style.css';

const TopNav = () => {
    const location = useLocation();

    const [buildingListData, setBuildingListData] = useAtom(buildingData);
    const [userPermissionDataNow, setUserPermissionDataNow] = useAtom(userPermissionData);
    const pageRefresh = BuildingListStore.useState((s) => s.fetchBuildingList);
    const IS_PLUG_ONLY = BuildingStore.useState((s) => s.isPlugOnly);
    console.log('SSR IS_PLUG_ONLY => ', IS_PLUG_ONLY);

    const [activeBldgList, setActiveBldgList] = useState(false);

    const getUserPermissionDetail = async () => {
        await fetchPermissions().then((res) => {
            const data = res?.data?.data;
            setUserPermissionDataNow(data);
        });
    };

    const getBuildingData = async (isActive) => {
        await fetchBuildingsList(isActive).then((res) => {
            const data = res?.data;
            setBuildingListData(data);
            BuildingListStore.update((s) => {
                s.fetchBuildingList = false;
            });
        });
    };

    const checkCurrentRoute = (path) => {
        if (
            isPathInSettingsRoutes(path, accountRoutes) ||
            isPathInSettingsRoutes(path, accountChildRoutes) ||
            isPathInSettingsRoutes(path, configRoutes) ||
            isPathInSettingsRoutes(path, configChildRoutes)
        ) {
            setActiveBldgList(true);
        } else {
            setActiveBldgList(false);
        }
    };

    useEffect(() => {
        if (!location.pathname.includes('/super-user/accounts') && !location.pathname.includes('/account/login')) {
            getBuildingData(activeBldgList);
        }
    }, [activeBldgList]);

    useEffect(() => {
        checkCurrentRoute(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (!pageRefresh) return;

        if (!location.pathname.includes('/super-user/') && !location.pathname.includes('/account/login')) {
            getBuildingData(activeBldgList);
        }
    }, [pageRefresh]);

    useEffect(() => {
        if (!location.pathname.includes('/super-user/') && !location.pathname.includes('/account/login')) {
            getUserPermissionDetail();
            getBuildingData(activeBldgList);
        }
    }, []);

    return (
        <div className="top-nav-bar d-flex w-100">
            <Logo />
            <div className="energy-top-nav__vertical-separator" />
            <NavLinks />
            <Control />
        </div>
    );
};

export default TopNav;
