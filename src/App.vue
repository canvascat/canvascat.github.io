<template>
  <el-container>
    <el-header>
      <h1>vue demos</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {}
})
</script>

<style lang="stylus" scoped>
.el-header {
  border-bottom 1px solid #dcdfe6
  display flex
  align-items center
}
.el-aside {
  border-right 1px solid #dcdfe6
}
h1 {
  margin 0
}
</style>