<template>
  <div class="container-lg">
    <template v-if="!products_loading && products.length !== 0">
      <div class="row row-cols-1 row-cols-md-3 g-4 py-5" >
        <div v-for="(product, index) in products" :key="index" class="col-12 col-md-6 col-lg-3">
          <div class="product-card h-100">
            <div class="d-flex justify-content-end">
              <button class="btn btn-danger btn-sm m-2" @click="removeProductFromBasket(product.id)"><i class="bi bi-trash3-fill"></i></button>
            </div>
            <div class="card-body">
              <h5 class="card-title product-title">{{ product.name }}</h5>
              <p class="card-text product-description">{{ product.description }}</p>
              <div class="d-flex justify-content-between mb-2">
                <div class="col-6">
                  <span class="ad-attr-text">Type: </span>
                  <span class="ad-attr-value">{{ product.type }}</span>
                </div>
                <div class="col-6">
                  <span class="ad-attr-text">Weight: </span>
                  <span class="ad-attr-value">{{ product.weight / 1000 }}kg</span>
                </div>
              </div>
              <div class="d-flex flex-wrap justify-content-between ms-1">
                <div class="price-tag">
                  <span class="price-value">{{ (product.price * ((100 - product.discount) / 100)).toFixed(2) }}€</span>
                  <span class="discount-value" v-if="product.discount > 0">-{{ product.discount }}%</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <label for="quantityInput" class="me-2">Quantity<br>to buy:</label>
                  <input v-model="product.quantityToBuy"  type="number" id="quantityInput" class="form-control" required style="width: 100px;">
                </div>
                <div class="d-flex align-items-center pe-2">
                  <i class="bi bi-box-seam pe-1"></i>
                  <span class="quantity-value ">Left: {{ product.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-sm m-2" @click="purchaseProducts">Purchase products {{ price.toFixed(2) }}€</button>
      </div>
    </template>
    <div v-else-if="!products_loading" class="alert alert-success" role="alert">You have no products in basket</div>
    <div v-else class="d-flex justify-content-center mt-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasketView',
  computed: {
    products() { return this.$store.getters['GET_PRODUCTS_BASKET']; },
    products_loading() { return this.$store.getters['GET_PRODUCTS_BASKET_LOADING'];},
    price() { return this.products.reduce((total, product) => { return total + product.price * product.quantityToBuy; }, 0); }
  },
  methods: {
    removeProductFromBasket(productId) { this.$store.dispatch('removeProductFromBasket', { userId: this.$route.params.userId, productId: productId }); },
    purchaseProducts() { this.$store.dispatch('purchaseProducts', { userId: this.$route.params.userId, data: this.products})}
  },
  mounted() {
    this.$store.dispatch('getProductsBasket', this.$route.params.userId);
  }
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.product-card {
  background-color: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  transition: transform 0.2s;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
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

.price-tag {
  display: flex;
  align-items: center;
  background-color: #007bff;
  color: #fff;
  padding: 3px 3px;
  border-radius: 10px;
  font-weight: bold;
}

.price-value {
  font-size: 1rem;
  margin-right: 10px;
}

.discount-value {
  background-color: #ff0000;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  font-weight: bold;
}

@media (max-width: 400px) {
  .price-tag {
    padding: 2px 2px;
  }

  .price-value {
    font-size: 0.8rem;
  }

  .discount-value {
    font-size: 0.7rem;
  }

  .product-card {
    min-width: 175px;
  }
}
.ad-attr-text {
  font-size: 0.8rem;
  font-weight: bold;
  color: #aeaeae;
}

.ad-attr-value {
  font-size: 0.75rem;
}
.quantity-value {
  font-size: 0.7rem;
}
</style>