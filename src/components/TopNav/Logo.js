import React from 'react';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { ReactComponent as SapientLogo } from '../../assets/images/logo-white.svg';
import './styles.scss';

const Logo = () => {
    const [userPermission] = useAtom(userPermissionData);

    return (
        <span className="logo-lg d-flex align-items-center justify-content-center logo-style">
            {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ? (
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
