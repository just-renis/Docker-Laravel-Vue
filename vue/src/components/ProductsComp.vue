<template>
  <div v-for="(product, index) in products" :key="index" class="col-12 col-md-6 col-lg-3">
      <div class="product-card h-100">
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
              <span class="price-value">{{ product.price }}€</span>
              <span class="discount-value" v-if="product.discount > 0">-{{ product.discount }}%</span>
              </div>
              <div class="d-flex align-items-center pe-2">
              <i class="bi bi-box-seam pe-1"></i>
              <span class="quantity-value ">Left: {{ product.quantity }}</span>
              </div>
          </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ProductsComp',
  props: {
    products: Object
  }
}
</script>

<style scoped>
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