<template>
  <div class="container">
    <div class="d-flex justify-content-center">
      <div v-if="success_message" class="success-message p-3 rounded">
        {{ success_message }}
        <button @click="closePopup" class="close-success-message ps-2">X</button>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4 py-5" v-if="!products_loading && products.length !== 0">
      <ProductsComp :products="products"/>
    </div>
    <div v-else-if="!products_loading" class="alert alert-success" role="alert">All your products are sold</div>
    <div v-else class="d-flex justify-content-center mt-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import ProductsComp from '../components/ProductsComp.vue';
export default {
  name: 'UserProductsView',
  components: {
    ProductsComp
  },
  computed: {
    products() { return this.$store.getters['GET_USER_PRODUCTS']; },
    products_loading() { return this.$store.getters['GET_USER_PRODUCTS_LOADING']; },
    success_message() { return this.$store.getters['GET_SUCCESS_MESSAGE']; }
  },
  methods: {
    closePopup() { this.$store.dispatch('closeSuccessMessage'); }
  },
  mounted() {
    this.$store.dispatch('getProducts', this.$route.params.userId);
  }
}
</script>

<style scoped>
.success-message {
  background-color: #4caf50;
  color: white;
}

.close-success-message {
  background: none;
  border: none;
  font-size: 0.8rem;
  color: white;
  cursor: pointer;
}
</style>