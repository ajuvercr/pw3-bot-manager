<template>
    <div>
        <h3>Bots</h3>
        <ul class="list-bots">
            <li class="bot" v-for="bot in bots" v-bind:key=bot.id>
                <p class="name">
                    <div class="delButton">
                        <fa-icon v-on:click="deleteBot(bot.id)" icon="times" class="status-icon"/>
                    </div>
                    {{bot.name}}
                </p>
                <p> Arguments: <span class="command">{{ botArgs(bot) }}</span></p>
            </li>
        </ul>

        <BotsCreate />
    </div>
</template>

<style scoped>
h3 {
    padding-left: 10px;
}
ul {
    list-style-type: none;
}
.status-icon {
  width: 1em;
}
.list-bots {
    padding-left: 40px;
}
.bot + .bot {
    padding-top: 15px;
}
.bot .name {
    position: relative;
}
.bot .name .delButton {
    position: absolute;
    top: 50%;
    left: -1.1em;
    transform: translateY(-50%);
}

.bot .name .delButton :hover {
    color: orange;
    cursor: pointer;
}

.bot .command {
    font-weight: bolder;
}
</style>

<script lang="ts">
import axios from "redaxios";
import BotsCreate from './Create.vue'
import { Bot, BotState } from '../../store/bots'

export default {
    name: "Bots",
    components: { BotsCreate },
    data() {
        return {
            deleted: new Set()
        }
    },
    computed: {
        bots(): BotState {
            console.log("Runnning computed bots")
            return this.$store.state.bots;
        }
    },
    methods: {
        botArgs(bot: Bot) {
            // Surround part with quotes if it contains spaces
            const maybeQuote = (part: string) => part.indexOf(" ") >= 0 ? `'${part}'` : part;
            return bot.arguments.map(maybeQuote).join(" ");
        },
        deleteBot(id: number) {
            // Some debouncing required, don't really know why
            if (this.deleted.has(id)) return;
            this.deleted.add(id);

            axios.delete(`/api/bots/${id}`).then((response) => {
                // Update bots
                this.$store.commit('removeBot', id);
            });
        }
    }
}
</script>
