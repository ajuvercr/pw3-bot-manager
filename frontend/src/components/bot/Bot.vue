<template>
    <p class="name">
        <div class="delButton">
            <fa-icon v-on:click="deleteBot()" icon="times" class="status-icon"/>
        </div>
        <h3>
            {{bot.name}}
        </h3>
    </p>
    <p> Arguments: <span class="command">{{ botArgs() }}</span></p>
</template>

<style scoped>
.command {
    font-weight: bolder;
}
</style>

<script lang="ts">
import axios from "redaxios";
import { BotT } from '../../store'
import errorHandler from '../../error';

export default {
    name: "Bots",
    props: { bot: Object as () => BotT },
    methods: {
        botArgs() {
            // Surround part with quotes if it contains spaces
            const maybeQuote = (part: string) => part.indexOf(" ") >= 0 ? `'${part}'` : part;
            return this.bot?.arguments.map(maybeQuote).join(" ");
        },
        deleteBot(id: number) {
            axios.delete(`/api/bots/${this.bot?.id}`).then((response) => {
                // Update bots
                this.$store.commit('bots/remove', this.bot?.id);
            }).catch(errorHandler);
        }
    }
}
</script>
