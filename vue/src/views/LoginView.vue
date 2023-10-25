<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header">Login</div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="input-group mb-3">
                <span class="input-group-text">Email:</span>
                <input v-model="email" type="email" class="form-control" required>
              </div>
              <div v-if="errors && errors.email" class="alert alert-danger">{{ errors.email[0] }}</div>
              <div class="input-group mb-3">
                <span class="input-group-text">Password:</span>
                <input v-model="password" type="password" class="form-control" required>
              </div>
              <div v-if="errors && errors.password" class="alert alert-danger">{{ errors.password[0] }}</div>
              <div v-if="errors && !errors.email && !errors.password" class="alert alert-danger">{{ errors }}</div>
              <div>
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-body">
            <p>Don't have an account? <router-link to="/register" class="custom-link">Register here</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    errors() { return this.$store.getters['GET_ERRORS'] }
  },
  methods: {
    login() {
      this.$store.dispatch('login', { email: this.email, password: this.password });
    },
  },
  mounted() {
    this.$store.dispatch('clearErrors');
  }
};
</script>

<style scoped>
.custom-link {
  color: #ff6600;
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: underline;
}
</style>