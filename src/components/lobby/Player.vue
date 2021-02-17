<template>
    <div>
        Bot: "{{bots[player.botId+'']?.name}}"
        <div>
            <label for="startbox">Start client</label>
            <input type="checkbox" id="startbox" v-model="player.startClient">
        </div>
        <div>
            <label for="autoacceptbox">Auto Accept</label>
            <input type="checkbox" id="autoacceptbox" v-model="player.autoAccept">
        </div>
        <div> Token: "{{player.token}}" </div>
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
import { State, BotT, PlayerT } from '@/store'
import errorHandler from '../../error';

export default {
    name: "Player",
    props: {
        player: Object as () => PlayerT,
        lobbyId: Number
    },
    computed: {
        bots(): State<BotT> {
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
