import React from 'react';
import { useHistory } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg';
import { ComponentStore } from '../../store/ComponentStore';

const Control = () => {
    const history = useHistory();
    const cookies = new Cookies();

    const handleLogout = () => {
        ComponentStore.update((s) => {
            s.parent = '';
        });
        localStorage.clear();
        cookies.remove('user', { path: '/' });
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
