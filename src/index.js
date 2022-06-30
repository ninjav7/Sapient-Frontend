import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById('root')
);
axios.interceptors.response.use(function (response) {
    
// let history = useHistory();
// let cookies = new Cookies();
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("interceptor response",response);
    // if(response.status===403){
    //     cookies.remove('user', { path: '/' });
    //     history.push('/account/login');
    //      window.location.reload();
    // }
    
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
