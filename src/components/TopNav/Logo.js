import React from "react";
import { Link } from "react-router-dom";

import {ReactComponent as SapientLogo} from '../../assets/images/logo-white.svg';

const Logo = () => {
    return (
        <span className="logo-lg energy-logo-style">
            <Link className='energy-logo-link-style' to='/'>
                <SapientLogo />
            </Link>
        </span>

    );
}


export default Logo;