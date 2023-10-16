import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import { BButton } from 'bootstrap-vue-3';
import { BSpinner } from 'bootstrap-vue-3';
import { BFormGroup } from 'bootstrap-vue-3';
import { BFormInput } from 'bootstrap-vue-3';

const app = createApp(App);
app.component('b-button', BButton);
app.component('b-spinner', BSpinner);
app.component('b-form-group', BFormGroup);
app.component('b-form-input', BFormInput);
app.use(store);
app.use(router);
app.mount('#app');