import React, { useEffect } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';
import { useAtom } from 'jotai';
import '../style.css';
import { buildingData } from '../../store/globalState';
import { Cookies } from 'react-cookie';
import { BaseUrl, getBuilding } from '../../services/Network';
import axios from 'axios';

const TopNav = () => {
    const [buildingListData, setBuildingListData] = useAtom(buildingData);
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

    // console.log(buildingListData, 'buildingListDataNowOrNever');

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
