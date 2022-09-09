import { useAtom } from 'jotai';
import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as SapientLogo } from '../../assets/images/logo-white.svg';
import { userPermissionData } from '../../store/globalState';

const Logo = () => {
    const [userPermission] = useAtom(userPermissionData);

    return (
        <span className="logo-lg energy-logo-style">
            {userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ? (
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
