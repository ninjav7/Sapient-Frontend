import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg';

const Control = () => {
    const history = useHistory();

    const handleLogout = () => {
        localStorage.clear();
        history.push('/account/login');
        window.location.reload();
    };

    return (
        <>
            <div className="topbar-buttons-wrapper">
                <div className="topbar-buttons">
                    <div className={`float-right h-100 ${'navbar-icon-container'}`}></div>
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
