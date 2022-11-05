<template>
  <div class="">
    <el-dialog v-model="createNetworkDialogVisible" title="新增网络" width="30%">
      <el-form :inline="false" :model="networkCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可选）">
          <el-input v-model="networkCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="外部网络" v-if="createVlanNetworkFlag">
          <el-switch v-model="networkCreateData.external" />
        </el-form-item>
        <el-form-item label="provider:physical_network" v-if="createVlanNetworkFlag">
          <el-select v-model="networkCreateData['provider:physical_network']" placeholder="Select" style="width: 240px" @change="onGetNetworksApi">
            <el-option v-for="provider_physical_network in provider_physical_networks" :label="provider_physical_network" :value="provider_physical_network"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Vlan id" v-if="createVlanNetworkFlag">
          <el-input-number v-model="networkCreateData['provider:segmentation_id']" placeholder="1" class="label_input"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCreateNetworkClose">取消</el-button>
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
        <el-option v-for="version in versions" :label="version.info" :value="version.version"/>
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="createVxlanNetwork" type="primary">新建Vxlan网络</el-button>
      <el-button @click="createVlanNetwork" type="warning">新建Vlan网络</el-button>
      <el-button @click="onGetNetworksApi" type="info">刷新</el-button>
      <el-divider />
      <div class="table_area">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="name" label="name" width="200"></el-table-column>
          <el-table-column prop="id" label="id" width="350"></el-table-column>
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
              <el-button type="success" size="small" @click.prevent="handleEdit(scope.$index)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

import { getNetworks,createNetwork,getConfigedOpenstacks,deleteNetwork,updateNetwork, getPhysicalNetworkApi } from '../api';
export default {
  name: "network",
  created() {
    this.loadVersionApi();
  },
  methods: {
    async loadVersionApi() {
      const result = await getConfigedOpenstacks()
      if (result.data === null) {
        this.versions = [];
        return
      }
      for (var i=0;i<result.data.length;i++){
        this.versions.push({"version": result.data[i].version, "info": result.data[i].version + "(" + result.data[i].url + ")", "ip": result.data[i].url})
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
    createVxlanNetwork() {
      if (this.selected_version==="") {
        this.$message.error("请选择要新建网络的openstack版本号");
        return
      };
      this.createNetworkDialogVisible=true;
    },
    handleCreateNetworkClose(){
      this.reset_formData();
      this.createNetworkDialogVisible=false;
      this.createVlanNetworkFlag=false;
    },
    createVlanNetwork() {
      if (this.selected_version==="") {
        this.$message.error("请选择要新建网络的openstack版本号");
        return
      };
      this.loadProviderNetworkTypes();
      this.createVlanNetworkFlag=true;
      this.createNetworkDialogVisible=true;
    },
    async loadProviderNetworkTypes() {
      this.provider_physical_networks = [];
      var ip = "";
      console.log(this.versions)
      for (let index = 0; index < this.versions.length; index++) {
        const versionInfo = this.versions[index];
        if (versionInfo.version === this.selected_version){
          ip = versionInfo.ip;
        }
      }
      if (ip === ""){
        this.$message.error("加载provider:physical_networks失败");
        return
      }
      const res = await getPhysicalNetworkApi({"ip": ip})
      if (res.status === 200){
        this.provider_physical_networks = res.data.physical_networks;
      }
    },
    async onCreateNetworkApi() {
      this.creatingNetwork=true;
      this.networkCreateData.version = this.selected_version;
      var createdBody = {}
      if (this.createVlanNetworkFlag === true ){
        if (this.networkCreateData['provider:physical_network'] === ""){
          this.$message.error("请选择provider:physical_network");
          this.creatingNetwork=false;
          return
        }
        if (this.networkCreateData['provider:segmentation_id'] === 0){
          this.$message.error("请输入vlan id");
          this.creatingNetwork=false;
          return
        }
        createdBody = {
          "network": {
            "name": this.networkCreateData.name,
            "provider:network_type": "vlan",
            "router:external": this.networkCreateData.external,
            "provider:physical_network": this.networkCreateData['provider:physical_network'],
            "provider:segmentation_id": this.networkCreateData['provider:segmentation_id']
          }
        }
      }else{
        createdBody = {
          "network": {
            "name": this.networkCreateData.name,
            "provider:network_type": "vxlan",
          }
        }
      }

      const res = await createNetwork(createdBody, {"version": this.selected_version});
      if (res.data.status==='ok'){
          this.$message.success("创建成功");
          await this.onGetNetworksApi();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.creatingNetwork=false;
      
      this.createNetworkDialogVisible=false;
    },
    async onUpdateNetworkApi() {
      this.updatingNetwork=true;
      const updatedNetwork = {
        "network": {
          "name": this.networkUpdateData.name
        }
      };
      const updatedParams = {
        "version": this.selected_version,
        "id": this.selected_id
      };
      const res = await updateNetwork(updatedNetwork, updatedParams);
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
     this.networkCreateData = {
        "name": "",
        "external": false,
        "provider:physical_network": "",
        "provider:segmentation_id": 0
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
      createNetworkDialogVisible: false,
      createVlanNetworkFlag: false,
      selected_version: "",
      loading: false,
      deletingnetworks: false,
      creatingNetwork: false,
      versions: [],
      tableData: [],
      provider_physical_networks: [],
      networkCreateData: {
        "name": "",
        "external": false,
        "provider:physical_network": "",
        "provider:segmentation_id": 0
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

