import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';

import { accountRoutes, configRoutes, portfolioRoutes, configChildRoutes } from './utils';
import { buildingData } from '../../store/globalState';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import SecondaryNavBar from '../../sharedComponents/secondaryNavBar/SecondaryNavBar';

import { EXPLORE_FILTER_TYPE } from '../../pages/explore/constants';

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
        updateBuildingStore(record?.value, record?.label, record?.timezone);

        if (portfolioRoutes.includes(path) || path.includes('/energy')) {
            redirectToEndpoint(`/energy/portfolio/overview`);
            return;
        }

        if (path.includes('/spaces')) {
            redirectToEndpoint(`/spaces/portfolio/overview`);
            return;
        }

        if (path.includes('/explore/building/overview')) {
            redirectToEndpoint(`/explore/portfolio/overview`);
            return;
        }

        if (path.includes('/carbon')) {
            redirectToEndpoint(`/carbon/portfolio/overview`);
        }

        if (path.includes('/control/plug-rules')) {
            redirectToEndpoint(`/control/plug-rules`);
            return;
        }

        if (accountRoutes.includes(path)) {
            redirectToEndpoint(`/settings/account`);
            return;
        }

        configRoutes.forEach((record) => {
            if (path.includes(record)) {
                redirectToEndpoint(`/settings/account`);
                return;
            }
        });

        configChildRoutes.forEach((record) => {
            if (path.includes(record)) {
                redirectToEndpoint(`/settings/account`);
                return;
            }
        });
    };

    const handleBuildingChange = (record, path) => {
        updateBuildingStore(record?.value, record?.label, record?.timezone, record?.plug_only);

        if (path.includes('/energy/end-uses') && record?.plug_only) {
            redirectToEndpoint(`/energy/building/overview/${record?.value}`);
            return;
        }

        if (path === '/explore/portfolio/overview') {
            redirectToEndpoint(`/explore/building/overview/${record?.value}/${EXPLORE_FILTER_TYPE.NO_GROUPING}`);
            return;
        }

        if (path.includes('/explore/building/overview')) {
            redirectToEndpoint(`/explore/building/overview/${record?.value}/${EXPLORE_FILTER_TYPE.NO_GROUPING}`);
            return;
        }

        if (portfolioRoutes.includes(path)) {
            redirectToEndpoint(`/energy/building/overview/${record?.value}`);
            return;
        }

        if (path.includes('control/plug-rules')) {
            redirectToEndpoint(`/control/plug-rules`);
            return;
        }

        if (accountRoutes.includes(path)) {
            redirectToEndpoint(`/settings/general/${record?.value}`);
            return;
        }

        if (path.includes('/energy')) {
            const pathName = path.substr(0, path.lastIndexOf('/'));
            redirectToEndpoint(`${pathName}/${record?.value}`);
            return;
        }

        if (path.includes('/spaces')) {
            redirectToEndpoint(`/spaces/building/overview/${record?.value}`);
            return;
        }

        if (path.includes('/carbon')) {
            redirectToEndpoint(`/carbon/building/overview/${record?.value}`);
        }

        if (path.includes('/settings')) {
            configChildRoutes.forEach((route) => {
                if (path.includes(route)) {
                    if (path.includes('edit-panel')) redirectToEndpoint(`/settings/panels/${record?.value}`);
                    if (path.includes('smart-plugs')) redirectToEndpoint(`/settings/smart-plugs/${record?.value}`);
                    if (path.includes('smart-meters')) redirectToEndpoint(`/settings/smart-meters/${record?.value}`);
                    if (path.includes('utility-monitors'))
                        redirectToEndpoint(`/settings/utility-monitors/${record?.value}`);
                    return;
                }
            });

            configRoutes.forEach((route) => {
                if (path.includes(route)) {
                    redirectToEndpoint(`${route}/${record?.value}`);
                    return;
                }
            });
        }
    };

    const handleBldgSwitcherChange = (bldg_id) => {
        if (bldg_id === 'portfolio') {
            const obj = {
                value: 'portfolio',
                label: 'Portfolio',
                timezone: '',
                icon: <PortfolioSVG className="p-0 square" />,
            };
            setSelectedBuilding(obj);
            handlePortfolioClick(obj, location.pathname);
            return;
        }

        const allBuildings = buildingsList[2].options;
        const bldgObj = allBuildings.find((record) => record?.value === bldg_id);
        setSelectedBuilding(bldgObj);
        handleBuildingChange(bldgObj, location.pathname);
    };

    const getBuildingList = async () => {
        const allBuildingsList = buildingListData?.map((record) => ({
            label: record?.building_name,
            value: record?.building_id,
            timezone: record?.timezone,
            iconForSelected: <BuildingSVG className="p-0 square" />,
            plug_only: record?.plug_only,
        }));

        const updatedBuildingsList = [...buildingsList];
        updatedBuildingsList[2].options = allBuildingsList;

        setBuildingsList(updatedBuildingsList);
    };

    useEffect(() => {
        const bldgObj = buildingsList[2].options.find((record) => record?.value === selectedBuilding.value);
        if (bldgObj?.value) setSelectedBuilding(bldgObj);
    }, [buildingsList]);

    useEffect(() => {
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
            icon: <BuildingSVG className="p-0 square" />,
        };
        setSelectedBuilding(bldgObj);
    }, [bldgId, bldgName, bldgTimeZone]);

    return (
        <React.Fragment>
            <div className="fixed-secondary-nav buidling-switcher-container secondary-nav-style w-100">
                <SecondaryNavBar
                    onChangeBuilding={(e) => handleBldgSwitcherChange(e.value)}
                    buildings={buildingsList}
                    selectedBuilding={selectedBuilding}
                    breadCrumbsItems={breadcrumList}
                />
            </div>
        </React.Fragment>
    );
};

export default SecondaryTopNavBar;
