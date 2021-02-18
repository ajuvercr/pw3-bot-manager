<template>
    <div class="name">
        <h3>Lobby: </h3>
        {{lobby?.token}}
        <div class="delButton">
            <fa-icon v-on:click="deleteLobby()" icon="times" class="status-icon"/>
        </div>
    </div>
    <div class="form small">
        <div class="title">
            <h2>Add bot instance</h2>
        </div>
        <select class="form-item" v-model="newinstance.botId">
            <option value="" disabled>Select your bot</option>
            <option v-for="bot in bots" v-bind:key=bot.id :value=bot.id>
                {{bot.name}}
            </option>
        </select>
        <div class="form-item oneline">
            <input type="text" v-model="newinstance.token" placeholder="Bot token" />
            <button v-on:click="generateToken()">Generate token</button>
        </div>
        <button class="form-item" v-on:click="botInstanceCreate" :disabled="buttonDisabled()">
            Add bot
        </button>
    </div>
    <ul class="players">
        <li class="player" v-for="player in players" v-bind:key=player.id>
            <Player :lobbyId="lobby.id" :player="player"/>
        </li>
    </ul>
</template>

<style scoped>
.name {
    padding: 20px;
}
.players {
    padding: 0;
}
.player {
    width: 90%;
    margin: auto;
}
</style>

<script lang="ts">
import axios from "redaxios";
import LobbyCreate from './Create.vue'
import errorHandler from '../../error';
import Player from './Player.vue';
import { State, BotT, LobbyT, PlayerT } from '@/store';
import { createTokenValidator, createTokenGenerator } from "../../util"

const tokenValidator = createTokenValidator(64);
const tokenGenerator = createTokenGenerator(64);

export default {
    name: "Lobby",
    components: { LobbyCreate, Player },
    props: { lobby: Object as () => LobbyT },
    data() {
        return {
            newinstance: {
                botId: "",
                token: ""
            }
        };
    },
    computed: {
      bots(): State<BotT> {
          return this.$store.state.bots;
      },
      players(): PlayerT[] {
          const allPlayers: PlayerT[] = Object.values(this.$store.state.players);
          return allPlayers.filter(p => p.lobbyId === this.lobby?.id);
      }
    },
    methods: {
        deleteLobby() {
            axios.delete(`/api/lobbies/${this.lobby?.id}`).then((response) => {
                // Update bots
                this.$store.commit('lobbies/remove', this.lobby?.id);
            }).catch(errorHandler);
        },
        botInstanceCreate() {
            console.log("Creating new bot instance");
            const data = {
                token: this.newinstance.token,
                botId: parseInt(this.newinstance.botId),
                lobbyId: this.lobby?.id,
                autoAccept: false,
                startClient: false
            };

            axios.post(`/api/players`, data).then((response) => {
                this.$store.commit('players/add', response.data);
                this.newinstance.botId = "";
                this.newinstance.token = "";
            }).catch(errorHandler);
        },
        buttonDisabled() {
            const validBot = !!this.newinstance.botId;
            const validToken = tokenValidator(this.newinstance.token);
            return !(validBot && validToken);
        },
        generateToken() {
            this.newinstance.token = tokenGenerator();
        }
    }
}
</script>
