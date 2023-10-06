import { createStore } from 'vuex';
import axios from 'axios';

const userModule = {
  state: {
    message: '',
    value: null,
  },
  getters: {
    GET_MESSAGE(state) { return state.message; },
    GET_VALUE(state) { return state.value; }
  },
  mutations: {
    SET_MESSAGE(state, message) {
      state.message = message;
    },
    SET_VALUE(state, value) {
      state.value = value;
    },
  },
  actions: {
    fetchData({ commit }) {
      return axios.get('http://localhost:9000/api/sample-data')
        .then(response => {
          commit('SET_MESSAGE', response.data.message);
          commit('SET_VALUE', response.data.value);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
  }
}

const store = createStore({
  modules: {
    userModule: userModule
  }
});

export default store;