import { createRouter, createWebHistory } from 'vue-router';
import MainView from './views/MainView.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import UserProductsView from './views/UserProductsView.vue';
import AddProductView from './views/AddProductView.vue';
import EditProductView from './views/EditProductView.vue';
import BasketView from './views/BasketView.vue';
import store from './store';

const routes = [
  { path: '/', component: MainView },
  { path: '/login', component: LoginView, meta: { auth: false} },
  { path: '/register', component: RegisterView, meta: { auth: false} },
  { path: '/users/:userId/products', component: UserProductsView, meta: { auth: true } },
  { path: '/users/:userId/products/add', component: AddProductView, meta: { auth: true } },
  { path: '/users/:userId/products/:productId/edit', component: EditProductView, meta: { auth: true }},
  { path: '/users/:userId/basket', component: BasketView, meta: { auth: true} },
  { path: '/logout', component: { template: '<div></div>' } },
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
    location.reload();
    return next('/');
  }

  if ('auth' in to.meta && to.meta.auth && !isAuthenticated) return next('/login');

  if (to.params.userId && currentUser) {
    const basePath = `/users/${currentUser.id}/products`;
    const productsAddPath = `${basePath}/add`;
    const editProductPath = `${basePath}/${to.params.productId}/edit`;
    const basketPath = `/users/${currentUser.id}/basket`;
    if (to.path === basePath || to.path === productsAddPath || to.path === editProductPath || to.path === basketPath) return next();
    if (to.params.userId !== currentUser.id) return next(basePath);
  }
  return next();
});

export default router;