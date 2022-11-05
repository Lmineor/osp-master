<template>
  <div class="">
    <el-dialog v-model="dialogCreatePortVisible" title="新增端口" width="30%">
      <el-form :inline="false" :model="portCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可选）">
          <el-input v-model="portCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="网络">
          <el-select v-model="portCreateData.net_id" class="label_input">
            <el-option v-for="net in networks" :label="net.name" :value="net.id"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="使能dhcp">
          <el-switch v-model="portCreateData.enable_dhcp" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCreatePortVisible = false">取消</el-button>
          <el-button type="primary" @click="onCreatePort" :loading="creatingPort">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdatePortVisible" title="编辑端口" width="30%">
      <el-form :inline="false" :model="portUpdateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="portUpdateData.name" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="QOS">
          <el-select v-model="portUpdateData.qos" placeholder="请选择要关联的qos">
            <el-option v-for="qos in qoss" :label="qos.name" :value="qos.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="安全组">
          <el-select v-model="portUpdateData.security_group" placeholder="请选择要关联的安全组">
            <el-option v-for="sec in securityGroups" :label="sec.name" :value="sec.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUpdatePortVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdatePort" :loading="updatingPort">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>端口</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <span class="text">请选择要默认的openstack的版本号：</span>
      <el-select v-model="selected_version" placeholder="Select" style="width: 240px" @change="get_ports">
        <el-option v-for="version in versions" :label="version.info" :value="version.version"/>
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="createPort" type="primary">新建端口</el-button>
      <el-button @click="get_ports" type="info">刷新</el-button>
      <el-divider />
      <div class="table_area">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%" border>
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="name" label="名称" width="200"></el-table-column>
          <el-table-column prop="fixed_ips" label="iP地址" width="150" resizable></el-table-column>
          <el-table-column prop="mac_address" label="mac地址" width="150"></el-table-column>
          <el-table-column prop="device_owner" label="device_owner" width="150"></el-table-column>
          <el-table-column prop="security_groups" label="security_groups" width="150"></el-table-column>
          <el-table-column prop="net_name" label="网络名称" width="200"></el-table-column>
          <el-table-column prop="id" label="id" width="290"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="150">
            <template #default="scope">
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="要删除该端口吗？" @confirm="handleDelete((scope.$index))">
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
import { getNetworks, getPortsApi,createPortApi,getConfigedOpenstacks,
deletePortApi, updatePortApi, getSecurityGroupsApi, getSecurityGroupApi } from '../api';

export default {
  name: "port",
  created() {
    this.loadVersion();
  },
  methods: {
    async loadQoss(){
      // clear old data first
      this.qoss = [];
      this.portUpdateData.qos = "";
      this.qoss = [{"name": "不关联", "id": ""},{"name": "1", "id": "1234"},{"name": "2", "id": "2222"},{"name": "13232", "id": "232"}];
    },
    async loadSecurityGroups(){
      // clear old data first
      this.securityGroups = [];
      this.portUpdateData.security_group = "";

      const res = await getSecurityGroupsApi({"version": this.selected_version})
      if (res.status === 200){
        this.securityGroups.push({"name": "不关联", "id": ""});
        this.securityGroups.push(...res.data.security_groups)
      }
      
      // this.securityGroups = [{"name": "解除关联", "id": null},{"name": "21", "id": "1234"},{"name": "22", "id": "2222"},{"name": "132232", "id": "232"}];
    },
    async loadVersion() {
      const result = await getConfigedOpenstacks()
      if (result.data === null) {
        this.versions = [];
        return
      }
      for (var i=0;i<result.data.length;i++){
        this.versions.push({"version": result.data[i].version, "info": result.data[i].version + "(" + result.data[i].url + ")", "ip": result.data[i].url})
      };
    },
    async loadNetworks(){
      const res = await getNetworks({'version': this.selected_version});
      if (res.status ===200){
        this.networks = res.data.networks;
      };
    },
    async get_ports() {
      if (this.selected_version === "") {
        return
      }
      this.loading = true
      const ports = await getPortsApi({'version': this.selected_version});
      if (ports.status != 200){
        this.$message.error("加载失败，请检查后台日志");
        this.loading = false;
        return
      }
      for (let index = 0; index < ports.data.ports.length; index++) {
        const port = ports.data.ports[index]
        const element = ports.data.ports[index].fixed_ips;
        let ips = [];
        let security_groups_name = [];
        for (let ipIndex = 0; ipIndex<element.length; ipIndex++){
          ips.push(element[ipIndex].ip_address)
        }
        for (let secIndex = 0; secIndex < port.security_groups.length; secIndex++) {
          const secGroup = port.security_groups[secIndex];
          const secGroupApiData = await getSecurityGroupApi({"version": this.selected_version, "id": secGroup})
          security_groups_name.push(secGroupApiData.data.security_group.name)
        }
        ports.data.ports[index].fixed_ips=ips.join();
        ports.data.ports[index].security_groups=security_groups_name;
      }
      this.tableData = ports.data.ports;
      this.loading = false;
    },
    createPort() {
      if (this.selected_version==="") {
        this.$message.error("请选择要新建端口的openstack版本号");
        return
      };
      this.loadNetworks();
      this.dialogCreatePortVisible=true;
    },
    async onCreatePort() {
      this.creatingPort=true;
      const body = {
        "port":{
          "network_id": this.portCreateData.net_id,
          "name": this.portCreateData.name
        }
      }
      const param = {
        "version": this.selected_version
      }
      const res = await createPortApi(
        body, param
      );
      if (res.data.status==='ok'){
          this.$message.success("创建成功");
          this.get_ports();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.creatingPort=false;
      
      this.dialogCreatePortVisible=false;
    },
    deleteAllPorts() {
      if (this.selected_version === "") {
        this.$message.error("请选择要删除网络的openstack版本号");
        return
      };
      this.deleteDialogVisible = true;
    },
    async handleDelete(index) {
      this.loading=true;
     const res = await deletePortApi({'version': this.selected_version, 'id':this.tableData[index].id})
      if (res.data.status==='ok'){
        this.get_ports();
        this.$message.success("删除成功");
      }else{
          this.$message.error(res.data.msg);
      };
      this.loading=false;
      
    },
    handleEdit(index) {
      this.selected_id = this.tableData[index].id;
      this.portUpdateData.name = this.tableData[index].name;
      this.portUpdateData.security_group = this.tableData[index].security_groups
      this.loadSecurityGroups();
      this.loadQoss();
      this.dialogUpdatePortVisible = true;
      
    },
    async onUpdatePort(index){
      this.updatingPort=true;
      const body = {
        "port": {
          "name": this.portUpdateData.name
        }
      }
      const param = {
        "version": this.selected_version,
        "id": this.selected_id
      }
      const res = await updatePortApi(
        body, param
      );
      if (res.data.status==='ok'){
          this.$message.success("更新成功");
          await this.get_ports();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.updatingPort=false;
      
      this.dialogUpdatePortVisible=false;
    },
    reset_formData(){
     this.portCreateData= {
        name: "",
        cidr: "",
        net_id: "",
        version: "",
        ip_version: 4,
        enable_dhcp: true,
      };
      this.portUpdateData = {
        name: '',
        enable_dhcp: true
      }
   }
  },
  data() {
    return {
      selected_id: '',
      dialogUpdatePortVisible: false,
      notifySelectedVersions: "",
      deleteDialogVisible: false,
      dialogCreatePortVisible: false,
      selected_version: "",
      loading: false,
      deletingports: false,
      creatingPort: false,
      updatingPort: false,
      versions: [],
      tableData: [],
      networks: [],
      qoss: [],
      securityGroups: [],
      portUpdateData: {
        name: '',
        qos: '',
        security_group: ''
      },
      portCreateData: {
        name: "",
        net_id: "",
        version: "",
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

