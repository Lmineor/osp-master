import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};


export const getConfigedOpenstacks = query => {
    return request({
        url: '/openstack/config',
        method: 'get',
        params: query
    })
}

export const saveOpenStacksConfig = data => {
    return request({
        url: '/openstack/config',
        method: 'put',
        data: data
    })
}