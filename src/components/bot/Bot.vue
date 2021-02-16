<template>
    <p class="name">
        <div class="delButton">
            <fa-icon v-on:click="deleteBot()" icon="times" class="status-icon"/>
        </div>
        {{bot.name}}
    </p>
    <p> Arguments: <span class="command">{{ botArgs() }}</span></p>
</template>

<style scoped>
.status-icon {
  width: 1em;
}
.name {
    position: relative;
}
.name .delButton {
    position: absolute;
    top: 50%;
    left: -1.1em;
    transform: translateY(-50%);
}

.name .delButton :hover {
    color: orange;
    cursor: pointer;
}

.command {
    font-weight: bolder;
}
</style>

<script lang="ts">
import axios from "redaxios";
import { Bot } from '../../store/bots'
import errorHandler from '../../error';

export default {
    name: "Bots",
    props: { bot: Object as () => Bot },
    methods: {
        botArgs() {
            // Surround part with quotes if it contains spaces
            const maybeQuote = (part: string) => part.indexOf(" ") >= 0 ? `'${part}'` : part;
            return this.bot?.arguments.map(maybeQuote).join(" ");
        },
        deleteBot(id: number) {
            axios.delete(`/api/bots/${this.bot?.id}`).then((response) => {
                // Update bots
                this.$store.commit('removeBot', this.bot?.id);
            }).catch(errorHandler);
        }
    }
}
</script>
