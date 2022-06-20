<template>
  <div class="">
    <el-dialog v-model="dialogCreateNetworkVisible" title="新增网络" width="30%">
      <el-form :inline="false" :model="networkCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可选）">
          <el-input v-model="networkCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCreateNetworkVisible = false">取消</el-button>
          <el-button type="primary" @click="onCreateNetwork">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="deleteDialogVisible" title="注意" width="30%">
      <span>这将会把你选定的openstack的版本的网络全部删除，你已选择{{ notifySelectedVersions }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>网络</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <span class="text">请选择要默认的openstack的版本号：</span>
      <el-select v-model="selected_versions" multiple placeholder="Select" style="width: 240px"
        @visible-change="get_networks">
        <el-option v-for="version in versions" :label="version" :value="version" />
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="createNetwork" type="primary" :loading="creatingNetwork">新建网络</el-button>
      <el-button @click="deleteAllNetworks" type="warning" :loading="deletingnetworks">删除所有网络</el-button>
      <el-divider />
      <div class="table_area">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="url" label="IP" width="150"></el-table-column>
          <el-table-column prop="name" label="云平台用户名" width="150"></el-table-column>
          <el-table-column prop="password" label="云平台密码" width="150"></el-table-column>
          <el-table-column prop="domain" label="租户" width="120"></el-table-column>
          <el-table-column prop="controller_username" label="后台用户名" width="150"></el-table-column>
          <el-table-column prop="controller_password" label="后台密码" width="120"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="text" size="small" @click.prevent="handleDelete(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>


</template>

<script>

import { ElNotification } from 'element-plus'

export default {
  name: "network",
  methods: {
    get_networks() {
      if (this.selected_versions.length < 1) {
        this.loading = false;
      } else {
        this.loading = true
      }
    },
    createNetwork() {
      if (this.selected_versions.length < 1) {
        ElNotification({
          title: "警告！",
          message: "请选择要新建网络的openstack版本号",
          type: "error",
        })
        return
      };
      this.dialogCreateNetworkVisible=true;
    },
    onCreateNetwork() {
      console.log(this.networkCreateData)
    },
    deleteAllNetworks() {
      if (this.selected_versions.length < 1) {
        ElNotification({
          title: "警告！",
          message: "请选择要删除网络的openstack版本号",
          type: "error",
        })
        return
      };
      this.notifySelectedVersions = this.selected_versions.join(",");
      this.deleteDialogVisible = true;
    },
    handleDelete(index) {
      this.successNotify(index);
    },
    successNotify(message) {
      ElNotification({
        title: "成功",
        message: message,
        type: "success",
      })
    },
    failNotify(message) {
      ElNotification({
        title: "失败",
        message: message,
        type: "error",
      })
    },
  },
  data() {
    return {
      notifySelectedVersions: "",
      deleteDialogVisible: false,
      dialogCreateNetworkVisible: false,
      selected_versions: [],
      loading: false,
      deletingnetworks: false,
      creatingNetwork: false,
      versions: [
        "pike",
        "rocky",
        "train"
      ],
      networkCreateData: {
        name: "",
      },

      tableData: [{
        "version": "pike",
        "url": "99.0.85.123",
        "name": "admin",
        "password": "123456",
        "domain": "admin",
        "controller_username": "admin",
        "controller_password": "123456"
      },
      {
        "version": "train",
        "url": "99.0.85.23",
        "name": "admin",
        "password": "123456",
        "domain": "admin",
        "controller_username": "admin",
        "controller_password": "123456"
      }],
    }
  }
}
</script>

<style>
.container {
  height: 100%vh !important;
}

.text {
  margin-right: 20px;
}


.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

