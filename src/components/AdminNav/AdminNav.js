import React, { useEffect } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';
import { useAtom } from 'jotai';
import '../style.css';
import { fetchPermissions } from '../../services/permissions';
import { buildingData, userPermissionData } from '../../store/globalState';

const TopNav = () => {
    const [userPermissionDataNow, setUserPermissionDataNow] = useAtom(userPermissionData);

    const getUserPermissionDetail = async () => {
        await fetchPermissions().then((res) => {
            let data = res.data.data;
            setUserPermissionDataNow(data);
        });
    };
    useEffect(() => {
        getUserPermissionDetail();
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
