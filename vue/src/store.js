import { createStore } from 'vuex';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:9000";
import router from '@/router';

const mainModule = {
  state: {
    categories: [],
    categories_loading: true,
    categories_with_products: [],
    categories_with_products_loading: true,
    maxPrice: 9999,
    minPrice: 0,
    types: [],
    types_loading: true
  },
  getters: {
    GET_CATEGORIES(state) { return state.categories; },
    GET_CATEGORIES_LOADING(state) { return state.categories_loading; },
    GET_CATEGORIES_WITH_PRODUCTS(state) { return state.categories_with_products; },
    GET_CATEGORIES_WITH_PRODUCTS_LOADING(state) { return state.categories_with_products_loading; },
    GET_MAX_PRICE(state) { return state.maxPrice; },
    GET_MIN_PRICE(state) { return state.minPrice; },
    GET_TYPES(state) { return state.types; },
    GET_TYPES_LOADING(state) { return state.types_loading; }
  },
  mutations: {
    SET_CATEGORIES(state, categories) { state.categories = categories; },
    SET_CATEGORIES_LOADING(state, status) { state.categories_loading = status; },
    SET_CATEGORIES_WITH_PRODUCTS(state, categories) { state.categories_with_products = categories; },
    SET_CATEGORIES_WITH_PRODUCTS_LOADING(state, status) { state.categories_with_products_loading = status; },
    SET_MAX_PRICE(state, maxPrice) { state.maxPrice = maxPrice; },
    SET_MIN_PRICE(state, minPrice) { state.minPrice = minPrice; },
    SET_TYPES(state, types) { state.types = types; },
    SET_TYPES_LOADING(state, status) { state.types_loading = status; }
  },
  actions: {
    getCategoriesWithProducts({ commit }, filters) {
      if (!filters) commit('SET_CATEGORIES_WITH_PRODUCTS_LOADING', true);
      return axios.get('resources/categories/products', { params: filters })
        .then(response => {
          commit('SET_CATEGORIES_WITH_PRODUCTS', response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          if (!filters) commit('SET_CATEGORIES_WITH_PRODUCTS_LOADING', false);
        });
    },
    getCategories({ commit }) {
      commit('SET_CATEGORIES_LOADING', true);
      return axios.get('resources/categories')
        .then(response => {
          commit('SET_CATEGORIES', response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          commit('SET_CATEGORIES_LOADING', false);
        });
    },
    getTypes({ commit }) {
      commit('SET_TYPES_LOADING', true);
      return axios.get('resources/products/types')
        .then(response => {
          commit('SET_TYPES', response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          commit('SET_TYPES_LOADING', false);
        });
    },
    updatePrice({ commit, dispatch }, filters) {
      commit('SET_MIN_PRICE', filters.minPrice);
      commit('SET_MAX_PRICE', filters.maxPrice);
      dispatch('getCategoriesWithProducts', filters);
    },
  }
}

const userModule = {
  state: {
    auth_token: localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'null',
    success_message: null,
    user: JSON.parse(localStorage.getItem('user')),
    user_errors: null,
    user_products: [],
    user_products_loading: true
  },
  getters: {
    GET_AUTH_TOKEN(state) { return state.auth_token; },
    GET_SUCCESS_MESSAGE(state) { return state.success_message; },
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
    SET_SUCCESS_MESSAGE(state, message) { state.success_message = message; },
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
    addProduct({ commit }, { userId, product }) {
      commit('SET_USER_ERRORS', null);
      axios.post('users/' + userId + '/products/add', product)
        .then(response => {
          commit('SET_SUCCESS_MESSAGE', response.data.message);
          router.push('/users/' + userId + '/products');
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    },
    closeSuccessMessage({ commit }) { commit('SET_SUCCESS_MESSAGE', null); }
  }
};

const store = createStore({
  modules: {
    mainModule: mainModule,
    userModule: userModule
  }
});

export default store;