import React from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import Control from './Control';

import '../style.css';

const TopNav = () => {
    return (
        <div className="energy-top-nav">
            <Logo />
            <div className='energy-top-nav__vertical-separator' />
            <NavLinks />
            <Control />
        </div>
    );
};

export default TopNav;
