import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data:  data,
  })
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
        url: '/user/openstack',
        method: 'get',
        params: query
    })
}

export const saveOpenStacksConfig = data => {
    return request({
        url: '/user/openstack',
        method: 'post',
        data: data
    })
}


export const deleteOpenStacksConfig = (params) => {
  return request({
      url: '/user/openstack',
      method: 'delete',
      params: params
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

export const getSingleNetwork = (params) => {
  return request({
    url: '/openstack/single_network',
    method:'get',
    params:params
  })
}



export const createNetwork = (data, params) =>{
  return request({
    url:'/openstack/network',
    method:'post',
    data: data,
    params: params
  })
}

export const deleteNetwork = (params) =>{
  return request({
    url:'/openstack/network',
    method:'delete',
    params: params
  })
}

export const updateNetwork = (data, params) =>{
  return request({
    url:'/openstack/network',
    method:'put',
    data: data,
    params: params
  })
}

export const getSubnets = (params) => {
  return request({
    url: '/openstack/subnet',
    method:'get',
    params:params
  })
}

export const getSubnetsByNetIdApi = (params) => {
  return request({
    url: '/openstack/subnet_by_net',
    method:'get',
    params:params
  })
}

export const createSubnet = (data, params) =>{
  return request({
    url:'/openstack/subnet',
    method:'post',
    data: data,
    params: params
  })
}

export const deleteSubnet = (params) =>{
  return request({
    url:'/openstack/subnet',
    method:'delete',
    params: params
  })
}

export const updateSubnet = (data, params) =>{
  return request({
    url:'/openstack/subnet',
    method:'put',
    data: data,
    params: params
  })
}

export const getPortsApi = (params) =>{
  return request({
    url:'/openstack/port',
    method:'get',
    params: params
  })
}
export const createPortApi = (data, params) =>{
  return request({
    url:'/openstack/port',
    method:'post',
    data: data,
    params: params
  })
}

export const deletePortApi = (params) =>{
  return request({
    url:'/openstack/port',
    method:'delete',
    params: params
  })
}

export const updatePortApi = (data, params) =>{
  return request({
    url:'/openstack/port',
    method:'put',
    data: data,
    params: params
  })
}

export const getRoutersApi = (params) =>{
  return request({
    url:'/openstack/router',
    method:'get',
    params: params
  })
}

export const getRouterInterfaceApi = (params) =>{
  return request({
    url:'/openstack/router_interface',
    method:'get',
    params: params
  })
}

export const createRouterApi = (data, params) =>{
  return request({
    url:'/openstack/router',
    method:'post',
    data: data,
    params: params
  })
}

export const deleteRouterApi = (params) =>{
  return request({
    url:'/openstack/router',
    method:'delete',
    params: params
  })
}

export const updateRouterApi = (data, params) =>{
  return request({
    url:'/openstack/router',
    method:'put',
    data: data,
    params:params
  })
}

export const addRouterInterfaceApi = (data) =>{
  return request({
    url:'/openstack/router_interface',
    method:'post',
    data: data
  })
}


export const removeRouterInterfaceApi = (data) =>{
  return request({
    url:'/openstack/router_interface',
    method:'delete',
    data: data
  })
}

export const removeRouterGwApi = (data) =>{
  return request({
    url:'/openstack/gw',
    method:'delete',
    data: data
  })
}

export const addRouterGwApi = (data) =>{
  return request({
    url:'/openstack/gw',
    method:'post',
    data: data
  })
}


export const getActiveNodeApi = (params) =>{
  return request({
    url:'/master/nodes',
    method: 'get',
    params: params
  })
}

export const changePluginApi = (data) =>{
  return request({
    url: '/master/change_plugin',
    method: 'put',
    data: data
  })
}

export const getConfigsApi = (data) =>{
  return request({
    url: '/master/config',
    method: 'post',
    data: data
  })
}

export const saveServicePluginsApi = (data) => {
  return request({
    url: '/master/api_service_plugins',
    method: 'put',
    data: data
  })
}

export const saveMl2ConfApi = (data) => {
  return request({
    url: '/master/api_ml2_conf',
    method: 'put',
    data: data
  })
}


export const restartNeutronServerApi = (data) => {
  return request({
    url: '/master/restart_neutron_server',
    method: 'put',
    data: data
  })
}


export const getPhysicalNetworkApi = (params) => {
  return request({
    url: '/master/ml2_conf',
    method: 'get',
    params: params
  })
}


export const getSecurityGroupsApi = (params) => {
  return request({
    url: '/openstack/security_groups',
    method: 'get',
    params: params
  })
}


export const getSecurityGroupApi = (params) => {
  return request({
    url: '/openstack/security_group',
    method: 'get',
    params: params
  })
}
