<template>
  <div class="app__ui">
    <transition name="quick-fade">
      <logo-ani v-show="!infoOn"></logo-ani>
    </transition>
    <header class="ui__header">
      <h1 class="studio_ima">
        / Studio
        <span>IMA</span>
      </h1>
      <transition name="quick-fade" mode="out-in">
            <a class="ui__link info__link" @click.prevent="showInfo" v-if="!infoOn" key="info">info</a>
            <a class="ui__link info__close" @click.prevent="closeInfo" v-if="infoOn" key="close"></a>
      </transition>
    </header>
    <!-- <router-link :to="{ name: 'INFO' }" class="ui__link info__link">info</router-link> -->
    <!-- <router-link to="/project/project-one">project</router-link> -->
  </div>
</template>
<script>
import LogoAni from "./LogoAni";
import bus from "../events/eventBus";
export default {
  components: {
    logoAni: LogoAni
  },
  data() {
    return {
      infoOn: false
    };
  },
  methods: {
    showInfo() {
      bus.emit("PAUSE_SLIDESHOW");
      this.$router.push({ name: "INFO" });
      this.infoOn = true;
    },
    closeInfo() {
      bus.emit("PLAY_SLIDESHOW");
      this.$router.push({ name: "HOME" });
      this.infoOn = false;
    }
  }
};
</script>
<style lang="scss">
@import "~@/scss/ui.scss";
</style>