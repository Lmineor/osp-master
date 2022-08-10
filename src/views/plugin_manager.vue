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
          <el-upload class="upload-demo" drag action="http://jsonplaceholder.typicode.com/api/posts/"
            :limit="1"
            :auto-upload="true"
            :before-upload="beforePluginUpload"
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
        <div class="choosePlatform">
          <el-transfer v-model="choosedPlatforms" :titles="['可选的云平台', '已选的云平台']" :data="allPlatforms" />
        </div>
      </div>
      <div v-if="activeSteps === 3">
        <div class="restart">
          <span>你已选择云平台为 </span>
          <el-tag class="show_tag" type="success" v-for=" platform in choosedPlatforms" effect="dark">{{ platform }}
          </el-tag>
        </div>
      </div>
      <div v-if="activeSteps === 4">
        <div class="config">
          <h4>请确认好配置项并保存</h4>
          <el-button size="small" @click="" type="danger" style="margin: 5px;">全部保存并重启neutron-server</el-button>
          <el-table
            :data="configData"
          >
            <el-table-column prop="ip" label="ip" width="180" />
            <el-table-column prop="version" label="版本" width="180" />
            <el-table-column prop="status" label="neutron-server状态" width="150">
              <template #default="props">
                <el-tag class="ml-2" type="success" v-if="props.row.status">激活</el-tag>
                <el-tag class="ml-2" type="success" v-else effect="dark">死了</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="service_plugins" label="service_plugins">
              <template #default="props">
                <el-input v-model="props.row.service_plugins" placeholder="Please input" />
              </template>
            </el-table-column>
            <el-table-column prop="plugin_conf" label="plugin_conf">
              <template #default="props">
                <el-input v-model="props.row.plugin_conf" placeholder="Please input" 
                  :rows="10"
                  type="textarea" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
            <template #default="scope, props">
              <el-button size="small" @click="handleVerified(scope.$index)" type="primary"
                >保存</el-button
              >
               <el-button size="small" @click="handleVerified(scope.$index)" type="success"
                >重启neutron-server</el-button
              >
            </template>
          </el-table-column>
          </el-table>
          <h4>请确认好配置项并保存</h4>
          <el-button size="small" @click="" type="danger" style="margin: 5px;">全部保存并重启neutron-server</el-button>
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


export default {
  name: "plugin",
  methods: {
    handleVerified(index){
      console.log(index);
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
      this.activeSteps = this.activeSteps + 1;
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
      uploadVisible: true,
      allPlatforms: [{ "key": "99.0.85.13", label: "99.0.85.13" }, { "key": "99.0.85.14", label: "99.0.85.14" }, { "key": "99.0.85.15", label: "99.0.85.15" }],
      choosedPlatforms: [],
      activeSteps: 3,
      maxSteps: 4,
      configData:[
        {"ip": "99.0.85.13", "version": "pike","status":true, "service_plugins":"router,bgp,trunk", "plugin_conf": "[Conf]\nurl=123.456.789\npassword=123456\nusername=admin\nurl=123.456.789\npassword=123456\nusername=admin"},
        {"ip": "99.0.85.14", "version": "train","status":true, "service_plugins":"router,bgp,trunk", "plugin_conf": "[Conf]\nurl=123.456.789\npassword=123456\nusername=admin\nurl=123.456.789\npassword=123456\nusername=admin"},
        {"ip": "99.0.85.13", "version": "pike","status":true,"service_plugins":"router,bgp,trunk", "plugin_conf": "[Conf]\nurl=123.456.789\npassword=123456\nusername=admin\nurl=123.456.789\npassword=123456\nusername=admin"},
        {"ip": "99.0.85.13", "version": "pike","status":true, "service_plugins":"router,bgp,trunk", "plugin_conf": "[Conf]\nurl=123.456.789\npassword=123456\nusername=admin\nurl=123.456.789\npassword=123456\nusername=admin"},
        {"ip": "99.0.85.13", "version": "pike","status":false,"service_plugins":"router,bgp,trunk", "plugin_conf": "[Conf]\nurl=123.456.789\npassword=123456\nusername=admin\nurl=123.456.789\npassword=123456\nusername=admin"},
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

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

