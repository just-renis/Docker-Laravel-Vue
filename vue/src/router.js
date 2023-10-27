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
  { path: '/users/:userId/products', component: UserProductsView, meta: { auth: true } },
  { path: '/users/:userId/products/add', component: AddProductsView, meta: { auth: true } },
  { path: '/logout', component: { template: '<div></div>' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['GET_AUTH_TOKEN'];
  const currentUser = store.getters['GET_USER'];
  if (to.path === '/logout' && isAuthenticated) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    store.commit('SET_AUTH_TOKEN', null);
    return next('/');
  }

  if ('auth' in to.meta && to.meta.auth && !isAuthenticated) return next('/login');

  if (to.params.userId && currentUser) {
    const basePath = `/users/${currentUser.id}/products`;
    const productsAddPath = `${basePath}/add`;
    if (to.path === basePath || to.path === productsAddPath) return next();
    if (to.params.userId !== currentUser.id) return next(basePath);
  }
  return next();
});

export default router;