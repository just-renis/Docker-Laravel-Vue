import { createStore } from 'vuex';
import axios from 'axios';

const categoriesModule = {
  state: {
    categories: [],
    categories_loading: true,
    filtered_categories: [],
    maxPrice: 9999,
    minPrice: 0
  },
  getters: {
    GET_CATEGORIES(state) { return state.categories; },
    GET_CATEGORIES_LOADING(state) { return state.categories_loading; },
    GET_FILTERED_CATEGORIES(state) { return state.filtered_categories; },
    GET_MAX_PRICE(state) { return state.maxPrice; },
    GET_MIN_PRICE(state) { return state.minPrice; }
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
      console.log(filters);
      if (!filters) commit('SET_CATEGORIES_LOADING', true);
      return axios.get('http://localhost:9000/categories', { params: filters })
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
    }
  }
}

const store = createStore({
  modules: {
    categoriesModule: categoriesModule
  }
});

export default store;