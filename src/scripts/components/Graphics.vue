<template>
  <div id="slideshow__container">
    <div id="slideshow"></div>
    <article id="slideshow__captions" v-show="!aboutOn">
      <transition-group name="fade" appear mode="out-in">
        <div
          class="slide__info"
          v-for="(project, i) in projects"
          :key="project._id"
          v-show="slideIndex == i && showCaption"
        >
          <h2>
            {{ project.caption }}
          </h2>
          <h4>{{ project.credit }}</h4>
        </div>
      </transition-group>
    </article>
  </div>
</template>

<script>
import bus from "@/scripts/events/eventBus.js";
import Slideshow from "@/scripts/graphics/Slideshow.js";

export default {
  props: ["projects", "isMobile"],
  data() {
    return {
      slideIndex: 0,
      aboutOn: false,
      showCaption: false,
      transitioning: false
    };
  },
  methods: {
    initScene() {
      this.slideshow = new Slideshow(this.projects, 7, this.isMobile);
    },
    next() {
      if (this.transitioning) {
        return;
      }
      this.transitioning = true;
      console.log("next");
      bus.emit("SLIDE_CHANGE", this.slideIndex + 1);
      setTimeout(() => {
        this.transitioning = false;
      }, 1500);
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
    $route(to, from) {
      if (to.name == "ABOUT") {
        this.aboutOn = true;
      }
      if (from.name == "ABOUT") {
        this.aboutOn = false;
      }
    }
  }
};
</script>
<style lang="scss">
@import "~@/scss/graphics.scss";
</style>
