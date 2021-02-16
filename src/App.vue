<template>
  <div class="main">
    <div class="content">
       <Bots/>
      <Lobby/>
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
import Bots from './components/bot/Bots.vue';
import Errors from './components/Errors.vue';
import Lobby from './components/lobby/Lobby.vue';

export default {
  name: 'App',
  components: {Bots, Errors, Lobby},
  async mounted() {
    // Is this the correct place though?
    axios.get("/api/fakeurl").catch(errorHandler);
    axios.post("/api/bots", {name: "test"}).catch(errorHandler);

    axios.get(`/api/bots`).then(resp => this.$store.commit('setBots', resp.data));
    axios.get(`/api/lobbies`).then(resp => this.$store.commit('setLobbies', resp.data));
  }
}
</script>
