<template>
  <div id="about__container-outer">
    <div id="about__container-inner">
      <div id="about__col-left">
        <div id="about__text">
          <block-content
            :blocks="content.intro"
            className="intro"
            :renderContainerOnSingleChild="true"
          ></block-content>
          <block-content :blocks="content.aboutTxt"> </block-content>
        </div>
        <div id="about__org-logos">
          <img src="static/images/riba_logo.svg" alt="riba" />
          <img src="static/images/rias_logo.svg" alt="rias" />
          <img src="static/images/arb_logo.svg" alt="arb" />
        </div>
      </div>
      <div id="about__col-right">
        <a href="mailto:iain@studioima.co.uk" target="_blank"
          >iain@studioima.co.uk</a
        >
        <a href="tel:+441316599994">+44 (0)131 659 9994</a>
        <a href="https://www.instagram.com/studioima.architects/" class="insta"
          >follow us</a
        >
        <div id="about__org-logos__mobile">
          <img src="static/images/riba_logo.svg" alt="riba" />
          <img src="static/images/rias_logo.svg" alt="rias" />
          <img src="static/images/arb_logo.svg" alt="arb" />
        </div>
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
      body: [],
      serializers: {
        types: {
          p: props => <p className="intro" {...props} />
        }
      }
    };
  }
};
</script>
<style lang="scss">
//@import "~@/scss/vue2-perfect-scrollbar.css";
@import "~@/scss/about.scss";
</style>
