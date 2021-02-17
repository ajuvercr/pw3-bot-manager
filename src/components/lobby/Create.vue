<template>
<div class="form">
  <div class="title">
    <h2> Create new lobby </h2>
  </div>
  <input class="form-item" type="text" v-model="token" placeholder="Enter lobby token"/>
  <button class="form-item" v-on:click="create" :disabled="buttonDisabled()">
    Create Lobby
  </button>
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
                this.$store.commit('lobbies/add', response.data);

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
