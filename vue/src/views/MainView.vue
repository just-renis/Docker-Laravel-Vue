<template>
  <div class="container py-5">
    <div class="row g-4" v-if="!categories_with_products_loading">
      <div class="col-md-4">
        <div class="card bg-light mb-3">
          <div class="card-header text-center fw-bold">Categories</div>
            <ul class="list-group list-group-flush">
              <li v-for="category in categories_with_products" :key="category.id" class="list-group-item d-flex justify-content-between align-items-center">
                <button class="btn btn-light w-100 text-start" @click="toggleCategorySelection(category)" :class="{ 'btn-selected': isCategorySelected(category) }">
                  {{ category.name }}
                </button>
                <span class="badge bg-primary rounded-pill">{{ category.product_count }}</span>
              </li>
            </ul>
          <div class="card-header text-center fw-bold">Price</div>
          <div class="row mt-2">
            <div class="col-md-6">
              <div class="input-group mb-3">
                <input v-model="minPrice" type="number" class="form-control" placeholder="Min">
                <span class="input-group-text">€</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="input-group mb-3">
                <input v-model="maxPrice" type="number" class="form-control" placeholder="Max">
                <span class="input-group-text">€</span>
              </div>
            </div>
            <div class="d-flex justify-content-center mb-2">
              <b-button variant="primary" class="btn-sm" @click="updatePrice">Apply price change</b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <ProductsComp :products="products"/>
        </div>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center mt-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
import ProductsComp from '../components/ProductsComp.vue';
export default {
  name: 'MainView',
  components: {
    ProductsComp
  },
  data() {
    return {
      minPrice: 0,
      maxPrice: 99999.99,
      selectedCategories: [],
    };
  },
  computed: {
    categories_with_products_loading() { return this.$store.getters['GET_CATEGORIES_WITH_PRODUCTS_LOADING']; },
    categories_with_products() { return this.$store.getters['GET_CATEGORIES_WITH_PRODUCTS']; },
    products() {
      if (this.selectedCategories.length === 0) return this.categories_with_products.reduce((allProducts, category) => allProducts.concat(category.products), []);
      return this.categories_with_products.reduce((allProducts, category) => {
        if (this.isCategorySelected(category)) return allProducts.concat(category.products);
        return allProducts;
      }, []);
    },
    types() { return this.$store.getters['GET_TYPES']; },
    types_loading() { return this.$store.getters['GET_TYPES_LOADING']; }
  },
  methods: {
    updatePrice() { this.$store.dispatch('updatePrice', { minPrice: this.minPrice, maxPrice: this.maxPrice }); },
    toggleCategorySelection(category) {
      const index = this.selectedCategories.indexOf(category.id);
      if (index === -1) this.selectedCategories.push(category.id);
      else this.selectedCategories.splice(index, 1);
    },
    isCategorySelected(category) { return this.selectedCategories.includes(category.id); },
  },
  mounted() {
    this.$store.dispatch('getCategoriesWithProducts');
    this.$store.dispatch('getTypes');
  }
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.btn-selected {
  background-color: #007bff;
  color: #fff;
}
</style>