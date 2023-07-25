import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { ReactComponent as SapientLogo } from '../../assets/images/logo-white.svg';
import './styles.scss';

const Logo = () => {
    const location = useLocation();
    const [userPermission] = useAtom(userPermissionData);

    return (
        <span className="logo-lg d-flex align-items-center justify-content-center logo-style">
            {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ||
            location.pathname === '/super-user/accounts' ? (
                <Link className="energy-logo-link-style" to="/">
                    <SapientLogo />
                </Link>
            ) : (
                <SapientLogo />
            )}
        </span>
    );
};

export default Logo;
