import Vue from 'vue';
import Router from 'vue-router';
import About from '@/scripts/components/About'
import Project from '@/scripts/components/Project'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HOME' 
    },
    {
      path: '/about',
      name: 'ABOUT',
      components: {
        about: About
      },
      beforeEnter: (to, from, next) => {
        // prevent deep link
        if (from.name == null || undefined) {
          next({ name: 'HOME' });
        } else {
          next();
        } 
      }
    },
    {
      path: '/project/:project',
      name: 'PROJECT',
      components: {
        project: Project
      },
      props: true
    }
  ]
})