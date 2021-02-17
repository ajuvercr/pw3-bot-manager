<template>
<div class="container">
  <div class="join-card">
    <div>
      <input type="text" v-model="name" placeholder="Enter bot's name"/>
    </div>
    <div>
      <input type="text" class="connect-input" v-model="args" placeholder="Enter bots command arguments" />
    </div>
    <div>
      <button v-on:click="create" :disabled="buttonDisabled()" class="join-button">
        Create Bot
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
