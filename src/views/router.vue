<template>
  <div class="">
    <el-dialog v-model="dialogCreateRouterVisible" title="新增路由器" width="30%">
      <el-form :inline="false" :model="routerCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可选）">
          <el-input v-model="routerCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
        <!-- <el-form-item label="使能dhcp">
          <el-switch v-model="routerCreateData.enable_dhcp" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCreateRouterVisible = false">取消</el-button>
          <el-button type="primary" @click="onCreateRouter" :loading="creatingRouter">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdateRouterVisible" title="编辑路由器" width="20%">
      <el-form :inline="false" :model="routerUpdateData" class="form-inline" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="routerUpdateData.name" class="label_input"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogUpdateRouterVisible = false">取消</el-button>
          <el-button type="primary" @click="onUpdateRouter" :loading="updatingRouter">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogEditRouterInterfaceVisible" title="路由接口" width="50%">
      <el-table :data="routerInterfaceData" style="width: 100%">
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="net_name" label="网络" width="180" />
        <el-table-column prop="subnet_name" label="子网" />
        <el-table-column prop="ip_address" label="iP 地址" />
        <el-table-column fixed="right" label="操作" align="center" width="100">
            <template #default="scope">
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="要删除该子网接口吗？" @confirm="remove_router_interface(scope.$index)">
                <template #reference>
                  <el-button type="danger" size="small" :loading="removing_router_interface">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
      </el-table>
      <br>
      <el-collapse>
        <el-collapse-item title="新增子网接口" name="1">
          <div>
            <span style="margin-right:10px">选择网络</span>
            <el-select v-model="router_interface_network" class="m-2" placeholder="请选择网络" size="large" @change="handleSelectNetwork">
              <el-option
                v-for="item in networks"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <span style="margin-left:10px;margin-right:10px">选择子网</span>
            <el-select v-model="router_interface_subnet" class="m-2" placeholder="请选择子网" size="large">
              <el-option
                v-for="item in subnets"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-button type="primary" @click="add_router_interface" :loading="adding_router_interface" style="margin-left:10px;">确认</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="finishEidtRouterInterface">好了</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogEditRouterGwVisible" title="路由器网关接口" width="30%">
      <el-form :inline="false" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="外部网络">
          <el-select v-model="external_net_id" placeholder="Select" style="width: 100%">
            <el-option v-for="net in external_networks" :label="net.name" :value="net.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditRouterGwVisible = false">取消</el-button>
          <el-button type="primary" @click="onAddRouterGw" :loading="adding_router_gw">确认</el-button>
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
      <el-select v-model="selected_version" placeholder="Select" style="width: 240px" @change="get_routers">
        <el-option v-for="version in versions" :label="version" :value="version"/>
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="createRouter" type="primary">新建路由器</el-button>
      <el-divider />
      <div class="table_area">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%" border>
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="name" label="名称" width="170"></el-table-column>
          <el-table-column prop="id" label="id" width="290"></el-table-column>
          <el-table-column prop="router_interface" label="router interface" width="200">
            <template #default="scope">
              <el-tag type="info" disable-transitions v-for="net in scope.row.router_interface">{{ net }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="external_network" label="外部网关信息" width="290">
            <template #default="scope">
              <el-tag
                :type="scope.row.external_network === '添加网关信息' ? '' : 'success'"
                :closable="scope.row.external_network === '添加网关信息' ? false : true"
                disable-transitions
                @close="remove_router_gw(scope.$index)"
                @click="handle_add_router_gw(scope.$index)"
                >{{ scope.row.external_network }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="300">
            <template #default="scope">
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="要删除该路由器吗？" @confirm="handleDelete(scope.$index)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button type="info" size="small" @click.prevent="handleEdit(scope.$index)">编辑</el-button>
              <el-button type="success" size="small" @click.prevent="handleEditRouterInterface(scope.$index)">编辑子网</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getNetworks, 
  getRoutersApi,
  createRouterApi,
  getConfigedOpenstacks,
  deleteRouterApi,
  updateRouterApi,
  getSingleNetwork,
  getRouterInterfaceApi,
  getSubnetsByNetIdApi,
  addRouterInterfaceApi,
  removeRouterInterfaceApi,
  removeRouterGwApi,
  addRouterGwApi,
  } from '../api';

export default {  
  name: "router",
  created() {
    this.loadVersion();
  },
  methods: {
    finishEidtRouterInterface(){
      this.get_routers();
      this.dialogEditRouterInterfaceVisible=false;
    },
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
    handleSelectNetwork(){
      console.log(this.router_interface_network);
      this.loadSubnetsByNetId(this.router_interface_network)
    },
    // gw ****************************************************
    async remove_router_gw(index){
      this.loading = true;
      const res = await removeRouterGwApi({"router_id": this.tableData[index].id, "version": this.selected_version})
      if (res.status != 200 || res.data.status !== "ok"){
        this.$message.error("删除网关失败，请检查后台日志");
        return
      }
      this.$message.success("删除成功");
      this.loading = false;
      this.get_routers();
    },
    handle_add_router_gw(index){
      this.selected_id = this.tableData[index].id;
      this.load_external_networks()
      this.dialogEditRouterGwVisible = true;
    },
    async onAddRouterGw(){
      this.adding_router_gw = true;
      const res = await addRouterGwApi({'router_id': this.selected_id, 'vlan_net_id': this.external_net_id, 'version': this.selected_version})
      if (res.data.status === 'ok'){
        this.$message.success("添加成功");
      }else{
        this.$message.error(res.data.msg);
      }
      this.adding_router_gw = false;
      this.get_routers();
      this.dialogEditRouterGwVisible = false;
    },
    async load_external_networks(){
      const res = await getNetworks({'version': this.selected_version, 'type': 'external'})
      if (res.status ===200){
        this.external_networks = res.data.networks;
      };
    },
    async add_router_interface(){
      this.adding_router_interface=true;
      const res = await addRouterInterfaceApi({'router_id': this.selected_id, 'subnet_id': this.router_interface_subnet, 'version': this.selected_version});
      this.adding_router_interface=false;
      if (res.status != 200 || res.data.status !== "ok"){
        this.$message.error("添加子网接口失败，请检查后台日志");
        return
      }
      this.$message.success("添加成功");
      this.getRouterInterfaceData(this.selected_id);
      this.reset_formData();
    },
    async remove_router_interface(index){
      this.removing_router_interface=true;
      let subnet_id = this.routerInterfaceData[index].fixed_ips[0].subnet_id
      const res = await removeRouterInterfaceApi({'router_id': this.selected_id, 'subnet_id': subnet_id, 'version': this.selected_version});
      this.removing_router_interface=false;
      if (res.status != 200 || res.data.status !== "ok"){
        this.$message.error("删除子网接口失败，请检查后台日志");
        return
      }
      this.$message.success("删除成功");
      await this.getRouterInterfaceData(this.selected_id);
    },
    async loadNetworks(){
      const res = await getNetworks({'version': this.selected_version});
      if (res.status ===200){
        this.networks = res.data.networks;
      };
    },
    async loadSubnetsByNetId(id){
      this.router_interface_subnet="";
      const res = await getSubnetsByNetIdApi({'id': id});
      if (res.status ===200){
        this.subnets = res.data.subnets;
      };
    },
    async get_routers() {
      if (this.selected_version === "") {
        return
      }
      this.loading = true
      const routers = await getRoutersApi({'version': this.selected_version});
      if (routers.status != 200){
        this.$message.error("加载失败，请检查后台日志");
        this.loading = false;
        return
      }
      this.tableData = routers.data.routers;
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        if (JSON.stringify(element.external_gateway_info) !== "{}") {
          const net_info = await getSingleNetwork({'id': element.external_gateway_info.network_id});
          this.tableData[index]['external_network'] = net_info.data.name;
        }else{
          this.tableData[index]['external_network'] = '添加网关信息';
        }
        const interface_info = await getRouterInterfaceApi({'version': this.selected_version, 'id': element.id});
        const interfacesNet = [];
        if (interface_info.data.length > 0){
          for (let portIndex = 0; portIndex < interface_info.data.length; portIndex++) {
            const port = interface_info.data[portIndex];
            interfacesNet.push(port.net_name+': '+port.subnet_name);
          }
        }
        this.tableData[index]['router_interface'] = interfacesNet;
      }
      this.loading = false;
    },
    createRouter() {
      if (this.selected_version==="") {
        this.$message.error("请选择要新建路由器的openstack版本号");
        return
      };
      this.dialogCreateRouterVisible=true;
    },
    async onCreateRouter() {
      this.creatingRouter=true;
      const res = await createRouterApi(
        {
          'name': this.routerCreateData.name,
          'version': this.selected_version,
        }
      );
      if (res.data.status==='ok'){
          this.$message.success("创建成功");
          this.get_routers();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.creatingRouter=false;
      
      this.dialogCreateRouterVisible=false;
    },
    // 获取路由接口信息
    async getRouterInterfaceData(rid){
      const data = await getRouterInterfaceApi({'version': this.selected_version, 'id': rid});
      this.routerInterfaceData = data.data
      for (let index = 0; index < data.data.length; index++) {
        const element = data.data[index];
        this.routerInterfaceData[index]['ip_address'] = element.fixed_ips[0].ip_address;
      }
    },
    deleteAllRouters() {
      if (this.selected_version === "") {
        this.$message.error("请选择要删除网络的openstack版本号");
        return
      };
      this.deleteDialogVisible = true;
    },
    async handleDelete(index) {
      this.loading=true;
     const res = await deleteRouterApi({'version': this.selected_version, 'id':this.tableData[index].id})
      if (res.data.status==='ok'){
        this.get_routers();
        this.$message.success("删除成功");
      }else{
          this.$message.error(res.data.msg);
      };
      this.loading=false;
      
    },
    handleEdit(index) {
      this.selected_id = this.tableData[index].id;
      this.routerUpdateData.name = this.tableData[index].name;
      this.dialogUpdateRouterVisible = true;
    },
    handleEditRouterInterface(index) {
      this.selected_id = this.tableData[index].id;
      this.router_interface_subnet="";
      this.router_interface_network="";
      this.getRouterInterfaceData(this.selected_id);
      this.loadNetworks();
      this.dialogEditRouterInterfaceVisible = true;
    },
    handleEditRouterGw(index) {
      this.selected_id = this.tableData[index].id;
      this.router_gw_net="";
      this.getRouterInterfaceData(this.selected_id);
      this.loadNetworks();
      this.dialogEditRouterInterfaceVisible = true;
    },
    async onUpdateRouter(index){
      this.updatingRouter=true;
      const res = await updateRouterApi(
        {
          'version': this.selected_version,
          'id': this.selected_id,
          'attr': {
            'router': {
              'name': this.routerUpdateData.name
            }
          }
        });
      if (res.data.status==='ok'){
          this.$message.success("更新成功");
          await this.get_routers();
      }else{
          this.$message.error(res.data.msg);
      };
      this.reset_formData();
      this.updatingRouter=false;
      
      this.dialogUpdateRouterVisible=false;
    },
    reset_formData(){
     this.routerCreateData= {
        name: "",
        cidr: "",
        net_id: "",
        version: "",
        ip_version: 4,
        enable_dhcp: true,
      };
      this.routerUpdateData = {
        name: '',
        enable_dhcp: true
      };
      this.router_interface_network="";
      this.router_interface_subnet="";
   }
  },
  data() {
    return {
      router_interface_network: '',
      router_interface_subnet: '',
      dialogEditRouterInterfaceVisible: false,
      dialogEditRouterGwVisible: false,
      selected_id: '',
      dialogUpdateRouterVisible: false,
      notifySelectedVersions: "",
      deleteDialogVisible: false,
      dialogCreateRouterVisible: false,
      selected_version: "",
      loading: false,
      deletingrouters: false,
      creatingRouter: false,
      adding_router_gw: false,
      updatingRouter: false,
      adding_router_interface: false,
      removing_router_interface: false,
      versions: [],
      tableData: [],
      networks: [],
      external_networks: [],
      subnets: [],
      routerUpdateData: {
        name: '',
      },
      external_net_id: '',
      routerInterfaceData: [],
      routerCreateData: {
        name: "",
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

