<template>
  <div id="preloader__container">
    <div class="preloader__progress top"></div>
    <div class="preloader__progress right"></div>
    <div class="preloader__progress bottom"></div>
    <div class="preloader__progress left"></div>
    <!-- <div id="preloader__logo_ani"></div> -->
    <div id="preloader__percent">
      <h1>{{ percentLoaded }}</h1>
    </div>
  </div>
</template>
<script>
import bus from "@/scripts/events/eventBus.js";
export default {
  data() {
    return {
      animation: {},
      loadedProgress: { percent: 0 }
    };
  },
  computed: {
    percentLoaded() {
      //return this.loadedProgress.percent < 100 ? `${this.loadedProgress.percent}%` : 'Welcome';
      return this.loadedProgress.percent < 100 ? "Loading" : "Welcome";
    }
  },
  methods: {
    init() {
      this.animation = lottie.loadAnimation({
        container: document.getElementById("preloader__logo_ani"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "static/animation/logo-ani.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      });
      this.animation.addEventListener("DOMLoaded", () => {
        setTimeout(() => {
          if (this.onReady) {
            this.onReady();
          }
        }, 1000);
      });
    },
    onReady() {
      console.log("Preloader ready");
      bus.emit("PRELOADER_READY");
      bus.on("LOAD_PROGRESS", e => {
        this.onProgress(e);
      });
    },
    onProgress(e) {
      let pc = Math.floor(e);
      console.log(e);
      gsap.to(".preloader__progress.top, .preloader__progress.bottom", 1, {
        scaleX: e / 100
      });
      gsap.to(".preloader__progress.right, .preloader__progress.left", 1, {
        scaleY: e / 100
      });
      gsap.to(this.loadedProgress, 1, {
        percent: pc,
        roundProps: "percent"
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.onReady();
    }, 50);
  }
};
</script>
<style lang="scss">
@import "~@/scss/preloader.scss";
</style>
