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
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <template v-if="isUserAuthenticated">
              <li class="nav-item">
                <router-link v-if="user" :to="{ path: `/users/${user.id}/products` }" class="nav-link">My products</router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="user" :to="{ path: `/users/${user.id}/products/add` }" class="nav-link">Add products</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/logout" class="nav-link">Logout</router-link>
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