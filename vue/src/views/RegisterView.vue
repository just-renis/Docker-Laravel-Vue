<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header">Registration</div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="input-group mb-3">
                <span class="input-group-text">Company Name:</span>
                <input v-model="company_name" type="text" class="form-control" required>
              </div>
              <div v-if="errors && errors.company_name" class="alert alert-danger">{{ errors.company_name[0] }}</div>
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
              <div class="input-group mb-3">
                <span class="input-group-text">Repeat password:</span>
                <input v-model="repeat_password" type="password" class="form-control" required>
              </div>
              <div v-if="errors && errors.repeat_password" class="alert alert-danger">{{ errors.repeat_password[0] }}</div>
              <div v-if="errors && !errors.company_name && !errors.email && !errors.password && !errors.repeat_password" class="alert alert-danger">{{ errors }}</div>
              <button type="submit" class="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-body">
            <p>Already have an account? <router-link to="/login" class="custom-link">Login here</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      company_name: '',
      email: '',
      password: '',
      repeat_password: '',
    };
  },
  computed: {
    errors() { return this.$store.getters['GET_USER_ERRORS'] }
  },
  methods: {
    register() {
      this.$store.dispatch('register', { company_name: this.company_name, email: this.email, password: this.password, repeat_password: this.repeat_password }); 
    },
  },
  mounted() {
    this.$store.dispatch('clearErrors');
  }
};
</script>

<style scoped>
.custom-link {
  color: #2c89f4;
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: underline;
}
</style>