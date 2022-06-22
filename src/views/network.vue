<template>
  <div class="">
    <el-dialog v-model="dialogCreateNetworkVisible" title="新增网络" width="30%">
      <el-form :inline="false" :model="networkCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可选）">
          <el-input v-model="networkCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="networkCreateData.networkType" placeholder="pike" class="label_input">
            <el-option label="vlan" value="vlan"></el-option>
            <el-option label="vxlan" value="vxlan"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCreateNetworkVisible = false">取消</el-button>
          <el-button type="primary" @click="onCreateNetwork" :loading="creatingNetwork">确认</el-button>
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
      <el-select v-model="selected_version" multiple placeholder="Select" style="width: 240px"
        @visible-change="get_networks">
        <el-option v-for="version in versions" :label="version" :value="version" />
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="createNetwork" type="primary">新建网络</el-button>
      <el-button @click="deleteAllNetworks" type="warning" :loading="deletingnetworks">删除所有网络</el-button>
      <el-divider />
      <div class="table_area">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" :key="isKey">
          <el-table-column prop="version" label="版本" width="120"></el-table-column>
          <el-table-column prop="name" label="name" width="200"></el-table-column>
          <el-table-column prop="attrs" label="是否是外部网络" width="150"></el-table-column>
          <el-table-column prop="id" label="id" width="300"></el-table-column>
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
import { getNetworks,createNetwork,getConfigedOpenstacks } from '../api';
import { ElNotification } from 'element-plus'

export default {
  name: "network",
  created(){
    this.loadVersion();
  },
  methods: {
    async loadVersion() {
      const result = await getConfigedOpenstacks()
      if (result.openstacks === null) {
        this.versions = [];
        return
      }
      for (var i=0;i<result.openstacks.length;i++){
        this.versions.push(result.openstacks[i].version)
      };
    },
    async get_networks() {
      if (this.selected_version === "") {
        return
      }
      this.loading = true
      const nets = await getNetworks({'versions': this.selected_version});
      if (nets.data.status != 200){
        this.$message.error("加载失败，请检查后台日志");
        this.loading = false;
        return
      }
      this.tableData = nets.data.networks
      this.loading = false;
    },
    createNetwork() {
      if (this.selected_versions.length < 1) {
        this.$message.error("请选择要新建网络的openstack版本号");
        return
      };
      this.dialogCreateNetworkVisible=true;
    },
    async onCreateNetwork() {
      this.creatingNetwork=true;
      const res = await createNetwork(this.networkCreateData);
      if (res.data.status==='ok'){
          this.$message.success("创建成功");
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.creatingNetwork=true;
      this.isKey = !this.isKey;
      this.get_networks();
      this.dialogCreateNetworkVisible=false;
    },
    deleteAllNetworks() {
      if (this.selected_version === "") {
        this.$message.error("请选择要删除网络的openstack版本号");
        return
      };
      this.deleteDialogVisible = true;
    },
    handleDelete(index) {
      this.$message.success("成功");
    },
    reset_formData(){
     this.networkCreateData= {
        version: "",
        name: "",
        network_type: ""
      }
   },
  },
  data() {
    return {
      isKey: false, // table数据实时刷新
      notifySelectedVersions: "",
      deleteDialogVisible: false,
      dialogCreateNetworkVisible: false,
      selected_version: "",
      loading: false,
      deletingnetworks: false,
      creatingNetwork: false,
      versions: [],
      networkCreateData: {
        name: "",
        network_type: "",
        version: ""
      },
      tableData: [],
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

