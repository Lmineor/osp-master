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
            <el-card class="box-card" v-loading="network_loading">
                <div class="title">
                    <span class="resourcename">网络</span>
                    <el-button type="primary" class="action" :disabled="network_loading" @click="testVxlanNetwork()">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in network_items">
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
            <el-card class="box-card" v-loading="subnet_loading">
                <div class="title">
                    <span class="resourcename">子网</span>
                    <el-button type="primary" class="action" :disabled="subnet_loading" @click="testSubnet()">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in subnet_items">
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
            <el-card class="box-card" v-loading="port_loading">
                <div class="title">
                    <span class="resourcename">端口</span>
                    <el-button type="primary" class="action" :disabled="port_loading" @click="testPort()">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in port_items">
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
            <el-card class="box-card" v-loading="router_loading">
                <div class="title">
                    <span class="resourcename">路由</span>
                    <el-button type="primary" class="action" :disabled="router_loading" @click="testRouter()">运行</el-button>
                </div>
                <el-divider></el-divider>
                <div class="tag-group" v-for="item in router_items">
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
import { runVxlanNetwork,runSubnet,runPort,runRouter } from "../api/index";

export default {
    methods: {
	async testVxlanNetwork(){
	   this.network_loading = true
           const result = await runVxlanNetwork()
	   this.network_loading = false
	   this.network_items = result.flag.flags
	},
	async testSubnet(){
           this.subnet_loading = true
           const result = await runSubnet()
           this.subnet_loading = false
           this.subnet_items = result.flag.flags
        },
        async testPort(){
           this.port_loading = true
           const result = await runPort()
           this.port_loading = false
           this.port_items = result.flag.flags
        },
	async testRouter(){
           this.router_loading = true
           const result = await runRouter()
           this.router_loading = false
           this.router_items = result.flag.flags
        }
    },
    data() {
        return  {
	    resultItems: '',
	    network_loading: false,
	    subnet_loading: false,
	    port_loading: false,
	    router_loading: false,
	    subnet_items: [],
	    port_items: [],
	    router_items: [],
	    network_items: [],
            //network_items: [
            //    {
            //        "version": "pike",
            //        'platform': '99.0.85.13',
            //        'resource': {'create': true, 'update': true, 'delete': false, 'get': false},
            //    },
            //    {
            //        "version": "pike",
            //        'platform': '99.0.85.14',
            //        'resource': {'create': false, 'update': true, 'delete': false, 'get': false},
            //    },
            //    {
            //        "version": "pike",
            //        'platform': '99.0.85.15',
            //        'resource': {'create': true, 'update': true, 'delete': false, 'get': false},
            //    },
            //],
        }
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
