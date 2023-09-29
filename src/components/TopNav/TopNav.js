import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useLocation } from 'react-router-dom';

import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';

import { buildingData, userPermissionData } from '../../store/globalState';
import { BuildingListStore } from '../../store/BuildingStore';
import { fetchBuildingsList } from '../../services/buildings';
import { fetchPermissions } from '../../services/permissions';

import {
    accountChildRoutes,
    accountRoutes,
    configChildRoutes,
    configRoutes,
    isPathInSettingsRoutes,
} from '../SecondaryTopNavBar/utils';

import { BuildingSwitcher } from '../../sharedComponents/buildingSwitcher';
import { ReactComponent as BuildingSVG } from '../../sharedComponents/assets/icons/building-icon.svg';
import { ReactComponent as PortfolioSVG } from '../../sharedComponents/assets/icons/portfolio-icon.svg';

import '../style.css';
import './styles.scss';

const TopNav = () => {
    const location = useLocation();

    const [buildingListData, setBuildingListData] = useAtom(buildingData);
    const [userPermissionDataNow, setUserPermissionDataNow] = useAtom(userPermissionData);
    const pageRefresh = BuildingListStore.useState((s) => s.fetchBuildingList);

    const buildingsList = [
        {
            group: null,
            options: [
                {
                    icon: <PortfolioSVG className="p-0 square" />,
                    label: 'Admin Portolio',
                    value: 'portfolio',
                },
            ],
        },
        {
            group: 'recent',
            options: [],
        },
        {
            group: 'All Clients',
            options: [
                {
                    label: '#1119 East Hanover',
                    value: '6345b8906038220590483725',
                    timezone: 'US/Eastern',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                    plug_only: false,
                },
                {
                    label: '#216 Springfield',
                    value: '6345d0aec48e248d25f49730',
                    timezone: 'US/Eastern',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                    plug_only: false,
                },
                {
                    label: '#2288 NYC Broadway',
                    value: '6346e0d70885b5dbd8c5a557',
                    timezone: 'US/Eastern',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                    plug_only: false,
                },
                {
                    label: '#2742 NYC 6th Ave',
                    value: '6346f28f31b103f419237dba',
                    timezone: 'US/Eastern',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                    plug_only: false,
                },
                {
                    label: '#787 White Plains',
                    value: '6346c188c48e248d25f49774',
                    timezone: 'US/Eastern',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                    plug_only: false,
                },
            ],
        },
    ];

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
            <div className="d-flex align-items-center ml-2 mr-4">
                <BuildingSwitcher
                    options={buildingsList}
                    currentValue={{
                        value: 'portfolio',
                        label: 'Admin Portolio',
                        timezone: '',
                        icon: <PortfolioSVG className="p-0 square white-icon" />,
                    }}
                    listType={'vendor'}
                    wrapperProps={{ style: { width: '12vw' } }}
                    onChange={() => {}}
                />
            </div>
            <NavLinks />
            <Control />
        </div>
    );
};

export default TopNav;
