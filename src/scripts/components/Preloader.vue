<template>
  <div id="preloader__container">
    <logo-ani></logo-ani>
  </div>
</template>
<script>
import LogoAni from './LogoAni'
export default {
  components: {
    logoAni: LogoAni
  }
}
</script>
<style lang="scss">
  @import "~@/scss/preloader.scss";
</style>