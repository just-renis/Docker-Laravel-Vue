import { createRouter, createWebHistory } from 'vue-router';
import MainView from './views/MainView.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import UserProductsView from './views/UserProductsView.vue';
import AddProductsView from './views/AddProductsView.vue';
import store from './store';

const routes = [
  { path: '/', component: MainView },
  { path: '/login', component: LoginView, meta: { auth: false} },
  { path: '/register', component: RegisterView, meta: { auth: false} },
  { path: '/user/products', component: UserProductsView, meta: { auth: true } },
  { path: '/user/products/add', component: AddProductsView, meta: { auth: true } },
  { path: '/logout', component: { template: '<div></div>' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['GET_AUTH_TOKEN'];
  if (to.path === '/logout' && isAuthenticated) {
    localStorage.removeItem('auth_token');
    store.commit('SET_AUTH_TOKEN', null);
    window.location.replace('/');
    next('/');
  }
  else if ('auth' in to.meta && to.meta.auth && !isAuthenticated) next('/login');
  else if ('auth' in to.meta && !to.meta.auth && isAuthenticated) next('/user/products');
  else next();
});

export default router;