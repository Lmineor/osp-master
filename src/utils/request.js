import axios from 'axios';
import router from '../router'

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
        console.log(response.status);
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        if (error.response.status === 401){
            // 返回 401 清除token信息并跳转到登录页面
            localStorage.removeItem('token');
            router.replace("/login");
        }
        return Promise.reject();
    }
);

export default service;
