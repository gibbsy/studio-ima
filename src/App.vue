<template>
  <div id="app" :class="{ loading: !loaded }">
    <div class="init" v-if="!dataReady"><h1>Please wait</h1></div>
    <graphics
      v-if="dataReady"
      :projects="projects"
      :isMobile="isMobile"
    ></graphics>
    <app-ui :loaded="loaded"></app-ui>
    <transition name="fade" appear>
      <router-view class="about" name="about" :content="about"></router-view>
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
import bus from "@/scripts/events/eventBus.js";
import Preloader from "@/scripts/components/Preloader";
import AppUi from "@/scripts/components/AppUi";
import Graphics from "@/scripts/components/Graphics";
import sanity from "@/scripts/data/sanity";

const query = `{
  "projects":*[_type=="projectList"]{featuredProjects[]->{_id, slug, title, heroImage, mobileHeroImage, caption, credit}},
	"about": *[_type=="about"]
}`;
export default {
  name: "app",
  components: {
    preloader: Preloader,
    appUi: AppUi,
    graphics: Graphics
  },
  data() {
    return {
      isMobile: "",
      dataReady: false,
      projects: {},
      about: {},
      loaded: false
    };
  },
  methods: {
    getData() {
      /*  
      Get the data and create a separate projects list if on mobile
      var endPoint = this.isMobile ? 'projectsMobile' : 'projects';
      axios.get('https://v2-api.sheety.co/e823bbe735347c6307cf679fdceeca0c/studioIma/' + endPoint)
      .then(response => {
        console.log(response);
        this.projects = response.data[endPoint].filter(project => project.published == true)
        console.log(this.projects);
         axios.get('https://v2-api.sheety.co/e823bbe735347c6307cf679fdceeca0c/studioIma/about')
        .then(response => {
          console.log(response);
          this.about = response.data.about
          this.initSlideshow()
        })
      }) */
      /* sanity.fetch(query).then(
        data => {
          console.log(data);
          let projects = data.projects[0].featuredProjects;
          if (this.isMobile) {
            console.log("mobile");
            let projectsMobile = projects.filter(
              item => item.projectsMobile == true
            );
            projectsMobile.forEach((el, i) => {
              el.index = i;
            });
            this.projects = projectsMobile;
          } else {
            projects.forEach((el, i) => {
              el.index = i;
            });
            this.projects = projects;
          }

          this.about = data.about[0];
          this.initSlideshow();
        },
        error => {
          console.error(error);
        }
      ); */
      sanity.fetch(query).then(
        data => {
          console.log(data);
          let projects = data.projects[0].featuredProjects;
          projects.forEach((el, i) => {
            el.index = i;
          });
          this.projects = projects;
          this.about = data.about[0];
          this.initSlideshow();
        },
        error => {
          console.error(error);
        }
      );
    },
    initSlideshow() {
      bus.on("IMAGES_LOADED", () => {
        this.loaded = true;
      });
      this.dataReady = true;
    }
  },
  mounted() {
    this.isMobile = PIXI.utils.isMobile.phone;
    console.log(this.isMobile);
    this.getData();
  }
};
</script>

<style lang="scss">
@import "./scss/reset.scss";
@import "./scss/main.scss";
@import "./scss/transitions.scss";
</style>
