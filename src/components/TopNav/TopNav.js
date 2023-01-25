import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';
import { useAtom } from 'jotai';
import { buildingData, userPermissionData } from '../../store/globalState';
import { BuildingListStore } from '../../store/BuildingStore';
import { fetchBuildingsList } from '../../services/buildings';
import { fetchPermissions } from '../../services/permissions';
import { accountChildRoutes, accountRoutes, configChildRoutes, configRoutes } from '../SecondaryTopNavBar/utils';
import '../style.css';

const TopNav = () => {
    const location = useLocation();
    const [buildingListData, setBuildingListData] = useAtom(buildingData);
    const [userPermissionDataNow, setUserPermissionDataNow] = useAtom(userPermissionData);
    const pageRefresh = BuildingListStore.useState((s) => s.fetchBuildingList);
    const [activeBldgList, setActiveBldgList] = useState(false);

    const getUserPermissionDetail = async () => {
        await fetchPermissions().then((res) => {
            let data = res.data.data;
            setUserPermissionDataNow(data);
        });
    };

    useEffect(() => {
        const getBuildingData = async (isActive) => {
            await fetchBuildingsList(isActive)
                .then((res) => {
                    let data = res.data;
                    setBuildingListData(data);
                })
                .catch(() => {
                    setBuildingListData([]);
                });
        };
        if (!location.pathname.includes('/super-user/')) {
            getBuildingData(activeBldgList);
        }
    }, [activeBldgList]);

    useEffect(() => {
        const checkCurrentRoute = (path) => {
            if (
                accountRoutes.includes(path) ||
                configRoutes.includes(path) ||
                path.includes(configChildRoutes[0]) ||
                path.includes(configChildRoutes[1]) ||
                path.includes(configChildRoutes[2]) ||
                path.includes(configChildRoutes[3]) ||
                path.includes(accountChildRoutes[0])
            ) {
                setActiveBldgList(true);
            } else {
                setActiveBldgList(false);
            }
        };

        checkCurrentRoute(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (!pageRefresh) {
            return;
        }
        const getBuildingData = async (isActive) => {
            await fetchBuildingsList(isActive).then((res) => {
                let data = res.data;
                setBuildingListData(data);
                BuildingListStore.update((s) => {
                    s.fetchBuildingList = false;
                });
            });
        };
        if (!location.pathname.includes('/super-user/')) {
            getBuildingData(activeBldgList);
        }
    }, [pageRefresh]);

    useEffect(() => {
        if (!location.pathname.includes('/super-user/')) {
            getUserPermissionDetail();
        }
    }, []);

    return (
        <div className="energy-top-nav">
            <Logo />
            <div className="energy-top-nav__vertical-separator" />
            <NavLinks />
            <Control />
        </div>
    );
};

export default TopNav;
