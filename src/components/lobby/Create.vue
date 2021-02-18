<template>
<div class="form oneline">
  <input type="text" v-model="token" placeholder="Enter lobby token"/>
  <button v-on:click="create" :disabled="buttonDisabled()">
    Join
  </button>
</div>
</template>

<style scoped>
</style>

<script lang="ts">
import axios from "redaxios";
import errorHandler from "../../error";
import { createTokenValidator } from "../../util"

const tokenValidator = createTokenValidator(32);

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
            const lobbyIdValid = tokenValidator(this.token);
            return !(lobbyIdValid);
        }
    }
}
</script>
