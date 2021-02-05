<template>
  <header class="header">
    <img @click="setDarkTheme()" class="logo" src="https://avatars1.githubusercontent.com/u/31235016?s=60&v=4" alt="logo"/>
    <nav class="menu">
      <a :href="m.url" v-for="m in menus" class="hover-underline" :title="m.title" :key="m.url">{{m.title}}</a>
    </nav>
  </header>
  <main>
    <article>
      <router-view></router-view>
    </article>
  </main>
  <footer class="footer">
    <span>Theme By</span>
    <a href="https://github.com/TMaize/tmaize-blog">TMaize</a>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { menus } from '@/assets/config'
import { setDarkTheme } from '@/util/util'

export default defineComponent({
  name: 'App',
  components: {
    // TestTpl
  },
  setup () {
    return {
      menus,
      setDarkTheme
    }
  }
})
</script>

<style lang="scss" scoped>
</style>