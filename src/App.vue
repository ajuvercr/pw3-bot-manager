<template>
  <div class="main">
    <div class="content">
       <Bots/>
    </div>
    <Errors/>
  </div>
</template>

<style scoped>
.main {
  width: 99vw;
  height: 99vh;
  position: relative;
}

.content {
  width: 99%;
  display: flex;
}
</style>

<script lang="ts">
import axios from 'redaxios';
import errorHandler from './error';
import Bots from './components/Bots.vue';
import Errors from './components/Errors.vue';

export default {
  name: 'App',
  components: {Bots, Errors},
  async mounted() {
    // Is this the correct place though?
    axios.get("/api/fakeurl").catch(errorHandler);
    axios.post("/api/bots", {name: "test"}).catch(errorHandler);

    const response = await axios.get(`/api/bots`);
    this.$store.commit('setBots', response.data);
  }
}
</script>
