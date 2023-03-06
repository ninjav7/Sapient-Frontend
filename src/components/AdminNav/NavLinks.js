import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ReactComponent as User } from '../../assets/icon/user.svg';

const NavLinks = () => {
    const location = useLocation();
    const history = useHistory();
    const routes = [
        {
            path: '/super-user/accounts',
            name: 'Accounts',
        },
    ];
    return (
        <div className="top-nav-routes-list">
            {routes.map((item, index) => {
                let str1 = item.path.split('/')[1];
                let str2 = location.pathname.split('/')[1];
                let active = str1.localeCompare(str2);
                let className = active === 0 ? 'active' : '';

                return (
                    <div
                        key={index}
                        className={`navbar-head-container mouse-pointer ${className}`}
                        onClick={() => {
                            history.push(item.path);
                        }}>
                        <div className="d-flex align-items-center">
                            {item.name === 'Accounts' && (
                                <div className={`font-icon-style ${className}`}>
                                    <User />
                                </div>
                            )}
                            <div className={`navbar-heading ${className}`} style={{ width: 'max-content' }}>
                                {item.name}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NavLinks;
