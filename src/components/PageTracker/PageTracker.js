import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import Breadcrumbs from './Breadcrumbs';
import { BuildingSwitcher } from '../../sharedComponents/buildingSwitcher';
import { accountRoutes, configRoutes, portfolioRoutes, updateBuildingStore } from './utils';
import { BuildingStore } from '../../store/BuildingStore';
import { ReactComponent as BuildingSVG } from '../../sharedComponents/assets/icons/building-icon.svg';
import { ReactComponent as PortfolioSVG } from '../../sharedComponents/assets/icons/portfolio-icon.svg';
import { buildingData } from '../../store/globalState';
import '../style.css';
import './PageTracker.scss';

const PageTracker = () => {
    const location = useLocation();
    const history = useHistory();

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const bldgTimeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const [buildingListData] = useAtom(buildingData);

    const [selectedBuilding, setSelectedBuilding] = useState({});

    // const [selectedBuilding, setSelectedBuilding] = useState({
    //     value: 'portfolio',
    //     label: 'Portfolio',
    //     timezone: '',
    //     icon: <PortfolioSVG className="p-0 square" />,
    // });

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
    };

    const handleBuildingChange = (record, path) => {
        updateBuildingStore(record);

        if (portfolioRoutes.includes(path)) {
            redirectToEndpoint(`/energy/building/overview/${record?.value}`);
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
                label: 'Portfolio1',
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

    useEffect(() => {
        console.log('SSR bldgId', bldgId);
        console.log('SSR selectedBuilding', selectedBuilding);
    });

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                <div className="mt-1">
                    <BuildingSwitcher
                        onChange={(e) => handleBldgSwitcherChange(e.value)}
                        options={buildingsList}
                        defaultValue={selectedBuilding}
                    />
                </div>

                <div className="route-tracker">
                    <Breadcrumbs />
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
