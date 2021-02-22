<template>
  <div class="app__ui" :class="{ on: loaded, about: aboutOn }">
    <transition name="quick-fade">
      <!-- <logo-ani v-show="!aboutOn"></logo-ani> -->
      <logo-ani :class="{ fade: aboutOn }"></logo-ani>
    </transition>
    <transition name="slow-fade" appear>
      <header class="ui__header">
        <h1 class="studio_ima">Studio<span> IMA</span></h1>
        <transition name="quick-fade" mode="out-in">
          <a
            class="ui__link about__link"
            @click.prevent="showInfo"
            v-if="!aboutOn && loaded"
            key="about"
            >about</a
          >
          <a
            class="ui__link about__close"
            @click.prevent="closeInfo"
            v-if="aboutOn"
            key="close"
          ></a>
        </transition>
      </header>
    </transition>
    <div id="slideshow__controller">
      <div
        id="slideshow__prev"
        :class="[
          'slideshow__ctrl',
          'slideshow__prev',
          { active: allowPrev && slideIndex > 0 }
        ]"
        @click="prevSlide"
      ></div>
      <div
        id="slideshow__next"
        :class="['slideshow__ctrl', 'slideshow__skip', { active: allowSkip }]"
        @click="nextSlide"
      ></div>
    </div>
    <!-- <router-link :to="{ name: 'ABOUT' }" class="ui__link about__link">about</router-link> -->
    <!-- <router-link to="/project/project-one">project</router-link> -->
  </div>
</template>
<script>
import LogoAni from "./LogoAni";
// import HeaderLogoAni from "./HeaderLogoAni";
import bus from "../events/eventBus";
export default {
  props: ["loaded"],
  components: {
    logoAni: LogoAni
    // headerLogoAni: HeaderLogoAni
  },
  data() {
    return {
      slideIndex: 0,
      aboutOn: false,
      allowSkip: true,
      allowPrev: false
    };
  },
  methods: {
    showInfo() {
      bus.emit("PAUSE_SLIDESHOW");
      this.$router.push({ name: "ABOUT" });
      this.aboutOn = true;
    },
    closeInfo() {
      bus.emit("PLAY_SLIDESHOW");
      this.$router.push({ name: "HOME" });
      this.aboutOn = false;
    },
    prevSlide() {
      bus.emit("PREV_SLIDE");
      this.allowPrev = this.allowSkip = false;
      setTimeout(() => {
        this.allowPrev = this.allowSkip = true;
      }, 1600);
    },
    nextSlide() {
      bus.emit("NEXT_SLIDE");
      this.allowPrev = this.allowSkip = false;
      setTimeout(() => {
        this.allowPrev = this.allowSkip = true;
      }, 1600);
    }
  },
  mounted() {
    bus.on("SLIDE_CHANGE", e => {
      this.slideIndex = e;
    });
  }
};
</script>
<style lang="scss">
@import "~@/scss/ui.scss";
</style>
