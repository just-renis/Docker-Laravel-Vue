import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import router from './router';
import bootstrapVue from 'bootstrap-vue-3';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(bootstrapVue);
app.mount('#app');