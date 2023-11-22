<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link to="/" class="navbar-brand">FPMS</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact-active-class="active-link" exact>Home</router-link>
            </li>
            <template v-if="isUserAuthenticated">
              <li class="nav-item">
                <router-link v-if="user" :to="{ path: `/users/${user.id}/products` }" class="nav-link" exact-active-class="active-link" exact>My products</router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="user" :to="{ path: `/users/${user.id}/products/add` }" class="nav-link" exact-active-class="active-link" exact>Add products</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/logout" class="nav-link">Logout</router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="user" :to="{ path: `/users/${user.id}/basket` }" class="nav-link" exact-active-class="active-link" exact><i class="bi bi-cart"></i></router-link>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link to="/login" class="nav-link">Login</router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
<script>
export default {
    name: 'NavBar',
    computed: {
        user() { return this.$store.getters['GET_USER']; },
        isUserAuthenticated() { return this.$store.getters['GET_AUTH_TOKEN'];}
    }
};
</script>

<style scoped>
.active-link {
  background-color: #007BFF;
  color: #fff !important;
  transition: background-color 0.3s, color 0.3s;
}

.active-link:hover {
  background-color: #0056b3;
}
</style>