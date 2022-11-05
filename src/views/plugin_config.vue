<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>插件配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="config">
        <span>此处仅列出状态为alive的节点</span>
        <el-button size="small" @click="refresh" type="primary" style="margin: 10px;">刷新</el-button>
        <el-table
          :data="configData"
          border
        >
          <el-table-column prop="ip" label="ip" width="150" />
          <el-table-column prop="version" label="版本" />
          <el-table-column prop="service_plugins" label="service_plugins"  width="300">
            <template #default="props">
              <el-input v-model="props.row.service_plugins" placeholder="Please input" />
            </template>
          </el-table-column>
          <el-table-column prop="conf" label="plugin_conf" width="450">
            <template #default="props">
              <el-input v-model="props.row.conf" placeholder="Please input" 
                :rows="10"
                type="textarea" />
            </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="250">
              <template #default="scope">
                <el-button type="primary" size="small" :disabled="!configChanged(scope.$index)" @click.prevent="saveConfig(scope.$index)" :loading="scope.row.saving">保存</el-button>
                <el-button type="danger" size="small" @click.prevent="handleRestart(scope.$index)" :loading="scope.row.restarting">重启</el-button>
              </template>
            </el-table-column>
        </el-table>
        <!-- <el-button size="small" @click="saveAndRestart" type="danger" style="margin: 5px;" :loading="restartingNeutronServer">全部保存并重启neutron-server</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>

import { getConfigedOpenstacks, getConfigsApi, saveServicePluginsApi, saveMl2ConfApi, restartNeutronServerApi } from '../api';

export default {
  name: "plugin",
  created() {
    this.getConfigs();
  },
  methods: {
    configChanged(index){
      const selectedConfig = this.configData[index];
      if (selectedConfig.orig_service_plugins !== selectedConfig.service_plugins || selectedConfig.orig_conf !== selectedConfig.conf){
        return true
      }
      return false
    },
    async getConfigs(){
      const activedPlatforms = await this.getActiveNodes()
      const res = await getConfigsApi({"ips": activedPlatforms});
      var config = [];
      for (let index = 0; index < res.data.resp.length; index++) {
        const element = res.data.resp[index];
        element['orig_service_plugins'] = element['service_plugins']
        element['orig_conf'] = element['conf']
        element['saving'] = false;
        element['restarting'] = false;
        config.push(element)
      }

      this.configData = config;
      return
    },
    async getActiveNodes(){
      let activedPlatforms = [];
      const result = await getConfigedOpenstacks()
      if (result.data === null) {
        return
      }
      if (result.status !== 200){
          this.$message.error("获取节点状态失败")
          return
      }
      const nodes = result.data
      for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          if (!element.status){
              continue
          }
          activedPlatforms.push(element.url) 
      }
      return activedPlatforms
    },
    refresh(){
      this.getConfigs();
    },
    async handleRestart(index){
      this.configData[index].restarting = true;
      this.restartingNeutronServer = true;
      let restartBody = {};
      restartBody['ips'] = [this.configData[index].ip];
      await restartNeutronServerApi(restartBody);
      this.configData[index].restarting = false;
    },
    async saveConfig(index){
      this.configData[index].saving = true;
      const current = this.configData[index];
      let service_plugins_body = {};
      let service_plugins_list = [];
      let ml2_conf_body = {};
      let ml2_conf_list = [];
      service_plugins_list.push({'ip': current.ip, 'plugins': current.service_plugins})
      service_plugins_body['plugins'] = service_plugins_list
      const service_plugins_res = await saveServicePluginsApi(service_plugins_body)
      if (service_plugins_res.status !== 'ok' ){
          this.$message.error("保存service_plugins失败");
          this.restartingNeutronServer = false;
      }
      ml2_conf_list.push({'ip': current.ip, 'conf': current.conf})
      ml2_conf_body['confs'] = ml2_conf_list
      const ml2_res = await saveMl2ConfApi(ml2_conf_body)
      if (ml2_res.status !== 'ok' ){
          this.$message.error("保存ml2 conf失败")
          this.restartingNeutronServer = false;
      }
      this.getConfigs()
      this.configData[index].saving = true;
    },
  },
  data() {
    return {
      restartingNeutronServer: false,
      savingConfig: false,
      configData:[],
    }
  }
}
</script>

<style>
.container {
  height: 100%vh !important;
  width: 95%;
}
.text {
  margin-right: 20px;
}
.steps {
  width: 100%;
}
.choosePlatform {
  display: flex;
  justify-content: center;
  align-items: center;
}
.show_tag {
  margin-right: 5px;
}
.upload {
  text-align: center;
}

.button {
  margin-top: 10px;
  text-align: center;
}

.change{
    width: 100%;
    margin: 0 auto;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
