import Home from 'pages/Home.vue'
const routes = [
  {
    path: '/',
    name: 'default',
    component: Home,
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/unregistered',
    children: [
      {
        path: '/home/mine',
        name: 'mine',
        component: () => import('pages/Mine.vue')
      },
      {
        path: '/home/unregistered',
        name: 'unregistered',
        component: () => import('pages/Unregistered.vue')
      }
    ]
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('pages/Manage.vue')
  },
  {
    path: '/statistic',
    name: 'statistic',
    component: () => import('pages/Statistic.vue')
  }
]
export default routes
