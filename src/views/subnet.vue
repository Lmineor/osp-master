<template>
  <div class="">
    <el-dialog v-model="dialogCreateSubnetVisible" title="新增子网" width="30%">
      <el-form :inline="false" :model="subnetCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可选）">
          <el-input v-model="subnetCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
        <!-- <el-form-item label="CIDR（可选）">
          <el-input v-model="subnetCreateData.cidr" placeholder="" class="label_input"></el-input>
        </el-form-item> -->
        <el-form-item label="ip version">
          <el-radio-group v-model="subnetCreateData.ip_version" class="ml-4">
            <el-radio :label=4 size="large">iP V4</el-radio>
            <el-radio :label=6 size="large">iP V6</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="网络">
          <el-select v-model="subnetCreateData.net_id" class="label_input">
            <el-option v-for="net in networks" :label="net.name" :value="net.id"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="使能dhcp">
          <el-switch v-model="subnetCreateData.enable_dhcp" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCreateSubnetVisible = false">取消</el-button>
          <el-button type="primary" @click="onCreateSubnet" :loading="creatingSubnet">确认</el-button>
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
      <el-select v-model="selected_version" placeholder="Select" style="width: 240px" @change="get_subnets">
        <el-option v-for="version in versions" :label="version" :value="version"/>
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="createSubnetApi" type="primary">新建子网</el-button>
      <!-- <el-button
        @click="deleteAllSubnets"
        type="warning"
        :loading="deletingsubnets"
        >删除所有网络</el-button
      > -->
      <el-divider />
      <div class="table_area">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="id" label="id" width="350"></el-table-column>
          <el-table-column prop="name" label="name" width="100"></el-table-column>
          <el-table-column prop="network_id" label="网络id" width="350" ></el-table-column>
          <el-table-column prop="net_name" label="网络名称" width="200"></el-table-column>
          <el-table-column prop="cidr" label="cidr" width="150"></el-table-column>
          <el-table-column prop="ip_version" label="ip版本" width="100"></el-table-column>
          <el-table-column prop="enable_dhcp" label="enable dhcp" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="150">
            <template #default="scope">
              <el-button type="text" size="small" @click.prevent="handleDelete(scope.$index)">删除</el-button>
              <el-button type="text" size="small" @click.prevent="handleEdit(scope.$index)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getNetworks, getSubnets,createSubnet,getConfigedOpenstacks,deleteSubnet } from '../api';

export default {
  name: "subnet",
  created() {
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
    async loadNetworks(){
      const res = await getNetworks({'version': this.selected_version});
      console.log(res);
      if (res.status ===200){
        this.networks = res.data.networks;
      };
    },
    async get_subnets() {
      if (this.selected_version === "") {
        return
      }
      this.loading = true
      const subnets = await getSubnets({'version': this.selected_version});
      if (subnets.status != 200){
        this.$message.error("加载失败，请检查后台日志");
        this.loading = false;
        return
      }
      this.tableData = subnets.data.subnets;
      this.loading = false;
    },
    createSubnetApi() {
      if (this.selected_version==="") {
        this.$message.error("请选择要新建网络的openstack版本号");
        return
      };
      this.loadNetworks();
      this.dialogCreateSubnetVisible=true;
    },
    async onCreateSubnet() {
      this.creatingSubnet=true;
      const res = await createSubnet(
        {
          'name': this.subnetCreateData.name,
          'version': this.selected_version,
          'net_id': this.subnetCreateData.net_id,
          'ip_version': this.subnetCreateData.ip_version,
          'cidr': this.subnetCreateData.cidr,
          'enable_dhcp': this.subnetCreateData.enable_dhcp
        }
      );
      if (res.data.status==='ok'){
          this.$message.success("创建成功");
          this.get_subnets();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.creatingSubnet=false;
      
      this.dialogCreateSubnetVisible=false;
    },
    deleteAllSubnets() {
      if (this.selected_version === "") {
        this.$message.error("请选择要删除网络的openstack版本号");
        return
      };
      this.deleteDialogVisible = true;
    },
    async handleDelete(index) {
      this.loading=true;
     const res = await deleteSubnet({'version': this.form.formData.nets[index].version, 'net_id':this.form.formData.nets[index].id})
      if (res.data.status==='ok'){
        this.get_subnets();
        this.$message.success("删除成功");
      }else{
          this.$message.error(res.data.msg);
      };
      this.loading=false;
      
    },
    handleEdit(index){},
    reset_formData(){
     this.subnetCreateData= {
        name: "",
        cidr: "",
        net_id: "",
        version: "",
        ip_version: 4,
        enable_dhcp: true,
      }
   }
  },
  data() {
    return {
      notifySelectedVersions: "",
      deleteDialogVisible: false,
      dialogCreateSubnetVisible: false,
      selected_version: "",
      loading: false,
      deletingsubnets: false,
      creatingSubnet: false,
      versions: [],
      tableData: [],
      networks: [],
      subnetCreateData: {
        name: "",
        net_id: "",
        version: "",
        ip_version: 4,
        enable_dhcp: true,
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

