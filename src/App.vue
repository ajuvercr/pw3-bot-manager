<template>
  <router-view />
</template>

<script lang="ts">
import axios from 'redaxios';

export default {
  name: 'App',
  components: {},
  async mounted() {
    // Is this the correct place though?
    const response = await axios.get(`/api/bots`);
    console.log(response);
    this.$store.commit('setBots', response.data);
  }
}
</script>
