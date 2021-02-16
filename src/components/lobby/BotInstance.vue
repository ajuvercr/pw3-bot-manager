<template>
    <div>
        Bot: "{{bots[bot.botId+'']?.name}}"
        <div>
            <label for="startbox">Start client</label>
            <input type="checkbox" id="startbox" v-model="bot.startClient">
        </div>
        <div>
            <label for="autoacceptbox">Auto Accept</label>
            <input type="checkbox" id="autoacceptbox" v-model="bot.autoAccept">
        </div>
        <div> Token: "{{bot.token}}" </div>
        <button v-on:click="save()">Save</button>
    </div>
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
import { BotState } from '../../store/bots'
import errorHandler from '../../error';
import { BotInstance } from '@/store/lobbies';

export default {
    name: "BotInstance",
    props: {
        bot: Object as () => BotInstance,
        lobbyId: Number
    },
    computed: {
        bots(): BotState {
            return this.$store.state.bots;
        }
    },
    methods: {
        deleteBot(id: number) {
        },
        save() {
            console.log("Saving")
        }
    }
}
</script>
