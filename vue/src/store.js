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
    editable_product: null,
    editable_product_loading: true,
    maxPrice: 9999,
    minPrice: 0,
    product_error: null,
    types: [],
    types_loading: true
  },
  getters: {
    GET_CATEGORIES(state) { return state.categories; },
    GET_CATEGORIES_LOADING(state) { return state.categories_loading; },
    GET_CATEGORIES_WITH_PRODUCTS(state) { return state.categories_with_products; },
    GET_CATEGORIES_WITH_PRODUCTS_LOADING(state) { return state.categories_with_products_loading; },
    GET_EDITABLE_PRODUCT(state) { return state.editable_product; },
    GET_EDITABLE_PRODUCT_LOADING(state) { return state.editable_product_loading; },
    GET_PRODUCT_ERROR(state) { return state.product_error; },
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
    SET_EDITABLE_PRODUCT(state, product) { state.editable_product = product; },
    SET_EDITABLE_PRODUCT_LOADING(state, status) { state.editable_product_loading = status; },
    SET_MAX_PRICE(state, maxPrice) { state.maxPrice = maxPrice; },
    SET_MIN_PRICE(state, minPrice) { state.minPrice = minPrice; },
    SET_PRODUCT_ERROR(state, error) { state.product_error = error; },
    SET_TYPES(state, types) { state.types = types; },
    SET_TYPES_LOADING(state, status) { state.types_loading = status; }
  },
  actions: {
    getCategoriesWithProducts({ commit }, filters) {
      if (!filters) commit('SET_CATEGORIES_WITH_PRODUCTS_LOADING', true);
      return axios.get('resources/categories/products', { params: filters })
        .then(response => {
          commit('SET_CATEGORIES_WITH_PRODUCTS', response.data.categories);
          commit('SET_TYPES', response.data.types);
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
    getAllTypes({ commit }) {
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
    getProductById({ commit }, { userId, productId }) {
      commit('SET_EDITABLE_PRODUCT_LOADING', true);
      commit('SET_PRODUCT_ERROR', null);
      return axios.get('users/' + userId + '/products/' + productId)
        .then(response => {
          commit('SET_EDITABLE_PRODUCT', response.data);
        })
        .catch(error => {
          commit('SET_PRODUCT_ERROR', error.response.data.error);
        })
        .finally(() => {
          commit('SET_EDITABLE_PRODUCT_LOADING', false);
        });
    }
  }
}

const userModule = {
  state: {
    auth_token: localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'null',
    products_basket: [],
    products_basket_loading: true,
    success_message: null,
    user: JSON.parse(localStorage.getItem('user')),
    user_errors: null,
    user_products: [],
    user_products_loading: true
  },
  getters: {
    GET_AUTH_TOKEN(state) { return state.auth_token; },
    GET_PRODUCTS_BASKET(state) { return state.products_basket; },
    GET_PRODUCTS_BASKET_LOADING(state) { return state.products_basket_loading; },
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
    SET_PRODUCTS_BASKET(state, products) { state.products_basket = products; },
    SET_PRODUCTS_BASKET_LOADING(state, status) { state.products_basket_loading = status; },
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
    getProductsBasket({ commit }, userId) {
      commit('SET_PRODUCTS_BASKET_LOADING', true);
      return axios.get('users/' + userId + '/basket/products')
        .then(response => {
          commit('SET_PRODUCTS_BASKET', response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          commit('SET_PRODUCTS_BASKET_LOADING', false);
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
    editProduct({ commit }, { userId, product }) {
      commit('SET_USER_ERRORS', null);
      axios.put('users/' + userId + '/products/' + product.id + '/edit', product)
        .then(response => {
          commit('SET_SUCCESS_MESSAGE', response.data.message);
          router.push('/users/' + userId + '/products');
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    },
    deleteProduct({ commit }, { userId, productId }) {
      axios.delete('users/' + userId + '/products/' + productId + '/delete')
        .then(response => {
          commit('SET_SUCCESS_MESSAGE', response.data.message);
          location.reload();
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    },
    clearErrors({ commit }) { commit('SET_USER_ERRORS', null); },
    closeSuccessMessage({ commit }) { commit('SET_SUCCESS_MESSAGE', null); },
    addProductToBasket({ commit }, { userId, productId }) { 
      axios.post('users/' + userId + '/basket/products/' + productId + '/add')
        .then(response => {
          commit('SET_SUCCESS_MESSAGE', response.data.message);
          router.push('/');
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    },
    removeProductFromBasket({ commit }, { userId, productId }) {
      axios.delete('users/' + userId + '/basket/products/' + productId + '/delete')
        .then(response => {
          commit('SET_SUCCESS_MESSAGE', response.data.message);
          location.reload();
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    },
    purchaseProducts({ commit }, { userId, data }) {
      axios.post('users/' + userId + '/basket/products/purchase', data)
        .then(response => {
          commit('SET_SUCCESS_MESSAGE', response.data.message);
          location.reload();
        })
        .catch(error => {
          if (error.response.status === 422) commit('SET_USER_ERRORS', error.response.data.errors);
          else if (error.response.status === 401) commit('SET_USER_ERRORS', error.response.data.error);
        });
    }
  }
};

const store = createStore({
  modules: {
    mainModule: mainModule,
    userModule: userModule
  }
});

export default store;