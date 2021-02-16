<template>
<div class="container">
  <div class="join-card">
    <div>
      <input type="text" v-model="token" placeholder="Enter lobby token"/>
    </div>
    <div>
      <button v-on:click="create" :disabled="buttonDisabled()" class="join-button">
        Create Lobby
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>

<script lang="ts">
import axios from "redaxios";
import errorHandler from "../../error";
const regex = new RegExp(`^([0-9abcdef]){${64}}$`, 'i');

export default {
    name: 'LobbyCreate',
    data() {
        return {
            token: "",
        };
    },
    methods: {
        create() {
            const data = {
                token: this.token,
                instances: []
            };

            axios.post(`/api/lobbies`, data).then((response) => {
                // Update bots
                this.$store.commit('addLobby', response.data);

                this.token = "";
            }).catch(errorHandler);
        },

        buttonDisabled() {
            const lobbyIdValid = regex.test(this.token);
            return !(lobbyIdValid);
        }
    }
}
</script>
