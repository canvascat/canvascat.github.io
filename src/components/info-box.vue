<template>
  <div class="capture-info__wrap" :style="style">
    <div class="capture-info__view">
      <canvas ref="canvasRef" width="120" height="88"></canvas>
      <svg viewBox="0 0 120 88" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path d="M 0 1 H 119 V87 H1 V1" stroke="red" stroke-width="2" />
        <path d="M 0 44 H 119" stroke="red" stroke-width="2" />
        <path d="M 60 0 V 88" stroke="red" stroke-width="2" />
      </svg>
    </div>
    <div class="capture-info__p">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
// import { isEmpty } from "lodash";
import { rafThrottle } from "@/util/util";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";

const OFFSET = { X: 10, Y: 10 }
const ZOOM_FACTOR = 4
const [DW, DH] = [120, 88]
const [SW, SH] = [DW / ZOOM_FACTOR, DH / ZOOM_FACTOR]

type Point = {
  x: number,
  y: number
}

export default defineComponent({
  props: {
    mousePoint: {
      type: Object as PropType<Nullable<Point>>,
      required: true
    },
    canvas: {
      type: Object as PropType<Nullable<HTMLCanvasElement>>,
      required: true
    }
  },

  setup (props) {
    // const visible = computed(() => !isEmpty(props.mousePoint))
    const { mousePoint, canvas } = toRefs(props)
    const canvasRef = ref(<Nullable<HTMLCanvasElement>>null)
    const style = computed(() => {
      const style = <{[key: string]: string}>{}
      if (mousePoint.value) {
        const { x, y } = mousePoint.value
        style.left = `${x + OFFSET.X}px`
        style.top = `${y + OFFSET.Y}px`
      }
      return style
    })
    // requestAnimationFrame
    watch(mousePoint, rafThrottle((point: Nullable<Point>) => {
      if (!point || !canvas.value || !canvasRef.value) return;
      // const ctx0 = <CanvasRenderingContext2D>canvas.value.getContext('2d')
      const ctx = <CanvasRenderingContext2D>canvasRef.value.getContext('2d')
      ctx.drawImage(canvas.value, point.x - SW / 2, point.y - SH / 2, SW, SH, 0, 0, DW, DH)
      // ctx.drawImage(canvas.value, point.x - SW / 2, point.y - SH / 2, SW, SH, 0, 0, SW, SH)
    }))
    document.body.style
    return {
      canvasRef,

      // visible,
      style
    }
  }
})
</script>

<style lang="scss" scoped>
.capture-info__wrap {
  width: 120px;
  height: 120px;
  // position: fixed;
  outline: 1px solid #000;
  position: absolute;
  z-index: 1;
}
.capture-info__view {
  // border: 2px solid #fff;
  height: 88px;
  box-sizing: border-box;
  position: relative;
  > canvas {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  > svg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.capture-info__p {
  height: 32px;
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  background-color: rgba($color: #000, $alpha: 0.8);
}
</style>