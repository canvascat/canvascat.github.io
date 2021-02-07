declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module '*.md' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare type Nullable<T> = T | null

/**
 * 类型“MediaDevices”上不存在属性“getDisplayMedia”。
 * https://github.com/microsoft/TypeScript/issues/33232
 */
declare interface MediaDevices {
  getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
}
