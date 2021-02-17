<template>
  <div class="main">
    <div class="content">
      <BotPage/>
      <LobbyPage/>
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
  max-width: 1000px;
  justify-content: space-between;
  display: flex;
}
</style>

<script lang="ts">
import axios from 'redaxios';
import errorHandler from './error';
import BotPage from './components/bot/BotPage.vue';
import Errors from './components/Errors.vue';
import LobbyPage from './components/lobby/LobbyPage.vue';

export default {
  name: 'App',
  components: {BotPage, Errors, LobbyPage},
  async mounted() {
    // Is this the correct place though?
    axios.get("/api/fakeurl").catch(errorHandler);
    axios.post("/api/bots", {name: "test"}).catch(errorHandler);

    axios.get(`/api/bots`).then(resp => this.$store.commit('bots/set', resp.data));
    axios.get(`/api/lobbies`).then(resp => this.$store.commit('lobbies/set', resp.data));
  }
}
</script>
