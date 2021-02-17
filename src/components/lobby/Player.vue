<template>
    <div>
        <p class="name form-item">
            Bot: "{{bots[player.botId+'']?.name}}"
            <div class="delButton">
                <fa-icon v-on:click="deletePlayer()" icon="times" class="status-icon"/>
            </div>
        </p>
        <div class="checks form-item">
            <div>
                <input type="checkbox" :id="start_client" v-model="player.startClient">
                <label :for="start_client">start client</label>
            </div>
            <div>
                <input type="checkbox" :id="auto_accept" v-model="player.autoAccept">
                <label :for="auto_accept">auto accept</label>
            </div>
        </div>
        <div class="form-item"> Token: "{{player.token}}" </div>
        <button class="form-item" v-on:click="save()">Save</button>
    </div>
</template>

<style scoped>
.command {
    font-weight: bolder;
}
.checks {
    display: flex;
    gap: 50px;
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
        },
        auto_accept(): string {
            return this.lobbyId + "auto_accept"+this.player?.id;
        },
        start_client(): string {
            return this.lobbyId + "start_client"+ this.player?.id;
        }
    },
    methods: {
        deleteBot(id: number) {
        },
        save() {
            console.log("Saving")
        },
        deletePlayer() {
            axios.delete(`/api/players/${this.player?.id}`).then((response) => {
                // Update bots
                this.$store.commit('players/remove', this.player?.id);
            }).catch(errorHandler);
        }
    }
}
</script>
