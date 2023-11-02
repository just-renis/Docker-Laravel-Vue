<template>
  <div class="container py-5">
    <div class="row g-4" v-if="!categories_with_products_loading">
      <div class="col-md-4">
        <div class="card bg-light mb-3">
          <div class="card-header text-center fw-bold">Categories</div>
          <ul class="list-group list-group-flush">
            <li v-for="category in categories_with_products" :key="category.id" class="list-group-item d-flex justify-content-between align-items-center">
              <button class="btn btn-light w-100 text-start" @click="toggleCategorySelection(category)" :class="{ 'btn-selected': isAttributeSelected(category, 'Category') }">
                {{ category.name }}
              </button>
              <span class="badge bg-primary rounded-pill">{{ category.products_count }}</span>
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
          <div class="card-header text-center fw-bold">Type</div>
          <ul class="list-group list-group-flush">
            <li v-for="pType in filteredTypes" :key="pType.type" class="list-group-item d-flex justify-content-between align-items-center">
              <button class="btn btn-light w-100 text-start" @click="toggleTypeSelection(pType)" :class="{ 'btn-selected': isAttributeSelected(pType, 'Type') }">
                {{ pType.type }}
              </button>
              <span class="badge bg-primary rounded-pill">{{ pType.products_count }}</span>
            </li>
          </ul>
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
      selectedCategoryIds: new Set(),
      selectedTypes: new Set(),
    };
  },
  computed: {
    categories_with_products_loading() { return this.$store.getters['GET_CATEGORIES_WITH_PRODUCTS_LOADING']; },
    categories_with_products() { return this.$store.getters['GET_CATEGORIES_WITH_PRODUCTS']; },
    filteredTypes() {
    if (this.selectedCategoryIds.size === 0) return this.types;
    return this.types.filter(type => {
      return new Set(Array.from(this.selectedCategoryIds)
        .flatMap(categoryId => {
          const category = this.categories_with_products.find(cat => cat.id === categoryId);
          return category ? category.products.map(product => product.type) : [];
        })
      ).has(type.type);
    });
  },
  products() {
    return this.categories_with_products.reduce((allProducts, category) => {
      if (this.selectedCategoryIds.size === 0 || this.selectedCategoryIds.has(category.id)) {
        return allProducts.concat(category.products.filter((product) => {
          if (this.selectedTypes.size === 0) return true;
          return Array.from(this.selectedTypes).some((selectedType) => selectedType === product.type);
        }));
      }
      return allProducts;
    }, []);
  },
    types() { return this.$store.getters['GET_TYPES']; },
    types_loading() { return this.$store.getters['GET_TYPES_LOADING']; }
  },
  methods: {
    updatePrice() { this.$store.dispatch('updatePrice', { minPrice: this.minPrice, maxPrice: this.maxPrice }); },
    toggleCategorySelection(category) {
      this.selectedCategoryIds.has(category.id) ? this.selectedCategoryIds.delete(category.id) : this.selectedCategoryIds.add(category.id);
    },
    isAttributeSelected(attribute, attributeType) {
      switch (attributeType) {
        case "Category": return this.selectedCategoryIds.has(attribute.id);
        case "Type": return this.selectedTypes.has(attribute.type);
      }
    },
    toggleTypeSelection(type) {
      this.selectedTypes.has(type.type) ? this.selectedTypes.delete(type.type) : this.selectedTypes.add(type.type);
    },
  },
  mounted() {
    this.$store.dispatch('getCategoriesWithProducts');
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