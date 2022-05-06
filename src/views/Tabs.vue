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
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="日期"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="地址">
                    </el-table-column>
                </el-table>
            </div>
            <el-divider></el-divider>
            
            <div class="input_area">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="新增配置" name="1">
                        <el-form :inline="false" :model="config" class="form-inline" label-width="200px" label-position="left">
                        <el-form-item label="OpenStack版本">
                            <el-select v-model="config.name" placeholder="pike" class="label_input">
                            <el-option label="pike" value="pike"></el-option>
                            <el-option label="train" value="train"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="url(只填写ip即可)">
                            <el-input v-model="config.url" placeholder="99.0.85.123" class="label_input"></el-input>
                        </el-form-item>
                        <el-form-item label="登录云平台的用户名(admin)">
                            <el-input v-model="config.openstackUser" placeholder="admin" class="label_input"></el-input>
                        </el-form-item>
                        <el-form-item label="登录云平台密码(123456)">
                            <el-input v-model="config.openstackPassword" placeholder="123456" class="label_input"></el-input>
                        </el-form-item>
                        <el-form-item label="云平台租户(admin)">
                            <el-input v-model="config.openstackScope" placeholder="admin" class="label_input"></el-input>
                        </el-form-item>
                        <el-form-item label="后台用户名(root)">
                            <el-input v-model="config.controllerUser" placeholder="root" class="label_input"></el-input>
                        </el-form-item>
                        <el-form-item label="后台密码(123456)">
                            <el-input v-model="config.controllerPassword" placeholder="123456" class="label_input"></el-input>
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
export default {
    name: "tabs",
    data() {
      return {
        config: {
            name: '',
            url: '',
            openstackUser: '',
            openstackPassword: '',
            openstackScope: '',
            controllerUser: '',
            controllerPassword: '',
        }
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

</style>

