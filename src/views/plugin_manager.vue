<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i>插件管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div>
        <el-steps :active="activeSteps" align-center class="step">
          <el-step title="第一步" description="选择并上传插件" />
          <el-step title="第二步" description="选择要替换插件的云平台" />
          <el-step title="第三步" description="替换插件" />
          <el-step title="第四步" description="核验配置项并重启neutron-server" />
        </el-steps>
      </div>
      <el-divider />
      <div v-if="activeSteps === 1">
        <div class="upload">
          <el-upload class="upload-demo" drag :action="actionUrl"
            v-model:file-list="uploadedFileName"
            :limit="1"
            :auto-upload="true"
            :before-upload="beforePluginUpload"
            :headers="{ 'X-Auth-Token': token }"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">只能上传.egg文件</div>
            </template>
          </el-upload>
        </div>
      </div>
      <div v-if="activeSteps === 2">
          <el-button size="small" @click="refresh" type="primary" style="margin: 5px;">刷新</el-button>
        <div class="choosePlatform">
          
          <el-transfer v-model="choosedPlatforms" :titles="['可选的云平台', '已选的云平台']" :data="allPlatforms" />
        </div>
      </div>
      <div v-if="activeSteps === 3">
        <div class="change">
          <el-button :loading="changingPlugin" size="small" @click="changePlugin" type="danger" style="margin: 5px;">更换插件</el-button>
          <el-button size="small" @click="refresh" type="primary" style="margin: 5px;">刷新</el-button>
          <el-table
            :data="nodesToInstall"
            
          >
            <el-table-column prop="ip" label="ip" width="300" align="center" />
            <el-table-column prop="version" label="版本" width="500" align="center" />
            <el-table-column prop="status" label="节点状态" align="center">
              <template #default="props">
                <el-tag class="ml-2" type="success">{{ props.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="installed" label="是否安装插件" align="center">
              <template #default="props">
                <el-tag class="ml-2" type="success">{{ props.row.installed }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="activeSteps === 4">
        <div class="config">
          <h4>请确认好配置项并保存</h4>
          <el-button size="small" @click="saveAndRestart" type="danger" style="margin: 5px;" :loading="restartingNeutronServer">全部保存并重启neutron-server</el-button>
          <el-button size="small" @click="refresh" type="primary" style="margin: 5px;">刷新</el-button>
          <el-table
            :data="configData"
            border
          >
            <el-table-column prop="ip" label="ip" width="150" />
            <el-table-column prop="version" label="版本" width="100" />
            <el-table-column prop="status" label="neutron" width="150">
              <template #default="props">
                <el-tag class="ml-2" type="success" v-if="props.row.neutron_status">激活</el-tag>
                <el-tag class="ml-2" type="success" v-else effect="dark">死了</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="service_plugins" label="service_plugins"  width="300">
              <template #default="props">
                <el-input v-model="props.row.service_plugins" placeholder="Please input" />
              </template>
            </el-table-column>
            <el-table-column prop="conf" label="plugin_conf">
              <template #default="props">
                <el-input v-model="props.row.conf" placeholder="Please input" 
                  :rows="10"
                  type="textarea" />
              </template>
            </el-table-column>
          </el-table>
          <el-button size="small" @click="saveAndRestart" type="danger" style="margin: 5px;" :loading="restartingNeutronServer">全部保存并重启neutron-server</el-button>
        </div>
      </div>
      <div class="button">
        <el-button @click="decreaseSteps" type="primary" :disabled="activeSteps == 1">上一步</el-button>
        <el-button @click="increaseSteps" type="primary" :disabled="activeSteps == maxSteps">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getActiveNodeApi, changePluginApi, getConfigsApi, saveServicePluginsApi, saveMl2ConfApi, restartNeutronServerApi } from '../api';

export default {
  name: "plugin",
  methods: {
    async getConfigs(){
        this.configData = [];
        const activeNodes = [];
        for (let index = 0; index < this.nodesToInstall.length; index++) {
            const element = this.nodesToInstall[index];
            if (element.status === "alive"){
                activeNodes.push(element.ip)
            }
        }
        if (activeNodes.length === 0){
            return false
        }
        const res = await getConfigsApi({"ips": activeNodes});
        this.configData = res.data.resp;
        return true
    },
    async changePlugin(){
        this.changingPlugin = true;
        const activeNodes = [];
        for (let index = 0; index < this.nodesToInstall.length; index++) {
            const element = this.nodesToInstall[index];
            if (element.status === "alive"){
                activeNodes.push(element.ip)
            }
        }
        if (activeNodes.length ===0){
            this.changingPlugin = false;
            this.$message.error("需要至少指定一个需要安装的云平台")
            return
        }
        const res = await changePluginApi({"ips": activeNodes, "plugin": this.uploadedFileName[0].name})
        for (let index = 0; index < res.data.results.length; index++) {
            const element = res.data.results[index];
            for(let nodeindex = 0; nodeindex < this.nodesToInstall.length; nodeindex++){
                if (element.ip === this.nodesToInstall[nodeindex].ip && element.status === "ok"){
                    this.nodesToInstall[nodeindex]['installed'] = true;
                }
            }
        }
        this.changingPlugin = false;
    },
    async getActiveNodes(){
        this.allPlatforms = [];
        const res = await getActiveNodeApi()
        if (res.status !== 200){
            this.$message.error("获取节点状态失败")
            return
        }
        const nodes = res.data.nodes
        for (let index = 0; index < nodes.length; index++) {
            const element = nodes[index];
            if (element.status === "dead"){
                continue
            }
            this.allPlatforms.push({"key": element.ip, "label": element.ip+"("+ element.version + ")"}) 
        }
    },
    async prepareNodesToInstallPlugin(){
        this.nodesToInstall = [];
        const res = await getActiveNodeApi()
        if (res.status !== 200){
            this.$message.error("获取节点状态失败")
            return
        }
        this.nodesToInstall = res.data.nodes
        for (let index = 0; index < this.nodesToInstall.length; index++) {
            this.nodesToInstall[index]['installed'] = false;
        }
    },
    handleUploadSuccess(file){
        this.uploadedFileName = [];
        this.uploadedFileName.push({'name': file.data.plugin});
        this.$message.success('上传成功');
        this.pluginUploaded = true;
    },
    handleUploadError(){
        this.$message.error('上传失败');
        this.pluginUploaded = false;
    },
    handleVerified(index){
      this.configData[index].verified = true;
    },
    increaseSteps() {
      if (this.activeSteps === this.maxSteps) {
        return;
      }
      if (this.choosedPlatforms.length === 0 && this.activeSteps === 2 ) {
        this.$message.error("请选择要替换插件的云平台");
        return;
      }
      if (this.activeSteps === 1){
          if (!this.pluginUploaded){
              this.$message.error("请先上传插件");
              return
          }
          this.getActiveNodes()
      }
      if (this.activeSteps===2){
          this.prepareNodesToInstallPlugin()
      }
      if (this.activeSteps === 3){
          const flag = this.getConfigs();
          if (!flag){
            this.$message.error("无可用节点。")
          }
      }
      this.activeSteps = this.activeSteps + 1;
    },
    refresh(){
        this.getActiveNodes()
        this.getConfigs();
    },
    async saveAndRestart(){
        this.restartingNeutronServer = true;
        let service_plugins_body = {};
        let service_plugins_list = [];
        let ml2_conf_body = {};
        let ml2_conf_list = [];
        let restartList = [];
        let restartBody = {};
        if (this.configData.length === 0){
            this.restartingNeutronServer = false;
            return
        }
        for (let index = 0; index < this.configData.length; index++) {
            const element = this.configData[index];
            service_plugins_list.push({'ip': element.ip, 'plugins': element.service_plugins});
            ml2_conf_list.push({'ip': element.ip, 'conf': element.conf})
            restartList.push(element.ip);
        }
        service_plugins_body['plugins'] = service_plugins_list
        ml2_conf_body['confs'] = ml2_conf_list
        const service_plugins_res = await saveServicePluginsApi(service_plugins_body)
        if (service_plugins_res.status !== 'ok' ){
            this.$message.error("保存service_plugins失败");
            this.restartingNeutronServer = false;
            return
        }
        const ml2_res = await saveMl2ConfApi(ml2_conf_body)
        if (ml2_res.status !== 'ok' ){
            this.$message.error("保存ml2 conf失败")
            this.restartingNeutronServer = false;
            return
        }
        restartBody['ips'] = restartList
        await restartNeutronServerApi(restartBody)
        this.getConfigs()
        this.restartingNeutronServer = false;
    },
    decreaseSteps() {
      if (this.activeSteps === 1) {
        return;
      }
      this.activeSteps = this.activeSteps - 1;
    },
    beforePluginUpload(rawFile) {
      const splited = rawFile.name.split(".")
      let ext = splited[splited.length-1]
      if (ext !== 'egg') {
        this.$message.error("请选择正确的插件!");
        return false
      }
      return true
}
  },
  data() {
    return {
      restartingNeutronServer: false,
      changingPlugin: false,
      pluginUploaded: false,
      actionUrl: "http://99.0.85.123:8080/openstack/upload",
      token: localStorage.getItem('token'),
      uploadVisible: true,
      uploadedFileName: [],
      allPlatforms: [{ "key": "99.0.85.14", label: "99.0.85.14" }, { "key": "99.0.85.15", label: "99.0.85.15" }],
      nodesToInstall: [],
      choosedPlatforms: [],
      activeSteps: 1,
      maxSteps: 4,
      configData:[
        {"ip": "99.0.85.13", "version": "pike","status":true, "service_plugins":"router,bgp,trunk", "conf": "[Conf]\nurl=123.456.789\npassword=123456\nusername=admin\nurl=123.456.789\npassword=123456\nusername=admin"},
      ],
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
