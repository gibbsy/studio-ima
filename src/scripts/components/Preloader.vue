<template>
  <div id="preloader__container">
    <div id="preloader__progress"></div>
    <div id="preloader__logo_ani"></div>
  </div>
</template>
<script>
import bus from "@/scripts/events/eventBus.js"
export default {
  data() {
    return {
      animation: {}
    }
  },
  methods: {
    init() {
        this.animation = lottie.loadAnimation({
        container: document.getElementById('preloader__logo_ani'),
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: `static/animation/logo-ani.json`,
        rendererSettings: {
          preserveAspectRatio:'xMidYMid slice'
        }
      });
      this.animation.addEventListener("DOMLoaded", () => {
        setTimeout(() => {
          if(this.onReady) {
            this.onReady()
          }
        }, 1000);
      })
    },
    onReady() {
      console.log('Preloader ready');
      bus.emit("PRELOADER_READY")
      bus.on("LOAD_PROGRESS", (e) => {
      this.onProgress(e);
    })
    },
    onProgress(e) {
      TweenMax.to('#preloader__progress', 2, { scaleX: e/100 })
    }
  },
  mounted() {
    this.init();
    setTimeout(() => {
    }, 50);
  }
}
</script>
<style lang="scss">
  @import "~@/scss/preloader.scss";
</style>