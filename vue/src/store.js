import { createStore } from 'vuex';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:9000";
import router from '@/router';

const mainModule = {
  state: {
    categories: [],
    categories_loading: true,
    filtered_categories: [],
    maxPrice: 9999,
    minPrice: 0,
  },
  getters: {
    GET_CATEGORIES(state) { return state.categories; },
    GET_CATEGORIES_LOADING(state) { return state.categories_loading; },
    GET_FILTERED_CATEGORIES(state) { return state.filtered_categories; },
    GET_MAX_PRICE(state) { return state.maxPrice; },
    GET_MIN_PRICE(state) { return state.minPrice; },
  },
  mutations: {
    SET_CATEGORIES(state, categories) { state.categories = categories; },
    SET_CATEGORIES_LOADING(state, status) { state.categories_loading = status; },
    SET_FILTERED_CATEGORIES(state, filtered_categories) { state.filtered_categories = filtered_categories; },
    SET_MAX_PRICE(state, maxPrice) { state.maxPrice = maxPrice; },
    SET_MIN_PRICE(state, minPrice) { state.minPrice = minPrice; }
  },
  actions: {
    getCategories({ commit }, filters) {
      if (!filters) commit('SET_CATEGORIES_LOADING', true);
      return axios.get('categories', { params: filters })
        .then(response => {
          commit('SET_CATEGORIES', response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          if (!filters) commit('SET_CATEGORIES_LOADING', false);
        });
    },
    updatePrice({ commit, dispatch }, filters) {
      commit('SET_MIN_PRICE', filters.minPrice);
      commit('SET_MAX_PRICE', filters.maxPrice);
      dispatch('getCategories', filters);
    },
  }
}

const userModule = {
  state: {
    auth_token: localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'null',
    user: JSON.parse(localStorage.getItem('user')),
    user_errors: null,
    user_products: [],
    user_products_loading: true
  },
  getters: {
    GET_AUTH_TOKEN(state) { return state.auth_token; },
    GET_USER(state) { return state.user; },
    GET_USER_ERRORS(state) { return state.user_errors; },
    GET_USER_PRODUCTS(state) { return state.user_products; },
    GET_USER_PRODUCTS_LOADING(state) { return state.user_products_loading; }
  },
  mutations: {
    SET_AUTH_TOKEN(state, auth_token) 
    { 
      state.auth_token = auth_token;
      localStorage.setItem('auth_token', auth_token);
    },
    SET_USER(state, user) 
    { 
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    SET_USER_ERRORS(state, errors) { state.user_errors = errors; },
    SET_USER_PRODUCTS(state, products) { state.user_products = products; },
    SET_USER_PRODUCTS_LOADING(state, status) { state.user_products_loading = status; }
  },
  actions: {
    register({ commit }, userData) {
      commit('SET_USER_ERRORS', null);
      axios.post('users/register', userData)
        .then(response => {
          commit('SET_AUTH_TOKEN', response.data.token);
          commit('SET_USER', response.data.user);
          router.push('/');
        })
        .catch(error => {
          console.log(error.response.data.errors);
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    },
    login({ commit }, userData) {
      commit('SET_USER_ERRORS', null);
      axios.post('users/login', userData)
        .then(response => {
          commit('SET_AUTH_TOKEN', response.data.token);
          commit('SET_USER', response.data.user);
          router.push('/');
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    },
    clearErrors({ commit }) { commit('SET_USER_ERRORS', null); },
    getProducts({ commit }, userId) {
      commit('SET_USER_PRODUCTS_LOADING', true);
      return axios.get('users/' + userId + '/products')
        .then(response => {
          commit('SET_USER_PRODUCTS', response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          commit('SET_USER_PRODUCTS_LOADING', false);
        });
    },
  }
};

const store = createStore({
  modules: {
    mainModule: mainModule,
    userModule: userModule
  }
});

export default store;