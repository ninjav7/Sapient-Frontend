import React, { useEffect } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';
import { useAtom } from 'jotai';
import '../style.css';
import { buildingData, userPermissionData } from '../../store/globalState';
import { Cookies } from 'react-cookie';
import { BaseUrl, getBuilding, singleUserPermissionDetail } from '../../services/Network';
import axios from 'axios';
import { BuildingListStore } from '../../store/BuildingStore';

const TopNav = () => {
    const [buildingListData, setBuildingListData] = useAtom(buildingData);
    const [userPermissionDataNow, setUserPermissionDataNow] = useAtom(userPermissionData);
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

    const getUserPermissionDetail = async () => {
        let headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        await axios.get(`${BaseUrl}${singleUserPermissionDetail}`, { headers }).then((res) => {
            let data = res.data.data;
            setUserPermissionDataNow(data);
        });
    };

    useEffect(() => {
        getUserPermissionDetail();
    }, []);

    console.log('userPermissionDataNow', userPermissionDataNow);

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
