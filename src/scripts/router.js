import Vue from 'vue';
import Router from 'vue-router';
import Info from '@/scripts/components/Info'
import Project from '@/scripts/components/Project'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HOME' 
    },
    {
      path: '/info',
      name: 'INFO',
      components: {
        info: Info
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