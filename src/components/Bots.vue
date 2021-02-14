<template>
    <h3>Bots</h3>
    <li class="list-bots" v-for="bot in bots" v-bind:key=bot.id>
        <div class="bot">
            <div class="name">
                <div class="delButton">
                    <fa-icon v-on:click="deleteBot(bot.id)" icon="times" class="status-icon"/>
                </div>
                {{bot.name}}
            </div>
            <p> Arguments: <span class="command">{{ bot.arguments.join(" ") }}</span></p>
        </div>
    </li>

    <BotsCreate />
</template>

<style scoped>
h3 {
    padding-left: 10px;
}
.status-icon {
  width: 1em;
}
.list-bots {
    padding-left: 40px;
}
.bot + .bot {
    padding-top: 20px;
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

.bot .command {
    font-weight: bolder;
}
</style>

<script lang="ts">
import axios from "redaxios";
import BotsCreate from './bots/Create.vue'
import { Bot } from '../store/bot'

export default {
    name: "Bots",
    components: { BotsCreate },
    data() {
        return {
            deleted: new Set()
        }
    },
    computed: {
        bots(): {[id: number]: Bot} {
            return this.$store.state.bots.inner;
        }
    },
    methods: {
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
