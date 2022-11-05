<template>
  <div class="">
    <el-dialog v-model="dialogCreateInstanceVisible" title="新建实例" width="30%" :before-close="handleClose">
      <el-form :inline="false" :model="instanceCreateData" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="名称（可为空）">
          <el-input v-model="instanceCreateData.name" placeholder="" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="实例镜像">
          <el-select v-model="instanceCreateData.imageRef" class="label_input">
            <el-option v-for="image in images" :label="image.name" :value="image.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="可用域">
          <el-select v-model="instanceCreateData.availability_zone" class="label_input">
            <el-option v-for="aggregate in aggregates" :label="aggregate.availability_zone" :value="aggregate.availability_zone"/>
          </el-select>
        </el-form-item>
        <el-form-item label="flavor(实例类型)">
          <el-select v-model="instanceCreateData.flavorRef" class="label_input">
            <el-option v-for="flavor in flavors" :label="flavor.name" :value="flavor.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="网络">
          <el-select v-model="choosedNetworksID" class="label_input" multiple>
            <el-option v-for="net in networkCandidates" :label="net.name" :value="net.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="端口">
          <el-select v-model="choosedPortsID" class="label_input" multiple>
            <el-option v-for="port in portCandidates" :label="port.name" :value="port.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onCreateInstance" :loading="creatingInstance">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogMigrateVisible" title="实例热迁移" width="30%" :before-close="handleClose">
      <el-form :inline="false" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="当前实例的主机">
          <el-input v-model="currentInstanceHost" class="label_input" disabled></el-input>
        </el-form-item>
        <el-form-item label="目的主机">
          <el-select v-model="targetHostToMigrate" class="label_input">
            <el-option v-for="host in hostCanMigrate" :label="host" :value="host"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="onMigrateInstance" :loading="migratingInstance">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogSecurityGroupsVisible" title="实例安全组"  :before-close="handleClose">
      <div style="height: 340px;">
        <el-transfer 
          v-model="choosedSecurityGroups" 
          :titles="['可选的安全组', '已选的安全组']" 
          :data="allSecurityGroups" 
          filterable
          :button-texts="['删除', '增加']"
          :right-default-checked="[1]"
        />
        <el-button
          size="small"
          type="primary"
          @click="onSaveInstanceSecurityGroups"
          style="float: right;margin-top: 20px;"
          :loading="updatingInstanceSecurityGroups"
          >保存</el-button>
      </div>
    </el-dialog>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>实例</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <span class="text">请选择要默认的openstack的版本号：</span>
      <el-select v-model="selected_version" placeholder="Select" style="width: 240px" @change="loadInstances">
        <el-option v-for="version in versions" :label="version.info" :value="version.version"/>
      </el-select>
      <el-divider content-position="left">操作</el-divider>
      <el-button @click="handleCreateInstance" type="primary">新建实例</el-button>
      <el-button @click="loadInstances" type="info">刷新</el-button>
      <el-divider />
      <div class="table_area">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="name" label="实例名称" width="100"></el-table-column>
          <el-table-column prop="image_name" label="镜像名称" width="100" ></el-table-column>
          <el-table-column prop="flavor_name" label="实例类型" width="100" ></el-table-column>
          <el-table-column prop="OS-EXT-STS:vm_state" label="实例状态" width="100" ></el-table-column>
          <el-table-column prop="OS-EXT-SRV-ATTR:host" label="宿主机" width="200"></el-table-column>
          <el-table-column prop="ips" label="网络信息" width="200"></el-table-column>
          <el-table-column prop="task" label="任务" width="50"></el-table-column>
          <el-table-column prop="power_state" label="电源状态" width="50"></el-table-column>
          <el-table-column prop="OS-EXT-SRV-ATTR:instance_name" label="nova后台实例名称" width="200" ></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="300">
            <template #default="scope">
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="要删除该实例吗？" @confirm="handleDelete((scope.$index))">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-dropdown style="margin-left: 5px;margin-right: 5px;">
                <el-button type="warning" size="small">
                  编辑实例
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleSecurityGroups(scope.$index)">编辑安全组</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button type="primary" size="small" @click.prevent="handleMigrate(scope.$index)">迁移实例</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { createApp } from '@vue/runtime-dom';
import { getConfigedOpenstacks, getNetworks, getPortsApi, getSecurityGroupsApi } from '../api';
import { getImagesApi, getFlavorsApi, getAggregatesApi, getInstancesApi,
         getImageApi, getFlavorApi, getAggregateApi, getInstanceApi,
         deleteInstanceApi, createInstanceApi, migrateInstanceApi, updateInstanceSecurityGroups } from '../api/instance';

export default {
  name: "instance",
  created() {
    this.loadVersion();
    // this.dialogSecurityGroupsVisible=true; 
  },
  methods: {
    async handleSecurityGroups(index){
      this.choosedSecurityGroups = [];
      this.allSecurityGroups = [];
      const res = await getSecurityGroupsApi({"version": this.selected_version})
      if (res.status != 200){
        this.$message.error("加载安全组失败，请检查后台日志");
      }else{
        for (let index = 0; index < res.data.security_groups.length; index++) {
          const element = res.data.security_groups[index];
          this.allSecurityGroups.push({"key": element.name, "label": element.name})
        }
      };
      this.selectedInstanceId = this.tableData[index].id
      if (this.selectedInstanceId === ""){
        this.$message.error("请选择要更新的实例!");
        return
      }
      const inst = await getInstanceApi({"version": this.selected_version, "id": this.selectedInstanceId})
      if (inst.status != 200){
        this.$message.error("加载实例失败，请检查后台日志");
        return
      }else{
        let sgs = inst.data.security_groups
        for (let index = 0; index < sgs.length; index++) {
          const element = sgs[index];
          this.choosedSecurityGroups.push(element.name)
        }
      }
      this.dialogSecurityGroupsVisible=true;
    },
    async onSaveInstanceSecurityGroups(){
      this.updatingInstanceSecurityGroups = true;
      let params = {
        'id': this.selectedInstanceId,
        'version': this.selected_version
      }
      let body = {
        'security_groups': this.choosedSecurityGroups
      }
      const res = await updateInstanceSecurityGroups(body, params)
      if (res.status !== 200){
        this.$message.error("更新实例安全组失败，请检查后台日志");
      }else{
        this.$message.success("更新实例安全组成功");
        this.dialogSecurityGroupsVisible=false;
      }
      this.updatingInstanceSecurityGroups = false;
    },
    handleCreateInstance(){
      if (this.selected_version === "") {
        this.$message.error("请选择openstack版本号");
        return
      };
      this.dialogCreateInstanceVisible = true;
      this.loadNetworks();
      this.loadPorts();
      this.loadImages();
      this.loadFlavors();
      this.loadAggregates();
    },
    handleCancel(){
      this.dialogCreateInstanceVisible = false;
      this.resetData();
    },
    handleClose(done){
      this.resetData();
      this.dialogMigrateVisible = false;
      done();
    },
    async handleMigrate(index){
      this.dialogMigrateVisible = true;
      await this.loadAggregates();
      this.instanceIdToMigrate = this.tableData[index].id;
      this.currentInstanceHost = this.tableData[index]['OS-EXT-SRV-ATTR:host'];
      this.hostCanMigrate = [];
      this.targetHostToMigrate = '';
      for (let index = 0; index < this.aggregates.length; index++) {
        const aggregate = this.aggregates[index];
        for (let i = 0; i < aggregate.hosts.length; i++){
          if (this.currentInstanceHost === aggregate.hosts[i]){
            continue
          }
          this.hostCanMigrate.push(aggregate.hosts[i])
        }
      }
    },
    async onMigrateInstance(){
      this.migratingInstance = true;
      let params = {'version': this.selected_version};
      let body = {'target_host': this.targetHostToMigrate, 'id': this.instanceIdToMigrate};
      await migrateInstanceApi(body, params);
      this.migratingInstance = false;
      this.dialogMigrateVisible = false;
    },
    async onCreateInstance(){
      let params = {'version': this.selected_version};
      for (let index=0; index < this.choosedNetworksID.length; index++){
        this.instanceCreateData.networks.push({'uuid': this.choosedNetworksID[index]})
      }
      for (let index = 0; index < this.choosedPortsID.length; index++) {
        this.instanceCreateData.networks.push({'port': this.choosedPortsID[index]})
      }
      this.creatingInstance = true;
      const res = await createInstanceApi({'server': this.instanceCreateData}, params);
      if (res.data.status === 'ok'){
        this.$message.success("创建成功");
        await this.loadInstances();
        this.resetData();
        this.dialogCreateInstanceVisible = false; //关闭对话框
      }else{
        this.$message.error("创建失败:"+res.data.msg);
      }
      this.creatingInstance = false;
    },
    async loadNetworks(){
      this.networkCandidates = [];
      const res = await getNetworks({"version": this.selected_version})
      if (res.status != 200){
        this.$message.error("加载失败，请检查后台日志");
      }else{
        this.networkCandidates = res.data.networks;
      };
    },
    async loadPorts(){
      this.portCandidates = [];
      const res = await getPortsApi({"version": this.selected_version})
      if (res.status != 200){
        this.$message.error("加载失败，请检查后台日志");
      }else{
        for (let index = 0; index < res.data.ports.length; index++) {
          const element = res.data.ports[index];
          let ips = [];
          if (element.device_owner === ""){
            for (let i = 0; i< element.fixed_ips.length; i++){
              ips.push(element.fixed_ips[i].ip_address)
            }
            element.name = element.name + "(ip: " + ips.join(",") + "在网络" + element.net_name + "中)"
            this.portCandidates.push(element)
          }
        }
      };
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
    async loadImages(){
      const result = await getImagesApi({"version": this.selected_version})
      if (result.data === null) {
        this.images = [];
        return
      }
      this.images = result.data.images
    },
    async loadFlavors(){
      const result = await getFlavorsApi({"version": this.selected_version})
      if (result.data === null) {
        this.flavors = [];
        return
      }
      this.flavors = result.data.flavors
    },
    async loadAggregates(){
      const result = await getAggregatesApi({"version": this.selected_version})
      if (result.data === null) {
        this.aggregates = [];
        return
      }
      this.aggregates = result.data.aggregates
    },
    async loadImage(id){
      const result = await getImageApi({"version": this.selected_version, "id": id})
      if (result.data === null) {
        return ""
      }
      return result.data.name
    },
    async loadFlavor(id){
      const result = await getFlavorApi({"version": this.selected_version, "id": id})
      if (result.data === null) {
        return ""
      }
      return result.data.name
    },
    async loadAggregate(id){
      const result = await getAggregateApi({"version": this.selected_version, "id": id})
      if (result.data === null) {
        return ""
      }
      return result.data.name
    },
    async handleDelete(index) {
      this.loading=true;
     const res = await deleteInstanceApi({'version': this.selected_version, 'id':this.tableData[index].id})
      if (res.data.status==='ok'){
        this.$message.success("删除成功");
      }else{
          this.$message.error(res.data.msg);
      };
      await this.loadInstances();
      this.loading=false;
    },
    async loadInstances(){
      let tmpData = [];
      this.tableData = [];
      const result = await getInstancesApi({"version": this.selected_version})
      if (result.data.servers === null) {
        this.tableData = [];
        this.loading=false;
        return
      };
      tmpData = result.data.servers
      for (let index = 0; index < tmpData.length; index++) {
        const element = tmpData[index];
        element['image_name'] = await this.loadImage(element.image.id)
        element['flavor_name'] = await this.loadFlavor(element.flavor.id)
        let ips = [];
        for(var key in element.addresses){
          for (let i=0; i <  element.addresses[key].length; i++){
              const netElement = element.addresses[key][i];
              ips.push(key + " " + netElement.addr)
          }
        }
        if(element['OS-EXT-STS:power_state'] === 1){
          element['power_state'] = "开机";
        }else if (element['OS-EXT-STS:power_state'] === 0){
          element['power_state'] = "无状态";
        }else if (element['OS-EXT-STS:power_state'] === 3){
          element['power_state'] = "暂停";
        }else if (element['OS-EXT-STS:power_state'] === 4){
          element['power_state'] = "关机";
        }else if (element['OS-EXT-STS:power_state'] === 6){
          element['power_state'] = "崩溃";
        }else if (element['OS-EXT-STS:power_state'] === 7){
          element['power_state'] = "挂起";
        }
        if(element['OS-EXT-STS:task_state'] === 'spawning'){
          element['task'] = "孵化中";
        }else if (element['OS-EXT-STS:task_state'] === 'scheduling'){
          element['task'] = "调度中";
        }else if (element['OS-EXT-STS:task_state'] === 'networking'){
          element['task'] = "分配网络中";
        }else{
          element['task'] = "无";
        }
        
        element['ips'] = ips.join(", ");
        this.tableData.push(element)
      }
    },
    resetData(){
      this.instanceIdToMigrate = '';
      this.currentInstanceHost = '';
      this.targetHostToMigrate = '';
      this.choosedNetworksID = [];
      this.choosedPortsID = [];
      this.instanceCreateData = {
        'name': '',
        'flavorRef': '',
        'availability_zone': '',
        'imageRef': ''
      }
    },
  },
  data() {
    return {
      creatingInstance: false,
      loading: false,
      migratingInstance: false,
      dialogCreateInstanceVisible: false,
      dialogSecurityGroupsVisible: false,
      dialogMigrateVisible: false,
      updatingInstanceSecurityGroups: false,
      choosedSecurityGroups: [],
      images: [],
      aggregates: [],
      flavors: [],
      networkCandidates: [],
      portCandidates: [],
      choosedPortsID: [],
      choosedNetworksID: [],
      allSecurityGroups: [],
      versions: [],
      instanceIdToMigrate: '',
      currentInstanceHost: '',
      targetHostToMigrate: '',
      selectedInstanceId: '',
      hostCanMigrate: [],
      tableData: [],
      instanceCreateData: {
        'name': '',
        'flavorRef': '',
        'networks': [],
        'availability_zone': '',
        'imageRef': ''
      },
      selected_version: "",
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

