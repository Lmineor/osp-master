<template>
  <div class="">
    <el-dialog v-model="dialogCreateNetworkVisible" title="新增网络" width="30%">
      <el-form :inline="false" :model="networkCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可选）">
          <el-input v-model="networkCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="网络类型">
          <el-select v-model="networkCreateData.network_type" placeholder="vxlan" class="label_input">
            <el-option label="vlan" value="vlan"></el-option>
            <el-option label="vxlan" value="vxlan"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCreateNetworkVisible = false">取消</el-button>
          <el-button type="primary" @click="onCreateNetworkApi" :loading="creatingNetwork">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdateNetworkVisible" title="编辑网络" width="30%">
      <el-form :inline="false" :model="networkUpdateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="networkUpdateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUpdateNetworkVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdateNetworkApi" :loading="updatingNetwork">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="deleteDialogVisible" title="注意" width="30%">
      <span
        >这将会把你选定的openstack的版本的网络全部删除，你已选择{{
          notifySelectedVersions
        }}</span
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>网络</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="container">
      <span class="text">请选择要默认的openstack的版本号：</span>
      <el-select v-model="selected_version" placeholder="Select" style="width: 240px" @change="onGetNetworksApi">
        <el-option v-for="version in versions" :label="version" :value="version"/>
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="createNetwork" type="primary">新建网络</el-button>
      <!-- <el-button @click="onGetNetworksApi" type="warning" :loading="loading">刷新</el-button> -->
      <el-divider />
      <div class="table_area">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="id" label="id" width="350"></el-table-column>
          <el-table-column prop="name" label="name" width="200"></el-table-column>
          <el-table-column prop="router:external" label="外部网络" width="150" ></el-table-column>
          <el-table-column prop="provider:network_type" label="网络类型" width="150"></el-table-column>
          <el-table-column prop="provider:segmentation_id" label="segment id" width="100"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="150">
            <template #default="scope">
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="要删除该网络吗？" @confirm="handleDeleteApi((scope.$index))">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button type="info" size="small" @click.prevent="handleEdit(scope.$index)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

import { getNetworks,createNetwork,getConfigedOpenstacks,deleteNetwork,updateNetwork } from '../api';
export default {
  name: "network",
  created() {
    this.loadVersionApi();
  },
  methods: {
    async loadVersionApi() {
      const result = await getConfigedOpenstacks()
      if (result.openstacks === null) {
        this.versions = [];
        return
      }
      for (var i=0;i<result.openstacks.length;i++){
        this.versions.push(result.openstacks[i].version)
      };
    },
    async onGetNetworksApi() {
      if (this.selected_version === "") {
        return
      }
      this.loading = true
      await getNetworks({'version': this.selected_version}).then(res=>{
        if (res.status != 200){
          this.$message.error("加载失败，请检查后台日志");
        }else{
          this.tableData = res.data.networks;
        };
        this.loading = false;
      });
    },
    createNetwork() {
      if (this.selected_version==="") {
        this.$message.error("请选择要新建网络的openstack版本号");
        return
      };
      this.dialogCreateNetworkVisible=true;
    },
    async onCreateNetworkApi() {
      this.creatingNetwork=true;
      this.networkCreateData.version = this.selected_version;
      const res = await createNetwork(this.networkCreateData);
      if (res.data.status==='ok'){
          this.$message.success("创建成功");
          await this.onGetNetworksApi();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.creatingNetwork=false;
      
      this.dialogCreateNetworkVisible=false;
    },
    async onUpdateNetworkApi() {
      this.updatingNetwork=true;
      const res = await updateNetwork(
        {
          'version': this.selected_version,
          'id': this.selected_id,
          'attr': {
            'network': {
              'name': this.networkUpdateData.name,
            }
          }
        });
      if (res.data.status==='ok'){
          this.$message.success("更新成功");
          await this.onGetNetworksApi();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.updatingNetwork=false;
      
      this.dialogUpdateNetworkVisible=false;
    },
    deleteAllNetworksApi() {
      if (this.selected_version === "") {
        this.$message.error("请选择要删除网络的openstack版本号");
        return
      };
      this.deleteDialogVisible = true;
    },
    async handleDeleteApi(index) {
      this.loading=true;
      await deleteNetwork({'version': this.tableData[index].version, 'id':this.tableData[index].id}).then(res=>{
        if (res.data.status==='ok'){
          this.onGetNetworksApi();
          this.$message.success("删除成功");
        }else{
          this.$message.error(res.data.msg);
        };
        this.loading=false;
      })
    },
    handleEdit(index) {
      this.dialogUpdateNetworkVisible = true;
      this.selected_id = this.tableData[index].id;
    },
    reset_formData(){
     this.networkCreateData= {
        version: "",
        name: "",
        network_type: ""
      };
      this.networkUpdateData = {
        name: ""
      }
   }
  },
  data() {
    return {
      selected_id: "",
      dialogUpdateNetworkVisible: false,
      updatingNetwork: false,
      notifySelectedVersions: "",
      deleteDialogVisible: false,
      dialogCreateNetworkVisible: false,
      selected_version: "",
      loading: false,
      deletingnetworks: false,
      creatingNetwork: false,
      versions: [],
      tableData: [],
      networkCreateData: {
        name: "",
        network_type: "",
        version: ""
      },
      networkUpdateData: {
        name: "",
      }
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

