<template>
  <div id="header__logo__ani"></div>
</template>
<script>
import bus from "@/scripts/events/eventBus.js";
export default {
  data() {
    return {
      animation: {}
    };
  },
  methods: {
    init() {
      this.animation = lottie.loadAnimation({
        container: document.getElementById("header__logo__ani"),
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "static/animation/logo-ani-grey.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      });
      this.animation.addEventListener("DOMLoaded", () => {
        console.log("Animation ready");
        bus.emit("ANIMATION_READY");
        setTimeout(() => {
          if (this.onReady) {
            this.onReady();
          }
        }, 200);
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 1000);
  }
};
</script>
