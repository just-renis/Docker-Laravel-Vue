<template>
  <div class="container">
    <div class="row" v-if="products_loading">
      <div class="col-12 text-center">
        Loading...
      </div>
    </div>

    <div class="row" v-else>
      <div class="col-12 product-grid">
        <div class="col-md-3 mb-3" v-for="(product, index) in products" :key="index">
          <div class="card h-100">
            <div class="card-header">
              {{ product.name }}
            </div>
            <div class="card-body">
              <p class="card-text">{{ product.description }}</p>
              <p class="card-text">Price: {{ product.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  computed: {
    products_loading() { return this.$store.getters['GET_PRODUCTS_LOADING']; },
    products() { return this.$store.getters['GET_PRODUCTS']; }
  },
  mounted() {
    this.$store.dispatch('getProducts');
  }
}
</script>

<style scoped>
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 1rem;
  }

  .card {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
</style>
