import React, { useEffect } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';
import { useAtom } from 'jotai';
import '../style.css';
import { buildingData } from '../../store/globalState';
import { Cookies } from 'react-cookie';
import { BaseUrl, getBuilding } from '../../services/Network';
import { BuildingListStore } from '../../store/BuildingStore';
import axios from 'axios';

const TopNav = () => {
    const [buildingListData, setBuildingListData] = useAtom(buildingData);
    const pageRefresh = BuildingListStore.useState((s) => s.fetchBuildingList);
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    useEffect(() => {
        const getBuildingList = async () => {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                let data = res.data;
                let activeBldgs = data.filter((bld) => bld.active === true);
                setBuildingListData(activeBldgs);
            });
        };
        getBuildingList();
    }, []);

    useEffect(() => {
        const getBuildingList = async () => {
            if (!pageRefresh) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                let data = res.data;
                let activeBldgs = data.filter((bld) => bld.active === true);
                setBuildingListData(activeBldgs);
                BuildingListStore.update((s) => {
                    s.fetchBuildingList = false;
                });
            });
        };
        getBuildingList();
    }, [pageRefresh]);

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
