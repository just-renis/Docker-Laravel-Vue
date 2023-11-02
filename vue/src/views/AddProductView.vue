<template>
  <div class="container-lg">
    <div v-if="!types_loading && !categories_loading">
      <ProductFormFields class="row justify-content-center" :categories="categories" :types="types" :mode="'addProduct'"
       :oldProduct="product" :title="'Product form'" :submitText="'Add product'"/>
    </div>
    <div v-else class="d-flex justify-content-center mt-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import ProductFormFields from '@/components/ProductFormFields.vue';
export default {
  name: 'AddProductView',
  components: {
    ProductFormFields
  },
  data() {
    return {
      product: {
          name: 'a',
          description: 'a',
          price: 0.99,
          quantity: 0,
          weight: 1,
          type: 'Apples',
          producer: 'a',
          seller: 'a',
          discount: 0,
          category: 'Fruits',
          weightType: 'g'
      },
    }
  },
  computed: {
    categories() { return this.$store.getters['GET_CATEGORIES']; },
    categories_loading() { return this.$store.getters['GET_CATEGORIES_LOADING']; },
    types() { return this.$store.getters['GET_TYPES']; },
    types_loading() { return this.$store.getters['GET_TYPES_LOADING']; }
  },
  mounted() {
    this.$store.dispatch('getAllTypes');
    this.$store.dispatch('getCategories');
  }
};
</script>