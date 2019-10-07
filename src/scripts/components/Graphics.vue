<template>
  <div id="slideshow"></div>
</template>

<script>
import bus from "@/scripts/events/eventBus.js"
import { Projects } from "@/scripts/data/appData.js"
import Slideshow from "@/scripts/graphics/Slideshow.js"

export default {
  data() {
    return {
      slides: []
    }
  },
  methods: {
    initScene() {
      this.slideshow = new Slideshow();
    }
  },
  mounted() {
    this.initScene();
    bus.on("LOAD_PROGRESS", (e) => {
      console.log(e)
    })
    bus.on("HEROES_LOADED", () => {
      console.log("IMAGES LOADED")
    })
    bus.on("NAVIGATE", route => {
      this.$router.push(route);
    })
  }
}
</script>
<style lang="scss">
@import "~@/scss/graphics.scss"
</style>
