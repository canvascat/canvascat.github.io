<template>
  <el-form :inline="true"
    size="mini">
    <el-form-item>
      <el-tooltip content="选择图片后会进入全屏操作">
        <el-button type="primary"
          @click="openFile">选择图片</el-button>
      </el-tooltip>
      <el-button type="primary"
        @click="downloadImage">下载图片</el-button>
      <el-button type="primary"
        @click="requestFullscreen">全屏</el-button>
    </el-form-item>
  </el-form>

  <div class="wrapper" ref="wrapRef">
    <canvas ref="canvasRef"
      width="400"
      height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ref, defineComponent, onMounted, onBeforeUnmount, watch } from 'vue'
import { loadLocalImage, drawImageToCanvas, download } from '../util/mosaic'

export default defineComponent({
  name: 'ImageEditor',
  setup() {
    const canvasRef = ref(null as Nullable<HTMLCanvasElement>)
    const wrapRef = ref(null as Nullable<HTMLDivElement>)

    function openFile() {
      loadLocalImage().then(file => {
        const { width, height } = screen
        requestFullscreen()
        drawImageToCanvas(canvasRef.value, file, { width, height })
      })
    }
    function downloadImage() {
      download(canvasRef.value as HTMLCanvasElement)
      ElMessage.info('文件已开始下载')
    }
    function requestFullscreen() {
      wrapRef.value?.requestFullscreen()
      // const { width, height } = screen
      // Object.assign(canvasRef.value, { width, height })
      // console
    }
    function handleFullscreenchange(e: Event) {
      (e.target as HTMLDivElement).classList[document.fullscreenElement ? 'add' : 'remove']('fullscreen')
    }
    onMounted(() => {
      wrapRef.value?.addEventListener('fullscreenchange', handleFullscreenchange)
    })
    onBeforeUnmount(() => {
      wrapRef.value?.removeEventListener('fullscreenchange', handleFullscreenchange)
    })
    return {
      openFile,
      downloadImage,
      requestFullscreen,

      canvasRef,
      wrapRef
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  overflow: auto;
  display: none;
  &:fullscreen {
    display: block;
    background-color: #fff;
    overflow: hidden;
  }
}
</style>
