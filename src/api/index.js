import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
export const runVxlanNetwork = (params) => {
  return request({
    url: '/openstack/network',
    method: 'get',
    params
  })
};
export const runSubnet = (params) => {
  return request({
    url: '/openstack/subnet',
    method: 'get',
    params
  })
};
export const runPort = (params) => {
  return request({
    url: '/openstack/port',
    method: 'get',
    params
  })
};
export const runRouter = (params) => {
  return request({
    url: '/openstack/router',
    method: 'get',
    params
  })
}

export const getConfigedOpenstacks = (query) => {
    return request({
        url: '/openstack/config',
        method: 'get',
        params: query
    })
}

export const saveOpenStacksConfig = data => {
    return request({
        url: '/openstack/config',
        method: 'post',
        data: data
    })
}
export const reloadCfg = (data) => {
    return request({
        url: '/openstack/reload_config',
        method: 'get',
        params: data
    })
}

export const getNetworks = (params) => {
  return request({
    url: '/openstack/network',
    method:'get',
    params:params
  })
}


export const createNetwork = (data) =>{
  return request({
    url:'/openstack/network',
    method:'post',
    data: data
  })
}

export const deleteNetwork = (data) =>{
  return request({
    url:'/openstack/network',
    method:'delete',
    data: data
  })
}

export const updateNetwork = (data) =>{
  return request({
    url:'/openstack/network',
    method:'put',
    data: data
  })
}

export const getSubnets = (params) => {
  return request({
    url: '/openstack/subnet',
    method:'get',
    params:params
  })
}


export const createSubnet = (data) =>{
  return request({
    url:'/openstack/subnet',
    method:'post',
    data: data
  })
}

export const deleteSubnet = (data) =>{
  return request({
    url:'/openstack/subnet',
    method:'delete',
    data: data
  })
}

export const updateSubnet = (data) =>{
  return request({
    url:'/openstack/subnet',
    method:'put',
    data: data
  })
}