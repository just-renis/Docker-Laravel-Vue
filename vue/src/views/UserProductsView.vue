<template>
  <div class="container py-5">
    <div class="row row-cols-1 row-cols-md-3 g-4" v-if="!products_loading">
      <ProductsComp :products="products"/>
    </div>
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
    products_loading() { return this.$store.getters['GET_USER_PRODUCTS_LOADING']; }
  },
  mounted() {
    this.$store.dispatch('getProducts', this.$route.params.userId);
  }
}
</script>