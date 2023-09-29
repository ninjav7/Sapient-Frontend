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

    // PLT-867 - Mock data for Vendor Selector
    const buildingsList = [
        {
            group: null,
            options: [
                {
                    label: 'Admin Portolio',
                    value: 'portfolio',
                    icon: <PortfolioSVG className="p-0 square" />,
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
                    label: 'DCPS',
                    value: '62dfe3650d5ed14486f94f3a',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                },
                {
                    label: 'Data Science',
                    value: '634420dfc7aee079e93327ee',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                },
                {
                    label: 'Simply Dev',
                    value: '649ed973c04f9cf6922a322d',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                },
                {
                    label: 'Luxottica',
                    value: '63443428c7aee079e93327f4',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                },
                {
                    label: 'Colorado School of Mines',
                    value: '639b316eb21b361c2f3ddd9f',
                    iconForSelected: <BuildingSVG className="p-0 square" />,
                },
            ],
        },
    ];

    // PLT-867 - Mock Object for Vendor Selector
    const portfolioObj = {
        value: 'portfolio',
        label: 'Admin Portolio',
        icon: <PortfolioSVG className="p-0 square white-icon" />,
    };

    const [selectedBldgObj, setSelectedBldgObj] = useState(portfolioObj);

    const [activeBldgList, setActiveBldgList] = useState(false);

    const handleBldgSwitcherChange = (vendor_id) => {
        if (vendor_id === 'portfolio') {
            setSelectedBldgObj(portfolioObj);
            return;
        }

        const allVendors = buildingsList[2].options;
        const vendorObj = allVendors.find((record) => record?.value === vendor_id);
        setSelectedBldgObj(vendorObj);
    };

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
            {/* PLT-867 - Vendor Selector   */}
            {/* <div className="d-flex align-items-center ml-2 mr-4">
                <BuildingSwitcher
                    options={buildingsList}
                    currentValue={selectedBldgObj}
                    listType={'vendor'}
                    wrapperProps={{ style: { width: '12vw' } }}
                    onChange={(e) => handleBldgSwitcherChange(e.value)}
                />
            </div> */}
            <NavLinks />
            <Control />
        </div>
    );
};

export default TopNav;
