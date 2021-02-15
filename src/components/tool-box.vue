<template>
  <div class="capture-info__wrap" :style="style">
    <div class="capture-info__view">
      <canvas ref="canvasRef" :width="DW" :height="DH"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
// import { isEmpty } from "lodash";
import { CaptureLayer } from "@/type";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  toRefs,
} from "vue";
import { bound } from "./config";

const OFFSET = { X: 10, Y: 10 };
const [DW, DH] = [120, 88];

export default defineComponent({
  name: "ToolBox",
  props: {
    captureLayer: {
      type: Object as PropType<CaptureLayer>,
      required: true,
    },
    canvas: {
      type: Object as PropType<Nullable<HTMLCanvasElement>>,
      required: true,
    },
  },

  setup(props) {
    const { captureLayer } = toRefs(props);
    const canvasRef = ref(<Nullable<HTMLCanvasElement>>null);
    const style = computed(() => {
      const style = <{ [key: string]: string }>{};
      const { x, y, w, h } = captureLayer.value;
      const left = x + w > bound.x.max ? x - w : x + OFFSET.X;
      const top = y + h > bound.y.max ? y - h : y + OFFSET.Y;
      style.left = `${left}px`;
      style.top = `${top}px`;
      return style;
    });
    onMounted(() => {});
    onUnmounted(() => {});
    return {
      canvasRef,

      DW,
      DH,

      style,
    };
  },
});
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
  }
  > svg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
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