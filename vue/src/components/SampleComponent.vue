<template>
  <div>
    <h1>{{ message }}</h1>
    <p>Kaina: {{ value }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'NO MESSAGE',
      value: null
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchData');
      this.message = this.$store.getters['GET_MESSAGE'];
      this.value = this.$store.getters['GET_VALUE'];
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
};
</script>