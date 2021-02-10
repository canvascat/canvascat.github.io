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
      <el-button @click="screenShot">截图</el-button>
    </el-form-item>
  </el-form>

  <div class="wrapper" ref="wrapRef" @mousedown.once="startCapture">
    <img src="../assets/img/test.png" alt="" style="display: none;">
    <canvas ref="canvasRef"
      width="400"
      height="400"></canvas>
    <div class="capture-layer" :style="captureLayerStyle" @mousedown="startMove">
      <i v-for="p in RESIZE_POINTS"
        @mousedown.prevent="startResize($event, p)"
        :key="p.position.join()"
        :style="p.position.reduce((o, p) => Object.assign(o, { [p]: '-3px' }), { cursor: p.cursor })"
        class="resize-point"/>
    </div>
    <info-box :mousePoint="mousePoint" :canvas="canvasRef" v-if="infoBoxVisible">
      <p>{{captureLayer.w}} x {{captureLayer.h}}</p>
      <p>RGB({{RGB}})</p>
    </info-box>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { ref, defineComponent, onMounted, onBeforeUnmount, watch, reactive, computed } from 'vue'
import InfoBox from './info-box.vue';
import { loadLocalImage, drawImageToCanvas, download, drawCanvas, darwScreen } from '@/util/mosaic'
import { createCSSRule, createStyleSheet } from '@/util/dom'
import { rafThrottle } from '@/util/util';
import { bound } from './config';

type Point = {
  x: number,
  y: number
}
type CaptureLayer = {
  x: number,
  y: number,
  w: number,
  h: number
}

type CaptureActionType = 'CREATE' | 'MOVE' | 'RESIZE'

type ResizePointPosition = 'top' | 'right' | 'bottom' | 'left'
type ResizePoint = {
  position: Array<ResizePointPosition>,
  cursor: 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize'
}

const RESIZE_POINTS: Array<ResizePoint> = [
  { position: ['top'], cursor: 'ns-resize' },
  { position: ['bottom'], cursor: 'ns-resize' },
  { position: ['left'], cursor: 'ew-resize' },
  { position: ['right'], cursor: 'ew-resize' },
  { position: ['top', 'left'], cursor: 'nwse-resize' },
  { position: ['bottom', 'right'], cursor: 'nwse-resize' },
  { position: ['top', 'right'], cursor: 'nesw-resize' },
  { position: ['bottom', 'left'], cursor: 'nesw-resize' }
]

export default defineComponent({
  name: 'ImageEditor',

  components: {
    InfoBox
  },

  setup() {
    const canvasRef = ref(null as Nullable<HTMLCanvasElement>)
    const wrapRef = ref(null as Nullable<HTMLDivElement>)
    const captureLayer: CaptureLayer = reactive({ x: 0, y: 0, h: 0, w: 0 })
    const action = ref(<Nullable<CaptureActionType>>null)
    let cursorDownPoint: Nullable<Point> = null
    const mousePoint = ref(<Nullable<Point>>null)
    const RGB = ref('0, 0, 0')
    let cloneCaptureLayer = cloneDeep(captureLayer)
    let resizeMode: Array<ResizePointPosition> = []
    let stylesheet: Nullable<HTMLStyleElement> = null;
    const infoBoxVisible = computed(() => action.value && ['CREATE', 'RESIZE'].includes(action.value))

    // CSSStyleDeclaration
    const captureLayerStyle = computed(() => {
      const { x, y, h, w } = captureLayer;
      const [left, top, height, width] = [x, y, h, w].map(n => `${n}px`);
      const style = { left, top, height, width };
      return style
    })

    const ctx = computed(() => canvasRef.value?.getContext('2d'))

    watch(mousePoint, rafThrottle((point: Point) => {
      if (!ctx.value || !point) return
      const { data } = ctx.value.getImageData(point.x, point.y, 1, 1)
      RGB.value = data.slice(0, 3).join(', ')
    }))

    function openFile() {
      loadLocalImage().then(file => {
        const { width, height } = screen
        drawImageToCanvas(canvasRef.value, file, { width, height })
        requestFullscreen()
      })
    }
    function downloadImage() {
      download(canvasRef.value as HTMLCanvasElement)
      ElMessage.info('文件已开始下载')
    }
    function requestFullscreen() {
      if (!canvasRef.value) return
      drawCanvas(canvasRef.value, (wrapRef.value as HTMLDivElement).querySelector('img') as HTMLImageElement)
      wrapRef.value!.requestFullscreen()
      const { width, height } = canvasRef.value
      bound.x.max = width
      bound.y.max = height
    }
    function handleFullscreenchange(e: Event) {
      (e.target as HTMLDivElement).classList[document.fullscreenElement ? 'add' : 'remove']('fullscreen')
    }
    function screenShot () {
      if (!canvasRef.value) return
      darwScreen(canvasRef.value).then(() => {
        wrapRef.value?.requestFullscreen()
      }, console.warn)
    }

    function startCapture(e: MouseEvent) {
      const { x, y } = e
      Object.assign(captureLayer, { x, y })
      action.value = 'CREATE'
      createCSSRule('*', `cursor: crosshair !important;`, (stylesheet = createStyleSheet()));
      startAction(e)
    }

    function startMove (e: MouseEvent) {
      action.value = 'MOVE'
      createCSSRule('*', `cursor: move !important;`, (stylesheet = createStyleSheet()));
      startAction(e)
    }

    function startResize (e: MouseEvent, { position, cursor}: ResizePoint) {
      action.value = 'RESIZE'
      resizeMode = position
      createCSSRule('*', `cursor: ${cursor} !important;`, (stylesheet = createStyleSheet()));
      startAction(e)
    }

    function startAction (e: MouseEvent) {
      cloneCaptureLayer = cloneDeep(captureLayer)
      e.stopImmediatePropagation()
      const { x, y } = e
      cursorDownPoint = { x, y }
      mousePoint.value = { x, y }
      document.addEventListener('mousemove', onMousemoveDocument)
      document.addEventListener('mouseup', onMouseupDocument)
      document.onselectstart = () => false;
    }

    function onMousemoveDocument(e: MouseEvent) {
      if (!cursorDownPoint || !action.value) return;
      const { x: x0, y: y0 } = cursorDownPoint;
      const { x: x1, y: y1 } = e;
      const [dx, dy] = [x1 - x0, y1 - y0]
      mousePoint.value = { x: x1, y: y1 }
      switch (action.value) {
        case 'CREATE':
          captureLayer.w = Math.abs(dx)
          captureLayer.h = Math.abs(dy)
          captureLayer.x = Math.min(x0, x1)
          captureLayer.y = Math.min(y0, y1)          
          break;
        case 'MOVE': {
          const { x: x2, y: y2 } = cloneCaptureLayer
          const { h, w } = captureLayer
          captureLayer.x = Math.min(Math.max(x2 + dx, bound.x.min), bound.x.max - w)
          captureLayer.y = Math.min(Math.max(y2 + dy, bound.y.min), bound.y.max - h)
          break;
        }
        case 'RESIZE': {
          const { h: h2, y: y2, w: w2, x: x2 } = cloneCaptureLayer
          if (resizeMode.includes('top')) {
            captureLayer.y = Math.min(y1, y2 + h2)
            captureLayer.h = Math.abs(y2 - y1 + h2)
          } else if (resizeMode.includes('bottom')) {
            captureLayer.y = Math.min(y1, y2)
            captureLayer.h = Math.abs(y1 - y2)
          }
          if (resizeMode.includes('left')) {
            captureLayer.x = Math.min(x1, x2 + w2)
            captureLayer.w = Math.abs(x2 - x1 + w2)
          } else if (resizeMode.includes('right')){
            captureLayer.x = Math.min(x1, x2)
            captureLayer.w = Math.abs(x1 - x2)
          }
        }
        default:
          break;
      }
    }
    function onMouseupDocument(e: MouseEvent) {
      cursorDownPoint = null;
      document.onselectstart = null
      action.value = null
      stylesheet?.parentNode?.removeChild(stylesheet)
      document.removeEventListener('mousemove', onMousemoveDocument)
      document.removeEventListener('mouseup', onMouseupDocument)
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
      screenShot,
      startCapture,
      startMove,
      startResize,

      captureLayerStyle,
      mousePoint,
      RESIZE_POINTS,
      RGB,
      captureLayer,
      infoBoxVisible,

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
  position: relative;
  &:fullscreen {
    display: block;
    background-color: #fff;
    overflow: hidden;
    cursor: crosshair;
  }
}
.capture-layer {
  position: absolute;
  box-shadow: 0 0 0 9999px rgba($color: #000, $alpha: 0.4);
  z-index: 1;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid skyblue;
}
.resize-point {
  position: absolute;
  width: 7px;
  height: 7px;
  background-color: skyblue;
}
</style>
