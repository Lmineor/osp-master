<template>
  <div class="">
    <el-dialog v-model="dialogFormVisible" title="新增/编辑openstack 配置" width="30%">
      <h2>请检查信息</h2>
      <br>
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
          <el-input v-model="config.user" placeholder="admin" class="label_input"></el-input>
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
      <el-button slot="reference" @click="dialogFormVisible = true" type="success">新增配置</el-button>
      <el-button slot="reference" @click="refresh" :loading="cfg_loading" type="primary">刷新</el-button>
      <div class="table_area">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="version" label="版本" width="100"></el-table-column>
          <el-table-column prop="url" label="IP" width="150">
            <template #default="scope">
              <a :href="`http://`+scope.row.url+`/dashboard`" target="_blank">{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="云平台用户名" width="150"></el-table-column>
          <el-table-column prop="password" label="云平台密码" width="150"></el-table-column>
          <el-table-column prop="domain" label="租户" width="120"></el-table-column>
          <el-table-column prop="controller_username" label="后台用户名" width="150"></el-table-column>
          <el-table-column prop="controller_password" label="后台密码" width="120"></el-table-column>
          <el-table-column prop="status" label="节点状态" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.status" class="mx-1" effect="dark" type="success" round >active</el-tag>
              <el-tag v-else class="mx-1" effect="light" type="danger" round >dead</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="要删除吗？" @confirm="handleDelete((scope.$index))">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <!-- <el-button type="info" size="small" @click.prevent="handleEdit(scope.$index)">编辑</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

import { getConfigedOpenstacks, saveOpenStacksConfig,deleteOpenStacksConfig } from "../api/index";

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
    async loadConfig() {
      const result = await getConfigedOpenstacks()
      if (result.openstacks === null) {
        this.resetConfig();
        return
      }
      this.tableData = result.data;
    },
    async handleDelete(index) {
      this.dialogFormVisible=false;
     const res = await deleteOpenStacksConfig({ "id": this.tableData[index].id });
     if (res.status === "ok"){
       this.$message.success("删除成功");
     }else{
       this.$message.error("删除失败");
     }
     this.loadConfig();
     this.$store.commit("clearTags");
     this.dialogFormVisible=false;
    },
    onSubmit() {
      this.dialogFormVisible=false;
      if (this.config.url === ""){
        return;
      }
      saveOpenStacksConfig(this.config);
      this.resetConfig();
      this.loadConfig();
      this.$store.commit("clearTags");
      this.$message.success("配置保存成功");
    },
    resetConfig() {
      this.config = {
        version: '',
        url: '',
        user: 'admin',
        password: '123456',
        domain: 'admin',
        controller_username: 'root',
        controller_password: '123456',
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      cfg_reloading: false,
      cfg_loading: false,
      configData: [],
      config: {
        version: '',
        url: '',
        user: 'admin',
        password: '123456',
        domain: 'admin',
        controller_username: 'root',
        controller_password: '123456',
      },
      tableData: [],
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

