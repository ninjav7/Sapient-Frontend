import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ExploreBuildingSwitcher from './ExploreBuildingSwitcher';
import Breadcrumbs from './Breadcrumbs';
import { BuildingSwitcher } from '../../sharedComponents/buildingSwitcher';
import { ReactComponent as BuildingSVG } from '../../sharedComponents/assets/icons/building-icon.svg';
import { ReactComponent as PortfolioSVG } from '../../sharedComponents/assets/icons/portfolio-icon.svg';
import BuildingSwitchers from './BuildingSwitcher';
import '../style.css';
import './PageTracker.scss';
import { useAtom } from 'jotai';
import { buildingData } from '../../store/globalState';

const PageTracker = () => {
    const location = useLocation();

    const [buildingListData] = useAtom(buildingData);
    const [selectedBuilding, setSelectedBuilding] = useState({
        icon: <PortfolioSVG className="p-0 square" />,
        label: 'Portfolio',
        value: 'portfolio',
    });
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

    const handleBuildingChange = (bldg_id) => {
        if (bldg_id === 'portfolio') {
            let obj = {
                icon: <PortfolioSVG className="p-0 square" />,
                label: 'Portfolio',
                value: 'portfolio',
            };
            setSelectedBuilding(obj);
            return;
        }

        let allBuildings = buildingsList[2].options;
        let bldgObj = allBuildings.find((record) => record?.value === bldg_id);
        setSelectedBuilding(bldgObj);
    };

    // const handleBldgChange = (bldgData, path) => {
    //     let pathName = '';

    //     localStorage.setItem('buildingId', bldgData?.building_id);
    //     localStorage.setItem('buildingName', bldgData?.building_name);
    //     localStorage.setItem('buildingTimeZone', bldgData?.timezone === '' ? 'US/Eastern' : bldgData?.timezone);
    //     BuildingStore.update((s) => {
    //         s.BldgId = bldgData?.building_id;
    //         s.BldgName = bldgData?.building_name;
    //         s.BldgTimeZone = bldgData?.timezone === '' ? 'US/Eastern' : bldgData?.timezone;
    //     });

    //     if (path.includes('/energy')) {
    //         pathName = path.substr(0, path.lastIndexOf('/'));
    //         history.push({
    //             pathname: `${pathName}/${bldgData?.building_id}`,
    //         });
    //         return;
    //     }
    //     if (path.includes('/control')) {
    //         return;
    //     }
    //     history.push({
    //         pathname: `${'/settings/general'}`,
    //     });
    // };

    useEffect(() => {
        const getBuildingList = async () => {
            let bldgList = [...buildingsList];
            buildingListData.forEach((record) => {
                let obj = {
                    label: record?.building_name,
                    value: record?.building_id,
                    iconForSelected: <BuildingSVG />,
                };
                bldgList[2].options.push(obj);
            });
            setBuildingsList(bldgList);
        };
        getBuildingList();
    }, [buildingListData]);

    useEffect(() => {
        console.log('SSR selectedBuilding :>> ', selectedBuilding);
    });

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                {location.pathname.includes('/explore-page/') && (
                    <>
                        <ExploreBuildingSwitcher />
                        <div className="vl"></div>
                    </>
                )}

                {!location.pathname.includes('/explore-page/') && (
                    <>
                        <BuildingSwitcher
                            onChange={(e) => handleBuildingChange(e.value)}
                            options={buildingsList}
                            defaultValue={selectedBuilding}
                        />
                        <BuildingSwitchers />
                        <div className="vl"></div>
                    </>
                )}

                <div className="route-tracker">
                    <Breadcrumbs />
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
