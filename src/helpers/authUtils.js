// @flow
import jwtDecode from 'jwt-decode';
import { Cookies } from 'react-cookie';

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
    const user = getLoggedInUser();
    if (!user) {
        return false;
    }
    const decoded = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        console.warn('access token expired');
        return false;
    } else {
        return true;
    }
};

const isSuperUserAuthenticated = () => {
    const user = getLoggedInUser();
    if (user?.is_superuser === undefined || user?.is_superuser === false) {
        return false;
    }
    const decoded = jwtDecode(user.token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        console.warn('access token expired');
        return false;
    } else {
        return true;
    }
    // const superuser =JSON.parse(localStorage.getItem("isSuperUser"))
    // console.log(superuser);
    // if(superuser==="true" || superuser===true){
    //     return true;
    // }
    // else{
    //    return false;
    // }
};

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
    const cookies = new Cookies();
    const user = cookies.get('user');
    return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
};

export { isUserAuthenticated, getLoggedInUser, isSuperUserAuthenticated };
