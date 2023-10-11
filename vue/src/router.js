import { createRouter, createWebHistory } from 'vue-router';
import MainPage from './views/MainPage.vue';
import SampleComponent from './components/SampleComponent.vue';

const routes = [
  { path: '/', component: MainPage },
  { path: '/SampleComponent', component: SampleComponent }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;