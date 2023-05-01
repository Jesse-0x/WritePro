import axois from 'axios';

let baseURL: string = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://127.0.0.1:4523/m1/2668878-0-default';
} else {
  baseURL = 'http://localhost:3000';
}

axois.interceptors.response.use((res) => {
  return res;
}, (err) => {
  return Promise.reject(err);
});

axois.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  config.headers['Accept'] = 'application/json';
  config.baseURL = baseURL;
  config.timeout = 10000;
  return config;
}, (err) => {
  return Promise.reject(err);
});

export function getAxios(url: string, params: any) {
  return new Promise((resolve, reject) => {
    axois.get(url, {
      params
    }).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  })
}

export function postAxios(url: string, data: any) {
  return new Promise((resolve, reject) => {
    axois.post(url, data).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  })
}

export default axois;