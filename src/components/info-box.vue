<template>
  <div class="capture-info__wrap">
    <div class="capture-info__view">
      <canvas width="100%" height="100%"></canvas>
      <svg viewBox="0 0 120 88" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path d="M 0 1 H 119 V87 H1 V1" stroke="red" stroke-width="2" />
        <path d="M 0 44 H 119" stroke="red" stroke-width="2" />
        <path d="M 60 0 V 88" stroke="red" stroke-width="2" />
      </svg>
    </div>
    <div class="capture-info__p">
      <p></p>
      <p></p>
    </div>
  </div>
</template>

<script lang="ts">import { defineComponent } from "vue";

export default defineComponent({
  props: {
    // mousePonit: Object
  }
})
</script>

<style lang="scss" scoped>
.capture-info__wrap {
  width: 120px;
  height: 120px;
  position: fixed;
  outline: 1px solid #000;
}
.capture-info__view {
  // border: 2px solid #fff;
  height: 88px;
  box-sizing: border-box;
  position: relative;
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