<template>
  <el-row justify="end">
    <el-col v-for="(o, index) in 4" :key="o" :span="8">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
            <el-button class="button" text>Operation button</el-button>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
      </el-card>
    </el-col>
  </el-row>


</template>

<script>
export default {
  name: "network",
  data() {
    return {
    }
  }
}
</script>

<style>

.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 10px;
  margin:10px;
}

</style>

