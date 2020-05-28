<template>
  <div id="slideshow">
    <ul id="slideshow__captions" v-show="!aboutOn">
      <transition name="fade" appear mode="out-in">
        <li
          v-for="(project, i) in projects"
          :key="project.id"
          v-if="slideIndex == i && showCaption"
        >{{ project.caption }}</li>
      </transition>
    </ul>
  </div>
</template>

<script>
import bus from "@/scripts/events/eventBus.js";
//import { Projects } from "@/scripts/data/appData.js";
import Slideshow from "@/scripts/graphics/Slideshow.js";

export default {
  props: ['projects', 'isMobile'],
  data() {
    return {
     // projects: Projects,
      slideIndex: 0,
      aboutOn: false,
      showCaption: false
    };
  },
  methods: {
    initScene() {
      this.slideshow = new Slideshow(this.projects, 7, this.isMobile);
    }
  },
  mounted() {
    bus.on("PRELOADER_READY", () => {
      this.initScene();
    });
    bus.on("LOAD_PROGRESS", e => {
      console.log(e);
    });
    bus.on("IMAGES_LOADED", () => {
      console.log("IMAGES LOADED");
    });
    bus.on("NAVIGATE", route => {
      this.$router.push(route);
    });
    bus.on("SLIDE_CHANGE", e => {
      this.slideIndex = e;
      this.showCaption = false;
    });
    bus.on("SHOW_CAPTION", () => {
      this.showCaption = true;
    });
  },
  watch: {
    $route (to, from) {
      if(to.name == "ABOUT") {
        this.aboutOn = true;
      }
      if(from.name == "ABOUT") {
        this.aboutOn = false;
      }
    }
  },
};
</script>
<style lang="scss">
@import "~@/scss/graphics.scss";
</style>
