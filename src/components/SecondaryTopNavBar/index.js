import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';

import { accountRoutes, configRoutes, portfolioRoutes, updateBuildingStore } from './utils';
import { buildingData } from '../../store/globalState';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import SecondaryNavBar from '../../sharedComponents/secondaryNavBar/SecondaryNavBar';

import { ReactComponent as BuildingSVG } from '../../sharedComponents/assets/icons/building-icon.svg';
import { ReactComponent as PortfolioSVG } from '../../sharedComponents/assets/icons/portfolio-icon.svg';

import './style.scss';

const SecondaryTopNavBar = () => {
    const location = useLocation();
    const history = useHistory();

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const bldgTimeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const breadcrumList = BreadcrumbStore.useState((bs) => bs.items);

    const [buildingListData] = useAtom(buildingData);

    const [selectedBuilding, setSelectedBuilding] = useState({});

    const [buildingsList, setBuildingsList] = useState([
        {
            group: null,
            options: [
                {
                    icon: <PortfolioSVG className="p-0 square" />,
                    label: 'Portfolio',
                    value: 'portfolio',
                },
            ],
        },
        {
            group: 'recent',
            options: [],
        },
        {
            group: 'All Buildings',
            options: [],
        },
    ]);

    const redirectToEndpoint = (pathName) => {
        history.push({
            pathname: `${pathName}`,
        });
    };

    const handlePortfolioClick = (record, path) => {
        updateBuildingStore(record);

        if (portfolioRoutes.includes(path) || path.includes('/energy')) {
            redirectToEndpoint(`/energy/portfolio/overview`);
            return;
        }

        if (path.includes('/explore-page/by-equipment')) {
            redirectToEndpoint(`/explore-page/by-buildings`);
            return;
        }

        if (path.includes('/control/plug-rules')) {
            redirectToEndpoint(`/energy/portfolio/overview`);
            return;
        }

        if (accountRoutes.includes(path) || configRoutes.includes(path)) {
            redirectToEndpoint(`/settings/account`);
            return;
        }
    };

    const handleBuildingChange = (record, path) => {
        updateBuildingStore(record);

        if (portfolioRoutes.includes(path)) {
            redirectToEndpoint(`/energy/building/overview/${record?.value}`);
            return;
        }

        if (path === '/explore-page/by-buildings') {
            redirectToEndpoint(`/explore-page/by-equipment/${record?.value}`);
            return;
        }

        if (path.includes('/explore-page/by-equipment')) {
            redirectToEndpoint(`/explore-page/by-equipment/${record?.value}`);
            return;
        }

        if (accountRoutes.includes(path)) {
            redirectToEndpoint(`/settings/general`);
            return;
        }

        if (location.pathname.includes('/energy')) {
            let pathName = path.substr(0, path.lastIndexOf('/'));
            redirectToEndpoint(`${pathName}/${record?.value}`);
            return;
        }
    };

    const handleBldgSwitcherChange = (bldg_id) => {
        if (bldg_id === 'portfolio') {
            let obj = {
                value: 'portfolio',
                label: 'Portfolio',
                timezone: '',
                icon: <PortfolioSVG className="p-0 square" />,
            };
            setSelectedBuilding(obj);
            handlePortfolioClick(obj, location.pathname);
            return;
        }

        let allBuildings = buildingsList[2].options;
        let bldgObj = allBuildings.find((record) => record?.value === bldg_id);
        setSelectedBuilding(bldgObj);
        handleBuildingChange(bldgObj, location.pathname);
    };

    useEffect(() => {
        const getBuildingList = async () => {
            let bldgList = [...buildingsList];
            buildingListData.forEach((record) => {
                let obj = {
                    label: record?.building_name,
                    value: record?.building_id,
                    timezone: record?.timezone,
                    iconForSelected: <BuildingSVG />,
                };
                bldgList[2].options.push(obj);
            });
            setBuildingsList(bldgList);
        };
        getBuildingList();
    }, [buildingListData]);

    useEffect(() => {
        if (bldgId === null || bldgId === 'portfolio') {
            let obj = {
                value: 'portfolio',
                label: 'Portfolio',
                timezone: '',
                icon: <PortfolioSVG className="p-0 square" />,
            };
            setSelectedBuilding(obj);
            return;
        }
        let bldgObj = {
            value: bldgId,
            label: bldgName,
            timezone: bldgTimeZone,
            icon: <BuildingSVG />,
        };
        setSelectedBuilding(bldgObj);
    }, [bldgId]);

    return (
        <React.Fragment>
            <div className="buidling-switcher-container w-100 secondary-nav-style">
                <SecondaryNavBar
                    onChangeBuilding={(e) => handleBldgSwitcherChange(e.value)}
                    buildings={buildingsList}
                    selectedBuilding={selectedBuilding}
                    breadCrumbsItems={breadcrumList}
                    switchStyle={`building-switcher`}
                />
            </div>
        </React.Fragment>
    );
};

export default SecondaryTopNavBar;
