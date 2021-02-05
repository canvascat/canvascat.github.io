<template>
  <el-form :inline="true"
    size="mini">
    <el-form-item label="马赛克大小">
      <el-input-number v-model="mosaicSize"
        @change="mosaicSizeChange"
        :min="4"
        :max="8"></el-input-number>
    </el-form-item>
    <el-form-item label="笔刷宽度">
      <el-input-number v-model="brushWidth"
        :min="30"
        :step="10"
        :max="100"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
        @click="openFile">选择图片</el-button>
      <el-button type="primary"
        @click="downloadImage">下载图片</el-button>
    </el-form-item>
  </el-form>

  <div class="canvas-wrapper">
    <canvas ref="canvasRef"
      width="400"
      height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ref, defineComponent, onMounted, onBeforeUnmount, watch } from 'vue'
import Mosaic, { loadLocalImage, MosaicOptions, download } from '@/util/mosaic'

export default defineComponent({
  name: 'CanavsMosaic',
  setup() {
    const brushWidth = ref(30)
    const mosaicSize = ref(6)
    const canvasRef = ref(null as null | HTMLCanvasElement)
    const mosaic = ref(null as null | Mosaic)

    function openFile() {
      loadLocalImage().then(file => {
        mosaic.value?.init(file)
      })
    }
    function mosaicSizeChange(val: number) {
      if (mosaic.value) mosaic.value.mosaicSize = val
    }
    function downloadImage() {
      if (mosaic.value?.inited) {
        download(canvasRef.value as HTMLCanvasElement)
        ElMessage.info('文件已开始下载')
      } else {
        ElMessage.info('请选择图片')
      }
    }
    onMounted(() => {
      const options: MosaicOptions = Object.create(null)
      options.brushWidth = brushWidth.value
      options.mosaicSize = mosaicSize.value
      mosaic.value = new Mosaic(canvasRef.value as HTMLCanvasElement, options)
    })
    onBeforeUnmount(() => {
      if (mosaic.value) mosaic.value.destroy()
    })
    watch(brushWidth, (val: number) => {
      if (mosaic.value) mosaic.value.brushWidth = val
    })
    return {
      mosaicSizeChange,
      openFile,
      downloadImage,

      mosaicSize,
      brushWidth,
      canvasRef
    }
  }
})
</script>

<style lang="stylus">
.canvas-wrapper {
  overflow: auto;
}
</style>
