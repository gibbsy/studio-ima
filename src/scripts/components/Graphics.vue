<template>
  <div id="slideshow">
  <ul id="slideshow__captions">
    <transition name="fade" appear mode="out-in">
      <li v-for="(project, i) in projects" :key="project.id" v-if="slideIndex == i && showCaption">{{ project.hero.caption }}</li>
    </transition>
  </ul>
  </div>
</template>

<script>
import bus from "@/scripts/events/eventBus.js"
import { Projects } from "@/scripts/data/appData.js"
import Slideshow from "@/scripts/graphics/Slideshow.js"

export default {
  data() {
    return {
      projects: Projects,
      slideIndex: 0,
      showCaption: false
    }
  },
  methods: {
    initScene() {
      this.slideshow = new Slideshow(7);
    }
  },
  mounted() {
    bus.on("PRELOADER_READY", () => {
      this.initScene();
    })
    bus.on("LOAD_PROGRESS", (e) => {
      console.log(e)
    })
    bus.on("IMAGES_LOADED", () => {
      console.log("IMAGES LOADED")
    })
    bus.on("NAVIGATE", route => {
      this.$router.push(route);
    })
    bus.on("SLIDE_CHANGE", (e) => {
      this.slideIndex = e;
      this.showCaption = false;
    })
    bus.on("SHOW_CAPTION", () => {
      this.showCaption = true;
    })
  }
}
</script>
<style lang="scss">
@import "~@/scss/graphics.scss"
</style>
