<template>
<div class="form">
  <div class="title">
    <h2> Create new bot </h2>
  </div>
  <input class="form-item" type="text" v-model="name" placeholder="Enter bot's name"/>
  <input class="form-item" type="text" class="connect-input" v-model="args" placeholder="Bot start command" />
  <button class="form-item" v-on:click="create" :disabled="buttonDisabled()">
    Create Bot
  </button>
</div>
</template>

<style scoped>
/* button {
    width: 40%;
} */
</style>

<script lang="ts">
import axios from "redaxios";
import errorHandler from "../../error";

export default {
    name: 'BotsCreate',
    data() {
        return {
            args: "",
            name: "",
        };
    },
    methods: {
        create() {
            const args: string[] = []
            const regex: RegExp = new RegExp('"[^"]+"|[\\S]+', 'g');

            this.args.match(regex)?.forEach(element => {
                if (!element) return;
                return args.push(element.replace(/"/g, ''));
            });

            const data = {
                arguments: args,
                name: this.name
            };

            axios.post(`/api/bots`, data).then((response) => {
                // Update bots
                this.$store.commit('bots/add', response.data);

                this.args = "";
                this.name = "";
            }).catch(errorHandler);
        },
        buttonDisabled() {
            const nameValid = this.name.length > 0;
            const argsValid = this.args.length > 0;
            return !(nameValid && argsValid);
        }
    }
}
</script>
