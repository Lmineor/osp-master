import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://99.0.85.123:8080',
    timeout: 1800000,
});

service.interceptors.request.use(
    config => {
        if (localStorage.token){
            config.headers['X-Auth-Token']= localStorage.token;  //将token设置成请求头
        }else{
            config.headers['X-Auth-Token'] = 'base'; 
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
