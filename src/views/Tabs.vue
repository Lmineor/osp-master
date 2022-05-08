<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 配置选项卡</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button slot="reference">重新加载配置</el-button>
            <div class="table_area">
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="version" label="版本" width="100"></el-table-column>
                    <el-table-column prop="url" label="url" width="150"></el-table-column>
                    <el-table-column prop="name" label="云平台用户名" width="150"></el-table-column>
                    <el-table-column prop="password" label="云平台密码" width="150"></el-table-column>
                    <el-table-column prop="domain" label="租户" width="120"></el-table-column>
                    <el-table-column prop="controller_username" label="后台用户名" width="150"></el-table-column>
                    <el-table-column prop="controller_password" label="后台密码" width="120"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click.prevent="handleDelete(scope.$index)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-button class="mt-4" style="width: 100%" @click="onAddItem"
                    >新增配置</el-button
                > -->
            </div>
            
            <div class="input_area">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="新增配置" name="1">
                        <el-form :inline="false" :model="config" class="form-inline" label-width="200px" label-position="left">
                        <el-form-item label="OpenStack版本">
                            <el-select v-model="config.version" placeholder="pike" class="label_input">
                            <el-option label="pike" value="pike"></el-option>
                            <el-option label="train" value="train"></el-option>
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
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">新增</el-button>
                        </el-form-item>
                    </el-form>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
import { getConfigedOpenstacks, saveOpenStacksConfig } from "../api/index";
import { ElNotification } from 'element-plus'

export default {
    name: "tabs",
    created() {
        getConfigedOpenstacks()
    },
    methods: {
        successNotify(message){
            ElNotification({
                title: "成功",
                message: message,
                type: "success",
            })
        },
        failNotify(message){
            ElNotification({
                title: "失败",
                message: message,
                type: "error",
            })
        },
        handleDelete(index){
            this.tableData.splice(index, 1);
            saveOpenStacksConfig(this.tableData);
            this.successNotify("ddddd")
        },
        onSubmit() {
            this.tableData.push(this.config);
            saveOpenStacksConfig(this.tableData);
            this.resetConfig();
            getConfigedOpenstacks();
            this.failNotify("e3eeee");
        },
        resetConfig(){
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
.container{
    height: 100%vh !important;
}
.label_input{
    width: 200px;
}
.table_area{
    margin-top: 15px;;
}
</style>

