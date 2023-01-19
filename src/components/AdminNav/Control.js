import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg';


const Control = () => {
    const location = useLocation();
    const history = useHistory();
    const cookies = new Cookies();

   

    const handleLogout = () => {
        localStorage.clear();
        history.push("/account/login")
        window.location.reload();
    };

  
    return (
        <>
            <div className="topbar-buttons-wrapper">
                <div className="topbar-buttons">
                    <div
                        className={`float-right h-100 ${
                            'navbar-icon-container'
                        }`}>
                        <button
                            className={`btn btn-sm float-right ${'other-font-icon-style'}`}
                            onClick={() => {

                            }}>
                            <FontAwesomeIcon icon={faGear} size="lg" />
                        </button>
                    </div>
                </div>
            </div>

            <button className="btn topbar-logout-btn" onClick={handleLogout}>
                <LogoutIcon />
                Sign Out
            </button>
        </>
    );
};

export default Control;
