<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> iP分配统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="ipallocation">
        <el-table 
          :data="tableData"
          stripe
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
          <el-table-column align="right" label="Operations" width="150">
            <template #header>
              <el-input v-model="search" size="small" placeholder="Type to search" />
            </template>
            <template #default>
              <el-button link type="primary" size="small" @click="handleEdit"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

import { getConfigedOpenstacks, getConfigsApi, saveServicePluginsApi, saveMl2ConfApi, restartNeutronServerApi } from '../api';

export default {
  name: "plugin",
  created() {
    this.getIpAllocation();
  },
  methods: {
    handleEdit(){
      console.log("edit");
    },
    async getIpAllocation(){
      this.tableData = [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ]
    },
  },
  data() {
    return {
      tableData :[],
    }
  }
}
</script>

<style>
.container {
  height: 100%vh !important;
  width: 95%;
}


</style>
