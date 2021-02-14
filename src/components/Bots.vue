<template>
    <li class="list-player" v-for="(bot, idx) in bots" v-bind:key=idx>
        <div>
            <p> Name: {{ bot.name }}</p>
            <p> Args: {{ bot.arguments.join(" ") }}</p>
        </div>
    </li>

    <BotsCreate />
</template>

<style scoped>

</style>

<script lang="ts">
import BotsCreate from './bots/Create.vue'
import { Bot } from '../store/bot'

export default {
    name: "Bots",
    components: { BotsCreate },
    computed: {
        bots(): {[id: number]: Bot} {
            return this.$store.state.bots.inner;
        }
    }
}
</script>
