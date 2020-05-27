<template>
  <div id="app" :class="{ loading: !loaded }">
    <div class="init" v-if="!dataReady"><h1>Please wait</h1></div>
    <graphics v-if="dataReady" :projects="projects" :isMobile="isMobile"></graphics>
    <app-ui :loaded="loaded"></app-ui>
    <transition name="fade" appear>
      <router-view class="about" name="about" :content="bio"></router-view>
    </transition>
    <transition name="fade">
      <preloader v-if="dataReady && !loaded"></preloader>
    </transition>
    <!--     <div class="projects-container">
      <router-view class="project" name="project"></router-view>
    </div>-->
  </div>
</template>

<script>
import bus from "@/scripts/events/eventBus.js"
import Preloader from "@/scripts/components/Preloader"
import AppUi from "@/scripts/components/AppUi";
import Graphics from "@/scripts/components/Graphics";
import axios from 'axios';
export default {
  name: "app",
  components: {
    preloader: Preloader,
    appUi: AppUi,
    graphics: Graphics
  },
  data() {
    return {
      isMobile: '',
      dataReady: false,
      projects: {},
      bio: {},
      loaded: false
    }
  },
  methods: {
    getData() {
      var endPoint = this.isMobile ? 'projectsMobile' : 'projects';
      axios.get('https://v2-api.sheety.co/e823bbe735347c6307cf679fdceeca0c/studioIma/' + endPoint)
      .then(response => {
        console.log(response);
        this.projects = response.data[endPoint].filter(project => project.published == true)
        console.log(this.projects);
         axios.get('https://v2-api.sheety.co/e823bbe735347c6307cf679fdceeca0c/studioIma/bio')
        .then(response => {
          console.log(response);
          this.bio = response.data.bio
          this.initSlideshow()
        })
      })
    },
    initSlideshow() {
      bus.on("IMAGES_LOADED", () => {
        this.loaded = true
      })
      this.dataReady = true;
    }
  },
  mounted() {
    this.isMobile = PIXI.utils.isMobile.phone;
    console.log(this.isMobile);
    this.getData();
  },
};
</script>

<style lang="scss">
@import "./scss/reset.scss";
@import "./scss/main.scss";
@import "./scss/transitions.scss";
</style>
