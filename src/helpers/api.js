import axios from 'axios';
import { BaseUrl } from '../services/Network';

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
const fetchJSON = async(url, options = {}) => {
    return await fetch(url, options)
        .then((response) => {
            if (!response.status === 200) {
                throw response.json();
            }
            let data = response.json();
            return data;
        })
        .then((json) => {
            return json;
        })
        .catch((error) => {
            throw error;
        });
};

const servicePost = async (path, payload, _headers = null) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${BaseUrl}${path}`, payload, {
                headers: _headers,
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

const serviceGet = async (path, payload) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${BaseUrl}${path}`, payload)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

const servicePostWithVersion = async (path, payload, version = process.env.REACT_APP_BACKEND_DEFAULT_VERSION) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${BaseUrl}${version}/${path}`, payload)
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

const apiServicePost = async (url, payload, _headers = null) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${url}`, payload, {
                headers: _headers,
            })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

export { fetchJSON, servicePost, serviceGet, servicePostWithVersion, apiServicePost };
