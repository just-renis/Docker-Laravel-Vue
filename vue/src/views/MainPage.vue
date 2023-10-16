<template>
  <div class="container py-5">
    <div class="row g-4" v-if="!categories_loading">
      <div class="col-md-4">
        <div class="card bg-light mb-3">
          <div class="card-header text-center fw-bold">Categories</div>
            <ul class="list-group list-group-flush">
              <li v-for="category in categories" :key="category.id" class="list-group-item d-flex justify-content-between align-items-center">
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
          <div v-for="(product, index) in products" :key="index" class="col">
            <div class="card product-card h-100">
              <div class="card-body">
                <h5 class="card-title product-title">{{ product.name }}</h5>
                <p class="card-text product-description">{{ product.description }}</p>
                <p class="card-text product-price">Price: {{ product.price }}€</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center mt-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      minPrice: 0,
      maxPrice: 9999,
      selectedCategories: [],
    };
  },
  computed: {
    categories_loading() { return this.$store.getters['GET_CATEGORIES_LOADING']; },
    categories() { return this.$store.getters['GET_CATEGORIES']; },
    products() {
      if (this.selectedCategories.length === 0) return this.categories.reduce((allProducts, category) => allProducts.concat(category.products), []);
      return this.categories.reduce((allProducts, category) => {
        if (this.isCategorySelected(category)) return allProducts.concat(category.products);
        return allProducts;
      }, []);
    },
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
    this.$store.dispatch('getCategories');
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
.category-container {
  border: 1px solid #e0e0e0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.btn-selected {
  background-color: #007bff;
  color: #fff;
}
.product-card {
  background-color: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  transition: transform 0.2s;
}
.product-card:hover {
  transform: scale(1.03);
}
.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}
.product-description {
  font-size: 0.75rem;
  color: #555;
}
.product-price {
  font-size: 0.75rem;
  font-weight: 600;
  color: #007bff;
}
.card {
  border: none;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
}
</style>