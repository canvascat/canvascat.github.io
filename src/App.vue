<template>
  <el-container>
    <el-header>
      <h1>vue demos</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router
          default-active="/ImageEditor">
          <el-menu-item index="/ImageEditor">
            <i class="el-icon-menu"></i>
            <template #title>ImageEditor</template>
          </el-menu-item>
          <el-menu-item index="/HelloWorld">
            <i class="el-icon-document"></i>
            <template #title>HelloWorld</template>
          </el-menu-item>
          <el-menu-item index="/CanvasMosaic">
            <i class="el-icon-setting"></i>
            <template #title>CanvasMosaic</template>
          </el-menu-item>
        </el-menu>
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

<style lang="scss" scoped>
.el-header {
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
}
.el-aside {
  // border-right: 1px solid #dcdfe6;
  // display: flex;
}
.el-menu {
  height: 100%;
  user-select: none;
}
h1 {
  margin: 0;
}
</style>