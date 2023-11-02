<template>
  <div class="container-lg">
    <div v-if="product_error" class="alert alert-danger" role="alert">{{ product_error }}</div>
    <div v-else-if="!types_loading && !categories_loading && !editable_product_loading">
      <ProductFormFields class="row justify-content-center" :categories="categories" :types="types" :mode="'editProduct'"
       :oldProduct="product" :title="'Product edit form'" :submitText="'Confirm changes'"/>
    </div>
    <div v-else class="d-flex justify-content-center mt-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import ProductFormFields from '@/components/ProductFormFields.vue';
export default {
  name: 'EditProductView',
  components: {
    ProductFormFields
  },
  computed: {
    categories() { return this.$store.getters['GET_CATEGORIES']; },
    categories_loading() { return this.$store.getters['GET_CATEGORIES_LOADING']; },
    product() { return this.$store.getters['GET_EDITABLE_PRODUCT']; },
    editable_product_loading() { return this.$store.getters['GET_EDITABLE_PRODUCT_LOADING']; },
    product_error() { return this.$store.getters['GET_PRODUCT_ERROR']; },
    types() { return this.$store.getters['GET_TYPES']; },
    types_loading() { return this.$store.getters['GET_TYPES_LOADING']; }
  },
  mounted() {
    this.$store.dispatch('getAllTypes');
    this.$store.dispatch('getCategories');
    this.$store.dispatch('getProductById', { userId: this.$route.params.userId, productId: this.$route.params.productId });
  }
};
</script>