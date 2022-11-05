import request from '../utils/request';

export const getImagesApi = (params) => {
  return request({
    url: '/nova/images',
    method: 'get',
    params: params
  })
}


export const getFlavorsApi = (params) => {
  return request({
    url: '/nova/flavors',
    method: 'get',
    params: params
  })
}

export const getAggregatesApi = (params) => {
  return request({
    url: '/nova/aggregates',
    method: 'get',
    params: params
  })
}
export const getImageApi = (params) => {
  return request({
    url: '/nova/image',
    method: 'get',
    params: params
  })
}


export const getFlavorApi = (params) => {
  return request({
    url: '/nova/flavor',
    method: 'get',
    params: params
  })
}

export const getAggregateApi = (params) => {
  return request({
    url: '/nova/aggregate',
    method: 'get',
    params: params
  })
}

export const getInstancesApi = (params) => {
  return request({
    url: '/nova/instances',
    method: 'get',
    params: params
  })
}


export const getInstanceApi = (params) => {
  return request({
    url: '/nova/instance',
    method: 'get',
    params: params
  })
}


export const deleteInstanceApi = (params) => {
  return request({
    url: '/nova/instance',
    method: 'delete',
    params: params
  })
}

export const createInstanceApi = (data, params) => {
  return request({
    url: '/nova/instance',
    method: 'post',
    data: data,
    params: params
  })
}

export const migrateInstanceApi = (data, params) => {
  return request({
    url: '/nova/migrate',
    method: 'post',
    data: data,
    params: params
  })
}

export const updateInstanceSecurityGroups = (data, params) => {
  return request({
    url: '/nova/instance_sgs',
    method: 'put',
    data: data,
    params: params
  })
}

