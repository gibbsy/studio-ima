<template>
  <div id="about__container-outer">
    <div id="about__container-inner">
      <div id="about__col-left">
        <div id="about__text">
          <p class="intro">{{ intro.content }}</p>
          <p v-for="para in body">
            {{ para.content }}
          </p>
        </div>
        <div id="about__org-logos">
          <img src="static/images/riba_logo.svg" alt="riba" />
          <img src="static/images/rias_logo.svg" alt="rias" />
          <img src="static/images/arb_logo.svg" alt="arb" />
        </div>
      </div>
      <div id="about__col-right">
        <a href="mailto:iain@studioima.co.uk" target="_blank">iain@studioima.co.uk</a>
        <a href="tel:+447840147442">+44 (0)7840 147442</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["content"],
  data() {
    return {
      intro: "",
      body: []
    };
  },
  mounted() {
    this.intro = this.content[0];
    this.body = this.content.slice(1, this.content.length);
  }
};
</script>
<style lang="scss">
//@import "~@/scss/vue2-perfect-scrollbar.css";
@import "~@/scss/about.scss";
</style>
