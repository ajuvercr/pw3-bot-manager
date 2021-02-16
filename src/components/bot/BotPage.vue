<template>
    <div>
        <h3>Bots</h3>
        <BotsCreate />
        <ul class="list-bots">
            <li class="bot" v-for="bot in bots" v-bind:key=bot.id>
                <Bot :bot="bot"/>
            </li>
        </ul>

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
</style>

<script lang="ts">
import BotsCreate from './Create.vue'
import Bot from './Bot.vue'
import { BotState } from '../../store/bots'

export default {
    name: "BotPage",
    components: { BotsCreate, Bot },
    computed: {
        bots(): BotState {
            console.log("Runnning computed bots")
            return this.$store.state.bots;
        }
    }
}
</script>
