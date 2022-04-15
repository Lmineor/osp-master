<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 二层资源
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-card class="box-card">
                <div class="title">
                    <span class="resourcename">网络</span>
                    <el-button type="primary" class="action">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in items">
                    <span class="tag-group_title"><i class="el-icon-s-promotion"></i></span>
                    <span class="tag-group_title">{{item.version}}({{item.platform}})</span>
                    <el-tag class="tag" v-if="item.resource.create == true" color="#00DD00">CREATE</el-tag>
                    <el-tag class="tag" v-else color="red">CREATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.update == true" color="#00DD00">UPDATE</el-tag>
                    <el-tag class="tag" v-else color="red">UPDATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.get == true" color="#00DD00">GET</el-tag>
                    <el-tag class="tag" v-else color="red">GET</el-tag>
                    <el-tag class="tag" v-if="item.resource.delete == true" color="#00DD00">DELETE</el-tag>
                    <el-tag class="tag" v-else color="red">DELETE</el-tag>
                    <el-divider></el-divider>
                </div>
            </el-card>
            <el-card class="box-card">
                <div class="title">
                    <span class="resourcename">子网</span>
                    <el-button type="primary" class="action">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in items">
                    <span class="tag-group_title"><i class="el-icon-s-promotion"></i></span>
                    <span class="tag-group_title">{{item.version}}({{item.platform}})</span>
                    <el-tag class="tag" v-if="item.resource.create == true" color="#00DD00">CREATE</el-tag>
                    <el-tag class="tag" v-else color="red">CREATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.update == true" color="#00DD00">UPDATE</el-tag>
                    <el-tag class="tag" v-else color="red">UPDATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.get == true" color="#00DD00">GET</el-tag>
                    <el-tag class="tag" v-else color="red">GET</el-tag>
                    <el-tag class="tag" v-if="item.resource.delete == true" color="#00DD00">DELETE</el-tag>
                    <el-tag class="tag" v-else color="red">DELETE</el-tag>
                    <el-divider></el-divider>
                </div>
            </el-card>
            <el-card class="box-card">
                <div class="title">
                    <span class="resourcename">端口</span>
                    <el-button type="primary" class="action">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in items">
                    <span class="tag-group_title"><i class="el-icon-s-promotion"></i></span>
                    <span class="tag-group_title">{{item.version}}({{item.platform}})</span>
                    <el-tag class="tag" v-if="item.resource.create == true" color="#00DD00">CREATE</el-tag>
                    <el-tag class="tag" v-else color="red">CREATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.update == true" color="#00DD00">UPDATE</el-tag>
                    <el-tag class="tag" v-else color="red">UPDATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.get == true" color="#00DD00">GET</el-tag>
                    <el-tag class="tag" v-else color="red">GET</el-tag>
                    <el-tag class="tag" v-if="item.resource.delete == true" color="#00DD00">DELETE</el-tag>
                    <el-tag class="tag" v-else color="red">DELETE</el-tag>
                    <el-divider></el-divider>
                </div>
            </el-card>
            <el-card class="box-card">
                <div class="title">
                    <span class="resourcename">路由</span>
                    <el-button type="primary" class="action">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in items">
                    <span class="tag-group_title"><i class="el-icon-s-promotion"></i></span>
                    <span class="tag-group_title">{{item.version}}({{item.platform}})</span>
                    <el-tag class="tag" v-if="item.resource.create == true" color="#00DD00">CREATE</el-tag>
                    <el-tag class="tag" v-else color="red">CREATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.update == true" color="#00DD00">UPDATE</el-tag>
                    <el-tag class="tag" v-else color="red">UPDATE</el-tag>
                    <el-tag class="tag" v-if="item.resource.get == true" color="#00DD00">GET</el-tag>
                    <el-tag class="tag" v-else color="red">GET</el-tag>
                    <el-tag class="tag" v-if="item.resource.delete == true" color="#00DD00">DELETE</el-tag>
                    <el-tag class="tag" v-else color="red">DELETE</el-tag>
                    <el-divider></el-divider>
                </div>
            </el-card>
        </div>

        
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";

export default {
    data() {
        return  {
            items: [
                {
                    "version": "pike",
                    'platform': '99.0.85.13',
                    'resource': {'create': true, 'update': true, 'delete': false, 'get': false},
                },
                {
                    "version": "pike",
                    'platform': '99.0.85.14',
                    'resource': {'create': false, 'update': true, 'delete': false, 'get': false},
                },
                {
                    "version": "pike",
                    'platform': '99.0.85.15',
                    'resource': {'create': true, 'update': true, 'delete': false, 'get': false},
                },
            ],
        }
        // return {
            // items: [
            //   { type: '', label: '标签一' },
            //   { type: 'success', label: '标签二' },
            //   { type: 'info', label: '标签三' },
            //   { type: 'danger', label: '标签四' },
            //   { type: 'warning', label: '标签五' }
            // ]
    //   }
    }
};
</script>

<style type="text/css"> 
.resourcename{
   width:250px; 
   height:25px;
   font-size: 30px;
   color:#333;
   margin-right: 5px;
}

.action{
    float: right;
}

.title{
    bottom: 0;
}
.box-card{
    margin: 10px;
}
.tag-group_title{
    padding-top: 30px;
    margin-right: 30px;
    margin-bottom: 0px;
    font-weight: bold;
}

.tag{
    margin-right:50px;
    margin-top: 10px;
    font-weight: bold;
    color: white;
    float: right;
}
</style>
