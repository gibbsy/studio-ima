<template>
  <div id="logo__container">
    <div id="logo__ani">
      
    </div>
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
        container: document.getElementById('logo__ani'),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: `static/animation/logo-ani.json`,
        rendererSettings: {
          preserveAspectRatio:'xMidYMid slice'
        }
      });
      this.animation.addEventListener("DOMLoaded", () => {
        console.log('Animation ready');
        bus.emit("ANIMATION_READY")
        setTimeout(() => {
          if(this.onReady) {
            this.onReady()
          }
        }, 200);
      })
    }
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 100);
    bus.on("IMAGES_LOADED", () => {
      setTimeout(() => {
        this.animation.play();
      }, 500);
    })
  }
}
</script>