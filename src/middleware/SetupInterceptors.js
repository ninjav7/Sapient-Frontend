import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';

const SetupInterceptors = () => {
    let history = useHistory();
    let cookies = new Cookies();

    axios.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data

            return response;
        },
        function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response.status === 403) {
                cookies.remove('user', { path: '/' });
                history.push('/account/login');
                window.location.reload();
                localStorage.clear();
            }
            // return Promise.reject(error);
        }
    );
};
export default SetupInterceptors;
