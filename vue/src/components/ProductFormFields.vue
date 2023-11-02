<template>
    <div>
      <div class="form-title">
        <h2>{{ title }}</h2>
      </div>
      <div class="col-lg-6 col-md-8 col-sm-10">
        <form @submit.prevent="handleSubmit" class="border p-4 rounded shadow" style="min-width: 530px">
            <div class="input-group mb-3">
            <span class="input-group-text">Product name</span>
            <input v-model="product.name" type="text" class="form-control" placeholder="Product name" required style="min-width: 250px; max-width: 300px">
            <div v-if="errors && errors.name" class="alert alert-danger">{{ errors.name[0] }}</div>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Product<br>category</span>
            <select v-if="!showCustomCategoryInput" v-model="product.category" class="form-select" @change="toggleCustomInput('category')" required style="min-width: 250px; max-width: 300px">
                <option disabled value="">Select category</option>
                <option v-for="(category, index) in categories" :key="index" :value="category">{{ category }}</option>
            </select>
            <input v-else v-model="product.category" type="text" class="form-control" placeholder="Custom category" required style="min-width: 200px; max-width: 250px">
            <div class="form-check d-flex align-items-center justify-content-start">
                <label class="form-check-label me-4" for="customCategoryCheckbox">Other category</label>
                <input type="checkbox" class="form-check-input ms-1" id="customCategoryCheckbox" v-model="showCustomCategoryInput">
            </div>
            <div v-if="errors && errors.category" class="alert alert-danger">{{ errors.category[0] }}</div>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Product<br>description</span>
            <textarea v-model="product.description" type="text" class="form-control" placeholder="Product description" required style="min-width:350px; max-width:350px"></textarea>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Price</span>
            <input v-model="product.price" type="number" class="form-control" placeholder="Price" required step="0.01" style="min-width:75px; max-width: 75px">
            <div v-if="errors && errors.price" class="alert alert-danger">{{ errors.price[0] }}</div>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Discount</span>
            <input v-model="product.discount" type="number" class="form-control" required style="min-width:50px; max-width: 50px">
            <span class="input-group-text">%</span>
            <div v-if="errors && errors.discount" class="alert alert-danger">{{ errors.discount[0] }}</div>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Product quantity</span>
            <input v-model="product.quantity" type="number" class="form-control" required style="min-width:75px; max-width: 75px">
            <div v-if="errors && errors.quantity" class="alert alert-danger">{{ errors.quantity[0] }}</div>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Product weight</span>
            <input v-model="product.weight" type="number" class="form-control" placeholder="Product weight" required style="min-width:135px; max-width: 135px">
            <select v-model="product.weightType" class="form-select" style="min-width:75px; max-width: 75px">
                <option value="g">g</option>
                <option value="kg">kg</option>
            </select>
            <div v-if="errors && errors.weight" class="alert alert-danger">{{ errors.weight[0] }}</div>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Product<br>type</span>
            <select v-if="!showCustomTypeInput" v-model="product.type" class="form-select" @change="toggleCustomInput('type')" required style="min-width:250px; max-width: 300px">
                <option disabled value="">Select type</option>
                <option v-for="(type, index) in types" :key="index" :value="type">{{ type }}</option>
            </select>
            <input v-else v-model="product.type" type="text" class="form-control" placeholder="Custom type" required style="min-width: 200px; max-width: 250px">
            <div class="form-check d-flex align-items-center justify-content-start">
                <label class="form-check-label me-4" for="customTypeCheckbox">Other type</label>
                <input type="checkbox" class="form-check-input ms-1" id="customTypeCheckbox" v-model="showCustomTypeInput">
            </div>
            <div v-if="errors && errors.type" class="alert alert-danger">{{ errors.type[0] }}</div>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Product producer</span>
            <input v-model="product.producer" type="text" class="form-control" placeholder="Product producer" required style="min-width:200px; max-width: 200px">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Product seller</span>
            <input v-model="product.seller" type="text" class="form-control" placeholder="Product seller" required style="min-width:200px; max-width: 200px">
        </div>
        <button type="submit" class="btn btn-primary">{{ submitText }}</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductFormFields',
    props: {
        categories: Array,
        types: Array,
        mode: String,
        oldProduct: Object,
        title: String,
        submitText: String
    },
    data() {
      return {
        product: this.oldProduct,
        showCustomTypeInput: false,
        showCustomCategoryInput: false
      };
    },
    methods: {
      addProduct() {
        this.$store.dispatch('addProduct', { userId: this.$route.params.userId, product: this.product});
      },
      editProduct() {
        if (!this.product.weightType) this.product.weightType = 'g';
        this.$store.dispatch('editProduct', { userId: this.$route.params.userId, product: this.product});
      },
      handleSubmit() { this.mode === 'addProduct' ? this.addProduct() : this.editProduct(); },
      toggleCustomInput(input) {
        switch(input)
        {
          case "type": this.showCustomTypeInput = this.product.type === ''; break;
          default: this.showCustomCategoryInput = this.product.category === ''; 
        }
      }
    },
    computed: {
      errors() { return this.$store.getters['GET_USER_ERRORS'] },
    },
    mounted() {
      this.$store.dispatch('clearErrors');
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
  @media (max-width: 500px) {
    .form-title {
      text-align: left;
    }
  }
  </style>