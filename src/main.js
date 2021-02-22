import Vue from "vue";
import App from "./App.vue";
import router from "./scripts/router";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import BlockContent from "sanity-blocks-vue-component";
Vue.component("block-content", BlockContent);

Vue.use(PerfectScrollbar);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
