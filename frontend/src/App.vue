<template>
  <div class="main">
    <div class="content">
      <BotPage/>
      <LobbyPage/>
    </div>
  </div>
  <Errors/>
</template>

<style>
.main {
  font-family: "typewriter", monospace;
}

.content {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px;
}

.status-icon {
  width: 1em;
}
.name {
    position: relative;
}
.name .delButton {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
}

.name .delButton :hover {
    color: orange;
    cursor: pointer;
}

.list {
  padding: 0;
}

.item + .item {
  padding-top: 50px;
}

ul {
    list-style-type: none;
}

.form {
  border: #3c5a86 5px solid;
  padding: 0.5em;
}

.small {
  border: #3c5a86 3px solid;
  padding: 0.2em;

  /* max-width: 500px; */
  /* margin: auto; */
}

.form .title {
   width:100%;
   text-align:center;
   position: relative;
}

.form h2 {
  font : 1em "typewriter", monospace;
  margin: -1.2em 0 0 0;

  font-weight: bold;
  position: absolute;

  display: inline-block;
  background-color: white;

  padding: 0 5px;
  transform: translateX(-50%);

  width: fit-content;
}

.oneline {
    display: flex;
    align-items: center;
    gap: 20px;
}

.small h2 {
  font-size: 0.8em;
  margin: -1em 0 0 0;
}


.form input, .form select {
  font    : 1.4em/1.5em "typewriter", sans-serif;
  border  : none;
  margin  : 0;
  width   : 100%;
  background : none;
}

.small input {
  font-size: 1.1em;
}

.form input:focus {
  background   : rgba(0,0,0,.1);
  border-radius: 5px;
}

.form-item + .form-item {
  margin-top: 10px!important;
}

button {
  color: #ddd;
  width        : 150px;
  padding      : 5px;
  font         : bold .8em sans-serif;
  border: 1px solid #333;
  border-radius: 5px;
  background   : none;
  cursor       : pointer;
  background-color: #333;
  /* transform    : rotate(-1.2deg); */
}

button:hover {
    background-color: orange;
    color: black;
}

button:disabled,
button[disabled]{
  border: 1px solid #333;
  background-color: #cccccc;
  color: #666666;
  cursor: unset;
}

.small button {
  font-size: 0.7em;
}

.token {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 160px;
  height: 1.2em;
  white-space: nowrap;
}

h3 {
  display: inline;
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

    axios.get(`/api/bots`).then(resp => this.$store.commit('bots/set', resp.data)).catch(errorHandler);
    axios.get(`/api/lobbies`).then(resp => this.$store.commit('lobbies/set', resp.data)).catch(errorHandler);
    axios.get(`/api/players`).then(resp => this.$store.commit('players/set', resp.data)).catch(errorHandler);
  }
}
</script>
