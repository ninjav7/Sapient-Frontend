import { getLoggedInUser } from "../helpers/authUtils.js";
import { BaseUrl } from "./Network.js";
// import Swal from 'sweetalert2/dist/sweetalert2.js'

const axios = require("axios");
// For Post Api Calls And Put
export const HttpCall = async (method, type, body) => {
  return new Promise(async function (resolve, reject) {
    const url = BaseUrl + method;
      axios({
        method: 'POST',
        url: url,
        data: body,
      })
      .then((response) => {
        if (response.status === 200 ) {
         
         
          return resolve(response);
        }
        return resolve(response);
      })
      .catch((err) => {
        
        return reject(err);
      });
  });
};
axios.interceptors.request.use(
  function (config) {
    const token = getLoggedInUser().token;
    Object.assign(config.headers, {
      "Content-Type": "application/json",
      accept: "application/json",
    });
    
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
   

    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

