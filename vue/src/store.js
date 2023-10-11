import { createStore } from 'vuex';
import axios from 'axios';

const productsModule = {
  state: {
    products: [],
    products_loading: true
  },
  getters: {
    GET_PRODUCTS(state) { return state.products; },
    GET_PRODUCTS_LOADING(state) { return state.products_loading; }
  },
  mutations: {
    SET_PRODUCTS(state, products) { state.products = products; },
    SET_PRODUCTS_LOADING(state, status) { state.products_loading = status; }
  },
  actions: {
    getProducts({ commit }) {
      commit('SET_PRODUCTS_LOADING', true);
      return axios.get('http://localhost:9000/products')
        .then(response => {
          console.log(response.data);
          commit('SET_PRODUCTS', response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          commit('SET_PRODUCTS_LOADING', false);
        });
    },
  }
}

const store = createStore({
  modules: {
    productsModule: productsModule
  }
});

export default store;