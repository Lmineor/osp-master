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
    url: '/openstack/networks',
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

export const deleteNetworkByIds = (data) =>{
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