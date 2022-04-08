import axios from 'axios';

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
const fetchJSON = (url, options = {}) => {
    return fetch(url, options)
        .then((response) => {
            if (!response.status === 200) {
                throw response.json();
            }
            return response.json();
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
            .post(`${process.env.REACT_APP_BACKEND_URL}/${path}`, payload, {
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
            .get(`${process.env.REACT_APP_BACKEND_URL}/${path}`, payload)
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
            .post(`${process.env.REACT_APP_BACKEND_URL}${version}/${path}`, payload)
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
