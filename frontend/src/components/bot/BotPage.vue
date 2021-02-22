<template>
    <div class="bots">
        <BotsCreate />
        <ul class="list">
            <li class="item" v-for="bot in bots" v-bind:key=bot.id>
                <Bot :bot="bot"/>
            </li>
        </ul>

    </div>
</template>

<style scoped>
.item + .item {
    padding-top: 20px;
}
</style>

<script lang="ts">
import BotsCreate from './Create.vue'
import Bot from './Bot.vue'
import { State, BotT } from '../../store'

export default {
    name: "BotPage",
    components: { BotsCreate, Bot },
    computed: {
        bots(): State<BotT> {
            return this.$store.state.bots;
        }
    }
}
</script>
