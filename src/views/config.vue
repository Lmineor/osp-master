<template>
  <div class="">
    <el-dialog v-model="dialogFormVisible" title="新增openstack 配置" width="30%">
      <el-form :inline="false" :model="config" class="form-inline" label-width="200px" label-position="left">
        <el-form-item label="OpenStack版本">
          <el-select v-model="config.version" placeholder="pike" class="label_input">
            <el-option label="mitaka" value="mitaka"></el-option>
            <el-option label="newton" value="newton"></el-option>
            <el-option label="ocata" value="ocata"></el-option>
            <el-option label="pike" value="pike"></el-option>
            <el-option label="queens" value="queens"></el-option>
            <el-option label="rocky" value="rocky"></el-option>
            <el-option label="stein" value="stein"></el-option>
            <el-option label="train" value="train"></el-option>
            <el-option label="ussuri" value="ussuri"></el-option>
            <el-option label="victoria" value="victoria"></el-option>
            <el-option label="wallaby" value="wallaby"></el-option>
            <el-option label="xena" value="xena"></el-option>
            <el-option label="yoga" value="yoga"></el-option>
            <el-option label="zed" value="zed"></el-option>Í
          </el-select>
        </el-form-item>
        <el-form-item label="url(只填写ip即可)">
          <el-input v-model="config.url" placeholder="99.0.85.123" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="登录云平台的用户名(admin)">
          <el-input v-model="config.name" placeholder="admin" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="登录云平台密码(123456)">
          <el-input v-model="config.password" placeholder="123456" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="云平台租户(admin)">
          <el-input v-model="config.domain" placeholder="admin" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="后台用户名(root)">
          <el-input v-model="config.controller_username" placeholder="root" class="label_input"></el-input>
        </el-form-item>
        <el-form-item label="后台密码(123456)">
          <el-input v-model="config.controller_password" placeholder="123456" class="label_input"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 配置选项卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-button slot="reference" @click="dialogFormVisible = true" type="primary">新增配置</el-button>
      <el-button slot="reference" @click="reloadConfig" :loading="cfg_reloading" type="warning">重新加载配置</el-button>
      <el-button slot="reference" @click="refresh" :loading="cfg_loading" type="info">刷新</el-button>
      <div class="table_area">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="url" label="IP" width="150"></el-table-column>
          <el-table-column prop="name" label="云平台用户名" width="150"></el-table-column>
          <el-table-column prop="password" label="云平台密码" width="150"></el-table-column>
          <el-table-column prop="domain" label="租户" width="120"></el-table-column>
          <el-table-column prop="controller_username" label="后台用户名" width="150"></el-table-column>
          <el-table-column prop="controller_password" label="后台密码" width="120"></el-table-column>
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getConfigedOpenstacks, saveOpenStacksConfig, reloadCfg } from "../api/index";
import { ElNotification } from 'element-plus'
export default {
  name: "config",
  created() {
    this.loadConfig()
  },
  methods: {
    // 关闭全部标签
    closeAllTags() {
      this.$store.commit("clearTags");
      this.$router.push("/config");
    },
    refresh() {
      this.cfg_loading = true;
      this.loadConfig();
      this.resetConfig();
      this.cfg_loading = false;
    },
    async reloadConfig() {
      this.cfg_reloading = true
      const res = await reloadCfg()
      if (res.status === "ok") {
        this.cfg_reloading = false
        this.$message.success("配置重新加载成功");
      }else{
        this.$message.error("配置加载失败");
      }
      this.cfg_reloading = false
      this.closeAllTags();
    },
    async loadConfig() {
      const result = await getConfigedOpenstacks()
      if (result.openstacks === null) {
        this.resetConfig();
        return
      }
      this.tableData = result.openstacks;
    },
    handleDelete(index) {
      this.tableData.splice(index, 1);
      saveOpenStacksConfig({ "openstacks": this.tableData });
    },
    onSubmit() {
      this.dialogFormVisible=false;
      this.tableData.push(this.config);
      saveOpenStacksConfig({ "openstacks": this.tableData });
      this.resetConfig();
      getConfigedOpenstacks();
      this.$message.success("配置重新保存成功");
    },
    resetConfig() {
      this.config = {
        version: '',
        url: '',
        user: '',
        password: '',
        domain: '',
        controller_username: '',
        controller_password: '',
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      cfg_reloading: false,
      cfg_loading: false,
      config: {
        version: '',
        url: '',
        user: '',
        password: '',
        domain: '',
        controller_username: '',
        controller_password: '',
      },
      tableData: [{
        "version": "pike",
        "url": "99.0.85.123",
        "name": "admin",
        "password": "123456",
        "domain": "admin",
        "controller_username": "admin",
        "controller_password": "123456"
      },
      {
        "version": "train",
        "url": "99.0.85.23",
        "name": "admin",
        "password": "123456",
        "domain": "admin",
        "controller_username": "admin",
        "controller_password": "123456"
      }],
    }
  },
};
</script>

<style>
.container {
  height: 100%vh !important;
}
.label_input{
  width: 100%;
}
.table_area {
  margin-top: 15px;
}
</style>

