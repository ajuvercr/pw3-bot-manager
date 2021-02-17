<template>
    <p class="name">
        Lobby: {{lobby?.token}}
        <div class="delButton">
            <fa-icon v-on:click="deleteLobby()" icon="times" class="status-icon"/>
        </div>
    </p>
    <ul class="list-instances">
        <div>
            <h3>Add bot instance</h3>
            <select v-model="newinstance.botId">
                <option value="" disabled>Select your bot</option>
                <option v-for="bot in bots" v-bind:key=bot.id :value=bot.id>
                    {{bot.name}}
                </option>
            </select>
            <div>
                <input type="text" v-model="newinstance.token" placeholder="Bot token" />
                <button v-on:click="generateToken()">Generate token</button>
            </div>
            <button v-on:click="botInstanceCreate" :disabled="buttonDisabled()" class="join-button">
                Add bot
            </button>
        </div>
        <br>
        <li class="instances" v-for="player in players" v-bind:key=player.id>
            <Player :lobbyId="lobby.id" :player="player"/>
        </li>
    </ul>
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
</style>

<script lang="ts">
import axios from "redaxios";
import LobbyCreate from './Create.vue'
import errorHandler from '../../error';
import Player from './Player.vue';
import { State, BotT, LobbyT, PlayerT } from '@/store';

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
            }).catch(errorHandler);
        },
        buttonDisabled() {
            const validBot = !!this.newinstance.botId;
            const validToken = !!this.newinstance.token;
            return !(validBot && validToken);
        },
        generateToken() {
            this.newinstance.token = "some random token";
        }
    }
}
</script>
