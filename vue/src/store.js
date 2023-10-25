import { createStore } from 'vuex';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:9000";
import router from '@/router';

const projectModule = {
  state: {
    auth_token: localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'null',
    categories: [],
    categories_loading: true,
    errors: null,
    filtered_categories: [],
    maxPrice: 9999,
    minPrice: 0
  },
  getters: {
    GET_AUTH_TOKEN(state) { return state.auth_token; },
    GET_CATEGORIES(state) { return state.categories; },
    GET_CATEGORIES_LOADING(state) { return state.categories_loading; },
    GET_ERRORS(state) { return state.errors; },
    GET_FILTERED_CATEGORIES(state) { return state.filtered_categories; },
    GET_MAX_PRICE(state) { return state.maxPrice; },
    GET_MIN_PRICE(state) { return state.minPrice; }
  },
  mutations: {
    SET_AUTH_TOKEN(state, auth_token) 
    { 
      state.auth_token = auth_token;
      localStorage.setItem('auth_token', auth_token);
    },
    SET_CATEGORIES(state, categories) { state.categories = categories; },
    SET_CATEGORIES_LOADING(state, status) { state.categories_loading = status; },
    SET_ERRORS(state, errors) { state.errors = errors; },
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
    register({ commit }, userData) {
      commit('SET_ERRORS', null);
      axios.post('users/register', userData)
        .then(response => {
          commit('SET_AUTH_TOKEN', response.data.token);
          router.push('/');
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_ERRORS', error.response.data.error);
        });
    },
    login({ commit }, userData) {
      commit('SET_ERRORS', null);
      axios.post('users/login', userData)
        .then(response => {
          commit('SET_AUTH_TOKEN', response.data.token);
          router.push('/');
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_ERRORS', error.response.data.error);
        });
    },
    clearErrors({ commit }) { commit('SET_ERRORS', null); }
  }
}

const store = createStore({
  modules: {
    projectModule: projectModule
  }
});

export default store;