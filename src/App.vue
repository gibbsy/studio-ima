<template>
  <div id="app">
    <graphics></graphics>
    <transition name="fade" appear>
      <router-view class="info" name="info"></router-view>
    </transition>
    <app-ui></app-ui>
    <preloader></preloader>
    <!--     <div class="projects-container">
      <router-view class="project" name="project"></router-view>
    </div>-->
  </div>
</template>

<script>
import Preloader from "@/scripts/components/Preloader"
import AppUi from "@/scripts/components/AppUi";
import Graphics from "@/scripts/components/Graphics";
export default {
  name: "app",
  components: {
    preloader: Preloader,
    appUi: AppUi,
    graphics: Graphics
  }
};
</script>

<style lang="scss">
@import "./scss/reset.scss";
@import "./scss/main.scss";
@import "./scss/transitions.scss";
</style>
